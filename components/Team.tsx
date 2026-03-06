import React, { useState } from 'react';
import { UserRole, User } from '../types';
import { Mail, Shield, Trash2, Plus, X, Loader2, CheckCircle } from 'lucide-react';

const MOCK_TEAM: User[] = [
    { id: '1', name: 'Jane Cooper', role: UserRole.OWNER, email: 'jane@nexus.com', avatar: 'https://picsum.photos/40?10' },
    { id: '2', name: 'Wade Warren', role: UserRole.ADMIN, email: 'wade@nexus.com', avatar: 'https://picsum.photos/40?11' },
    { id: '3', name: 'Esther Howard', role: UserRole.DESIGNER, email: 'esther@nexus.com', avatar: 'https://picsum.photos/40?12' },
    { id: '4', name: 'Cameron Williamson', role: UserRole.MEMBER, email: 'cameron@nexus.com', avatar: 'https://picsum.photos/40?13' },
];

export const Team: React.FC = () => {
    const [team, setTeam] = useState<User[]>(MOCK_TEAM);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    
    // Form State
    const [newEmail, setNewEmail] = useState('');
    const [newRole, setNewRole] = useState<UserRole>(UserRole.MEMBER);
    const [isInviting, setIsInviting] = useState(false);
    const [inviteSent, setInviteSent] = useState(false);

    const handleInvite = async () => {
        if (!newEmail) return;
        setIsInviting(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        const newUser: User = {
            id: Date.now().toString(),
            name: newEmail.split('@')[0], // Placeholder name from email
            email: newEmail,
            role: newRole,
            avatar: `https://picsum.photos/40?random=${Date.now()}`
        };

        setTeam([...team, newUser]);
        setIsInviting(false);
        setInviteSent(true);

        // Reset after success
        setTimeout(() => {
            setInviteSent(false);
            setIsInviteModalOpen(false);
            setNewEmail('');
            setNewRole(UserRole.MEMBER);
        }, 1500);
    };

    const handleRemove = (id: string) => {
        if (confirm('Are you sure you want to remove this member?')) {
            setTeam(team.filter(m => m.id !== id));
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 relative">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Team Management</h1>
                    <p className="text-slate-500">Manage workspace members and permissions.</p>
                </div>
                <button 
                    onClick={() => setIsInviteModalOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all"
                >
                    <Plus size={18} /> Invite Member
                </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                        <tr>
                            <th className="px-6 py-4">Member</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {team.map((member) => (
                            <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full object-cover" />
                                        <div>
                                            <p className="font-medium text-slate-900 capitalize">{member.name}</p>
                                            <p className="text-sm text-slate-500 flex items-center gap-1">
                                                <Mail size={12} /> {member.email}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-sm text-slate-700 bg-slate-100 px-3 py-1 rounded-full w-fit">
                                        <Shield size={14} className="text-indigo-600" />
                                        {member.role}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                                        Active
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button 
                                        onClick={() => handleRemove(member.id)}
                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                {team.length === 0 && (
                     <div className="text-center py-12">
                        <p className="text-slate-500">No team members found.</p>
                     </div>
                )}
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
                                <p className="text-slate-500 mt-2">An email has been sent to {newEmail}</p>
                             </div>
                        ) : (
                            <>
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-slate-900">Invite Team Member</h3>
                                    <button onClick={() => setIsInviteModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                                        <input 
                                            type="email" 
                                            value={newEmail}
                                            onChange={(e) => setNewEmail(e.target.value)}
                                            placeholder="colleague@nexus.com"
                                            className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                                            autoFocus
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Assign Role</label>
                                        <select 
                                            value={newRole}
                                            onChange={(e) => setNewRole(e.target.value as UserRole)}
                                            className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                                        >
                                            {Object.values(UserRole).map(role => (
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