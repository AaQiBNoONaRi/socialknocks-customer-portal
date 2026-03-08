import React, { useState } from 'react';
import { Plus, Clock, FileText, X, Folder, Image, Layout, Grid, ChevronRight, ChevronLeft, Mic, StopCircle, UploadCloud, Link, Palette, Calendar, Check, Play, Users } from 'lucide-react';
import { DesignRequest } from '../types';

const MOCK_REQUESTS: DesignRequest[] = [
    { id: '1', title: 'Instagram Story Templates', type: 'Social', status: 'In Progress', priority: 'High', date: '2024-10-20', assignedTo: 'Jane Cooper' },
    { id: '2', title: 'Website Hero Banner', type: 'Web', status: 'Pending', priority: 'Medium', date: '2024-10-21' },
    { id: '3', title: 'Fall Campaign Logo', type: 'Graphic', status: 'Review', priority: 'High', date: '2024-10-18', assignedTo: 'Esther Howard' },
];

const PLATFORMS_LIST = ['Instagram', 'Facebook', 'Twitter', 'LinkedIn', 'TikTok', 'YouTube'];
const DESIGN_TYPES = ['Promotion', 'Announcement', 'Engagement', 'Sales'];

const TEAM_MEMBERS = [
    { id: '1', name: 'Jane Cooper' },
    { id: '2', name: 'Wade Warren' },
    { id: '3', name: 'Esther Howard' },
    { id: '4', name: 'Cameron Williamson' },
];

export const DesignRequests: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'requests' | 'templates'>('requests');
    const [isCreating, setIsCreating] = useState(false);
    const [requests, setRequests] = useState<DesignRequest[]>(MOCK_REQUESTS);

    // Wizard State
    const [wizardStep, setWizardStep] = useState(1);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        designType: 'Promotion',
        platforms: [] as string[],
        colors: { primary: '#4f46e5', secondary: '#000000', accent: '#ffffff' },
        dueDate: '',
        assignedTo: '',
        links: '',
        hasVoiceNote: false
    });

    const columns = [
        { id: 'Pending', label: 'Pending', color: 'bg-slate-100 text-slate-600' },
        { id: 'In Progress', label: 'In Progress', color: 'bg-blue-100 text-blue-600' },
        { id: 'Review', label: 'In Review', color: 'bg-amber-100 text-amber-600' },
        { id: 'Approved', label: 'Approved', color: 'bg-green-100 text-green-600' },
    ];

    const handlePlatformToggle = (platform: string) => {
        setFormData(prev => {
            const newPlatforms = prev.platforms.includes(platform)
                ? prev.platforms.filter(p => p !== platform)
                : [...prev.platforms, platform];
            return { ...prev, platforms: newPlatforms };
        });
    };

    const handleColorChange = (key: 'primary' | 'secondary' | 'accent', value: string) => {
        setFormData(prev => ({
            ...prev,
            colors: { ...prev.colors, [key]: value }
        }));
    };

    const toggleRecording = () => {
        if (isRecording) {
            setIsRecording(false);
            setFormData(prev => ({ ...prev, hasVoiceNote: true }));
        } else {
            setIsRecording(true);
            // Simulate recording
        }
    };

    const handleSubmit = () => {
        const newRequest: DesignRequest = {
            id: Date.now().toString(),
            title: formData.title,
            type: 'Social', // Simplified for the list view
            status: 'Pending',
            priority: 'Medium',
            date: new Date().toISOString().split('T')[0],
            assignedTo: formData.assignedTo
        };
        setRequests([newRequest, ...requests]);
        setIsCreating(false);
        setWizardStep(1);
        setFormData({
            title: '', description: '', designType: 'Promotion', platforms: [], 
            colors: { primary: '#4f46e5', secondary: '#000000', accent: '#ffffff' }, 
            dueDate: '', assignedTo: '', links: '', hasVoiceNote: false
        });
    };

    const getInitials = (name?: string) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    const renderWizardStep = () => {
        switch (wizardStep) {
            case 1: // The Basics
                return (
                    <div className="space-y-6 animate-in slide-in-from-right duration-300">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Project Title</label>
                            <input 
                                type="text" 
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-lg"
                                placeholder="e.g. Black Friday Story Set"
                                autoFocus
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                            <textarea 
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                rows={6}
                                className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                                placeholder="Describe the vision, copy, and specific requirements in detail..."
                            />
                        </div>
                    </div>
                );
            case 2: // Details
                return (
                    <div className="space-y-8 animate-in slide-in-from-right duration-300">
                         <div>
                            <label className="block text-sm font-bold text-slate-700 mb-3">Design Type</label>
                            <div className="grid grid-cols-2 gap-3">
                                {DESIGN_TYPES.map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setFormData({...formData, designType: type})}
                                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                                            formData.designType === type 
                                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold' 
                                            : 'border-slate-100 hover:border-slate-300 text-slate-600'
                                        }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-3">Platforms</label>
                            <div className="flex flex-wrap gap-2">
                                {PLATFORMS_LIST.map(platform => (
                                    <button
                                        key={platform}
                                        onClick={() => handlePlatformToggle(platform)}
                                        className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${
                                            formData.platforms.includes(platform)
                                            ? 'bg-slate-900 text-white border-slate-900'
                                            : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                                        }`}
                                    >
                                        {platform}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 3: // Visuals & Timeline & Assignee
                return (
                    <div className="space-y-8 animate-in slide-in-from-right duration-300">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                                <Palette size={18} /> Brand Colors
                            </label>
                            <div className="grid grid-cols-3 gap-6">
                                {Object.entries(formData.colors).map(([key, value]) => (
                                    <div key={key} className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase">{key}</label>
                                        <div className="flex items-center gap-2">
                                            <div className="relative w-full h-12 rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                                                <input 
                                                    type="color" 
                                                    value={value}
                                                    onChange={(e) => handleColorChange(key as any, e.target.value)}
                                                    className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] cursor-pointer p-0 m-0 border-0"
                                                />
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-400 font-mono">{value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                    <Calendar size={18} /> Due Date
                                </label>
                                <input 
                                    type="date"
                                    value={formData.dueDate}
                                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                                    className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                    <Users size={18} /> Assign Team Member
                                </label>
                                <select
                                    value={formData.assignedTo}
                                    onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                                    className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white appearance-none"
                                >
                                    <option value="">Unassigned</option>
                                    {TEAM_MEMBERS.map(member => (
                                        <option key={member.id} value={member.name}>{member.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                );
            case 4: // Assets
                return (
                    <div className="space-y-6 animate-in slide-in-from-right duration-300">
                        {/* Dropzone */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">File Uploads</label>
                            <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer group">
                                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                    <UploadCloud size={24} />
                                </div>
                                <p className="text-sm font-medium text-slate-900">Click to upload or drag and drop</p>
                                <p className="text-xs text-slate-400 mt-1">Images, PDFs, or Sketches (Max 10MB)</p>
                            </div>
                        </div>

                        {/* Voice Note */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Voice Note</label>
                            {!formData.hasVoiceNote ? (
                                <button 
                                    onClick={toggleRecording}
                                    className={`w-full py-4 rounded-xl border border-slate-200 flex items-center justify-center gap-3 font-bold transition-all ${
                                        isRecording ? 'bg-red-50 text-red-600 border-red-200 animate-pulse' : 'hover:bg-slate-50 text-slate-700'
                                    }`}
                                >
                                    {isRecording ? (
                                        <>
                                            <StopCircle size={20} /> Stop Recording...
                                        </>
                                    ) : (
                                        <>
                                            <Mic size={20} /> Record Audio Instructions
                                        </>
                                    )}
                                </button>
                            ) : (
                                <div className="flex items-center gap-3 p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                                    <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-indigo-600 shadow-sm">
                                        <Play size={16} fill="currentColor" />
                                    </button>
                                    <div className="flex-1">
                                        <div className="h-1 bg-indigo-200 rounded-full w-full overflow-hidden">
                                            <div className="h-full bg-indigo-600 w-1/3"></div>
                                        </div>
                                    </div>
                                    <button onClick={() => setFormData({...formData, hasVoiceNote: false})} className="p-2 text-slate-400 hover:text-red-500">
                                        <X size={16} />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Links */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Inspiration / Links</label>
                            <div className="relative">
                                <Link className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input 
                                    type="text"
                                    value={formData.links}
                                    onChange={(e) => setFormData({...formData, links: e.target.value})}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="Paste URL here..."
                                />
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                         <span className="px-2 py-1 bg-pink-50 text-pink-700 text-xs font-bold rounded uppercase tracking-wider">Content Lab</span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Design & Creative</h1>
                    <p className="text-slate-500 mt-1">Submit requests to designers or use templates.</p>
                </div>
                <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                    {['requests', 'templates'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                                activeTab === tab ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            {activeTab === 'requests' && (
                <div className="space-y-6">
                    <div className="flex justify-end">
                        <button 
                            onClick={() => { setIsCreating(true); setWizardStep(1); }}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5"
                        >
                            <Plus size={20} /> New Request
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto pb-4">
                        {columns.map((col) => (
                            <div key={col.id} className="flex flex-col bg-slate-50 rounded-2xl border border-slate-200 h-full min-h-[500px]">
                                <div className="p-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-slate-50 rounded-t-2xl z-10">
                                    <h3 className="font-bold text-slate-700">{col.label}</h3>
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${col.color}`}>
                                        {requests.filter(r => r.status === col.id).length}
                                    </span>
                                </div>
                                <div className="p-3 space-y-3 overflow-y-auto flex-1">
                                    {requests.filter(r => r.status === col.id).map((req) => (
                                        <div key={req.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 cursor-move hover:border-indigo-400 hover:shadow-md transition-all group">
                                            <div className="flex justify-between items-start mb-3">
                                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg bg-slate-100 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors`}>
                                                    {req.type}
                                                </span>
                                                <div className={`w-2 h-2 rounded-full ${
                                                    req.priority === 'High' ? 'bg-red-500' : req.priority === 'Medium' ? 'bg-amber-500' : 'bg-green-500'
                                                }`} title={`Priority: ${req.priority}`} />
                                            </div>
                                            <h4 className="font-bold text-slate-900 mb-2 leading-tight">{req.title}</h4>
                                            <div className="flex items-center justify-between text-xs text-slate-400 mt-4 pt-3 border-t border-slate-50">
                                                <span className="flex items-center gap-1">
                                                    <Clock size={12} /> {req.date}
                                                </span>
                                                <div className="flex -space-x-2">
                                                    {req.assignedTo ? (
                                                        <div className="w-6 h-6 rounded-full bg-indigo-100 border-2 border-white text-indigo-600 flex items-center justify-center text-[10px] font-bold" title={req.assignedTo}>
                                                            {getInitials(req.assignedTo)}
                                                        </div>
                                                    ) : (
                                                        <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white text-slate-400 flex items-center justify-center text-[10px]" title="Unassigned">
                                                            <Users size={12} />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'templates' && (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                         <div key={i} className="group relative rounded-2xl overflow-hidden bg-slate-900 aspect-[4/5] shadow-md hover:shadow-xl transition-all cursor-pointer">
                             <img src={`https://picsum.photos/400/500?random=${i+10}`} alt="Template" className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity" />
                             <div className="absolute inset-0 flex flex-col justify-end p-6 translate-y-4 group-hover:translate-y-0 transition-transform">
                                 <div className="bg-indigo-600 w-fit px-2 py-1 rounded text-[10px] font-bold text-white mb-2">Instagram</div>
                                 <h3 className="text-white font-bold text-lg leading-tight">Modern Sale #{i}</h3>
                                 <button className="mt-4 bg-white text-slate-900 py-2 rounded-lg font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity delay-75 hover:bg-indigo-50">Use Template</button>
                             </div>
                         </div>
                    ))}
                </div>
            )}

            {/* Creation Wizard Modal */}
            {isCreating && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-3xl max-w-2xl w-full relative shadow-2xl flex flex-col max-h-[90vh]">
                        {/* Header */}
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">New Design Request</h2>
                                <p className="text-sm text-slate-500">Step {wizardStep} of 4</p>
                            </div>
                            <button 
                                onClick={() => setIsCreating(false)}
                                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-1 bg-slate-100 w-full">
                            <div 
                                className="h-full bg-indigo-600 transition-all duration-300 ease-out"
                                style={{ width: `${(wizardStep / 4) * 100}%` }}
                            ></div>
                        </div>

                        {/* Content Scrollable Area */}
                        <div className="flex-1 overflow-y-auto p-8">
                             {renderWizardStep()}
                        </div>

                        {/* Footer Actions */}
                        <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-3xl flex justify-between items-center">
                            {wizardStep > 1 ? (
                                <button 
                                    onClick={() => setWizardStep(wizardStep - 1)}
                                    className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-white hover:text-slate-900 transition-colors flex items-center gap-2"
                                >
                                    <ChevronLeft size={18} /> Back
                                </button>
                            ) : <div></div>}

                            <button 
                                onClick={() => {
                                    if (wizardStep < 4) setWizardStep(wizardStep + 1);
                                    else handleSubmit();
                                }}
                                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all hover:translate-x-1 flex items-center gap-2"
                            >
                                {wizardStep === 4 ? 'Submit Request' : 'Next Step'}
                                {wizardStep === 4 ? <Check size={18} /> : <ChevronRight size={18} />}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};