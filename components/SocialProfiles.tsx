import React, { useState, useEffect } from 'react';
import { Plus, MoreVertical, RefreshCw, Trash2, Share2, AlertCircle, CheckCircle, X, Loader2, Instagram, Facebook, Linkedin, Twitter, Youtube, Video } from 'lucide-react';
import { UserRole } from '../types';

const API_BASE = 'http://localhost:8000';

const getToken = () =>
    localStorage.getItem('sk_agency_token') ||
    localStorage.getItem('socialknoks_token') || '';

interface SocialProfile {
    id: string;
    platform: string;
    page_name: string;
    picture?: string;
    connected_at?: string;
    status: 'Connected' | 'Disconnected' | 'Token Expired';
}

const MAX_PROFILES = 10;

export const SocialProfiles: React.FC = () => {
    const [profiles, setProfiles] = useState<SocialProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
    const [isConnecting, setIsConnecting] = useState<string | null>(null);
    const [workspaceId, setWorkspaceId] = useState<string | null>(null);

    const usedSlots = profiles.length;
    const availableSlots = MAX_PROFILES - usedSlots;

    const fetchData = async () => {
        const token = getToken();
        if (!token) { setIsLoading(false); return; }

        try {
            // 1. Get current workspace
            const wsRes = await fetch(`${API_BASE}/api/workspaces/my`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const wsData = await wsRes.json();
            const ws = wsData?.workspaces?.[0];
            if (!ws?.id) { setIsLoading(false); return; }
            const wsId = ws.id;
            setWorkspaceId(wsId);

            // 2. Fetch connections
            const connRes = await fetch(`${API_BASE}/auth/social/connections/${wsId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (connRes.ok) {
                const connData = await connRes.json();
                const formatted = (connData.connections || []).map((c: any) => ({
                    ...c,
                    status: 'Connected'
                }));
                setProfiles(formatted);
            }
        } catch (err) {
            console.error('Failed to fetch social profiles:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Listen for postMessage from SocialCallback popup
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.origin !== window.location.origin) return;
            const data = event.data;
            if (data?.type === 'social_connect' && data?.success === 'true') {
                setIsConnectModalOpen(false);
                fetchData(); // Refresh list
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    const getPlatformColor = (platform: string) => {
        switch (platform.toLowerCase()) {
            case 'instagram': return 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 text-white';
            case 'linkedin': return 'bg-[#0077b5] text-white';
            case 'twitter': case 'x': return 'bg-black text-white';
            case 'facebook': return 'bg-[#1877f2] text-white';
            case 'tiktok': return 'bg-black text-white border border-slate-800';
            case 'youtube': return 'bg-red-600 text-white';
            default: return 'bg-slate-200 text-slate-600';
        }
    };

    const handleConnect = (platform: string) => {
        if (platform !== 'facebook' && platform !== 'instagram') return; // Others coming soon

        const origin = encodeURIComponent(window.location.origin);
        const wsId = encodeURIComponent(workspaceId || '');
        const url = `${API_BASE}/auth/social/${platform}/login?workspace_id=${wsId}&origin=${origin}`;

        const popup = window.open(url, `connect_${platform}`, 'width=580,height=680,scrollbars=yes,resizable=yes');
        if (popup) {
            setIsConnecting(platform);
            const timer = setInterval(() => {
                if (popup.closed) {
                    clearInterval(timer);
                    setIsConnecting(null);
                }
            }, 600);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to disconnect this account?')) return;

        const token = getToken();
        try {
            const res = await fetch(`${API_BASE}/auth/social/connections/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                setProfiles(profiles.filter(p => p.id !== id));
            } else {
                alert('Failed to disconnect account.');
            }
        } catch (err) {
            alert('Error disconnecting account.');
        }
    };

    const PLATFORM_OPTIONS = [
        { id: 'facebook', label: 'Facebook Page', icon: Facebook, color: 'text-blue-600 bg-blue-50', active: true },
        { id: 'instagram', label: 'Instagram Business', icon: Instagram, color: 'text-pink-600 bg-pink-50', active: true },
        { id: 'linkedin', label: 'LinkedIn Page', icon: Linkedin, color: 'text-blue-700 bg-blue-50', active: false },
        { id: 'twitter', label: 'X (Twitter)', icon: Twitter, color: 'text-slate-900 bg-slate-100', active: false },
        { id: 'youtube', label: 'YouTube Channel', icon: Youtube, color: 'text-red-600 bg-red-50', active: false },
        { id: 'tiktok', label: 'TikTok Account', icon: Video, color: 'text-slate-900 bg-teal-50', active: false },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500 relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Social Profiles</h1>
                    <p className="text-slate-500">Connect and manage your social media accounts.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex flex-col items-end mr-2">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Plan Usage</span>
                        <div className="flex items-center gap-2">
                            <span className={`text-sm font-bold ${availableSlots === 0 ? 'text-red-500' : 'text-slate-700'}`}>
                                {usedSlots} / {MAX_PROFILES} Connected
                            </span>
                            <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${availableSlots === 0 ? 'bg-red-500' : 'bg-indigo-600'}`}
                                    style={{ width: `${(usedSlots / MAX_PROFILES) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsConnectModalOpen(true)}
                        disabled={usedSlots >= MAX_PROFILES || isLoading}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Plus size={18} /> Connect Profile
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                    <Loader2 size={40} className="text-indigo-600 animate-spin mb-4" />
                    <p className="text-slate-500 font-medium">Loading your social profiles...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {profiles.map((profile) => (
                        <div key={profile.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group relative">
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                                    <MoreVertical size={20} />
                                </button>
                            </div>

                            <div className="flex items-center gap-4 mb-6">
                                {profile.picture ? (
                                    <img src={profile.picture} alt={profile.page_name} className="w-14 h-14 rounded-2xl shadow-md object-cover" />
                                ) : (
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold shadow-md ${getPlatformColor(profile.platform)}`}>
                                        {profile.platform[0].toUpperCase()}
                                    </div>
                                )}
                                <div className="min-w-0">
                                    <h3 className="text-lg font-bold text-slate-900 truncate">{profile.page_name}</h3>
                                    <p className="text-sm text-slate-500 capitalize">{profile.platform}</p>
                                </div>
                            </div>

                            <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</span>
                                    <div className="flex items-center gap-1.5">
                                        <CheckCircle size={14} className="text-green-500" />
                                        <span className="text-xs font-bold text-green-600">Connected</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Linked At</span>
                                    <span className="text-xs font-bold text-slate-700">
                                        {profile.connected_at ? new Date(profile.connected_at).toLocaleDateString() : 'N/A'}
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 rounded-lg text-sm font-medium transition-colors">
                                    <RefreshCw size={16} /> Sync
                                </button>
                                <button
                                    onClick={() => handleDelete(profile.id)}
                                    className="py-2 px-4 bg-white border border-slate-200 hover:border-red-300 hover:text-red-600 rounded-lg text-sm font-medium transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Connect New Card */}
                    {availableSlots > 0 && (
                        <button
                            onClick={() => setIsConnectModalOpen(true)}
                            className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-400 hover:bg-slate-50 hover:text-indigo-600 transition-all min-h-[200px] group"
                        >
                            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-100 transition-colors">
                                <Share2 size={24} />
                            </div>
                            <h3 className="font-bold text-lg text-slate-600 group-hover:text-indigo-700">Connect New Account</h3>
                        </button>
                    )}
                </div>
            )}

            {/* Connect Modal */}
            {isConnectModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">Connect Social Tool</h2>
                                <p className="text-sm text-slate-500 mt-1">Select a platform to start managing your brand.</p>
                            </div>
                            <button
                                onClick={() => setIsConnectModalOpen(false)}
                                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-8 overflow-y-auto">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                {PLATFORM_OPTIONS.map((option) => (
                                    <div key={option.id} className="relative group">
                                        <button
                                            onClick={() => option.active && handleConnect(option.id)}
                                            disabled={!!isConnecting || !option.active}
                                            className={`w-full flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all relative ${option.active
                                                    ? 'border-slate-100 hover:border-indigo-400 hover:bg-indigo-50/30'
                                                    : 'border-slate-50 bg-slate-50/50 cursor-not-allowed grayscale opacity-60'
                                                }`}
                                        >
                                            {isConnecting === option.id ? (
                                                <Loader2 size={32} className="text-indigo-600 animate-spin mb-4" />
                                            ) : (
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${option.active ? option.color : 'bg-slate-200 text-slate-400'} shadow-sm transition-transform group-hover:scale-110`}>
                                                    <option.icon size={28} />
                                                </div>
                                            )}
                                            <span className={`font-bold text-sm ${option.active ? 'text-slate-700' : 'text-slate-400'}`}>
                                                {option.label}
                                            </span>

                                            {!option.active && (
                                                <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-slate-200 text-slate-500 text-[10px] font-bold rounded uppercase">
                                                    Soon
                                                </span>
                                            )}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
                            <p className="text-xs text-slate-500 flex items-center justify-center gap-1">
                                <AlertCircle size={14} className="text-indigo-500" />
                                Can't see your page? Make sure you have Admin access on Facebook.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
