import React, { useState, useEffect } from 'react';
import { UserRole } from '../types';
import { Mail, Shield, Trash2, Plus, X, Loader2, CheckCircle, Clock } from 'lucide-react';

const API_BASE = 'http://localhost:8000';

const getToken = () =>
    localStorage.getItem('sk_agency_token') ||
    localStorage.getItem('socialknoks_token') || '';

interface Member {
    id?: string;
    name?: string;
    email: string;
    role: string;
    status: 'active' | 'pending' | 'invited';
    avatar?: string;
    invited_at?: string;
}

interface Connection {
    platform: string;
    page_name: string;
    picture?: string;
    username?: string;
}

export const Team: React.FC = () => {
    const [members, setMembers] = useState<Member[]>([]);
    const [connections, setConnections] = useState<Connection[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [workspaceId, setWorkspaceId] = useState<string | null>(null);
    const [resendingEmail, setResendingEmail] = useState<string | null>(null);

    // Form state
    const [newEmail, setNewEmail] = useState('');
    const [newRole, setNewRole] = useState<string>(UserRole.MEMBER);
    const [isInviting, setIsInviting] = useState(false);
    const [inviteSent, setInviteSent] = useState(false);
    const [inviteError, setInviteError] = useState('');

    // Fetch workspace ID + members + connections on mount
    useEffect(() => {
        const token = getToken();
        if (!token) { setIsLoading(false); return; }

        const fetchData = async () => {
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

                // 2. Fetch members and connections in parallel
                const [memRes, connRes] = await Promise.all([
                    fetch(`${API_BASE}/api/team/members?workspace_id=${wsId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    fetch(`${API_BASE}/api/auth/social/connections/${wsId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);

                if (memRes.ok) {
                    const memData = await memRes.json();
                    setMembers(memData.members || []);
                }
                if (connRes.ok) {
                    const connData = await connRes.json();
                    setConnections(connData.connections || []);
                }
            } catch (err) {
                console.error('Failed to fetch team data:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleInvite = async () => {
        if (!newEmail) return;
        setIsInviting(true);
        setInviteError('');

        const token = getToken();
        try {
            const res = await fetch(`${API_BASE}/api/team/invite`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    email: newEmail,
                    role: newRole,
                    workspace_id: workspaceId,
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data?.detail || 'Failed to send invite.');
            }

            // Add pending member to local state
            setMembers(prev => [...prev, { email: newEmail, role: newRole, status: 'pending', invited_at: new Date().toISOString() }]);
            setIsInviting(false);
            setInviteSent(true);

            setTimeout(() => {
                setInviteSent(false);
                setIsInviteModalOpen(false);
                setNewEmail('');
                setNewRole(UserRole.MEMBER);
            }, 2000);

        } catch (err: any) {
            setInviteError(err?.message || 'Failed to send invite.');
            setIsInviting(false);
        }
    };

    const handleResend = async (email: string) => {
        setResendingEmail(email);
        const token = getToken();
        try {
            const res = await fetch(`${API_BASE}/api/team/resend`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    email: email,
                    workspace_id: workspaceId,
                    role: 'member' // Backend expects role but uses original
                }),
            });

            if (res.ok) {
                alert(`Invitation resent to ${email}`);
            } else {
                const data = await res.json();
                alert(data?.detail || 'Failed to resend invite.');
            }
        } catch (err) {
            alert('Error resending invitation.');
        } finally {
            setResendingEmail(null);
        }
    };

    const handleRemove = async (email: string) => {
        if (!window.confirm(`Are you sure you want to remove ${email}?`)) return;

        const token = getToken();
        try {
            const res = await fetch(`${API_BASE}/api/team/member/${email}?workspace_id=${workspaceId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                setMembers(prev => prev.filter(m => m.email !== email));
                alert('Member removed successfully.');
            } else {
                const data = await res.json();
                alert(data?.detail || 'Failed to remove member.');
            }
        } catch (err) {
            alert('Error removing member.');
        }
    };

    const roleColors: Record<string, string> = {
        [UserRole.OWNER]: 'bg-violet-100 text-violet-700',
        [UserRole.ADMIN]: 'bg-red-100 text-red-700',
        [UserRole.MEMBER]: 'bg-blue-100 text-blue-700',
        [UserRole.DESIGNER]: 'bg-amber-100 text-amber-700',
        [UserRole.CLIENT]: 'bg-green-100 text-green-700',
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 relative">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Team Management</h1>
                    <p className="text-slate-500">Manage workspace members and their roles.</p>
                </div>
                <button
                    onClick={() => setIsInviteModalOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all"
                >
                    <Plus size={18} /> Invite Member
                </button>
            </div>

            {/* Summary Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-sm font-medium text-slate-500">Total Members</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{members.filter(m => m.status === 'active').length}</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-sm font-medium text-slate-500">Pending Invites</p>
                    <p className="text-2xl font-bold text-amber-600 mt-1">{members.filter(m => m.status !== 'active').length}</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-sm font-medium text-slate-500">Social Connections</p>
                    <p className="text-2xl font-bold text-indigo-600 mt-1">{connections.length}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-16">
                                <Loader2 className="animate-spin text-indigo-500" size={28} />
                            </div>
                        ) : (
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                                    <tr>
                                        <th className="px-6 py-4">Member</th>
                                        <th className="px-6 py-4">Role</th>
                                        <th className="px-6 py-4">Status / Invited At</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {members.map((member, idx) => (
                                        <tr key={member.id || idx} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {member.avatar ? (
                                                        <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full object-cover" />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                                                            {(member.name || member.email)[0].toUpperCase()}
                                                        </div>
                                                    )}
                                                    <div>
                                                        {member.name && <p className="font-medium text-slate-900 capitalize">{member.name}</p>}
                                                        <p className="text-sm text-slate-500 flex items-center gap-1">
                                                            <Mail size={12} /> {member.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${roleColors[member.role] || 'bg-slate-100 text-slate-700'}`}>
                                                    <Shield size={12} /> {member.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    {member.status === 'pending' || member.status === 'invited' ? (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                                                            <Clock size={11} /> Pending
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-green-600" /> Active
                                                        </span>
                                                    )}
                                                    {member.invited_at && (
                                                        <p className="text-[10px] text-slate-400">
                                                            Sent: {new Date(member.invited_at).toLocaleDateString()}
                                                        </p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {(member.status === 'pending' || member.status === 'invited') && (
                                                        <button
                                                            onClick={() => handleResend(member.email)}
                                                            disabled={resendingEmail === member.email}
                                                            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
                                                        >
                                                            {resendingEmail === member.email ? 'Resending...' : 'Resend Invite'}
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleRemove(member.email)}
                                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Remove Member"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}

                                    {members.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="text-center py-12 text-slate-400">
                                                No team members yet. Invite someone to get started!
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Social Connections Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                        <h2 className="font-bold text-slate-900 flex items-center gap-2 mb-4">
                            Connected Socials
                        </h2>
                        <div className="space-y-4">
                            {connections.length > 0 ? connections.map((conn, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                                        {conn.picture ? (
                                            <img src={conn.picture} alt={conn.platform} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold uppercase">
                                                {conn.platform[0]}
                                            </div>
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-slate-900 truncate capitalize">{conn.platform}</p>
                                        <p className="text-[10px] text-slate-500 truncate">{conn.page_name}</p>
                                    </div>
                                    <div className="ml-auto">
                                        <CheckCircle size={14} className="text-green-500" />
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-6">
                                    <p className="text-xs text-slate-400">No social profiles connected.</p>
                                    <button
                                        onClick={() => window.location.hash = '/agency/settings'}
                                        className="text-xs font-bold text-indigo-600 mt-2 hover:underline"
                                    >
                                        Connect Now
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Invite Modal */}
            {isInviteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
                        {inviteSent ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">Invitation Sent!</h3>
                                <p className="text-slate-500 mt-2">An invite email has been sent to <strong>{newEmail}</strong></p>
                            </div>
                        ) : (
                            <>
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-slate-900">Invite Team Member</h3>
                                    <button onClick={() => setIsInviteModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            value={newEmail}
                                            onChange={(e) => setNewEmail(e.target.value)}
                                            placeholder="colleague@company.com"
                                            className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                                            autoFocus
                                            onKeyDown={e => e.key === 'Enter' && handleInvite()}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Assign Role</label>
                                        <select
                                            value={newRole}
                                            onChange={(e) => setNewRole(e.target.value)}
                                            className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                                        >
                                            {Object.values(UserRole).filter(r => r !== UserRole.SUPER_ADMIN).map(role => (
                                                <option key={role} value={role}>{role}</option>
                                            ))}
                                        </select>
                                        <p className="text-xs text-slate-500 mt-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                                            {newRole === UserRole.ADMIN && "Full access to workspace settings, billing, and all features."}
                                            {newRole === UserRole.MEMBER && "Can view and edit content, campaigns, and stores."}
                                            {newRole === UserRole.DESIGNER && "Limited to Design Requests and Content Lab."}
                                            {newRole === UserRole.CLIENT && "Read-only access to specific dashboards and approval workflows."}
                                            {newRole === UserRole.OWNER && "Complete control over the entire workspace."}
                                        </p>
                                    </div>

                                    {inviteError && (
                                        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                                            {inviteError}
                                        </div>
                                    )}

                                    <button
                                        onClick={handleInvite}
                                        disabled={!newEmail || isInviting}
                                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                                    >
                                        {isInviting && <Loader2 size={18} className="animate-spin" />}
                                        {isInviting ? 'Sending...' : 'Send Invitation'}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};