import React, { useState } from 'react';
import { Plus, MoreVertical, RefreshCw, Trash2, Share2, AlertCircle, CheckCircle, X, Loader2, Instagram, Facebook, Linkedin, Twitter, Youtube, Video } from 'lucide-react';
import { SocialProfile } from '../types';

const MOCK_PROFILES: SocialProfile[] = [
    { id: '1', platform: 'Instagram', username: '@nexus_agency', avatar: 'https://picsum.photos/50?10', followers: 12450, status: 'Connected', lastSync: 'Just now' },
    { id: '2', platform: 'LinkedIn', username: 'Nexus Agency', avatar: 'https://picsum.photos/50?11', followers: 5890, status: 'Connected', lastSync: '2 hours ago' },
    { id: '3', platform: 'Twitter', username: '@nexus_updates', avatar: 'https://picsum.photos/50?12', followers: 8900, status: 'Token Expired', lastSync: '2 days ago' },
];

const MAX_PROFILES = 5; // Simulating Pro Plan limit

export const SocialProfiles: React.FC = () => {
    const [profiles, setProfiles] = useState<SocialProfile[]>(MOCK_PROFILES);
    const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
    const [isConnecting, setIsConnecting] = useState<string | null>(null);

    const usedSlots = profiles.length;
    const availableSlots = MAX_PROFILES - usedSlots;

    const getPlatformColor = (platform: string) => {
        switch (platform) {
            case 'Instagram': return 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 text-white';
            case 'LinkedIn': return 'bg-[#0077b5] text-white';
            case 'Twitter': return 'bg-black text-white';
            case 'Facebook': return 'bg-[#1877f2] text-white';
            case 'TikTok': return 'bg-black text-white border border-slate-800';
            case 'YouTube': return 'bg-red-600 text-white';
            default: return 'bg-slate-200 text-slate-600';
        }
    };

    const handleConnect = async (platform: string) => {
        if (usedSlots >= MAX_PROFILES) return;
        
        setIsConnecting(platform);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const newProfile: SocialProfile = {
            id: Date.now().toString(),
            platform: platform as any,
            username: `@new_${platform.toLowerCase()}`,
            avatar: `https://picsum.photos/50?random=${Date.now()}`,
            followers: 0,
            status: 'Connected',
            lastSync: 'Just now'
        };
        
        setProfiles([...profiles, newProfile]);
        setIsConnecting(null);
        setIsConnectModalOpen(false);
    };

    const handleDelete = (id: string) => {
        setProfiles(profiles.filter(p => p.id !== id));
    };

    const PLATFORM_OPTIONS = [
        { id: 'Instagram', icon: Instagram, color: 'text-pink-600 bg-pink-50' },
        { id: 'Facebook', icon: Facebook, color: 'text-blue-600 bg-blue-50' },
        { id: 'Twitter', icon: Twitter, color: 'text-slate-900 bg-slate-100' },
        { id: 'LinkedIn', icon: Linkedin, color: 'text-blue-700 bg-blue-50' },
        { id: 'YouTube', icon: Youtube, color: 'text-red-600 bg-red-50' },
        { id: 'TikTok', icon: Video, color: 'text-slate-900 bg-teal-50' },
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
                        disabled={usedSlots >= MAX_PROFILES}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Plus size={18} /> Connect Profile
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profiles.map((profile) => (
                    <div key={profile.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group relative">
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                                <MoreVertical size={20} />
                            </button>
                        </div>
                        
                        <div className="flex items-center gap-4 mb-6">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold shadow-md ${getPlatformColor(profile.platform)}`}>
                                {profile.platform[0]}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">{profile.username}</h3>
                                <p className="text-sm text-slate-500">{profile.platform}</p>
                            </div>
                        </div>

                        <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Followers</span>
                                <span className="font-bold text-slate-900">{profile.followers.toLocaleString()}</span>
                            </div>
                             <div className="flex justify-between items-center">
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</span>
                                <div className="flex items-center gap-1.5">
                                    {profile.status === 'Connected' ? (
                                        <CheckCircle size={14} className="text-green-500" />
                                    ) : (
                                        <AlertCircle size={14} className="text-amber-500" />
                                    )}
                                    <span className={`text-xs font-bold ${profile.status === 'Connected' ? 'text-green-600' : 'text-amber-600'}`}>
                                        {profile.status}
                                    </span>
                                </div>
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
                        
                        <div className="mt-4 text-center">
                             <p className="text-xs text-slate-400">Last synced: {profile.lastSync}</p>
                        </div>
                    </div>
                ))}

                {/* Connect New Card */}
                <button 
                    onClick={() => setIsConnectModalOpen(true)}
                    disabled={usedSlots >= MAX_PROFILES}
                    className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-400 hover:bg-slate-50 hover:text-indigo-600 transition-all min-h-[280px] group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-slate-200 disabled:hover:text-slate-400"
                >
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-100 transition-colors">
                        <Share2 size={24} />
                    </div>
                    <h3 className="font-bold text-lg text-slate-600 group-hover:text-indigo-700">Connect New Account</h3>
                    <p className="text-sm text-slate-500 mt-2 text-center max-w-[200px]">
                        {usedSlots >= MAX_PROFILES ? 'Plan limit reached' : 'Link Facebook, Instagram, LinkedIn, X, or TikTok.'}
                    </p>
                </button>
            </div>

            {/* Connect Modal */}
            {isConnectModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Connect Profile</h2>
                                <p className="text-sm text-slate-500">Choose a platform to connect to Nexus.</p>
                            </div>
                            <button 
                                onClick={() => setIsConnectModalOpen(false)}
                                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            {usedSlots >= MAX_PROFILES ? (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <AlertCircle size={32} />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">Limit Reached</h3>
                                    <p className="text-slate-500 mb-6">You have reached the maximum number of connected profiles for your current plan.</p>
                                    <button 
                                        onClick={() => setIsConnectModalOpen(false)}
                                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-colors"
                                    >
                                        Upgrade Plan
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    {PLATFORM_OPTIONS.map((option) => (
                                        <button
                                            key={option.id}
                                            onClick={() => handleConnect(option.id)}
                                            disabled={!!isConnecting}
                                            className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-slate-100 hover:border-indigo-100 hover:bg-slate-50 transition-all group disabled:opacity-50"
                                        >
                                            {isConnecting === option.id ? (
                                                <Loader2 size={32} className="text-indigo-600 animate-spin mb-3" />
                                            ) : (
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${option.color} transition-transform group-hover:scale-110`}>
                                                    <option.icon size={24} />
                                                </div>
                                            )}
                                            <span className="font-bold text-slate-700 group-hover:text-indigo-700">
                                                {isConnecting === option.id ? 'Connecting...' : option.id}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                            <p className="text-xs text-slate-500">
                                By connecting a profile, you agree to our <a href="#" className="text-indigo-600 hover:underline">Terms of Service</a>.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
