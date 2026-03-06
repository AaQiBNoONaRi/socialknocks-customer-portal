import React, { useState } from 'react';
import { CreditCard, Globe, Lock, Bell, User } from 'lucide-react';
import { Workspace } from '../types';

interface SettingsProps {
    currentWorkspace: Workspace;
}

export const Settings: React.FC<SettingsProps> = ({ currentWorkspace }) => {
    const [activeTab, setActiveTab] = useState('general');

    const renderContent = () => {
        switch (activeTab) {
            case 'general':
                return (
                    <div className="space-y-6 max-w-2xl">
                        <div className="bg-white p-6 rounded-xl border border-slate-200">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Workspace Details</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Workspace Name</label>
                                    <input type="text" defaultValue={currentWorkspace.name} className="w-full p-2.5 rounded-lg border border-slate-200" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Brand Color</label>
                                    <div className="flex items-center gap-3">
                                        <input type="color" defaultValue="#4f46e5" className="h-10 w-20 rounded cursor-pointer" />
                                        <span className="text-sm text-slate-500">#4f46e5</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'billing':
                return (
                    <div className="bg-white p-6 rounded-xl border border-slate-200 max-w-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Current Plan</h3>
                                <p className="text-slate-500">You are on the {currentWorkspace.plan}</p>
                            </div>
                            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-bold uppercase">{currentWorkspace.plan.split(' ')[0]}</span>
                        </div>
                        <div className="border-t border-slate-100 pt-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-slate-50 rounded-lg"><CreditCard className="text-slate-600" /></div>
                                <div>
                                    <p className="font-medium text-slate-900">Visa ending in 4242</p>
                                    <p className="text-sm text-slate-500">Expires 12/25</p>
                                </div>
                                <button className="ml-auto text-indigo-600 text-sm font-medium hover:underline">Edit</button>
                            </div>
                            <button className="w-full py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50">
                                View Invoices
                            </button>
                        </div>
                    </div>
                );
            default: return null;
        }
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">Workspace Settings</h1>

            <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-64 space-y-1">
                    {[
                        { id: 'general', label: 'General', icon: Globe },
                        { id: 'billing', label: 'Billing & Plan', icon: CreditCard },
                        { id: 'notifications', label: 'Notifications', icon: Bell },
                        { id: 'security', label: 'Security', icon: Lock },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === item.id ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-white'
                                }`}
                        >
                            <item.icon size={18} />
                            {item.label}
                        </button>
                    ))}
                </div>

                <div className="flex-1">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};