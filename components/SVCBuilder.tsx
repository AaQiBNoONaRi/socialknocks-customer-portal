import React, { useState } from 'react';
import { Smartphone, Upload, Save, Globe, Linkedin, Twitter, Mail, QrCode, Share2, BarChart3, Palette, Layout, Plus, Scan, ChevronLeft, MoreVertical, Trash2, CheckCircle, AlertCircle, X, Loader2, User, IdCard } from 'lucide-react';

// Mock Data for SVC List
interface SVCSummary {
    id: string;
    name: string; // Internal name for the card (e.g. "Work Profile")
    personName: string; // Name on the card
    role: string;
    status: 'Active' | 'Draft';
    scans: number;
    saves: number;
    avatar: string;
}

const MOCK_SVC_LIST: SVCSummary[] = [
    { id: '1', name: 'Primary Work', personName: 'Alex Johnson', role: 'Creative Director', status: 'Active', scans: 1245, saves: 340, avatar: 'https://picsum.photos/200?1' },
    { id: '2', name: 'Freelance', personName: 'Alex J. Design', role: 'Freelancer', status: 'Draft', scans: 0, saves: 0, avatar: 'https://picsum.photos/200?2' },
];

const MAX_SVCS = 3; // Simulating Plan Limit

export const SVCBuilder: React.FC = () => {
  // View State
  const [view, setView] = useState<'list' | 'edit'>('list');
  const [activeTab, setActiveTab] = useState<'svc' | 'qr'>('svc');
  
  // Data State
  const [svcs, setSvcs] = useState<SVCSummary[]>(MOCK_SVC_LIST);
  const [activeSVC, setActiveSVC] = useState<SVCSummary | null>(null);

  // Creation State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newSVCName, setNewSVCName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Profile Editor State (Mocked per card)
  const [profile, setProfile] = useState({
    name: 'Alex Johnson',
    role: 'Creative Director',
    bio: 'Helping brands tell better stories through design and strategy.',
    email: 'alex@example.com',
    website: 'www.alexj.design',
    twitter: '@alexj_design',
    linkedin: 'alex-johnson-pro',
    color: '#4f46e5'
  });

  const usedSlots = svcs.length;
  const availableSlots = MAX_SVCS - usedSlots;

  const handleChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateSVC = async () => {
    if (!newSVCName || usedSlots >= MAX_SVCS) return;
    setIsCreating(true);
    // Simulate API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newCard: SVCSummary = {
        id: Date.now().toString(),
        name: newSVCName,
        personName: 'New User',
        role: 'Title',
        status: 'Draft',
        scans: 0,
        saves: 0,
        avatar: `https://picsum.photos/200?random=${Date.now()}`
    };

    setSvcs([...svcs, newCard]);
    setIsCreating(false);
    setIsCreateModalOpen(false);
    setNewSVCName('');
    
    // Optional: Auto-open editor
    handleManageSVC(newCard);
  };

  const handleManageSVC = (svc: SVCSummary) => {
      setActiveSVC(svc);
      // In a real app, we'd load the specific profile data here
      setProfile({
          ...profile,
          name: svc.personName,
          role: svc.role
      });
      setView('edit');
      setActiveTab('svc');
  };

  // --- VIEW: LIST ---
  if (view === 'list') {
      return (
        <div className="space-y-8 animate-in fade-in duration-500 relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                     <div className="flex items-center gap-2 mb-2">
                         <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded uppercase tracking-wider">Identity Kit</span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Smart Profiles</h1>
                    <p className="text-slate-500">Manage your digital business cards and QR assets.</p>
                </div>
                
                <div className="flex items-center gap-6">
                     <div className="hidden md:flex flex-col items-end">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Plan Usage</span>
                        <div className="flex items-center gap-2">
                            <span className={`text-sm font-bold ${availableSlots === 0 ? 'text-amber-600' : 'text-slate-700'}`}>
                                {usedSlots} / {MAX_SVCS} Cards
                            </span>
                            <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full rounded-full transition-all duration-500 ${availableSlots === 0 ? 'bg-amber-500' : 'bg-indigo-600'}`} 
                                    style={{ width: `${(usedSlots / MAX_SVCS) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                     </div>
                     <button 
                        onClick={() => setIsCreateModalOpen(true)}
                        disabled={usedSlots >= MAX_SVCS}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                        <Plus size={20} /> Create New SVC
                     </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Card Name</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Total Scans</th>
                            <th className="px-6 py-4 text-right">Saved Contacts</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {svcs.map((svc) => (
                            <tr key={svc.id} className="hover:bg-slate-50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                                            <img src={svc.avatar} className="w-full h-full object-cover" alt="Profile" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900">{svc.name}</h3>
                                            <p className="text-xs text-slate-500">{svc.personName} • {svc.role}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1.5">
                                        {svc.status === 'Active' ? <CheckCircle size={14} className="text-green-500" /> : <AlertCircle size={14} className="text-slate-400" />}
                                        <span className={`text-sm font-bold ${svc.status === 'Active' ? 'text-green-700' : 'text-slate-600'}`}>
                                            {svc.status}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-1.5 font-bold text-slate-700">
                                        <Scan size={14} className="text-slate-400" />
                                        {svc.scans.toLocaleString()}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                     <div className="flex items-center justify-end gap-1.5 font-bold text-slate-700">
                                        <Save size={14} className="text-slate-400" />
                                        {svc.saves.toLocaleString()}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                            <BarChart3 size={18} />
                                        </button>
                                        <button 
                                            onClick={() => handleManageSVC(svc)}
                                            className="px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 shadow-md transition-all"
                                        >
                                            Edit
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                {svcs.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                            <IdCard size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">No Cards Created</h3>
                        <p className="text-slate-500 mb-6">Create your first digital business card to get started.</p>
                        <button onClick={() => setIsCreateModalOpen(true)} className="text-indigo-600 font-bold hover:underline">Create Now</button>
                    </div>
                )}
            </div>

            {/* Create Modal */}
             {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-900">Create Smart Profile</h3>
                            <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Card Name (Internal)</label>
                                <input 
                                    type="text" 
                                    value={newSVCName}
                                    onChange={(e) => setNewSVCName(e.target.value)}
                                    placeholder="e.g. Work Profile, Event Badge..."
                                    className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    autoFocus
                                />
                            </div>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start gap-3">
                                <Smartphone size={20} className="text-indigo-500 mt-0.5" />
                                <div className="text-sm">
                                    <p className="font-bold text-slate-700">Digital Identity</p>
                                    <p className="text-slate-500">This card will have its own unique URL and QR code.</p>
                                </div>
                            </div>
                            <button 
                                onClick={handleCreateSVC}
                                disabled={!newSVCName || isCreating}
                                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                            >
                                {isCreating && <Loader2 size={18} className="animate-spin" />}
                                {isCreating ? 'Creating...' : 'Launch Editor'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
      );
  }

  // --- VIEW: EDITOR (Active SVC) ---
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6">
         <div className="flex items-center gap-4">
             <button 
                onClick={() => setView('list')}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
             >
                 <ChevronLeft size={24} />
             </button>
             <div>
                 <h1 className="text-2xl font-bold text-slate-900">{activeSVC?.name}</h1>
                 <p className="text-sm text-slate-500">Editing profile details</p>
             </div>
         </div>

         <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
             <button 
                onClick={() => setActiveTab('svc')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'svc' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
             >
                 SVC Builder
             </button>
             <button 
                onClick={() => setActiveTab('qr')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'qr' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
             >
                 QR Tools
             </button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Editor Form */}
        <div className="lg:col-span-2 space-y-6">
            {activeTab === 'svc' && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-8 animate-in slide-in-from-right duration-300">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4 mb-6 flex items-center gap-2">
                            <Palette size={20} className="text-indigo-600" />
                            Visual Identity
                        </h3>
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border-2 border-dashed border-slate-300 hover:border-indigo-500 hover:text-indigo-500 hover:bg-indigo-50 transition-all cursor-pointer overflow-hidden">
                                <img src="https://picsum.photos/200" alt="Avatar" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-bold text-slate-700 mb-2">Accent Color</label>
                                <div className="flex items-center gap-3">
                                    <input 
                                        type="color" 
                                        value={profile.color}
                                        onChange={(e) => handleChange('color', e.target.value)}
                                        className="w-12 h-12 rounded-lg cursor-pointer border-0 shadow-sm"
                                    />
                                    <div className="px-3 py-2 bg-slate-50 rounded-lg text-sm font-mono text-slate-600 border border-slate-200">
                                        {profile.color}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4 mb-6">Personal Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                                <input 
                                    type="text" 
                                    value={profile.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Role / Job Title</label>
                                <input 
                                    type="text" 
                                    value={profile.role}
                                    onChange={(e) => handleChange('role', e.target.value)}
                                    className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                />
                            </div>
                        </div>
                        <div className="mt-6">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Bio</label>
                            <textarea 
                                value={profile.bio}
                                onChange={(e) => handleChange('bio', e.target.value)}
                                rows={3}
                                className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4 mb-6">Contact & Social</h3>
                        <div className="space-y-4">
                            {[
                                { icon: Mail, field: 'email', label: 'Email Address' },
                                { icon: Globe, field: 'website', label: 'Website URL' },
                                { icon: Linkedin, field: 'linkedin', label: 'LinkedIn Username' },
                                { icon: Twitter, field: 'twitter', label: 'X (Twitter) Handle' },
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-200">
                                        <item.icon size={20} />
                                    </div>
                                    <input 
                                        type="text" 
                                        value={(profile as any)[item.field]}
                                        onChange={(e) => handleChange(item.field, e.target.value)}
                                        className="flex-1 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                        placeholder={item.label}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'qr' && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center flex flex-col items-center justify-center min-h-[500px] animate-in slide-in-from-right duration-300">
                    <div className="bg-white p-6 rounded-2xl shadow-xl inline-block mb-8 border border-slate-100">
                        <QrCode size={200} className="text-slate-900" />
                    </div>
                    <div className="max-w-md mx-auto space-y-6">
                        <h3 className="text-xl font-bold text-slate-900">Dynamic QR Assets</h3>
                        <p className="text-slate-500">Scan this code to instantly view your digital business card. Track scans in analytics.</p>
                        <div className="flex gap-4 justify-center">
                            <button className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors">Download PNG</button>
                            <button className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors">Download SVG</button>
                        </div>
                    </div>
                </div>
            )}
        </div>

        {/* Live Preview */}
        <div className="flex justify-center lg:sticky lg:top-8 h-fit animate-in fade-in duration-500">
            <div className="w-[320px] h-[640px] bg-slate-900 rounded-[3.5rem] border-[10px] border-slate-800 shadow-2xl overflow-hidden relative">
                {/* Phone UI */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-7 w-36 bg-slate-800 rounded-b-2xl z-20"></div>
                
                {/* Screen Content */}
                <div className="h-full w-full bg-white overflow-y-auto pb-8 scrollbar-hide">
                    {/* Header Background */}
                    <div style={{ backgroundColor: profile.color }} className="h-40 w-full relative transition-colors duration-300">
                        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
                            <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-slate-200 overflow-hidden">
                                <img src="https://picsum.photos/200" alt="Avatar" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-20 px-8 text-center space-y-2">
                        <h2 className="text-2xl font-bold text-slate-900 leading-tight">{profile.name}</h2>
                        <span className="inline-block px-3 py-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-600">{profile.role}</span>
                        <p className="text-sm text-slate-500 leading-relaxed mt-4">{profile.bio}</p>
                    </div>

                    <div className="mt-8 px-6 space-y-3">
                        {profile.email && (
                            <a href={`mailto:${profile.email}`} className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl hover:border-indigo-200 hover:shadow-md transition-all shadow-sm group">
                                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:scale-110 transition-transform"><Mail size={20} /></div>
                                <span className="text-sm font-semibold text-slate-700">{profile.email}</span>
                            </a>
                        )}
                        {profile.website && (
                             <a href="#" className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl hover:border-indigo-200 hover:shadow-md transition-all shadow-sm group">
                                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:scale-110 transition-transform"><Globe size={20} /></div>
                                <span className="text-sm font-semibold text-slate-700">{profile.website}</span>
                            </a>
                        )}
                    </div>
                    
                    <div className="mt-8 text-center px-6">
                        <button style={{ backgroundColor: profile.color }} className="w-full text-white py-4 rounded-2xl font-bold text-sm shadow-lg shadow-indigo-200 hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                            <Save size={18} /> Save Contact
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};