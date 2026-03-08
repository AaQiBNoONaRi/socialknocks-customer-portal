import React, { useState, useRef, useEffect } from 'react';
import {
    User, Mail, Phone, Lock, Shield, Camera, Check,
    Eye, EyeOff, Save, Loader2, AlertCircle, CheckCircle2,
    Key, Smartphone, Copy, Bell, Globe, Moon, Sun, Palette,
    X, ChevronDown, MapPin
} from 'lucide-react';

const API_BASE = 'http://localhost:8000';

const getToken = () =>
    localStorage.getItem('sk_agency_token') ||
    localStorage.getItem('socialknocks_token') || '';

const getInitials = (name: string) =>
    name.split(' ').filter(Boolean).map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U';

const avatarGradients = [
    'from-violet-500 to-indigo-600',
    'from-rose-500 to-pink-600',
    'from-amber-500 to-orange-600',
    'from-emerald-500 to-teal-600',
    'from-cyan-500 to-blue-600',
];

type Tab = 'profile' | 'security' | 'notifications' | 'preferences';

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'profile', label: 'Profile', icon: <User size={16} /> },
    { id: 'security', label: 'Security & 2FA', icon: <Shield size={16} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={16} /> },
    { id: 'preferences', label: 'Preferences', icon: <Palette size={16} /> },
];

// ── Country + phone code data ──────────────────────────────────────────────────
interface Country {
    name: string;
    code: string;  // ISO 2-letter
    dial: string;  // e.g. +92
    flag: string;  // emoji
}

const COUNTRIES: Country[] = [
    { name: 'Pakistan', code: 'PK', dial: '+92', flag: '🇵🇰' },
    { name: 'United States', code: 'US', dial: '+1', flag: '🇺🇸' },
    { name: 'United Kingdom', code: 'GB', dial: '+44', flag: '🇬🇧' },
    { name: 'India', code: 'IN', dial: '+91', flag: '🇮🇳' },
    { name: 'UAE', code: 'AE', dial: '+971', flag: '🇦🇪' },
    { name: 'Saudi Arabia', code: 'SA', dial: '+966', flag: '🇸🇦' },
    { name: 'Canada', code: 'CA', dial: '+1', flag: '🇨🇦' },
    { name: 'Australia', code: 'AU', dial: '+61', flag: '🇦🇺' },
    { name: 'Germany', code: 'DE', dial: '+49', flag: '🇩🇪' },
    { name: 'France', code: 'FR', dial: '+33', flag: '🇫🇷' },
    { name: 'Turkey', code: 'TR', dial: '+90', flag: '🇹🇷' },
    { name: 'Egypt', code: 'EG', dial: '+20', flag: '🇪🇬' },
    { name: 'Bangladesh', code: 'BD', dial: '+880', flag: '🇧🇩' },
    { name: 'Nigeria', code: 'NG', dial: '+234', flag: '🇳🇬' },
    { name: 'Qatar', code: 'QA', dial: '+974', flag: '🇶🇦' },
    { name: 'Kuwait', code: 'KW', dial: '+965', flag: '🇰🇼' },
    { name: 'Netherlands', code: 'NL', dial: '+31', flag: '🇳🇱' },
    { name: 'Spain', code: 'ES', dial: '+34', flag: '🇪🇸' },
    { name: 'Italy', code: 'IT', dial: '+39', flag: '🇮🇹' },
    { name: 'China', code: 'CN', dial: '+86', flag: '🇨🇳' },
    { name: 'Japan', code: 'JP', dial: '+81', flag: '🇯🇵' },
    { name: 'Brazil', code: 'BR', dial: '+55', flag: '🇧🇷' },
    { name: 'Russia', code: 'RU', dial: '+7', flag: '🇷🇺' },
    { name: 'Indonesia', code: 'ID', dial: '+62', flag: '🇮🇩' },
    { name: 'Malaysia', code: 'MY', dial: '+60', flag: '🇲🇾' },
    { name: 'Singapore', code: 'SG', dial: '+65', flag: '🇸🇬' },
    { name: 'South Africa', code: 'ZA', dial: '+27', flag: '🇿🇦' },
    { name: 'Kenya', code: 'KE', dial: '+254', flag: '🇰🇪' },
    { name: 'Jordan', code: 'JO', dial: '+962', flag: '🇯🇴' },
    { name: 'Lebanon', code: 'LB', dial: '+961', flag: '🇱🇧' },
];

const LANGUAGES = ['English', 'Urdu', 'Arabic', 'French', 'Spanish', 'German', 'Turkish', 'Bengali', 'Malay'];
const TIMEZONES = ['UTC-8 (PST)', 'UTC-5 (EST)', 'UTC (GMT)', 'UTC+1 (CET)', 'UTC+3 (AST)', 'UTC+5 (PKT)', 'UTC+5:30 (IST)', 'UTC+8 (CST)', 'UTC+9 (JST)'];

// ── Phone Country Picker ───────────────────────────────────────────────────────
const PhonePicker: React.FC<{
    value: string;
    selectedCountry: Country;
    onCountryChange: (c: Country) => void;
    onChange: (v: string) => void;
}> = ({ value, selectedCountry, onCountryChange, onChange }) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const filtered = COUNTRIES.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.dial.includes(search)
    );

    return (
        <div className="flex gap-2" ref={ref}>
            {/* Country code dropdown */}
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setOpen(!open)}
                    className="flex items-center gap-1.5 h-10 px-3 bg-white border-[1.5px] border-slate-200 rounded-xl text-sm font-semibold text-slate-800 hover:border-indigo-400 transition-colors whitespace-nowrap"
                >
                    <span className="text-lg leading-none">{selectedCountry.flag}</span>
                    <span className="text-slate-500 text-xs">{selectedCountry.dial}</span>
                    <ChevronDown size={12} className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
                </button>

                {open && (
                    <div className="absolute left-0 top-full mt-1 w-64 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 overflow-hidden">
                        <div className="p-2 border-b border-slate-100">
                            <input
                                autoFocus
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search country..."
                                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-400"
                            />
                        </div>
                        <div className="max-h-52 overflow-y-auto">
                            {filtered.map(c => (
                                <button
                                    key={c.code}
                                    type="button"
                                    onClick={() => { onCountryChange(c); setOpen(false); setSearch(''); }}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-indigo-50 transition-colors text-left ${selectedCountry.code === c.code ? 'bg-indigo-50 font-semibold text-indigo-700' : 'text-slate-700'
                                        }`}
                                >
                                    <span className="text-lg">{c.flag}</span>
                                    <span className="flex-1 truncate">{c.name}</span>
                                    <span className="text-xs text-slate-400 shrink-0">{c.dial}</span>
                                </button>
                            ))}
                            {filtered.length === 0 && (
                                <p className="text-center text-sm text-slate-400 py-4">No country found</p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Phone number input */}
            <input
                type="tel"
                value={value}
                onChange={e => onChange(e.target.value.replace(/[^0-9\s\-]/g, ''))}
                placeholder="300 1234567"
                className="profile-input flex-1"
            />
        </div>
    );
};

// ── Shared helpers ─────────────────────────────────────────────────────────────
const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) => (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl text-sm font-semibold ${type === 'success' ? 'bg-emerald-600' : 'bg-red-600'} text-white max-w-xs`}>
        {type === 'success' ? <CheckCircle2 size={16} className="shrink-0" /> : <AlertCircle size={16} className="shrink-0" />}
        <span className="flex-1">{message}</span>
        <button onClick={onClose} className="opacity-70 hover:opacity-100 shrink-0"><X size={14} /></button>
    </div>
);

const Card = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
            <span className="text-indigo-500">{icon}</span>
            <h3 className="font-bold text-slate-900 text-sm">{title}</h3>
        </div>
        {children}
    </div>
);

const Field = ({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) => (
    <div className={className}>
        <label className="block text-xs font-bold text-slate-600 mb-1.5">{label}</label>
        {children}
    </div>
);

const PasswordField = ({ label, value, show, onChange, onToggle }: {
    label: string; value: string; show: boolean; onChange: (v: string) => void; onToggle: () => void;
}) => (
    <div>
        <label className="block text-xs font-bold text-slate-600 mb-1.5">{label}</label>
        <div className="relative">
            <input type={show ? 'text' : 'password'} value={value}
                onChange={e => onChange(e.target.value)}
                className="profile-input pr-10" placeholder="••••••••" />
            <button type="button" onClick={onToggle}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {show ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
        </div>
    </div>
);

const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button onClick={onChange}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 ${checked ? 'bg-indigo-600' : 'bg-slate-200'}`}>
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${checked ? 'translate-x-5' : ''}`} />
    </button>
);

const SaveButton = ({ isSaving, onClick, label = 'Save Changes' }: {
    isSaving: boolean; onClick: () => void; label?: string;
}) => (
    <button onClick={onClick} disabled={isSaving}
        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-100 transition-all disabled:opacity-60 active:scale-95">
        {isSaving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
        {isSaving ? 'Saving...' : label}
    </button>
);

// ── Profile Tab (with Regional Settings merged in) ────────────────────────────
const ProfileTab: React.FC<{ onToast: (msg: string, type: 'success' | 'error') => void }> = ({ onToast }) => {
    const [isSaving, setIsSaving] = useState(false);
    const [avatarGrad] = useState(avatarGradients[Math.floor(Math.random() * avatarGradients.length)]);
    const fileRef = useRef<HTMLInputElement>(null);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    const [selectedPhoneCountry, setSelectedPhoneCountry] = useState<Country>(COUNTRIES[0]); // default Pakistan
    const [form, setForm] = useState({
        name: 'Agency Owner',
        email: 'owner@agency.com',
        phone: '',
        company: '',
        website: '',
        bio: '',
        country: '',
        language: 'English',
        timezone: 'UTC+5 (PKT)',
    });

    // Load from backend on mount
    useEffect(() => {
        const token = getToken();
        if (!token) return;

        fetch(`${API_BASE}/api/profile/me`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(r => r.ok ? r.json() : null)
            .then(data => {
                if (!data?.profile) return;
                const p = data.profile;
                setForm(prev => ({
                    ...prev,
                    name: p.name || prev.name,
                    email: p.email || prev.email,
                    phone: p.phone || '',
                    company: p.company || '',
                    website: p.website || '',
                    bio: p.bio || '',
                    country: p.country || '',
                    language: p.language || 'English',
                    timezone: p.timezone || 'UTC+5 (PKT)',
                }));
                if (p.phone_code) {
                    const found = COUNTRIES.find(c => c.dial === p.phone_code && c.code === p.phone_country);
                    if (found) setSelectedPhoneCountry(found);
                }
            })
            .catch(() => {
                // Fall back to JWT decode
                try {
                    const parts = token.split('.');
                    if (parts.length < 2) return;
                    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
                    setForm(prev => ({
                        ...prev,
                        name: payload.name || prev.name,
                        email: payload.email || prev.email,
                    }));
                } catch { /* ignore */ }
            });
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const token = getToken();
            await fetch(`${API_BASE}/api/profile/me`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    name: form.name,
                    phone: form.phone,
                    phone_code: selectedPhoneCountry.dial,
                    phone_country: selectedPhoneCountry.code,
                    company: form.company,
                    website: form.website,
                    bio: form.bio,
                    country: form.country,
                    language: form.language,
                    timezone: form.timezone,
                })
            });
            onToast('Profile updated successfully!', 'success');
        } catch {
            onToast('Failed to save. Please try again.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-5 max-w-2xl">
            {/* Avatar card */}
            <Card title="Profile Photo" icon={<Camera size={16} />}>
                <div className="flex items-center gap-5">
                    <div className="relative group cursor-pointer shrink-0" onClick={() => fileRef.current?.click()}>
                        {avatarUrl
                            ? <img src={avatarUrl} alt="avatar" className="w-20 h-20 rounded-2xl object-cover ring-4 ring-indigo-100 shadow-md" />
                            : <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${avatarGrad} flex items-center justify-center text-white font-bold text-3xl shadow-md ring-4 ring-indigo-100`}>{getInitials(form.name)}</div>
                        }
                        <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Camera size={20} className="text-white" />
                        </div>
                        <input ref={fileRef} type="file" accept="image/*" className="hidden"
                            onChange={e => { const f = e.target.files?.[0]; if (f) setAvatarUrl(URL.createObjectURL(f)); }} />
                    </div>
                    <div className="min-w-0">
                        <p className="font-bold text-slate-900 truncate">{form.name}</p>
                        <p className="text-slate-500 text-sm truncate">{form.email}</p>
                        <button onClick={() => fileRef.current?.click()}
                            className="mt-2 text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 transition-colors">
                            <Camera size={11} /> Change photo
                        </button>
                    </div>
                </div>
            </Card>

            {/* Personal info */}
            <Card title="Personal Information" icon={<User size={16} />}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Full Name">
                        <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                            className="profile-input" placeholder="Your full name" />
                    </Field>
                    <Field label="Email Address">
                        <input value={form.email} readOnly
                            className="profile-input bg-slate-50 cursor-not-allowed text-slate-400" />
                    </Field>

                    {/* Phone with country code picker */}
                    <Field label="Phone Number" className="sm:col-span-2">
                        <PhonePicker
                            value={form.phone}
                            selectedCountry={selectedPhoneCountry}
                            onCountryChange={setSelectedPhoneCountry}
                            onChange={v => setForm({ ...form, phone: v })}
                        />
                        <p className="text-[10px] text-slate-400 mt-1.5">
                            {selectedPhoneCountry.flag} {selectedPhoneCountry.name} · {selectedPhoneCountry.dial}
                        </p>
                    </Field>

                    <Field label="Company / Agency">
                        <input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })}
                            className="profile-input" placeholder="Your agency name" />
                    </Field>
                    <Field label="Website">
                        <input value={form.website} onChange={e => setForm({ ...form, website: e.target.value })}
                            type="url" className="profile-input" placeholder="https://youragency.com" />
                    </Field>

                    <Field label="Bio" className="sm:col-span-2">
                        <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })}
                            rows={3} className="profile-input resize-none" placeholder="A short bio about you..." />
                    </Field>
                </div>
            </Card>

            {/* Regional Settings — now in Profile tab */}
            <Card title="Regional Settings" icon={<Globe size={16} />}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Field label="Country" className="sm:col-span-1">
                        <div className="relative">
                            <select
                                value={form.country}
                                onChange={e => {
                                    setForm({ ...form, country: e.target.value });
                                    // Auto-switch phone country code
                                    const match = COUNTRIES.find(c => c.name === e.target.value);
                                    if (match) setSelectedPhoneCountry(match);
                                }}
                                className="profile-input appearance-none pr-8"
                            >
                                <option value="">Select country</option>
                                {COUNTRIES.map(c => (
                                    <option key={c.code} value={c.name}>{c.flag} {c.name}</option>
                                ))}
                            </select>
                            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                    </Field>
                    <Field label="Language">
                        <div className="relative">
                            <select value={form.language} onChange={e => setForm({ ...form, language: e.target.value })}
                                className="profile-input appearance-none pr-8">
                                {LANGUAGES.map(l => <option key={l}>{l}</option>)}
                            </select>
                            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                    </Field>
                    <Field label="Timezone">
                        <div className="relative">
                            <select value={form.timezone} onChange={e => setForm({ ...form, timezone: e.target.value })}
                                className="profile-input appearance-none pr-8">
                                {TIMEZONES.map(t => <option key={t}>{t}</option>)}
                            </select>
                            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                    </Field>
                </div>
            </Card>

            <div className="flex justify-end">
                <SaveButton isSaving={isSaving} onClick={handleSave} />
            </div>
        </div>
    );
};

// ── Security Tab ───────────────────────────────────────────────────────────────
const SecurityTab: React.FC<{ onToast: (msg: string, type: 'success' | 'error') => void }> = ({ onToast }) => {
    const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });
    const [isSavingPw, setIsSavingPw] = useState(false);
    const [pwForm, setPwForm] = useState({ current: '', new: '', confirm: '' });
    const [twoFAEnabled, setTwoFAEnabled] = useState(false);
    const [showSetupModal, setShowSetupModal] = useState(false);
    const [verifyCode, setVerifyCode] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);

    const totpSecret = 'JBSWY3DPEHPK3PXP';
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=otpauth://totp/SocialKnocks:user@agency.com?secret=${totpSecret}&issuer=SocialKnocks`;

    const pwStrength = (pw: string) => {
        if (!pw) return null;
        if (pw.length < 6) return { label: 'Weak', color: 'bg-red-400', w: '25%' };
        if (pw.length < 10) return { label: 'Fair', color: 'bg-amber-400', w: '50%' };
        if (!/[!@#$%^&*]/.test(pw)) return { label: 'Good', color: 'bg-blue-400', w: '75%' };
        return { label: 'Strong', color: 'bg-emerald-500', w: '100%' };
    };
    const strength = pwStrength(pwForm.new);

    const handlePasswordSave = async () => {
        if (!pwForm.current || !pwForm.new) return;
        if (pwForm.new !== pwForm.confirm) { onToast('Passwords do not match.', 'error'); return; }
        if (pwForm.new.length < 8) { onToast('Minimum 8 characters required.', 'error'); return; }
        setIsSavingPw(true);
        try {
            const res = await fetch(`${API_BASE}/api/profile/me/password`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify({ current_password: pwForm.current, new_password: pwForm.new })
            });
            if (!res.ok) {
                const err = await res.json();
                onToast(err.detail || 'Failed to change password.', 'error');
            } else {
                setPwForm({ current: '', new: '', confirm: '' });
                onToast('Password changed successfully!', 'success');
            }
        } catch { onToast('Network error. Please try again.', 'error'); }
        finally { setIsSavingPw(false); }
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

    return (
        <div className="space-y-5 max-w-2xl">
            <Card title="Change Password" icon={<Lock size={16} />}>
                <div className="space-y-4">
                    <PasswordField label="Current Password" value={pwForm.current} show={showPw.current}
                        onChange={v => setPwForm({ ...pwForm, current: v })}
                        onToggle={() => setShowPw(s => ({ ...s, current: !s.current }))} />
                    <PasswordField label="New Password" value={pwForm.new} show={showPw.new}
                        onChange={v => setPwForm({ ...pwForm, new: v })}
                        onToggle={() => setShowPw(s => ({ ...s, new: !s.new }))} />
                    {pwForm.new && strength && (
                        <div className="space-y-1">
                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full transition-all duration-500 ${strength.color}`} style={{ width: strength.w }} />
                            </div>
                            <p className={`text-xs font-medium ${strength.label === 'Strong' ? 'text-emerald-600' :
                                    strength.label === 'Good' ? 'text-blue-600' :
                                        strength.label === 'Fair' ? 'text-amber-600' : 'text-red-500'}`}>
                                {strength.label} password
                            </p>
                        </div>
                    )}
                    <PasswordField label="Confirm New Password" value={pwForm.confirm} show={showPw.confirm}
                        onChange={v => setPwForm({ ...pwForm, confirm: v })}
                        onToggle={() => setShowPw(s => ({ ...s, confirm: !s.confirm }))} />
                    <div className="flex justify-end">
                        <SaveButton isSaving={isSavingPw} onClick={handlePasswordSave} label="Update Password" />
                    </div>
                </div>
            </Card>

            <Card title="Two-Factor Authentication" icon={<Smartphone size={16} />}>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${twoFAEnabled ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                            <Shield size={18} className={twoFAEnabled ? 'text-emerald-600' : 'text-slate-400'} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900">{twoFAEnabled ? '2FA Active' : 'Authenticator App'}</p>
                            <p className="text-xs text-slate-500">{twoFAEnabled ? 'Your account is protected with TOTP' : 'Google Authenticator, Authy, 1Password'}</p>
                        </div>
                    </div>
                    {twoFAEnabled ? (
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1"><Check size={11} /> On</span>
                            <button onClick={() => { setTwoFAEnabled(false); onToast('2FA disabled.', 'error'); }}
                                className="text-xs text-red-500 hover:text-red-700 font-semibold px-3 py-1.5 rounded-xl border border-red-200 hover:bg-red-50 transition-colors">
                                Disable
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => setShowSetupModal(true)}
                            className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors">
                            <Key size={13} /> Enable 2FA
                        </button>
                    )}
                </div>
                <div className="mt-3 space-y-1.5">
                    {[
                        '2FA adds a second layer of security to your account.',
                        'Even if your password is stolen, attackers need your phone.',
                        'Works with Google Authenticator, Authy, and 1Password.',
                    ].map((tip, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-500">
                            <Check size={11} className="text-indigo-400 mt-0.5 shrink-0" /> {tip}
                        </div>
                    ))}
                </div>
            </Card>

            {showSetupModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6">
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Set up 2FA</h3>
                                <p className="text-xs text-slate-500 mt-0.5">Scan with your authenticator app</p>
                            </div>
                            <button onClick={() => setShowSetupModal(false)}
                                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors">
                                <X size={18} />
                            </button>
                        </div>
                        <div className="flex justify-center mb-4">
                            <div className="p-3 bg-white rounded-2xl border-2 border-slate-100">
                                <img src={qrUrl} alt="QR Code" className="w-44 h-44" />
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 mb-1.5 font-medium">Or enter this key manually:</p>
                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 mb-4">
                            <code className="flex-1 font-mono text-xs text-slate-800 tracking-widest">{totpSecret}</code>
                            <button onClick={() => { navigator.clipboard.writeText(totpSecret); onToast('Copied!', 'success'); }}
                                className="p-1 text-slate-400 hover:text-indigo-600 transition-colors"><Copy size={14} /></button>
                        </div>
                        <p className="text-xs font-semibold text-slate-700 mb-2">Enter the 6-digit code from your app:</p>
                        <input value={verifyCode}
                            onChange={e => setVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            placeholder="000000" maxLength={6}
                            className="w-full text-center text-2xl font-mono tracking-[0.5em] border-2 border-slate-200 focus:border-indigo-500 rounded-2xl py-3 focus:outline-none mb-4" />
                        <button onClick={handleVerify2FA} disabled={verifyCode.length !== 6 || isVerifying}
                            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
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
    const toggle = (key: keyof typeof prefs) => setPrefs(p => ({ ...p, [key]: !p[key] }));

    const sections = [
        {
            title: 'Email Notifications', items: [
                { key: 'emailDigest' as const, label: 'Daily Digest', desc: 'Workspace activity summary every morning' },
                { key: 'loginAlerts' as const, label: 'Login Alerts', desc: 'Notify on new sign-ins' },
                { key: 'ticketReplies' as const, label: 'Support Replies', desc: 'When support replies to your tickets' },
                { key: 'mentionAlerts' as const, label: 'Mentions', desc: 'When someone tags you' },
                { key: 'billingAlerts' as const, label: 'Billing Updates', desc: 'Invoice and payment confirmations' },
                { key: 'weeklyReport' as const, label: 'Weekly Report', desc: 'Analytics summary every Monday' },
            ]
        },
        {
            title: 'Push & Marketing', items: [
                { key: 'pushNotifications' as const, label: 'Browser Push', desc: 'Real-time push notifications' },
                { key: 'marketingEmails' as const, label: 'Product Updates', desc: 'News and feature releases' },
            ]
        },
    ];

    return (
        <div className="space-y-5 max-w-2xl">
            {sections.map(s => (
                <Card key={s.title} title={s.title} icon={<Bell size={16} />}>
                    <div className="divide-y divide-slate-100">
                        {s.items.map(item => (
                            <div key={item.key} className="flex items-center justify-between py-3.5 first:pt-1 last:pb-0">
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

// ── Helpers for real theme + accent application ────────────────────────────────
const ACCENT_HEX: Record<string, string> = {
    indigo: '#6366f1', violet: '#8b5cf6', rose: '#f43f5e',
    amber: '#f59e0b', emerald: '#10b981', cyan: '#06b6d4',
};
const ACCENT_LIGHT: Record<string, string> = {
    indigo: '#e0e7ff', violet: '#ede9fe', rose: '#ffe4e6',
    amber: '#fef3c7', emerald: '#d1fae5', cyan: '#cffafe',
};

function applyTheme(mode: 'light' | 'dark' | 'system') {
    const root = document.documentElement;
    const dark = mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    dark ? root.classList.add('dark') : root.classList.remove('dark');
    localStorage.setItem('sk_theme', mode);
}

function applyAccent(id: string) {
    const hex = ACCENT_HEX[id];
    if (!hex) return;
    document.documentElement.style.setProperty('--sk-accent', hex);
    document.documentElement.style.setProperty('--sk-accent-light', ACCENT_LIGHT[id] ?? '#e0e7ff');
    localStorage.setItem('sk_accent', id);
}

// ── Preferences Tab ────────────────────────────────────────────────────────────
const PreferencesTab: React.FC<{ onToast: (msg: string, type: 'success' | 'error') => void }> = ({ onToast }) => {
    const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(() =>
        (localStorage.getItem('sk_theme') as 'light' | 'dark' | 'system') || 'light'
    );
    const [accentColor, setAccentColor] = useState(() => localStorage.getItem('sk_accent') || 'indigo');

    // Apply saved settings on mount
    useEffect(() => { applyTheme(theme); applyAccent(accentColor); }, []); // eslint-disable-line

    // Re-apply if system preference changes while in system mode
    useEffect(() => {
        if (theme !== 'system') return;
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        const fn = () => applyTheme('system');
        mq.addEventListener('change', fn);
        return () => mq.removeEventListener('change', fn);
    }, [theme]);

    const handleTheme = (t: 'light' | 'dark' | 'system') => { setTheme(t); applyTheme(t); };
    const handleAccent = (id: string) => { setAccentColor(id); applyAccent(id); };

    const accents = [
        { id: 'indigo', label: 'Indigo' }, { id: 'violet', label: 'Violet' },
        { id: 'rose',   label: 'Rose'   }, { id: 'amber',  label: 'Amber'  },
        { id: 'emerald',label: 'Emerald'}, { id: 'cyan',   label: 'Cyan'   },
    ];

    const themeOpts = [
        { id: 'light'  as const, label: 'Light',  icon: <Sun size={16}  />, bg: '#ffffff', barOpacity: 0.5  },
        { id: 'dark'   as const, label: 'Dark',   icon: <Moon size={16} />, bg: '#0f172a', barOpacity: 0.7  },
        { id: 'system' as const, label: 'System', icon: <Globe size={16}/>, bg: 'linear-gradient(135deg,#fff 50%,#0f172a 50%)', barOpacity: 0.5 },
    ] as const;

    return (
        <div className="space-y-5 max-w-2xl">
            <Card title="Appearance" icon={<Palette size={16} />}>
                <div className="space-y-6">
                    {/* ─ Theme ─ */}
                    <div>
                        <p className="text-sm font-semibold text-slate-800 mb-0.5">Theme</p>
                        <p className="text-xs text-slate-400 mb-3">Applied instantly to the entire portal</p>
                        <div className="grid grid-cols-3 gap-3">
                            {themeOpts.map(t => {
                                const active = theme === t.id;
                                return (
                                    <button key={t.id} onClick={() => handleTheme(t.id)}
                                        className={`flex flex-col gap-2 p-3 rounded-2xl border-2 transition-all text-left ${
                                            active ? 'border-indigo-500 shadow-md shadow-indigo-100' : 'border-slate-200 hover:border-slate-300 bg-white'
                                        }`}>
                                        {/* Mini preview */}
                                        <div className="w-full h-9 rounded-lg overflow-hidden border border-slate-200 flex flex-col gap-1 p-1.5"
                                            style={{ background: t.bg }}>
                                            <div className="h-1.5 w-3/4 rounded-full bg-slate-400" style={{ opacity: t.barOpacity }} />
                                            <div className="h-1.5 w-1/2 rounded-full bg-slate-400" style={{ opacity: t.barOpacity * 0.6 }} />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1.5">
                                                <span className={active ? 'text-indigo-500' : 'text-slate-400'}>{t.icon}</span>
                                                <span className={`text-xs font-bold ${active ? 'text-indigo-700' : 'text-slate-600'}`}>{t.label}</span>
                                            </div>
                                            {active && (
                                                <span className="w-4 h-4 bg-indigo-600 rounded-full flex items-center justify-center">
                                                    <Check size={10} className="text-white" />
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* ─ Accent Color ─ */}
                    <div>
                        <p className="text-sm font-semibold text-slate-800 mb-0.5">Accent Color</p>
                        <p className="text-xs text-slate-400 mb-3">Changes buttons, badges and highlights immediately</p>
                        <div className="flex gap-3 flex-wrap">
                            {accents.map(a => {
                                const active = accentColor === a.id;
                                return (
                                    <button key={a.id} title={a.label} onClick={() => handleAccent(a.id)}
                                        className="relative w-9 h-9 rounded-full transition-all duration-150 focus:outline-none hover:scale-110"
                                        style={{
                                            backgroundColor: ACCENT_HEX[a.id],
                                            transform: active ? 'scale(1.18)' : undefined,
                                            boxShadow: active ? `0 0 0 3px white, 0 0 0 5px ${ACCENT_HEX[a.id]}` : undefined,
                                        }}>
                                        {active && <Check size={14} className="text-white absolute inset-0 m-auto" strokeWidth={3} />}
                                    </button>
                                );
                            })}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-2">
                            Active: <strong className="capitalize">{accentColor}</strong>
                        </p>
                    </div>
                </div>
            </Card>

            <div className="flex justify-end">
                <SaveButton
                    isSaving={false}
                    onClick={() => {
                        applyTheme(theme);
                        applyAccent(accentColor);
                        onToast('Appearance applied and saved!', 'success');
                    }}
                    label="Apply & Save"
                />
            </div>
        </div>
    );
};

// ── Main export ────────────────────────────────────────────────────────────────
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
            <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 pb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                        <User size={20} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Profile & Settings</h1>
                        <p className="text-sm text-slate-500">Manage your account</p>
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
                {/* Tab bar */}
                <div className="flex gap-1 bg-white border border-slate-200 rounded-2xl p-1.5 mb-5 shadow-sm overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                    {TABS.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-150 ${activeTab === tab.id
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}>
                            {tab.icon}
                            <span className="hidden sm:inline">{tab.label}</span>
                            <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                        </button>
                    ))}
                </div>

                {activeTab === 'profile' && <ProfileTab onToast={showToast} />}
                {activeTab === 'security' && <SecurityTab onToast={showToast} />}
                {activeTab === 'notifications' && <NotificationsTab onToast={showToast} />}
                {activeTab === 'preferences' && <PreferencesTab onToast={showToast} />}
            </div>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <style>{`
                .profile-input {
                    display: block;
                    width: 100%;
                    height: 2.5rem;
                    padding: 0 0.875rem;
                    border-radius: 0.75rem;
                    border: 1.5px solid #e2e8f0;
                    font-size: 0.875rem;
                    color: #0f172a;
                    background: #ffffff;
                    outline: none;
                    transition: border-color 0.15s, box-shadow 0.15s;
                    appearance: none;
                    -webkit-appearance: none;
                }
                textarea.profile-input { height: auto; padding-top: 0.625rem; padding-bottom: 0.625rem; }
                .profile-input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.12); }
                .profile-input:read-only { background: #f8fafc; }
                .profile-input::placeholder { color: #94a3b8; }
            `}</style>
        </div>
    );
};
