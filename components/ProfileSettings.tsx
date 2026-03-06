import React, { useState, useRef, useEffect } from 'react';
import {
    User, Mail, Phone, Lock, Shield, Camera, Check,
    Eye, EyeOff, Save, Loader2, AlertCircle, CheckCircle2,
    Key, Smartphone, Copy, RefreshCw, ChevronRight, Bell,
    Globe, Moon, Sun, Palette, LogOut, X
} from 'lucide-react';

const API_BASE = 'http://localhost:8000';

const getToken = () =>
    localStorage.getItem('sk_agency_token') ||
    localStorage.getItem('socialknoks_token') || '';

// ── Utility ───────────────────────────────────────────────────────────────────
const getInitials = (name: string) =>
    name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U';

const avatarColors = [
    'from-violet-500 to-indigo-600',
    'from-rose-500 to-pink-600',
    'from-amber-500 to-orange-600',
    'from-emerald-500 to-teal-600',
    'from-cyan-500 to-blue-600',
];

// ── Tab config ─────────────────────────────────────────────────────────────────
type Tab = 'profile' | 'security' | 'notifications' | 'preferences';

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'profile', label: 'Profile', icon: <User size={16} /> },
    { id: 'security', label: 'Security & 2FA', icon: <Shield size={16} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={16} /> },
    { id: 'preferences', label: 'Preferences', icon: <Palette size={16} /> },
];

// ── Toast ──────────────────────────────────────────────────────────────────────
const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) => (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl text-sm font-semibold animate-in slide-in-from-bottom-4 duration-300 ${type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
        {type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
        {message}
        <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100"><X size={14} /></button>
    </div>
);

// ── Profile Tab ────────────────────────────────────────────────────────────────
const ProfileTab: React.FC<{ onToast: (msg: string, type: 'success' | 'error') => void }> = ({ onToast }) => {
    const [isSaving, setIsSaving] = useState(false);
    const [avatarColor] = useState(avatarColors[Math.floor(Math.random() * avatarColors.length)]);
    const fileRef = useRef<HTMLInputElement>(null);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    const [form, setForm] = useState({
        name: 'Agency Owner',
        email: 'owner@agency.com',
        phone: '',
        company: '',
        website: '',
        bio: '',
        timezone: 'UTC+5',
        language: 'English',
    });

    // Load from JWT on mount
    useEffect(() => {
        try {
            const token = getToken();
            if (!token) return;
            const payload = JSON.parse(atob(token.split('.')[1]));
            setForm(prev => ({
                ...prev,
                name: payload.name || prev.name,
                email: payload.email || prev.email,
            }));
        } catch { /* ignore */ }
    }, []);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setAvatarUrl(URL.createObjectURL(file));
    };

    const handleSave = async () => {
        setIsSaving(true);
        await new Promise(r => setTimeout(r, 800)); // simulate API call
        setIsSaving(false);
        onToast('Profile updated successfully!', 'success');
    };

    return (
        <div className="space-y-8 max-w-2xl animate-in fade-in duration-300">
            {/* Avatar */}
            <div className="flex items-center gap-6">
                <div className="relative group cursor-pointer" onClick={() => fileRef.current?.click()}>
                    {avatarUrl ? (
                        <img src={avatarUrl} alt="avatar" className="w-24 h-24 rounded-2xl object-cover ring-4 ring-white shadow-xl" />
                    ) : (
                        <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${avatarColor} flex items-center justify-center text-white font-bold text-3xl shadow-xl ring-4 ring-white`}>
                            {getInitials(form.name)}
                        </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Camera size={22} className="text-white" />
                    </div>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-900">{form.name}</h3>
                    <p className="text-slate-500 text-sm">{form.email}</p>
                    <button
                        onClick={() => fileRef.current?.click()}
                        className="mt-2 text-xs text-indigo-600 font-semibold hover:text-indigo-800 flex items-center gap-1 transition-colors"
                    >
                        <Camera size={12} /> Change photo
                    </button>
                </div>
            </div>

            {/* Form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Full Name" icon={<User size={15} />}>
                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                        className="input-base" placeholder="Your full name" />
                </Field>
                <Field label="Email Address" icon={<Mail size={15} />}>
                    <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                        type="email" className="input-base" placeholder="your@email.com" />
                </Field>
                <Field label="Phone Number" icon={<Phone size={15} />}>
                    <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                        type="tel" className="input-base" placeholder="+1 234 567 8900" />
                </Field>
                <Field label="Company / Agency" icon={<Globe size={15} />}>
                    <input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })}
                        className="input-base" placeholder="Your agency name" />
                </Field>
                <Field label="Website" icon={<Globe size={15} />} className="sm:col-span-2">
                    <input value={form.website} onChange={e => setForm({ ...form, website: e.target.value })}
                        type="url" className="input-base" placeholder="https://youragency.com" />
                </Field>
                <Field label="Bio" icon={<User size={15} />} className="sm:col-span-2">
                    <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })}
                        rows={3} className="input-base resize-none" placeholder="Tell us a little about yourself..." />
                </Field>
            </div>

            <div className="flex justify-end">
                <SaveButton isSaving={isSaving} onClick={handleSave} />
            </div>
        </div>
    );
};

// ── Security & 2FA Tab ─────────────────────────────────────────────────────────
const SecurityTab: React.FC<{ onToast: (msg: string, type: 'success' | 'error') => void }> = ({ onToast }) => {
    const [showCurrentPw, setShowCurrentPw] = useState(false);
    const [showNewPw, setShowNewPw] = useState(false);
    const [showConfirmPw, setShowConfirmPw] = useState(false);
    const [isSavingPw, setIsSavingPw] = useState(false);
    const [pwForm, setPwForm] = useState({ current: '', new: '', confirm: '' });
    const [twoFAEnabled, setTwoFAEnabled] = useState(false);
    const [showSetupModal, setShowSetupModal] = useState(false);
    const [verifyCode, setVerifyCode] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);

    // Fake TOTP secret and QR
    const totpSecret = 'JBSWY3DPEHPK3PXP';
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=otpauth://totp/SocialKnocks:owner@agency.com?secret=${totpSecret}&issuer=SocialKnocks`;

    const handleCopySecret = () => {
        navigator.clipboard.writeText(totpSecret);
        onToast('Secret key copied!', 'success');
    };

    const handlePasswordSave = async () => {
        if (!pwForm.current || !pwForm.new) return;
        if (pwForm.new !== pwForm.confirm) { onToast('Passwords do not match.', 'error'); return; }
        if (pwForm.new.length < 8) { onToast('Password must be at least 8 characters.', 'error'); return; }
        setIsSavingPw(true);
        await new Promise(r => setTimeout(r, 800));
        setIsSavingPw(false);
        setPwForm({ current: '', new: '', confirm: '' });
        onToast('Password changed successfully!', 'success');
    };

    const handleVerify2FA = async () => {
        if (verifyCode.length !== 6) return;
        setIsVerifying(true);
        await new Promise(r => setTimeout(r, 700));
        setIsVerifying(false);
        setTwoFAEnabled(true);
        setShowSetupModal(false);
        setVerifyCode('');
        onToast('Two-factor authentication enabled!', 'success');
    };

    const handleDisable2FA = () => {
        setTwoFAEnabled(false);
        onToast('2FA disabled. Your account is less secure.', 'error');
    };

    const pwStrength = (pw: string) => {
        if (!pw) return null;
        if (pw.length < 6) return { label: 'Weak', color: 'bg-red-400', width: '25%' };
        if (pw.length < 10) return { label: 'Fair', color: 'bg-amber-400', width: '50%' };
        if (!/[!@#$%^&*]/.test(pw)) return { label: 'Good', color: 'bg-blue-400', width: '75%' };
        return { label: 'Strong', color: 'bg-emerald-500', width: '100%' };
    };
    const strength = pwStrength(pwForm.new);

    return (
        <div className="space-y-8 max-w-2xl animate-in fade-in duration-300">

            {/* Change Password */}
            <Card title="Change Password" icon={<Lock size={18} />}>
                <div className="space-y-4 mt-4">
                    <PasswordField label="Current Password" value={pwForm.current} show={showCurrentPw}
                        onChange={v => setPwForm({ ...pwForm, current: v })} onToggle={() => setShowCurrentPw(!showCurrentPw)} />
                    <PasswordField label="New Password" value={pwForm.new} show={showNewPw}
                        onChange={v => setPwForm({ ...pwForm, new: v })} onToggle={() => setShowNewPw(!showNewPw)} />
                    {/* Strength bar */}
                    {pwForm.new && strength && (
                        <div className="space-y-1">
                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full transition-all duration-500 ${strength.color}`} style={{ width: strength.width }} />
                            </div>
                            <p className={`text-xs font-medium ${strength.label === 'Strong' ? 'text-emerald-600' : strength.label === 'Good' ? 'text-blue-600' : strength.label === 'Fair' ? 'text-amber-600' : 'text-red-500'}`}>
                                {strength.label} password
                            </p>
                        </div>
                    )}
                    <PasswordField label="Confirm New Password" value={pwForm.confirm} show={showConfirmPw}
                        onChange={v => setPwForm({ ...pwForm, confirm: v })} onToggle={() => setShowConfirmPw(!showConfirmPw)} />
                    <div className="flex justify-end">
                        <SaveButton isSaving={isSavingPw} onClick={handlePasswordSave} label="Update Password" />
                    </div>
                </div>
            </Card>

            {/* 2FA */}
            <Card title="Two-Factor Authentication" icon={<Smartphone size={18} />}>
                <div className="mt-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${twoFAEnabled ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                                <Shield size={18} className={twoFAEnabled ? 'text-emerald-600' : 'text-slate-500'} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900">
                                    {twoFAEnabled ? '2FA is Active' : 'Authenticator App'}
                                </p>
                                <p className="text-xs text-slate-500">
                                    {twoFAEnabled
                                        ? 'Your account is protected with TOTP 2FA'
                                        : 'Use Google Authenticator or Authy'}
                                </p>
                            </div>
                        </div>
                        {twoFAEnabled ? (
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1">
                                    <Check size={11} /> Enabled
                                </span>
                                <button onClick={handleDisable2FA} className="text-xs text-red-500 hover:text-red-700 font-semibold px-3 py-1.5 rounded-xl border border-red-200 hover:bg-red-50 transition-colors">
                                    Disable
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowSetupModal(true)}
                                className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl transition-colors shadow-md shadow-indigo-200 flex items-center gap-1.5"
                            >
                                <Key size={13} /> Enable 2FA
                            </button>
                        )}
                    </div>

                    {/* Security tips */}
                    <div className="mt-4 space-y-2">
                        {[
                            '2FA adds a second layer of security to your account.',
                            'Even if someone gets your password, they cannot log in without your phone.',
                            'Supported apps: Google Authenticator, Authy, 1Password.',
                        ].map((tip, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs text-slate-500">
                                <Check size={12} className="text-indigo-400 mt-0.5 shrink-0" /> {tip}
                            </div>
                        ))}
                    </div>
                </div>
            </Card>

            {/* 2FA Setup Modal */}
            {showSetupModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Set up 2FA</h3>
                                <p className="text-xs text-slate-500 mt-0.5">Scan with your authenticator app</p>
                            </div>
                            <button onClick={() => setShowSetupModal(false)} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"><X size={18} /></button>
                        </div>

                        {/* QR Code */}
                        <div className="flex justify-center mb-4">
                            <div className="p-3 bg-white rounded-2xl border-2 border-slate-100 shadow-inner">
                                <img src={qrUrl} alt="QR Code" className="w-44 h-44" />
                            </div>
                        </div>

                        {/* Manual key */}
                        <div className="mb-5">
                            <p className="text-xs text-slate-500 mb-1.5 font-medium">Or enter this key manually:</p>
                            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                                <code className="flex-1 font-mono text-xs text-slate-800 tracking-widest">{totpSecret}</code>
                                <button onClick={handleCopySecret} className="p-1 text-slate-400 hover:text-indigo-600 transition-colors">
                                    <Copy size={14} />
                                </button>
                            </div>
                        </div>

                        {/* Verify */}
                        <div className="mb-4">
                            <p className="text-xs font-semibold text-slate-700 mb-2">Enter the 6-digit code from your app:</p>
                            <input
                                value={verifyCode}
                                onChange={e => setVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="000000"
                                className="w-full text-center text-2xl font-mono tracking-[0.5em] border-2 border-slate-200 focus:border-indigo-500 rounded-2xl py-3 focus:outline-none transition-colors"
                                maxLength={6}
                            />
                        </div>
                        <button
                            onClick={handleVerify2FA}
                            disabled={verifyCode.length !== 6 || isVerifying}
                            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-lg shadow-indigo-200"
                        >
                            {isVerifying ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                            {isVerifying ? 'Verifying...' : 'Confirm & Enable'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// ── Notifications Tab ──────────────────────────────────────────────────────────
const NotificationsTab: React.FC<{ onToast: (msg: string, type: 'success' | 'error') => void }> = ({ onToast }) => {
    const [prefs, setPrefs] = useState({
        emailDigest: true, loginAlerts: true, ticketReplies: true,
        mentionAlerts: true, billingAlerts: true, weeklyReport: false,
        pushNotifications: false, marketingEmails: false,
    });

    const toggle = (key: keyof typeof prefs) => setPrefs(prev => ({ ...prev, [key]: !prev[key] }));

    const sections = [
        {
            title: 'Email Notifications',
            items: [
                { key: 'emailDigest' as const, label: 'Daily Digest', desc: 'A summary of your workspace activity each morning' },
                { key: 'loginAlerts' as const, label: 'Login Alerts', desc: 'Get notified of new sign-ins to your account' },
                { key: 'ticketReplies' as const, label: 'Support Replies', desc: 'When the support team replies to your tickets' },
                { key: 'mentionAlerts' as const, label: 'Mentions', desc: 'When someone tags you in a comment' },
                { key: 'billingAlerts' as const, label: 'Billing Updates', desc: 'Invoice and payment confirmations' },
                { key: 'weeklyReport' as const, label: 'Weekly Report', desc: 'Analytics summary every Monday' },
            ]
        },
        {
            title: 'Push & Marketing',
            items: [
                { key: 'pushNotifications' as const, label: 'Browser Push', desc: 'Real-time push notifications in your browser' },
                { key: 'marketingEmails' as const, label: 'Product Updates', desc: 'News, feature releases, and tips from SocialKnocks' },
            ]
        }
    ];

    return (
        <div className="space-y-6 max-w-2xl animate-in fade-in duration-300">
            {sections.map(section => (
                <Card key={section.title} title={section.title} icon={<Bell size={18} />}>
                    <div className="mt-4 divide-y divide-slate-100">
                        {section.items.map(item => (
                            <div key={item.key} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                                </div>
                                <Toggle checked={prefs[item.key]} onChange={() => toggle(item.key)} />
                            </div>
                        ))}
                    </div>
                </Card>
            ))}
            <div className="flex justify-end">
                <SaveButton isSaving={false} onClick={() => onToast('Notification preferences saved!', 'success')} label="Save Preferences" />
            </div>
        </div>
    );
};

// ── Preferences Tab ────────────────────────────────────────────────────────────
const PreferencesTab: React.FC<{ onToast: (msg: string, type: 'success' | 'error') => void }> = ({ onToast }) => {
    const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');
    const [accentColor, setAccentColor] = useState('indigo');
    const [language, setLanguage] = useState('English');
    const [timezone, setTimezone] = useState('UTC+5');

    const accents = [
        { id: 'indigo', bg: 'bg-indigo-500' },
        { id: 'violet', bg: 'bg-violet-500' },
        { id: 'rose', bg: 'bg-rose-500' },
        { id: 'amber', bg: 'bg-amber-500' },
        { id: 'emerald', bg: 'bg-emerald-500' },
        { id: 'cyan', bg: 'bg-cyan-500' },
    ];

    return (
        <div className="space-y-6 max-w-2xl animate-in fade-in duration-300">
            <Card title="Appearance" icon={<Palette size={18} />}>
                <div className="mt-4 space-y-5">
                    {/* Theme */}
                    <div>
                        <p className="text-sm font-semibold text-slate-700 mb-3">Theme</p>
                        <div className="grid grid-cols-3 gap-3">
                            {([
                                { id: 'light', icon: <Sun size={16} />, label: 'Light' },
                                { id: 'dark', icon: <Moon size={16} />, label: 'Dark' },
                                { id: 'system', icon: <Globe size={16} />, label: 'System' },
                            ] as const).map(t => (
                                <button key={t.id} onClick={() => setTheme(t.id)}
                                    className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all text-sm font-semibold ${theme === t.id ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                                    {t.icon} {t.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    {/* Accent color */}
                    <div>
                        <p className="text-sm font-semibold text-slate-700 mb-3">Accent Color</p>
                        <div className="flex gap-3">
                            {accents.map(a => (
                                <button key={a.id} onClick={() => setAccentColor(a.id)}
                                    className={`w-8 h-8 rounded-full ${a.bg} transition-all ${accentColor === a.id ? 'ring-2 ring-offset-2 ring-slate-900 scale-110' : 'hover:scale-105'}`} />
                            ))}
                        </div>
                    </div>
                </div>
            </Card>

            <Card title="Regional Settings" icon={<Globe size={18} />}>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Language">
                        <select value={language} onChange={e => setLanguage(e.target.value)} className="input-base">
                            {['English', 'Urdu', 'Arabic', 'French', 'Spanish', 'German'].map(l => <option key={l}>{l}</option>)}
                        </select>
                    </Field>
                    <Field label="Timezone">
                        <select value={timezone} onChange={e => setTimezone(e.target.value)} className="input-base">
                            {['UTC-8', 'UTC-5', 'UTC', 'UTC+1', 'UTC+3', 'UTC+5', 'UTC+5:30', 'UTC+8'].map(t => <option key={t}>{t}</option>)}
                        </select>
                    </Field>
                </div>
            </Card>

            <div className="flex justify-end">
                <SaveButton isSaving={false} onClick={() => onToast('Preferences saved!', 'success')} label="Save Preferences" />
            </div>
        </div>
    );
};

// ── Shared sub-components ──────────────────────────────────────────────────────
const Card = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-2.5">
            <span className="text-indigo-500">{icon}</span>
            <h3 className="font-bold text-slate-900 text-sm">{title}</h3>
        </div>
        {children}
    </div>
);

const Field = ({ label, icon, children, className = '' }: { label: string; icon?: React.ReactNode; children: React.ReactNode; className?: string }) => (
    <div className={className}>
        <label className="block text-xs font-bold text-slate-700 mb-1.5">
            {icon && <span className="inline-block mr-1 align-middle opacity-60">{icon}</span>}
            {label}
        </label>
        {children}
    </div>
);

const PasswordField = ({ label, value, show, onChange, onToggle }: { label: string; value: string; show: boolean; onChange: (v: string) => void; onToggle: () => void }) => (
    <div>
        <label className="block text-xs font-bold text-slate-700 mb-1.5">{label}</label>
        <div className="relative">
            <input type={show ? 'text' : 'password'} value={value} onChange={e => onChange(e.target.value)}
                className="input-base pr-10" placeholder="••••••••" />
            <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {show ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
        </div>
    </div>
);

const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button onClick={onChange} className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${checked ? 'bg-indigo-600' : 'bg-slate-200'}`}>
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${checked ? 'translate-x-5' : ''}`} />
    </button>
);

const SaveButton = ({ isSaving, onClick, label = 'Save Changes' }: { isSaving: boolean; onClick: () => void; label?: string }) => (
    <button onClick={onClick} disabled={isSaving}
        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-200 transition-all disabled:opacity-60">
        {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
        {isSaving ? 'Saving...' : label}
    </button>
);

// ── Main Component ─────────────────────────────────────────────────────────────
export const ProfileSettings: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('profile');
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
            {/* Page header */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-4">
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                        <User size={20} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Profile & Settings</h1>
                        <p className="text-sm text-slate-500">Manage your personal account settings</p>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
                {/* Tab bar — scrollable on mobile */}
                <div className="flex gap-1 overflow-x-auto bg-white border border-slate-200 rounded-2xl p-1.5 mb-6 shadow-sm no-scrollbar">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-150 ${activeTab === tab.id
                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                                }`}
                        >
                            {tab.icon}
                            <span className="hidden sm:inline">{tab.label}</span>
                            <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                        </button>
                    ))}
                </div>

                {/* Tab content */}
                {activeTab === 'profile' && <ProfileTab onToast={showToast} />}
                {activeTab === 'security' && <SecurityTab onToast={showToast} />}
                {activeTab === 'notifications' && <NotificationsTab onToast={showToast} />}
                {activeTab === 'preferences' && <PreferencesTab onToast={showToast} />}
            </div>

            {/* Toast */}
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {/* Global input styles injected once */}
            <style>{`
        .input-base {
          width: 100%;
          padding: 0.625rem 0.875rem;
          border-radius: 0.75rem;
          border: 1.5px solid #e2e8f0;
          font-size: 0.875rem;
          color: #0f172a;
          background: #fff;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .input-base:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
        }
        .input-base::placeholder { color: #94a3b8; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
        </div>
    );
};
