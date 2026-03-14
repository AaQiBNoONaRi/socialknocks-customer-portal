import React, { useState } from 'react';
import { Shield, Check, X, Plus, Loader2, Save } from 'lucide-react';
import { UserRole, Workspace } from '../types';

interface RolesPermissionsProps {
    currentWorkspace: Workspace;
}

interface RoleConfig {
    role: string;
    permissions: boolean[];
    isCustom?: boolean;
}

export const RolesPermissions: React.FC<RolesPermissionsProps> = ({ currentWorkspace }) => {
    const modules = ['Dashboard', 'AI Studio', 'Content Lab', 'Analytics', 'Store', 'Settings'];
    
    // Initial Config
    const [roleConfig, setRoleConfig] = useState<RoleConfig[]>([
        { role: UserRole.OWNER, permissions: [true, true, true, true, true, true] },
        { role: UserRole.ADMIN, permissions: [true, true, true, true, true, true] },
        { role: UserRole.MEMBER, permissions: [true, true, true, false, false, false] },
        { role: UserRole.DESIGNER, permissions: [true, true, true, false, false, false] },
        { role: UserRole.CLIENT, permissions: [true, false, true, true, false, false] },
    ]);

    // Modal State
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newRoleName, setNewRoleName] = useState('');
    const [newRolePerms, setNewRolePerms] = useState<boolean[]>(new Array(modules.length).fill(false));
    const [isSaving, setIsSaving] = useState(false);

    const toggleNewPerm = (index: number) => {
        const updated = [...newRolePerms];
        updated[index] = !updated[index];
        setNewRolePerms(updated);
    };

    const handleCreateRole = async () => {
        if (!newRoleName) return;
        setIsSaving(true);
        
        // Simulate API
        await new Promise(resolve => setTimeout(resolve, 1000));

        const newRole: RoleConfig = {
            role: newRoleName,
            permissions: newRolePerms,
            isCustom: true
        };

        setRoleConfig([...roleConfig, newRole]);
        setIsSaving(false);
        setIsCreateModalOpen(false);
        setNewRoleName('');
        setNewRolePerms(new Array(modules.length).fill(false));
    };

    const handleDeleteRole = (roleName: string) => {
        if (confirm(`Delete custom role "${roleName}"?`)) {
            setRoleConfig(roleConfig.filter(r => r.role !== roleName));
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                         <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded uppercase tracking-wider">{currentWorkspace.name}</span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Roles & Permissions</h1>
                    <p className="text-slate-500">Configure access levels for different team members.</p>
                </div>
                <button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all"
                >
                    <Plus size={18} /> Create Custom Role
                </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                        <tr>
                            <th className="px-6 py-4 min-w-[150px] sticky left-0 bg-slate-50 z-10 border-b border-slate-200">Module / Feature</th>
                            {roleConfig.map((rc) => (
                                <th key={rc.role} className="px-6 py-4 text-center border-b border-slate-200 min-w-[100px] relative group">
                                    <div className="flex flex-col items-center gap-1">
                                        <Shield size={16} className={rc.isCustom ? "text-purple-600" : "text-indigo-600"} />
                                        <span className={rc.isCustom ? "text-purple-700" : ""}>{rc.role}</span>
                                        {rc.isCustom && (
                                            <button 
                                                onClick={() => handleDeleteRole(rc.role)}
                                                className="absolute top-2 right-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={14} />
                                            </button>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {modules.map((module, idx) => (
                            <tr key={module} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-bold text-slate-700 sticky left-0 bg-white group-hover:bg-slate-50 transition-colors border-r border-slate-100">
                                    {module}
                                </td>
                                {roleConfig.map((rc) => (
                                    <td key={`${rc.role}-${module}`} className="px-6 py-4 text-center border-r border-slate-50 last:border-0">
                                        <div className="flex justify-center">
                                            {rc.permissions[idx] ? (
                                                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                                    <Check size={14} />
                                                </div>
                                            ) : (
                                                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-300">
                                                    <X size={14} />
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                <h3 className="font-bold text-blue-800 mb-2">Note on Role Hierarchy</h3>
                <p className="text-sm text-blue-600">
                    Owners and Admins have full access to all modules by default. Custom roles can be created for specific agency needs, but cannot override core system security settings.
                </p>
            </div>

            {/* Create Role Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative flex flex-col max-h-[90vh]">
                        <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                            <h3 className="text-xl font-bold text-slate-900">Create Custom Role</h3>
                            <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
                        </div>
                        
                        <div className="space-y-6 overflow-y-auto flex-1 px-1">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Role Name</label>
                                <input 
                                    type="text" 
                                    value={newRoleName}
                                    onChange={(e) => setNewRoleName(e.target.value)}
                                    placeholder="e.g. Content Moderator, Analyst"
                                    className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    autoFocus
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-3">Permissions</label>
                                <div className="space-y-3">
                                    {modules.map((module, idx) => (
                                        <div 
                                            key={module}
                                            onClick={() => toggleNewPerm(idx)}
                                            className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                                                newRolePerms[idx] 
                                                ? 'bg-indigo-50 border-indigo-200' 
                                                : 'bg-white border-slate-200 hover:bg-slate-50'
                                            }`}
                                        >
                                            <span className={`text-sm font-medium ${newRolePerms[idx] ? 'text-indigo-900' : 'text-slate-600'}`}>
                                                {module} Access
                                            </span>
                                            <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${
                                                newRolePerms[idx] ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-300'
                                            }`}>
                                                {newRolePerms[idx] && <Check size={14} className="text-white" />}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 mt-6 border-t border-slate-100">
                             <button 
                                onClick={handleCreateRole}
                                disabled={!newRoleName || isSaving}
                                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                            >
                                {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                {isSaving ? 'Creating Role...' : 'Save Role'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};