import React, { useState } from 'react';
import { Plus, Building, MoreVertical, ExternalLink } from 'lucide-react';
import { Client } from '../types';

const MOCK_CLIENTS: Client[] = [
    { id: '1', name: 'Acme Corp', industry: 'SaaS', email: 'contact@acme.com', status: 'Active', logo: 'https://picsum.photos/50?1' },
    { id: '2', name: 'Fresh Foods', industry: 'Retail', email: 'hello@freshfoods.com', status: 'Active', logo: 'https://picsum.photos/50?2' },
    { id: '3', name: 'TechStart', industry: 'Technology', email: 'admin@techstart.io', status: 'Inactive', logo: 'https://picsum.photos/50?3' },
];

export const Clients: React.FC = () => {
    const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                     <div className="flex items-center gap-2 mb-2">
                         <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded uppercase tracking-wider">Workspace</span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Agency Clients</h1>
                    <p className="text-slate-500">Manage your client workspaces and access.</p>
                </div>
                <button className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
                    <Plus size={18} /> Add Client
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clients.map((client) => (
                    <div key={client.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group relative">
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600">
                                <MoreVertical size={20} />
                            </button>
                        </div>
                        
                        <div className="flex items-center gap-4 mb-6">
                            <img src={client.logo} alt={client.name} className="w-16 h-16 rounded-xl object-cover bg-slate-100" />
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">{client.name}</h3>
                                <p className="text-sm text-slate-500">{client.industry}</p>
                            </div>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Status</span>
                                <span className={`font-medium ${client.status === 'Active' ? 'text-green-600' : 'text-slate-400'}`}>
                                    {client.status}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Contact</span>
                                <span className="font-medium text-slate-900 truncate max-w-[150px]">{client.email}</span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button className="flex-1 py-2 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-sm font-medium transition-colors">
                                Manage
                            </button>
                            <button className="py-2 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center">
                                <ExternalLink size={16} />
                            </button>
                        </div>
                    </div>
                ))}

                {/* Add New Card */}
                <button className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-400 hover:bg-slate-50 hover:text-indigo-600 transition-all min-h-[250px]">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-100 transition-colors">
                        <Plus size={24} />
                    </div>
                    <span className="font-medium">Register New Client</span>
                </button>
            </div>
        </div>
    );
};