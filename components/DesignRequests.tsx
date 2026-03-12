import React, { useState, useEffect } from 'react';
import { Plus, Clock, FileText, X, Folder, Image, Layout, Grid, ChevronRight, ChevronLeft, Mic, StopCircle, UploadCloud, Link, Palette, Calendar, Check, Play, Users } from 'lucide-react';
import { DesignRequest } from '../types';

const PLATFORMS_LIST = ['Instagram', 'Facebook', 'Twitter', 'LinkedIn', 'TikTok', 'YouTube'];
const DESIGN_TYPES = ['Promotion', 'Announcement', 'Engagement', 'Sales'];

// predefined templates
const TEMPLATES = [
    { id: 't1', title: 'Modern Sale Banner', type: 'Sales', platforms: ['Instagram', 'Facebook'], colors: { primary: '#4f46e5', secondary: '#1e293b', accent: '#f8fafc' }, description: 'A sleek, modern sale banner template focusing on bold typography and high contrast for max conversions.' },
    { id: 't2', title: 'Product Showcase Reel', type: 'Promotion', platforms: ['Instagram', 'TikTok'], colors: { primary: '#ec4899', secondary: '#000000', accent: '#ffffff' }, description: 'Fast-paced video reel format designed to highlight 3-5 product features quickly.' },
    { id: 't3', title: 'Minimalist Quote Post', type: 'Engagement', platforms: ['Twitter', 'LinkedIn', 'Instagram'], colors: { primary: '#f1f5f9', secondary: '#334155', accent: '#0f172a' }, description: 'Clean, typography-focused layout for sharing industry quotes or customer testimonials.' },
    { id: 't4', title: 'Black Friday Campaign Set', type: 'Sales', platforms: ['Instagram', 'Facebook', 'Twitter'], colors: { primary: '#000000', secondary: '#ef4444', accent: '#ffffff' }, description: 'Complete set of urgent, high-impact designs for Black Friday or flash sales.' },
    { id: 't5', title: 'Company Announcement', type: 'Announcement', platforms: ['LinkedIn', 'Twitter'], colors: { primary: '#0284c7', secondary: '#f8fafc', accent: '#0ea5e9' }, description: 'Professional, trustworthy design for sharing company news, milestones, or press releases.' },
    { id: 't6', title: 'Event Invitation Series', type: 'Promotion', platforms: ['Instagram', 'Facebook', 'LinkedIn'], colors: { primary: '#8b5cf6', secondary: '#1e1b4b', accent: '#ddd6fe' }, description: 'Multi-post series including Save the Date, Speaker Reveals, and Last Chance reminders.' },
    { id: 't7', title: 'Educational Carousel', type: 'Engagement', platforms: ['Instagram', 'LinkedIn'], colors: { primary: '#10b981', secondary: '#064e3b', accent: '#d1fae5' }, description: '5-slide educational carousel designed to boost saves and shares.' },
    { id: 't8', title: 'Holiday Greeting Bundle', type: 'Engagement', platforms: ['Instagram', 'Facebook', 'LinkedIn'], colors: { primary: '#b91c1c', secondary: '#14532d', accent: '#fef3c7' }, description: 'Warm, festive templates for sharing holiday cheer with your audience and clients.' },
];

const TEAM_MEMBERS = [
    { id: '1', name: 'Jane Cooper' },
    { id: '2', name: 'Wade Warren' },
    { id: '3', name: 'Esther Howard' },
    { id: '4', name: 'Cameron Williamson' },
];

interface DesignRequestsProps {
    workspaceId: string;
}

export const DesignRequests: React.FC<DesignRequestsProps> = ({ workspaceId }) => {
    const [activeTab, setActiveTab] = useState<'requests' | 'templates'>('requests');
    const [isCreating, setIsCreating] = useState(false);
    const [requests, setRequests] = useState<DesignRequest[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!workspaceId) return;
        const fetchRequests = async () => {
            setIsLoading(true);
             try {
                 const token = localStorage.getItem('sk_agency_token') || localStorage.getItem('socialknoks_token');
                 const response = await fetch(`http://localhost:8000/api/design-requests/${workspaceId}`, {
                      headers: { Authorization: `Bearer ${token}` }
                 });
                 if (response.ok) {
                     const data = await response.json();
                     setRequests(data.requests);
                 }
             } catch (error) {
                 console.error("Failed to fetch design requests", error);
             } finally {
                 setIsLoading(false);
             }
        };
        fetchRequests();
    }, [workspaceId]);

    // Wizard State
    const [wizardStep, setWizardStep] = useState(1);
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
    const audioChunksRef = React.useRef<Blob[]>([]);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
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

    const handleUseTemplate = (template: typeof TEMPLATES[0]) => {
        setFormData({
            title: `Copy of ${template.title}`,
            description: template.description,
            designType: template.type,
            platforms: template.platforms,
            colors: template.colors,
            dueDate: '',
            assignedTo: '',
            links: '',
            hasVoiceNote: false
        });
        setAudioBlob(null);
        setAudioUrl(null);
        setActiveTab('requests');
        setWizardStep(1);
        setIsCreating(true);
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const url = URL.createObjectURL(blob);
                setAudioBlob(blob);
                setAudioUrl(url);
                setFormData(prev => ({ ...prev, hasVoiceNote: true }));
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (error) {
            console.error('Error accessing microphone:', error);
            alert('Microphone access is required to record a voice note.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
            setIsRecording(false);
        }
    };

    const toggleRecording = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem('sk_agency_token') || localStorage.getItem('socialknoks_token');
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('designType', formData.designType);
            formDataToSend.append('platforms', JSON.stringify(formData.platforms));
            formDataToSend.append('colors', JSON.stringify(formData.colors));
            formDataToSend.append('dueDate', formData.dueDate);
            formDataToSend.append('assignedTo', formData.assignedTo);
            formDataToSend.append('links', formData.links);
            formDataToSend.append('hasVoiceNote', formData.hasVoiceNote.toString());
            
            if (audioBlob) {
                formDataToSend.append('voice_note', audioBlob, 'voice_note.webm');
            }
            
            const response = await fetch(`http://localhost:8000/api/design-requests/${workspaceId}`, {
                method: 'POST',
                headers: { 
                    Authorization: `Bearer ${token}` 
                },
                body: formDataToSend
            });
            
            if (response.ok) {
                const newRequest = await response.json();
                setRequests([newRequest, ...requests]);
                setIsCreating(false);
                setWizardStep(1);
                setFormData({
                    title: '', description: '', designType: 'Promotion', platforms: [], 
                    colors: { primary: '#4f46e5', secondary: '#000000', accent: '#ffffff' }, 
                    dueDate: '', assignedTo: '', links: '', hasVoiceNote: false
                });
                setAudioBlob(null);
                setAudioUrl(null);
            } else {
                alert('Failed to submit design request');
            }
        } catch (error) {
            console.error("Failed to submit", error);
            alert('Failed to submit design request');
        }
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
                                    <div className="flex-1">
                                        {audioUrl && (
                                            <audio src={audioUrl} controls className="w-full h-10" />
                                        )}
                                    </div>
                                    <button onClick={() => {
                                        setFormData({...formData, hasVoiceNote: false});
                                        setAudioBlob(null);
                                        setAudioUrl(null);
                                    }} className="p-2 text-slate-400 hover:text-red-500 hover:bg-white rounded-lg transition-colors">
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
                    {TEMPLATES.map((template, i) => (
                         <div key={template.id} className="group relative rounded-2xl overflow-hidden bg-slate-900 aspect-[4/5] shadow-md hover:shadow-xl transition-all cursor-pointer">
                             <img src={`https://picsum.photos/400/500?random=${i+10}`} alt={template.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity" />
                             <div className="absolute inset-0 flex flex-col justify-end p-6 translate-y-4 group-hover:translate-y-0 transition-transform bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent">
                                 <div className="flex gap-2 flex-wrap mb-2">
                                     {template.platforms.slice(0, 2).map(p => (
                                         <span key={p} className="bg-indigo-600 px-2 py-1 rounded text-[10px] font-bold text-white shadow-sm">{p}</span>
                                     ))}
                                     {template.platforms.length > 2 && <span className="bg-slate-700 px-2 py-1 rounded text-[10px] font-bold text-white shadow-sm">+{template.platforms.length - 2}</span>}
                                 </div>
                                 <h3 className="text-white font-bold text-lg leading-tight drop-shadow-md">{template.title}</h3>
                                 <p className="text-slate-300 text-xs mt-2 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity delay-75">{template.description}</p>
                                 <button 
                                     onClick={(e) => {
                                         e.stopPropagation();
                                         handleUseTemplate(template);
                                     }}
                                     className="mt-4 bg-white text-slate-900 py-2.5 rounded-lg font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity delay-150 hover:bg-indigo-50 shadow-lg"
                                 >
                                     Use Template
                                 </button>
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