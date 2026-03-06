import React, { useState } from 'react';
import { Upload, Image as ImageIcon, Film, File, Grid, List, Search, MoreHorizontal, Filter, Trash2 } from 'lucide-react';

export const MediaLibrary: React.FC = () => {
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const [filter, setFilter] = useState('All');

    const assets = [
        { id: 1, name: 'Summer_Campaign_01.jpg', type: 'image', size: '2.4 MB', date: 'Oct 24, 2024', url: 'https://picsum.photos/400/300?random=1' },
        { id: 2, name: 'Product_Demo_Video.mp4', type: 'video', size: '45.2 MB', date: 'Oct 23, 2024', url: 'https://picsum.photos/400/300?random=2' },
        { id: 3, name: 'Brand_Guidelines.pdf', type: 'document', size: '1.2 MB', date: 'Oct 20, 2024', url: null },
        { id: 4, name: 'Logo_Transparent.png', type: 'image', size: '0.8 MB', date: 'Oct 18, 2024', url: 'https://picsum.photos/400/300?random=3' },
        { id: 5, name: 'Team_Photo_HighRes.jpg', type: 'image', size: '12.4 MB', date: 'Oct 15, 2024', url: 'https://picsum.photos/400/300?random=4' },
    ];

    const getIcon = (type: string) => {
        switch (type) {
            case 'video': return <Film size={24} className="text-red-500" />;
            case 'document': return <File size={24} className="text-blue-500" />;
            default: return <ImageIcon size={24} className="text-indigo-500" />;
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                     <div className="flex items-center gap-2 mb-2">
                         <span className="px-2 py-1 bg-pink-50 text-pink-700 text-xs font-bold rounded uppercase tracking-wider">Content Lab</span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Media Library</h1>
                    <p className="text-slate-500">Manage your brand assets and campaign files.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input type="text" placeholder="Search assets..." className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                    </div>
                    <div className="flex bg-white p-1 rounded-lg border border-slate-200">
                        <button onClick={() => setView('grid')} className={`p-2 rounded ${view === 'grid' ? 'bg-slate-100 text-indigo-600' : 'text-slate-400'}`}><Grid size={18} /></button>
                        <button onClick={() => setView('list')} className={`p-2 rounded ${view === 'list' ? 'bg-slate-100 text-indigo-600' : 'text-slate-400'}`}><List size={18} /></button>
                    </div>
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-indigo-200">
                        <Upload size={18} /> Upload
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {['All', 'Images', 'Videos', 'Documents'].map(f => (
                    <button 
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === f ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {view === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {assets.map(asset => (
                        <div key={asset.id} className="group relative bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all">
                            <div className="aspect-square bg-slate-100 flex items-center justify-center relative">
                                {asset.url ? (
                                    <img src={asset.url} alt={asset.name} className="w-full h-full object-cover" />
                                ) : (
                                    <File size={48} className="text-slate-300" />
                                )}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button className="p-2 bg-white rounded-lg text-slate-900 hover:text-indigo-600"><MoreHorizontal size={18} /></button>
                                </div>
                            </div>
                            <div className="p-3">
                                <h4 className="font-bold text-slate-800 truncate text-sm mb-1">{asset.name}</h4>
                                <div className="flex justify-between items-center text-xs text-slate-500">
                                    <span className="uppercase">{asset.type}</span>
                                    <span>{asset.size}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {/* Dropzone */}
                    <div className="aspect-square rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all cursor-pointer">
                        <Upload size={32} className="mb-2" />
                        <span className="text-sm font-medium">Drop files here</span>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Size</th>
                                <th className="px-6 py-4">Date Added</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {assets.map(asset => (
                                <tr key={asset.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                                                {getIcon(asset.type)}
                                            </div>
                                            <span className="font-medium text-slate-900">{asset.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 capitalize">{asset.type}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{asset.size}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{asset.date}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 text-slate-400 hover:text-red-600"><Trash2 size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};