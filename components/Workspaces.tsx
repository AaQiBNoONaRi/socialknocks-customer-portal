
import React, { useState } from 'react';
import { Plus, Check, MoreVertical, Users, Settings, Building2, ArrowRight, Share2, ShoppingBag, IdCard, Sparkles, BarChart3, Rocket, PenTool, X, Loader2, DollarSign, AlertCircle } from 'lucide-react';
import { Workspace } from '../types';

interface WorkspacesProps {
    workspaces: Workspace[];
    currentWorkspaceId: string;
    onSwitchWorkspace: (workspace: Workspace) => void;
    onNavigate: (path: string) => void;
}

// Extended interface for display purposes
interface WorkspaceDetails extends Workspace {
    stats: {
        members: number;
        socials: number;
        stores: number;
        svcs: number;
    };
    activeModules: ('ai' | 'analytics' | 'campaigns' | 'design')[];
}

export const Workspaces: React.FC<WorkspacesProps> = ({ workspaces, currentWorkspaceId, onSwitchWorkspace, onNavigate }) => {
    // Enriching the simple props with mock stats for the UI
    const generateMockDetails = (ws: Workspace): WorkspaceDetails => ({
        ...ws,
        stats: {
            members: Math.floor(Math.random() * 10) + 1,
            socials: Math.floor(Math.random() * 5),
            stores: ws.plan === 'Pro Plan' ? 1 : 0,
            svcs: Math.floor(Math.random() * 3),
        },
        activeModules: ws.plan === 'Pro Plan' ? ['ai', 'analytics', 'campaigns'] : ['analytics']
    });

    const localWorkspaces = workspaces.map(generateMockDetails);

    const getModuleIcon = (mod: string) => {
        switch (mod) {
            case 'ai': return <Sparkles size={14} className="text-purple-500" />;
            case 'analytics': return <BarChart3 size={14} className="text-blue-500" />;
            case 'campaigns': return <Rocket size={14} className="text-orange-500" />;
            case 'design': return <PenTool size={14} className="text-pink-500" />;
            default: return null;
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded uppercase tracking-wider">Overview</span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">My Workspaces</h1>
                    <p className="text-slate-500">Manage and switch between your organization environments.</p>
                </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {localWorkspaces.map((workspace) => {
                    const isActive = workspace.id === currentWorkspaceId;
                    return (
                        <div
                            key={workspace.id}
                            className={`relative bg-white rounded-2xl border transition-all group flex flex-col ${isActive
                                ? 'border-indigo-600 ring-1 ring-indigo-600 shadow-lg shadow-indigo-100'
                                : 'border-slate-200 hover:border-indigo-300 hover:shadow-md'
                                }`}
                        >
                            <div className="p-6 flex-1">
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold ${workspace.color} shadow-sm border border-black/5`}>
                                        {workspace.initials}
                                    </div>
                                    <div className="flex gap-2">
                                        {isActive && (
                                            <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full flex items-center gap-1">
                                                <Check size={12} /> Active
                                            </span>
                                        )}
                                        <button
                                            onClick={() => onNavigate('/settings')}
                                            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50 transition-colors"
                                            title="Settings"
                                        >
                                            <Settings size={20} />
                                        </button>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h3 className="text-lg font-bold text-slate-900 mb-1">{workspace.name}</h3>
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <Building2 size={14} />
                                        <span>{workspace.plan}</span>
                                    </div>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-4 gap-2 mb-6">
                                    <div className="bg-slate-50 p-2 rounded-lg text-center border border-slate-100">
                                        <div className="flex justify-center text-slate-400 mb-1"><Users size={14} /></div>
                                        <span className="block text-sm font-bold text-slate-700">{workspace.stats.members}</span>
                                    </div>
                                    <div className="bg-slate-50 p-2 rounded-lg text-center border border-slate-100">
                                        <div className="flex justify-center text-slate-400 mb-1"><Share2 size={14} /></div>
                                        <span className="block text-sm font-bold text-slate-700">{workspace.stats.socials}</span>
                                    </div>
                                    <div className="bg-slate-50 p-2 rounded-lg text-center border border-slate-100">
                                        <div className="flex justify-center text-slate-400 mb-1"><IdCard size={14} /></div>
                                        <span className="block text-sm font-bold text-slate-700">{workspace.stats.svcs}</span>
                                    </div>
                                    <div className="bg-slate-50 p-2 rounded-lg text-center border border-slate-100">
                                        <div className="flex justify-center text-slate-400 mb-1"><ShoppingBag size={14} /></div>
                                        <span className="block text-sm font-bold text-slate-700">{workspace.stats.stores}</span>
                                    </div>
                                </div>

                                {/* Active Modules */}
                                {workspace.activeModules.length > 0 ? (
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Subscribed:</span>
                                        <div className="flex gap-1">
                                            {workspace.activeModules.map(mod => (
                                                <div key={mod} className="p-1.5 bg-slate-100 rounded-md" title={mod}>
                                                    {getModuleIcon(mod)}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-xs text-slate-400 italic">No premium modules active.</p>
                                )}
                            </div>

                            {!isActive && (
                                <div className="p-4 border-t border-slate-50 bg-slate-50/50 rounded-b-2xl">
                                    <button
                                        onClick={() => onSwitchWorkspace(workspace)}
                                        className="w-full py-2 px-4 bg-indigo-600 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-colors"
                                    >
                                        Switch to this <ArrowRight size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div >
    );
};
