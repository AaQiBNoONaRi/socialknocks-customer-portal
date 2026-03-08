import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
    Building2,
    Users,
    Share2,
    Layout,
    ArrowRight,
    ArrowLeft,
    Check,
    Upload,
    Plus,
    Trash2,
    Sparkles,
    Calendar,
    BarChart3,
    ShoppingBag,
    IdCard,
    PenTool,
    Rocket,
    Shield,
    CreditCard,
    Ticket,
    Search,
    ChevronDown
} from 'lucide-react';
import { UserRole } from '../types';

const API_BASE = 'http://localhost:8000';

const INDUSTRIES = [
    { value: 'marketing', label: 'Marketing & Advertising' },
    { value: 'tech', label: 'Technology / SaaS' },
    { value: 'retail', label: 'Retail & E-commerce' },
    { value: 'creator', label: 'Content Creator' },
    { value: 'fashion', label: 'Fashion & Apparel' },
    { value: 'food', label: 'Food & Beverage' },
    { value: 'health', label: 'Health & Wellness' },
    { value: 'finance', label: 'Finance & Fintech' },
    { value: 'education', label: 'Education & E-learning' },
    { value: 'real_estate', label: 'Real Estate' },
    { value: 'travel', label: 'Travel & Hospitality' },
    { value: 'media', label: 'Media & Entertainment' },
    { value: 'nonprofit', label: 'Non-Profit & NGO' },
    { value: 'sports', label: 'Sports & Fitness' },
    { value: 'auto', label: 'Automotive' },
    { value: 'other', label: 'Other' },
];

const IndustrySearch: React.FC<{ value: string; onChange: (v: string) => void }> = ({ value, onChange }) => {
    const [query, setQuery] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const ref = React.useRef<HTMLDivElement>(null);

    const selected = INDUSTRIES.find(i => i.value === value);
    const filtered = query
        ? INDUSTRIES.filter(i => i.label.toLowerCase().includes(query.toLowerCase()))
        : INDUSTRIES;

    React.useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div ref={ref} className="relative">
            <div
                className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl border bg-slate-50 cursor-pointer transition-all ${open ? 'border-indigo-500 ring-2 ring-indigo-500 bg-white' : 'border-slate-200 hover:border-slate-300'}`}
                onClick={() => { setOpen(o => !o); setQuery(''); }}
            >
                <Search size={18} className="text-slate-400 flex-shrink-0" />
                {open ? (
                    <input
                        autoFocus
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        onClick={e => e.stopPropagation()}
                        placeholder="Search industry..."
                        className="flex-1 bg-transparent outline-none text-slate-800 text-sm"
                    />
                ) : (
                    <span className={`flex-1 text-sm ${selected ? 'text-slate-800 font-medium' : 'text-slate-400'}`}>
                        {selected ? selected.label : 'Search your industry'}
                    </span>
                )}
                <ChevronDown size={16} className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
            </div>

            {open && (
                <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl max-h-56 overflow-y-auto">
                    {filtered.length === 0 ? (
                        <p className="text-sm text-slate-400 text-center py-4">No industries found</p>
                    ) : filtered.map(ind => (
                        <button
                            key={ind.value}
                            onClick={() => { onChange(ind.value); setOpen(false); setQuery(''); }}
                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${value === ind.value
                                ? 'bg-indigo-50 text-indigo-700 font-bold'
                                : 'text-slate-700 hover:bg-slate-50'
                                }`}
                        >
                            {ind.label}
                            {value === ind.value && <Check size={14} className="text-indigo-600" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

interface OnboardingProps {
    onComplete: () => void;
}

type Step = 'workspace' | 'team' | 'socials' | 'features' | 'pricing' | 'tutorial';

const STEP_ORDER: Step[] = ['workspace', 'team', 'socials', 'features', 'pricing', 'tutorial'];

function getStepFromHash(): Step {
    // Always start fresh — ignore any leftover hash from a previous session
    window.location.hash = '';
    return 'workspace';
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
    const [step, setStep] = useState<Step>(getStepFromHash);

    // Sync step <-> URL hash
    useEffect(() => {
        window.location.hash = step;
    }, [step]);

    // Step 1: Workspace State
    const [workspaceName, setWorkspaceName] = useState('');
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const logoInputRef = useRef<HTMLInputElement>(null);
    const [industry, setIndustry] = useState('');
    const [manageClients, setManageClients] = useState(false);

    // Step 2: Team State
    const [invites, setInvites] = useState<{ email: string, role: string }[]>([]);
    const [currentEmail, setCurrentEmail] = useState('');
    const [currentRole, setCurrentRole] = useState<string>(UserRole.MEMBER);

    // Step 3: Socials State — persisted in localStorage so popup close doesn't lose state
    const [connectedSocials, setConnectedSocials] = useState<string[]>(() => {
        try { return JSON.parse(localStorage.getItem('sk_socials') || '[]'); } catch { return []; }
    });
    const [socialData, setSocialData] = useState<Record<string, { page_name: string }>>(() => {
        try { return JSON.parse(localStorage.getItem('sk_social_data') || '{}'); } catch { return {}; }
    });
    const [connectingPlatform, setConnectingPlatform] = useState<string | null>(null);

    // Persist social state to localStorage whenever it changes
    useEffect(() => { localStorage.setItem('sk_socials', JSON.stringify(connectedSocials)); }, [connectedSocials]);
    useEffect(() => { localStorage.setItem('sk_social_data', JSON.stringify(socialData)); }, [socialData]);

    // Generate a stable temp workspace ID for this onboarding session
    const [tempWorkspaceId] = useState(() => {
        const saved = localStorage.getItem('sk_tmp_ws_id');
        if (saved) return saved;
        const id = `tmp_${Date.now()}_${Math.random().toString(36).slice(2)}`;
        localStorage.setItem('sk_tmp_ws_id', id);
        return id;
    });

    // Listen for postMessage from OAuth popups
    useEffect(() => {
        const handler = (event: MessageEvent) => {
            if (event.data?.type !== 'social_connect') return;
            const { success, platform, page_name } = event.data;
            setConnectingPlatform(null);
            if (success && platform) {
                setConnectedSocials(prev => {
                    const next = prev.includes(platform) ? prev : [...prev, platform];
                    localStorage.setItem('sk_socials', JSON.stringify(next));
                    return next;
                });
                setSocialData(prev => {
                    const next = { ...prev, [platform]: { page_name: page_name || platform } };
                    localStorage.setItem('sk_social_data', JSON.stringify(next));
                    return next;
                });
            }
        };
        window.addEventListener('message', handler);
        return () => window.removeEventListener('message', handler);
    }, []);

    // Step 4: Features & Pricing State
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
    const [selectedModules, setSelectedModules] = useState<string[]>([]);

    // Dynamic modules fetched from the admin backend
    interface ApiModule {
        id: string;
        name: string;
        description: string;
        price: number;
        enabled: boolean;
        icon: string;
        features: string[];
    }
    const [apiModules, setApiModules] = useState<ApiModule[]>([]);
    const [apiAnnualDiscount, setApiAnnualDiscount] = useState(20);
    const [modulesLoading, setModulesLoading] = useState(true);

    useEffect(() => {
        const url = `${API_BASE}/admin/modules/public`;
        console.log('[Onboarding] Fetching modules from:', url);
        fetch(url)
            .then(r => {
                console.log('[Onboarding] Modules API status:', r.status);
                if (!r.ok) throw new Error(`HTTP ${r.status}`);
                return r.json();
            })
            .then(data => {
                console.log('[Onboarding] Modules loaded from API:', data);
                if (data.modules && data.modules.length > 0) {
                    setApiModules(data.modules);
                    setApiAnnualDiscount(data.annualDiscount ?? 20);
                } else {
                    throw new Error('Empty modules array');
                }
            })
            .catch((err) => {
                console.warn('[Onboarding] Modules API failed, using fallback. Reason:', err.message);
                // Fallback to defaults if API unavailable
                setApiModules([
                    { id: 'store', name: 'Store Builder', description: 'E-commerce storefronts', price: 15, enabled: true, icon: 'ShoppingBag', features: ['Product Catalog', 'Order Management', 'Storefront Designer'] },
                    { id: 'svc', name: 'SVC Builder', description: 'Smart digital visit cards', price: 5, enabled: true, icon: 'IdCard', features: ['Digital Business Cards', 'NFC Ready', 'Analytics Tracking'] },
                    { id: 'ai', name: 'AI Studio', description: 'GenAI content tools', price: 20, enabled: true, icon: 'Sparkles', features: ['KnockOUT AI', 'Post Generator', 'Strategy Assistant'] },
                    { id: 'design', name: 'Design Requests', description: 'Unlimited design workflow', price: 20, enabled: true, icon: 'PenTool', features: ['Unlimited Requests', 'Revision Tracking', 'Asset Manager'] },
                    { id: 'analytics', name: 'Analytics Hub', description: 'Advanced reporting', price: 20, enabled: true, icon: 'BarChart3', features: ['Deep Dive Reports', 'Competitor Analysis', 'ROI Tracking'] },
                    { id: 'campaigns', name: 'Campaigns Module', description: 'Ad campaign management', price: 20, enabled: true, icon: 'Rocket', features: ['Ad Management', 'Audience Builder', 'A/B Testing'] },
                ]);
            })
            .finally(() => setModulesLoading(false));
    }, []);

    // Map icon name strings → Lucide components
    const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
        Sparkles, ShoppingBag, IdCard, PenTool, Layout, BarChart3, Rocket, Shield, CreditCard
    };
    const getModuleIcon = (iconName: string) => ICON_MAP[iconName] ?? Sparkles;

    // Counters kept for API submission compatibility (workspace/profiles locked in UI)
    const [counts] = useState({
        workspaces: 1,
        profiles: 4,
        stores: 1,
        svcs: 1,
    });

    // Step 5: Checkout State
    const [couponCode, setCouponCode] = useState('');
    const [discountApplied, setDiscountApplied] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const stepsList: { id: Step, label: string }[] = [
        { id: 'workspace', label: 'Workspace' },
        { id: 'team', label: 'Team' },
        { id: 'socials', label: 'Socials' },
        { id: 'features', label: 'Plan' },
        { id: 'pricing', label: 'Checkout' }
    ];

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleNext = () => {
        switch (step) {
            case 'workspace': setStep('team'); break;
            case 'team': setStep('socials'); break;
            case 'socials': setStep('features'); break;
            case 'features': setStep('pricing'); break;
            case 'pricing': handleSubmitOnboarding(); break;
            case 'tutorial': onComplete(); break;
        }
    };

    const handleSubmitOnboarding = async () => {
        setIsSubmitting(true);
        setSubmitError('');
        try {
            const token = localStorage.getItem('sk_agency_token') || '';
            const formData = new FormData();
            formData.append('workspaceName', workspaceName || 'My Workspace');
            formData.append('industry', industry || 'other');
            formData.append('manageClients', String(manageClients));
            formData.append('invites', JSON.stringify(invites));
            formData.append('connectedSocials', JSON.stringify(connectedSocials));
            formData.append('tempWorkspaceId', tempWorkspaceId); // re-links OAuth data in DB
            formData.append('billingCycle', billingCycle);
            formData.append('selectedModules', JSON.stringify(selectedModules));
            formData.append('counts', JSON.stringify(counts));
            formData.append('couponCode', couponCode);
            formData.append('monthlyTotal', String(financials.monthlyRaw));
            formData.append('finalTotal', String(financials.finalTotal));
            formData.append('discountApplied', String(discountApplied));
            if (logoFile) formData.append('logo', logoFile);

            const res = await fetch(`${API_BASE}/api/onboarding/complete`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data?.detail || 'Failed to save workspace. Please try again.');
            }

            // Clear onboarding-session localStorage keys
            localStorage.removeItem('sk_socials');
            localStorage.removeItem('sk_social_data');
            localStorage.removeItem('sk_tmp_ws_id');
            setStep('tutorial');
        } catch (err: any) {
            setSubmitError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBack = () => {
        switch (step) {
            case 'team': setStep('workspace'); break;
            case 'socials': setStep('team'); break;
            case 'features': setStep('socials'); break;
            case 'pricing': setStep('features'); break;
            case 'tutorial': setStep('pricing'); break;
        }
    };

    const addInvite = () => {
        if (currentEmail) {
            setInvites([...invites, { email: currentEmail, role: currentRole }]);
            setCurrentEmail('');
        }
    };

    const removeInvite = (index: number) => {
        const newInvites = [...invites];
        newInvites.splice(index, 1);
        setInvites(newInvites);
    };

    const connectSocial = (platform: string) => {
        const origin = encodeURIComponent(window.location.origin);
        const wsId = encodeURIComponent(tempWorkspaceId);
        const url = `${API_BASE}/auth/social/${platform}/login?workspace_id=${wsId}&origin=${origin}`;
        const popup = window.open(url, `connect_${platform}`, 'width=580,height=680,scrollbars=yes,resizable=yes');
        if (popup) {
            setConnectingPlatform(platform);
            // Fallback: detect popup closed without postMessage
            const timer = setInterval(() => {
                if (popup.closed) {
                    clearInterval(timer);
                    setConnectingPlatform(null);
                }
            }, 600);
        }
    };

    const disconnectSocial = (platform: string) => {
        setConnectedSocials(prev => prev.filter(s => s !== platform));
        setSocialData(prev => { const n = { ...prev }; delete n[platform]; return n; });
    };

    const toggleModule = (id: string) => {
        if (selectedModules.includes(id)) {
            setSelectedModules(selectedModules.filter(m => m !== id));
        } else {
            setSelectedModules([...selectedModules, id]);
        }
    };

    const applyCoupon = () => {
        if (couponCode.toLowerCase() === 'welcome20') {
            setDiscountApplied(20);
        } else if (couponCode.toLowerCase() === 'nexus50') {
            setDiscountApplied(50);
        } else {
            alert('Invalid coupon code');
            setDiscountApplied(0);
        }
    };

    // --- Pricing Logic (driven by apiModules from backend) ---
    const financials = useMemo(() => {
        let monthlyTotal = 0;
        selectedModules.forEach(id => {
            const mod = apiModules.find(m => m.id === id);
            if (mod) monthlyTotal += mod.price;
        });

        // Annual: apply admin-configured discount %
        const discountMult = billingCycle === 'annual' ? (1 - apiAnnualDiscount / 100) : 1;
        const annualMonthlyRate = monthlyTotal * discountMult;
        const subtotal = billingCycle === 'annual' ? annualMonthlyRate * 12 : monthlyTotal;
        const finalTotal = subtotal * ((100 - discountApplied) / 100);

        return {
            monthlyRaw: monthlyTotal,
            subtotal,
            finalTotal,
            isAnnual: billingCycle === 'annual',
            annualDiscount: apiAnnualDiscount,
        };
    }, [selectedModules, billingCycle, discountApplied, apiModules, apiAnnualDiscount]);

    const currentStepIndex = stepsList.findIndex(s => s.id === step);

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8">
            <div className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[700px] animate-in fade-in zoom-in-95 duration-300">

                {/* Left Panel: Sidebar / Progress */}
                <div className={`w-full md:w-1/4 bg-slate-900 p-8 text-white flex flex-col justify-between transition-all duration-500 ${step === 'tutorial' ? 'hidden md:flex' : ''}`}>
                    <div>
                        <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center font-bold text-xl mb-8 shadow-lg shadow-indigo-500/50">N</div>
                        <h2 className="text-3xl font-bold mb-4 leading-tight">
                            {step === 'workspace' && "Let's build your HQ."}
                            {step === 'team' && "Strength in numbers."}
                            {step === 'socials' && "Connect your world."}
                            {step === 'features' && "Power up your toolkit."}
                            {step === 'pricing' && "Review & Checkout."}
                            {step === 'tutorial' && "Ready for liftoff."}
                        </h2>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            {step === 'workspace' && "Start by defining your workspace identity."}
                            {step === 'team' && "Invite your core team members to collaborate."}
                            {step === 'socials' && "Link your social profiles for seamless management."}
                            {step === 'features' && "Select the modules you need. Save 20% with annual billing."}
                            {step === 'pricing' && "Review your selected plan and features before proceeding."}
                            {step === 'tutorial' && "Your workspace is ready. Let's get started."}
                        </p>
                    </div>

                    {/* Progress Indicators */}
                    <div className="space-y-4">
                        {stepsList.map((s, idx) => (
                            <div key={s.id} className="flex items-center gap-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${step === s.id
                                    ? 'bg-white text-slate-900 border-white'
                                    : idx < currentStepIndex
                                        ? 'bg-indigo-600 text-white border-indigo-600'
                                        : 'border-slate-700 text-slate-700'
                                    }`}>
                                    {idx < currentStepIndex ? <Check size={14} /> : idx + 1}
                                </div>
                                <span className={`font-medium text-sm transition-colors duration-300 ${step === s.id ? 'text-white' : 'text-slate-500'}`}>
                                    {s.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Panel: Content */}
                <div className="flex-1 flex flex-col bg-white">
                    <div className="flex-1 p-8 md:p-12 overflow-y-auto">

                        {/* Step 1: Workspace */}
                        {step === 'workspace' && (
                            <div className="space-y-6 max-w-md mx-auto animate-in slide-in-from-right-8 duration-500">
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-sm font-bold text-slate-700">Workspace Name</label>
                                        <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">First Workspace Free</span>
                                    </div>
                                    <div className="relative group">
                                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                                        <input
                                            type="text"
                                            value={workspaceName}
                                            onChange={(e) => setWorkspaceName(e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-lg bg-slate-50 focus:bg-white transition-all"
                                            placeholder="e.g. Acme Agency"
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Industry</label>
                                    <IndustrySearch value={industry} onChange={setIndustry} />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Workspace Logo (Optional)</label>
                                    <div
                                        className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-indigo-400 hover:bg-slate-50 transition-all cursor-pointer group"
                                        onClick={() => logoInputRef.current?.click()}
                                    >
                                        <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                                        {logoPreview ? (
                                            <img src={logoPreview} alt="Logo preview" className="w-20 h-20 object-cover rounded-xl mx-auto mb-2" />
                                        ) : (
                                            <div className="w-14 h-14 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mx-auto mb-3 group-hover:scale-110 transition-transform">
                                                <Upload size={24} />
                                            </div>
                                        )}
                                        <p className="text-sm font-bold text-slate-700">{logoPreview ? 'Click to change logo' : 'Click to upload logo'}</p>
                                        {logoFile && <p className="text-xs text-slate-400 mt-1">{logoFile.name}</p>}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Team */}
                        {step === 'team' && (
                            <div className="space-y-6 max-w-md mx-auto animate-in slide-in-from-right-8 duration-500">
                                <div className="flex gap-3">
                                    <div className="flex-1">
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            value={currentEmail}
                                            onChange={(e) => setCurrentEmail(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                                            placeholder="colleague@example.com"
                                        />
                                    </div>
                                    <div className="w-1/3">
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Role</label>
                                        <select
                                            value={currentRole}
                                            onChange={(e) => setCurrentRole(e.target.value)}
                                            className="w-full px-3 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-sm"
                                        >
                                            <option value={UserRole.ADMIN}>Admin</option>
                                            <option value={UserRole.MEMBER}>Member</option>
                                            <option value={UserRole.DESIGNER}>Designer</option>
                                            <option value={UserRole.CLIENT}>Client</option>
                                        </select>
                                    </div>
                                </div>
                                <button
                                    onClick={addInvite}
                                    disabled={!currentEmail}
                                    className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
                                >
                                    <Plus size={18} /> Send Invite
                                </button>

                                <div className="space-y-3 mt-6">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Team Members</h3>
                                        <span className="text-xs text-slate-400">{invites.length} Pending</span>
                                    </div>
                                    {invites.length > 0 ? (
                                        invites.map((invite, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl shadow-sm">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                                                        {invite.email[0].toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900">{invite.email}</p>
                                                        <p className="text-xs text-slate-500">{invite.role}</p>
                                                    </div>
                                                </div>
                                                <button onClick={() => removeInvite(idx)} className="text-slate-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition-colors">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 border-2 border-dashed border-slate-100 rounded-xl">
                                            <Users size={32} className="mx-auto mb-2 text-slate-300" />
                                            <p className="text-sm text-slate-400">No team members added yet.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Step 3: Socials */}
                        {step === 'socials' && (
                            <div className="space-y-4 max-w-md mx-auto">
                                <p className="text-sm text-slate-500 mb-6">Connect your social media accounts to manage and schedule posts directly from your workspace.</p>

                                {[
                                    { id: 'facebook', name: 'Facebook Page', color: '#1877f2', emoji: '📘', available: true },
                                    { id: 'instagram', name: 'Instagram Business', color: '#e1306c', emoji: '📸', available: true },
                                    { id: 'linkedin', name: 'LinkedIn Company Page', color: '#0077b5', emoji: '💼', available: false },
                                    { id: 'twitter', name: 'X (Twitter)', color: '#14171a', emoji: '🐦', available: false },
                                ].map((social) => {
                                    const isConnected = connectedSocials.includes(social.id);
                                    const isConnecting = connectingPlatform === social.id;
                                    const data = socialData[social.id];

                                    return (
                                        <div
                                            key={social.id}
                                            className={`flex items-center justify-between p-4 border-2 rounded-xl transition-all ${isConnected
                                                ? 'border-green-300 bg-green-50'
                                                : 'border-slate-200 bg-white hover:border-slate-300'
                                                }`}
                                        >
                                            {/* Left: icon + name */}
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg shadow-sm"
                                                    style={{ backgroundColor: social.color }}
                                                >
                                                    {social.emoji}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800 text-sm">{social.name}</p>
                                                    {isConnected && data?.page_name && (
                                                        <p className="text-xs text-green-700 font-medium mt-0.5">✓ {data.page_name}</p>
                                                    )}
                                                    {!social.available && (
                                                        <p className="text-xs text-slate-400 mt-0.5">Coming soon</p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Right: action button */}
                                            {social.available ? (
                                                isConnected ? (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-bold text-green-700 bg-green-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                                                            <Check size={11} /> Connected
                                                        </span>
                                                        <button
                                                            onClick={() => disconnectSocial(social.id)}
                                                            className="text-xs text-slate-400 hover:text-red-500 font-medium px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
                                                        >
                                                            Disconnect
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => connectSocial(social.id)}
                                                        disabled={isConnecting}
                                                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-slate-900 text-white hover:bg-slate-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                                                    >
                                                        {isConnecting ? (
                                                            <><svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" /><path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="opacity-75" /></svg> Connecting…</>
                                                        ) : (
                                                            <><Share2 size={14} /> Connect</>
                                                        )}
                                                    </button>
                                                )
                                            ) : (
                                                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full">
                                                    Soon
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}

                                {connectedSocials.length > 0 && (
                                    <div className="mt-4 p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-700 font-medium flex items-center gap-2">
                                        <Check size={14} className="text-indigo-500" />
                                        {connectedSocials.length} account{connectedSocials.length > 1 ? 's' : ''} connected — you can connect more later from Settings.
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Step 4: Features / Plan */}
                        {step === 'features' && (
                            <div className="space-y-8 max-w-4xl mx-auto animate-in slide-in-from-right-8 duration-500">

                                {/* Billing Toggle */}
                                <div className="bg-slate-50 p-1 rounded-xl flex justify-center w-fit mx-auto border border-slate-200">
                                    <button
                                        onClick={() => setBillingCycle('monthly')}
                                        className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${billingCycle === 'monthly' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
                                    >
                                        Monthly
                                    </button>
                                    <button
                                        onClick={() => setBillingCycle('annual')}
                                        className={`px-6 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${billingCycle === 'annual' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500'}`}
                                    >
                                        Annual <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full">SAVE {apiAnnualDiscount}%</span>
                                    </button>
                                </div>

                                {/* Two-column grid */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                                    {/* Section 1: Resource Allocation */}
                                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 bg-slate-900 rounded-lg text-white"><Building2 size={20} /></div>
                                            <div>
                                                <h3 className="font-bold text-lg text-slate-900">Resource Allocation</h3>
                                                <p className="text-xs text-slate-500">Your plan includes the following.</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            {/* Workspaces — locked to 1 */}
                                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                                                <div>
                                                    <h4 className="font-bold text-slate-700 flex items-center gap-2">
                                                        <Building2 size={16} className="text-slate-400" />
                                                        Workspaces
                                                    </h4>
                                                    <p className="text-xs text-slate-500 mt-1">1 workspace included free</p>
                                                </div>
                                                <span className="px-3 py-1.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">1 Free</span>
                                            </div>

                                            {/* Connector */}
                                            <div className="flex justify-center -my-2 relative z-10">
                                                <div className="bg-slate-200 text-[10px] font-bold text-slate-500 px-3 py-1 rounded-full border border-white">
                                                    Includes 4 Social Profiles
                                                </div>
                                            </div>

                                            {/* Social Profiles — locked to 4 */}
                                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                                                <div>
                                                    <h4 className="font-bold text-slate-700 flex items-center gap-2">
                                                        <Share2 size={16} className="text-indigo-600" />
                                                        Social Profiles
                                                    </h4>
                                                    <p className="text-xs text-slate-500 mt-1">4 profiles included with workspace</p>
                                                </div>
                                                <span className="px-3 py-1.5 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full">4 Included</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section 2: Power Modules */}
                                    <div className="space-y-4">
                                        <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                                            <Sparkles size={20} className="text-amber-500" />
                                            Power Modules
                                        </h3>
                                        <div className="grid grid-cols-2 gap-3">

                                            {/* Dynamic modules from admin backend */}
                                            {modulesLoading ? (
                                                // Loading skeleton
                                                Array.from({ length: 4 }).map((_, i) => (
                                                    <div key={i} className="p-4 rounded-xl border-2 border-slate-100 bg-slate-50 animate-pulse h-24" />
                                                ))
                                            ) : (
                                                apiModules.map((mod) => {
                                                    const ModIcon = getModuleIcon(mod.icon);
                                                    const isSelected = selectedModules.includes(mod.id);
                                                    return (
                                                        <div
                                                            key={mod.id}
                                                            onClick={() => toggleModule(mod.id)}
                                                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all relative group ${isSelected ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                                                        >
                                                            <div className="flex justify-between items-start mb-2">
                                                                <ModIcon size={20} className={isSelected ? 'text-indigo-600' : 'text-slate-400'} />
                                                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'}`}>
                                                                    {isSelected && <Check size={12} className="text-white" />}
                                                                </div>
                                                            </div>
                                                            <h4 className="font-bold text-sm text-slate-900">{mod.name}</h4>
                                                            <p className="text-xs text-slate-500">${mod.price}/mo</p>

                                                            {/* Hover Tooltip with features */}
                                                            {mod.features && mod.features.length > 0 && (
                                                                <div className="absolute left-1/2 -translate-x-1/2 bottom-[calc(100%+12px)] w-48 bg-slate-900 text-white p-3 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-20 translate-y-2 group-hover:translate-y-0">
                                                                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-700">
                                                                        <ModIcon size={14} className="text-indigo-400" />
                                                                        <span className="font-bold text-xs">{mod.name}</span>
                                                                    </div>
                                                                    <ul className="space-y-1">
                                                                        {mod.features.map((feature, i) => (
                                                                            <li key={i} className="text-[10px] text-slate-300 flex items-center gap-1.5">
                                                                                <div className="w-1 h-1 bg-indigo-400 rounded-full" />
                                                                                {feature}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                    <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-slate-900" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </div>

                                </div>
                                {/* end two-column grid */}

                                {/* Included Free */}
                                <div className="pt-6 border-t border-slate-200">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Included Free Forever</h4>
                                    <div className="grid grid-cols-3 gap-4">
                                        {[
                                            { label: 'Planner', icon: Calendar, desc: 'Unlimited Posts' },
                                            { label: 'Team', icon: Users, desc: 'Unlimited Members' },
                                            { label: 'Roles', icon: Shield, desc: 'Custom Access' },
                                        ].map((m, i) => (
                                            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                                                <div className="p-2 bg-white rounded-lg text-slate-400 shadow-sm"><m.icon size={16} /></div>
                                                <div>
                                                    <p className="font-bold text-xs text-slate-700">{m.label}</p>
                                                    <p className="text-[10px] text-slate-500">{m.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Live Total Footer */}
                                <div className="bg-slate-900 rounded-2xl p-6 text-white flex justify-between items-center shadow-xl">
                                    <div>
                                        <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Estimated Total</p>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-3xl font-bold">${financials.subtotal.toFixed(2)}</span>
                                            <span className="text-slate-400 text-sm">/{billingCycle === 'annual' ? 'yr' : 'mo'}</span>
                                        </div>
                                        {billingCycle === 'annual' && (
                                            <p className="text-green-400 text-xs mt-1">20% annual discount applied</p>
                                        )}
                                    </div>
                                    <button onClick={handleNext} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-colors">
                                        Review Order
                                    </button>
                                </div>

                            </div>
                        )}

                        {/* Step 5: Pricing / Checkout */}
                        {step === 'pricing' && (
                            <div className="space-y-6 max-w-lg mx-auto animate-in slide-in-from-right-8 duration-500">
                                <div className="text-center mb-6">
                                    <h2 className="text-2xl font-bold text-slate-900">Order Summary</h2>
                                    <p className="text-slate-500">Review your subscription details.</p>
                                </div>

                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                                    <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                                        <div>
                                            <h3 className="font-bold text-slate-900">Subscription Plan</h3>
                                            <p className="text-xs text-slate-500">{billingCycle === 'annual' ? 'Billed Annually (20% off)' : 'Billed Monthly'}</p>
                                        </div>
                                        <button onClick={() => setStep('features')} className="text-indigo-600 text-sm font-bold hover:underline">Edit</button>
                                    </div>

                                    <div className="space-y-2 text-sm">
                                        {selectedModules.map(modId => {
                                            const mod = apiModules.find(m => m.id === modId);
                                            if (!mod) return null;
                                            return (
                                                <div key={modId} className="flex justify-between text-slate-600">
                                                    <span>{mod.name}</span>
                                                    <span>${mod.price.toFixed(2)}/mo</span>
                                                </div>
                                            );
                                        })}
                                        {selectedModules.length === 0 && (
                                            <p className="text-slate-400 text-xs text-center py-2">No paid modules selected</p>
                                        )}
                                    </div>

                                    <div className="pt-4 border-t border-slate-200">
                                        <div className="flex justify-between items-end">
                                            <span className="font-bold text-slate-900">Total Due Today</span>
                                            <span className="text-2xl font-bold text-indigo-600">${financials.finalTotal.toFixed(2)}</span>
                                        </div>
                                        {discountApplied > 0 && (
                                            <p className="text-right text-xs text-green-600 font-bold mt-1">Includes {discountApplied}% Discount</p>
                                        )}
                                        {billingCycle === 'annual' && financials.monthlyRaw > 0 && (
                                            <p className="text-right text-xs text-green-600 mt-1">{apiAnnualDiscount}% annual discount applied</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Ticket size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="Promo Code"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                            className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                                        />
                                    </div>
                                    <button onClick={applyCoupon} className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors">Apply</button>
                                </div>

                                {submitError && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                                        {submitError}
                                    </div>
                                )}

                                <button
                                    onClick={handleNext}
                                    disabled={isSubmitting}
                                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <><span className="animate-spin">⏳</span> Saving your workspace...</>
                                    ) : (
                                        <><CreditCard size={20} /> Pay &amp; Launch Workspace</>
                                    )}
                                </button>

                                <p className="text-center text-xs text-slate-400">
                                    Workspace data saved securely to your account.
                                </p>
                            </div>
                        )}

                        {/* Step 6: Tutorial */}
                        {step === 'tutorial' && (
                            <div className="space-y-6 max-w-md mx-auto animate-in slide-in-from-right-8 duration-500 text-center py-12">
                                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Rocket size={48} />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900">Workspace Created Successfully!</h2>
                                <p className="text-slate-500">Your account is set up and ready to go. We've prepared a quick tour to help you get started.</p>

                                <div className="grid grid-cols-2 gap-4 text-left mt-8">
                                    {['Dashboard', 'AI Studio', 'Campaigns', 'Store Builder'].map((feature, i) => (
                                        <div key={i} className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                                            <Check size={16} className="text-green-500" /> {feature}
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={handleNext}
                                    className="w-full mt-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all"
                                >
                                    Enter Dashboard
                                </button>
                            </div>
                        )}

                    </div>

                    {/* Footer Navigation */}
                    {!['features', 'pricing', 'tutorial'].includes(step) && (
                        <div className="p-8 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
                            {step !== 'workspace' ? (
                                <button
                                    onClick={handleBack}
                                    className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-white hover:text-slate-900 transition-colors flex items-center gap-2"
                                >
                                    <ArrowLeft size={18} /> Back
                                </button>
                            ) : <div></div>}

                            <button
                                onClick={handleNext}
                                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all hover:translate-x-1 flex items-center gap-2"
                            >
                                Next Step <ArrowRight size={18} />
                            </button>
                        </div>
                    )}

                    {/* Back button for features step */}
                    {step === 'features' && (
                        <div className="p-8 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
                            <button
                                onClick={handleBack}
                                className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-white hover:text-slate-900 transition-colors flex items-center gap-2"
                            >
                                <ArrowLeft size={18} /> Back
                            </button>
                        </div>
                    )}

                    {/* Back button for pricing step */}
                    {step === 'pricing' && (
                        <div className="p-8 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
                            <button
                                onClick={handleBack}
                                className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-white hover:text-slate-900 transition-colors flex items-center gap-2"
                            >
                                <ArrowLeft size={18} /> Back
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};