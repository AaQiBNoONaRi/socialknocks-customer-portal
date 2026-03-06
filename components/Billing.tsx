import React, { useState, useMemo } from 'react';
import { Check, CreditCard, Download, Zap, Plus, Minus, AlertCircle, Calendar, Building2, Share2, ShoppingBag, IdCard, Sparkles, PenTool, Layout, BarChart3, Rocket, Shield, Users } from 'lucide-react';

// Pricing configuration matching Onboarding update
const PRICING = {
    workspace: { threshold: 1, price: 5, label: 'Additional Workspaces' },
    profiles: { 
        basePerWorkspace: 4, 
        price: 5, 
        label: 'Additional Social Profiles' 
    },
    store: { threshold: 0, price: 15, label: 'Store Builder' },
    svc: { threshold: 0, price: 5, label: 'SVC Builder' },
    modules: {
        ai: { id: 'ai', price: 20, label: 'AI Studio', icon: Sparkles, desc: 'Generative tools & assistants' },
        design: { id: 'design', price: 20, label: 'Design Requests', icon: PenTool, desc: 'Manage creative workflows' },
        ai_design: { id: 'ai_design', price: 20, label: 'AI Design Gen', icon: Layout, desc: 'Automated visual creation' },
        analytics: { id: 'analytics', price: 20, label: 'Analytics Hub', icon: BarChart3, desc: 'Deep data insights' },
        campaigns: { id: 'campaigns', price: 20, label: 'Campaigns Module', icon: Rocket, desc: 'Ad management suite' },
    }
};

export const Billing: React.FC = () => {
    // Mock State representing current user's configuration
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
    
    // Usage Counters (Mock data: user is slightly over limits on some)
    const [usage, setUsage] = useState({
        workspaces: 2, // 1 free + 1 paid
        profiles: 9,   // 8 included (2 ws * 4) + 1 paid
        stores: 1,     // Paid
        svcs: 5        // Paid
    });

    // Active Modules (Mock data)
    const [activeModules, setActiveModules] = useState<string[]>(['ai', 'analytics']);

    // --- Calculations ---
    const financials = useMemo(() => {
        let monthlyRaw = 0;

        // 1. Workspace Cost
        const costWorkspace = Math.max(0, usage.workspaces - PRICING.workspace.threshold) * PRICING.workspace.price;
        
        // 2. Profile Cost (Dynamic based on workspaces)
        const includedProfiles = usage.workspaces * PRICING.profiles.basePerWorkspace;
        const costProfiles = Math.max(0, usage.profiles - includedProfiles) * PRICING.profiles.price;
        
        // 3. Store Cost (0 threshold, pay per store)
        const costStore = Math.max(0, usage.stores - PRICING.store.threshold) * PRICING.store.price;
        
        // 4. SVC Cost (0 threshold, pay per card)
        const costSVC = Math.max(0, usage.svcs - PRICING.svc.threshold) * PRICING.svc.price;
        
        monthlyRaw += costWorkspace + costProfiles + costStore + costSVC;

        // Calculate Module Costs
        const costModules = activeModules.length * 20;
        monthlyRaw += costModules;

        // Apply Annual Discount
        const monthlyBillable = billingCycle === 'annual' ? monthlyRaw * 0.8 : monthlyRaw;
        const annualTotal = monthlyBillable * 12;

        return {
            monthlyRaw,
            monthlyBillable,
            totalDue: billingCycle === 'annual' ? annualTotal : monthlyBillable,
            savings: billingCycle === 'annual' ? (monthlyRaw * 0.2 * 12) : 0,
            includedProfiles,
            breakdown: { costWorkspace, costProfiles, costStore, costSVC, costModules }
        };
    }, [usage, activeModules, billingCycle]);

    const toggleModule = (id: string) => {
        if (activeModules.includes(id)) {
            setActiveModules(activeModules.filter(m => m !== id));
        } else {
            setActiveModules([...activeModules, id]);
        }
    };

    const updateUsage = (key: keyof typeof usage, delta: number) => {
        setUsage(prev => {
            const newState = { ...prev, [key]: Math.max(0, prev[key] + delta) };
            if (key === 'workspaces') newState.workspaces = Math.max(1, newState.workspaces);
            return newState;
        });
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                     <div className="flex items-center gap-2 mb-2">
                         <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded uppercase tracking-wider">Workspace</span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Billing & Plans</h1>
                    <p className="text-slate-500">Manage your subscription, usage limits, and active modules.</p>
                </div>
                
                {/* Billing Cycle Toggle */}
                <div className="bg-white p-1 rounded-xl border border-slate-200 flex shadow-sm">
                    <button 
                        onClick={() => setBillingCycle('monthly')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${billingCycle === 'monthly' ? 'bg-slate-900 text-white shadow' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        Monthly
                    </button>
                    <button 
                        onClick={() => setBillingCycle('annual')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${billingCycle === 'annual' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        Annual
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${billingCycle === 'annual' ? 'bg-white/20 text-white' : 'bg-green-100 text-green-700'}`}>-20%</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Plan Config */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Usage & Limits */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Usage & Add-ons</h3>
                                <p className="text-sm text-slate-500">Manage your capacity. Pay only for what you need.</p>
                            </div>
                        </div>
                        <div className="divide-y divide-slate-100">
                             {/* Workspaces */}
                             <div className="p-6 flex items-center gap-6">
                                <div className="p-3 bg-slate-100 rounded-xl text-slate-600"><Building2 size={24} /></div>
                                <div className="flex-1">
                                    <div className="flex justify-between mb-1">
                                        <h4 className="font-bold text-slate-900">Workspaces</h4>
                                        <span className="text-sm font-bold text-slate-900">{usage.workspaces} Active</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2 mb-2 overflow-hidden">
                                        <div className={`h-full rounded-full ${usage.workspaces > PRICING.workspace.threshold ? 'bg-indigo-600' : 'bg-slate-300'}`} style={{ width: `${(usage.workspaces / (PRICING.workspace.threshold + 5)) * 100}%` }}></div>
                                    </div>
                                    <p className="text-xs text-slate-500">
                                        {PRICING.workspace.threshold} included. 
                                        {usage.workspaces > PRICING.workspace.threshold && <span className="text-indigo-600 font-bold ml-1">+${financials.breakdown.costWorkspace}/mo</span>}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-1 border border-slate-200">
                                    <button onClick={() => updateUsage('workspaces', -1)} className="p-2 hover:bg-white rounded-md transition-colors"><Minus size={14} /></button>
                                    <button onClick={() => updateUsage('workspaces', 1)} className="p-2 hover:bg-white rounded-md transition-colors"><Plus size={14} /></button>
                                </div>
                             </div>

                             {/* Profiles */}
                             <div className="p-6 flex items-center gap-6">
                                <div className="p-3 bg-slate-100 rounded-xl text-slate-600"><Share2 size={24} /></div>
                                <div className="flex-1">
                                    <div className="flex justify-between mb-1">
                                        <h4 className="font-bold text-slate-900">Social Profiles</h4>
                                        <span className="text-sm font-bold text-slate-900">{usage.profiles} Active</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2 mb-2 overflow-hidden">
                                        <div className={`h-full rounded-full ${usage.profiles > financials.includedProfiles ? 'bg-indigo-600' : 'bg-slate-300'}`} style={{ width: `${(usage.profiles / (financials.includedProfiles + 5)) * 100}%` }}></div>
                                    </div>
                                    <p className="text-xs text-slate-500">
                                        {financials.includedProfiles} included ({PRICING.profiles.basePerWorkspace} per workspace). 
                                        {usage.profiles > financials.includedProfiles && <span className="text-indigo-600 font-bold ml-1">+${financials.breakdown.costProfiles}/mo</span>}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-1 border border-slate-200">
                                    <button onClick={() => updateUsage('profiles', -1)} className="p-2 hover:bg-white rounded-md transition-colors"><Minus size={14} /></button>
                                    <button onClick={() => updateUsage('profiles', 1)} className="p-2 hover:bg-white rounded-md transition-colors"><Plus size={14} /></button>
                                </div>
                             </div>

                             {/* Stores */}
                             <div className="p-6 flex items-center gap-6">
                                <div className="p-3 bg-slate-100 rounded-xl text-slate-600"><ShoppingBag size={24} /></div>
                                <div className="flex-1">
                                    <div className="flex justify-between mb-1">
                                        <h4 className="font-bold text-slate-900">Store Builder</h4>
                                        <span className="text-sm font-bold text-slate-900">{usage.stores} Stores</span>
                                    </div>
                                    {/* Progress bar visualizes usage as capacity for visual feedback */}
                                    <div className="w-full bg-slate-100 rounded-full h-2 mb-2 overflow-hidden">
                                        <div className="h-full rounded-full bg-indigo-600" style={{ width: '100%' }}></div>
                                    </div>
                                    <p className="text-xs text-slate-500">
                                        ${PRICING.store.price}/mo per store.
                                        {usage.stores > 0 && <span className="text-indigo-600 font-bold ml-1">Total: ${financials.breakdown.costStore}/mo</span>}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-1 border border-slate-200">
                                    <button onClick={() => updateUsage('stores', -1)} className="p-2 hover:bg-white rounded-md transition-colors"><Minus size={14} /></button>
                                    <button onClick={() => updateUsage('stores', 1)} className="p-2 hover:bg-white rounded-md transition-colors"><Plus size={14} /></button>
                                </div>
                             </div>

                             {/* SVCs */}
                             <div className="p-6 flex items-center gap-6">
                                <div className="p-3 bg-slate-100 rounded-xl text-slate-600"><IdCard size={24} /></div>
                                <div className="flex-1">
                                    <div className="flex justify-between mb-1">
                                        <h4 className="font-bold text-slate-900">Digital Cards (SVC)</h4>
                                        <span className="text-sm font-bold text-slate-900">{usage.svcs} Cards</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2 mb-2 overflow-hidden">
                                        <div className="h-full rounded-full bg-indigo-600" style={{ width: '100%' }}></div>
                                    </div>
                                    <p className="text-xs text-slate-500">
                                        ${PRICING.svc.price}/mo per card.
                                        {usage.svcs > 0 && <span className="text-indigo-600 font-bold ml-1">Total: ${financials.breakdown.costSVC}/mo</span>}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-1 border border-slate-200">
                                    <button onClick={() => updateUsage('svcs', -1)} className="p-2 hover:bg-white rounded-md transition-colors"><Minus size={14} /></button>
                                    <button onClick={() => updateUsage('svcs', 1)} className="p-2 hover:bg-white rounded-md transition-colors"><Plus size={14} /></button>
                                </div>
                             </div>
                        </div>
                    </div>

                    {/* Modules Grid */}
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-4 px-1">Power Modules</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.values(PRICING.modules).map((module) => {
                                const isActive = activeModules.includes(module.id);
                                return (
                                    <div 
                                        key={module.id}
                                        onClick={() => toggleModule(module.id)}
                                        className={`cursor-pointer p-4 rounded-xl border-2 transition-all relative ${
                                            isActive 
                                            ? 'bg-indigo-50 border-indigo-500' 
                                            : 'bg-white border-slate-200 hover:border-slate-300'
                                        }`}
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div className={`p-2 rounded-lg ${isActive ? 'bg-indigo-200 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>
                                                <module.icon size={20} />
                                            </div>
                                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isActive ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 bg-white'}`}>
                                                {isActive && <Check size={12} className="text-white" />}
                                            </div>
                                        </div>
                                        <h4 className="font-bold text-slate-900">{module.label}</h4>
                                        <p className="text-xs text-slate-500 mb-2">{module.desc}</p>
                                        <div className="flex items-center gap-1">
                                            <span className={`font-bold ${isActive ? 'text-indigo-700' : 'text-slate-700'}`}>
                                                ${billingCycle === 'annual' ? module.price * 0.8 : module.price}
                                            </span>
                                            <span className="text-xs text-slate-400">/mo</span>
                                        </div>
                                    </div>
                                );
                            })}
                             {/* Free Modules Display */}
                            {[
                                { label: 'Planner', icon: Calendar, desc: 'Unlimited posts' },
                                { label: 'Team & Collab', icon: Users, desc: 'Unlimited users' },
                                { label: 'Roles', icon: Shield, desc: 'Custom permissions' }
                            ].map((m, i) => (
                                <div key={i} className="p-4 rounded-xl border border-slate-200 bg-slate-50 opacity-75">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="p-2 rounded-lg bg-slate-200 text-slate-500"><m.icon size={20} /></div>
                                        <Check size={16} className="text-slate-400" />
                                    </div>
                                    <h4 className="font-bold text-slate-700">{m.label}</h4>
                                    <p className="text-xs text-slate-500 mb-2">{m.desc}</p>
                                    <span className="text-xs font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded">Free</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Summary & Payment */}
                <div className="space-y-8">
                     {/* Summary Card */}
                     <div className="bg-gradient-to-br from-slate-900 to-indigo-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
                         <div className="relative z-10">
                            <h3 className="text-indigo-200 text-xs font-bold uppercase tracking-wider mb-2">Estimated Total</h3>
                            <div className="flex items-baseline gap-1 mb-1">
                                <span className="text-5xl font-bold tracking-tight">${financials.totalDue.toFixed(2)}</span>
                                <span className="text-indigo-300 text-lg font-medium">/{billingCycle === 'annual' ? 'yr' : 'mo'}</span>
                            </div>
                            <p className="text-indigo-200 text-xs mb-6">
                                {billingCycle === 'annual' ? 'Billed annually' : 'Billed monthly'}. 
                                {financials.savings > 0 && <span className="text-green-400 font-bold ml-1">You save ${financials.savings.toFixed(2)}/yr</span>}
                            </p>

                            <div className="space-y-3 pt-6 border-t border-white/10 text-sm">
                                <div className="flex justify-between text-indigo-100">
                                    <span>Base Plan (Core)</span>
                                    <span className="font-medium">Free</span>
                                </div>
                                <div className="flex justify-between text-indigo-100">
                                    <span>Usage Charges</span>
                                    <span className="font-medium">${(financials.breakdown.costWorkspace + financials.breakdown.costProfiles + financials.breakdown.costStore + financials.breakdown.costSVC).toFixed(2)}/mo</span>
                                </div>
                                <div className="flex justify-between text-indigo-100">
                                    <span>Active Modules ({activeModules.length})</span>
                                    <span className="font-medium">${financials.breakdown.costModules.toFixed(2)}/mo</span>
                                </div>
                            </div>
                            
                            <button className="w-full mt-8 bg-white text-indigo-900 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-lg">
                                Update Subscription
                            </button>
                         </div>
                         {/* Decor */}
                         <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
                         <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
                     </div>

                     {/* Payment Method */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                <CreditCard size={18} className="text-slate-400" /> Payment Method
                            </h3>
                            <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700">Update</button>
                        </div>
                        <div className="flex items-center gap-4 p-4 border border-slate-100 rounded-xl bg-slate-50 mb-4">
                            <div className="w-12 h-8 bg-white rounded border border-slate-200 flex items-center justify-center">
                                <span className="font-bold text-slate-700 italic text-xs">VISA</span>
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-slate-900 text-sm">•••• •••• •••• 4242</p>
                                <p className="text-xs text-slate-500">Expires 12/25</p>
                            </div>
                        </div>
                    </div>

                    {/* Invoices */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-4">Recent Invoices</h3>
                        <div className="space-y-3">
                            {[
                                { date: 'Oct 24, 2024', amount: '$124.00', status: 'Paid' },
                                { date: 'Sep 24, 2024', amount: '$110.00', status: 'Paid' },
                            ].map((inv, i) => (
                                <div key={i} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100">
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm">{inv.amount}</p>
                                        <p className="text-xs text-slate-500">{inv.date}</p>
                                    </div>
                                    <button className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors">
                                        <Download size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-4 text-sm font-bold text-slate-600 hover:text-indigo-600 py-2">
                            View All History
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};