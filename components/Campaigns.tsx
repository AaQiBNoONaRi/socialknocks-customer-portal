import React, { useState } from 'react';
import { Rocket, Calendar, MoreHorizontal, Plus, X, ArrowRight, Check, Target, PieChart, DollarSign, Users, FileText, BarChart } from 'lucide-react';
import { Campaign } from '../types';

const MOCK_CAMPAIGNS: Campaign[] = [
    { id: '1', name: 'Summer Sale 2024', platform: 'Instagram', status: 'Active', reach: 12500, budget: 500, spent: 250, objective: 'Sales' },
    { id: '2', name: 'B2B Lead Gen', platform: 'LinkedIn', status: 'Draft', reach: 0, budget: 1000, spent: 0, objective: 'Awareness' },
    { id: '3', name: 'Viral Challenge', platform: 'TikTok', status: 'Completed', reach: 450000, budget: 200, spent: 200, objective: 'Engagement' },
];

export const Campaigns: React.FC = () => {
  const [view, setView] = useState<'list' | 'create' | 'audience' | 'reports'>('list');
  const [step, setStep] = useState(1);

  const StatusBadge = ({ status }: { status: string }) => {
      const colors = {
          'Active': 'bg-green-100 text-green-700',
          'Draft': 'bg-slate-100 text-slate-700',
          'Completed': 'bg-blue-100 text-blue-700'
      };
      return (
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${colors[status as keyof typeof colors]}`}>
              {status}
          </span>
      );
  }

  const PlatformIcon = ({ platform }: { platform: string }) => {
      return <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded">{platform}</span>
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-orange-50 text-orange-700 text-xs font-bold rounded uppercase tracking-wider">Growth Engine</span>
                </div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Campaigns</h1>
                <p className="text-slate-500 mt-1">Manage ads, audiences, and performance reports.</p>
            </div>
            
            <div className="flex items-center gap-2">
                <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                    <button onClick={() => setView('list')} className={`px-4 py-2 rounded-lg text-sm font-medium ${view === 'list' ? 'bg-slate-900 text-white' : 'text-slate-500'}`}>Overview</button>
                    <button onClick={() => setView('audience')} className={`px-4 py-2 rounded-lg text-sm font-medium ${view === 'audience' ? 'bg-slate-900 text-white' : 'text-slate-500'}`}>Audience</button>
                    <button onClick={() => setView('reports')} className={`px-4 py-2 rounded-lg text-sm font-medium ${view === 'reports' ? 'bg-slate-900 text-white' : 'text-slate-500'}`}>Reports</button>
                </div>
                <button 
                    onClick={() => { setView('create'); setStep(1); }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all"
                >
                    <Plus size={20} /> Create
                </button>
            </div>
       </div>

       {view === 'list' && (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {MOCK_CAMPAIGNS.map((camp) => (
                   <div key={camp.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg transition-all group cursor-pointer hover:-translate-y-1">
                       <div className="flex justify-between items-start mb-6">
                            <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                <Rocket size={24} />
                            </div>
                            <button className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-lg transition-colors">
                                <MoreHorizontal size={20} />
                            </button>
                       </div>
                       
                       <div className="mb-6">
                            <h3 className="font-bold text-slate-900 text-lg mb-2">{camp.name}</h3>
                            <div className="flex items-center gap-2">
                                    <PlatformIcon platform={camp.platform} />
                                    <StatusBadge status={camp.status} />
                            </div>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-4 mb-6">
                           <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                               <p className="text-xs text-slate-500 font-medium uppercase">Reach</p>
                               <p className="font-bold text-slate-900 text-lg">{camp.reach.toLocaleString()}</p>
                           </div>
                           <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                               <p className="text-xs text-slate-500 font-medium uppercase">Spent</p>
                               <p className="font-bold text-slate-900 text-lg">${camp.spent}</p>
                           </div>
                       </div>

                       <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                           <div className="flex items-center gap-2">
                               <Target size={16} className="text-slate-400" />
                               <span className="text-sm font-semibold text-slate-600">{camp.objective}</span>
                           </div>
                           <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
                                <Calendar size={14} />
                                <span>Oct 24</span>
                           </div>
                       </div>
                   </div>
               ))}
           </div>
       )}

       {view === 'audience' && (
           <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
               <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
                   <Users size={32} />
               </div>
               <h2 className="text-xl font-bold text-slate-900 mb-2">Audience Manager</h2>
               <p className="text-slate-500 max-w-md mx-auto">Create and manage custom audiences for your ad campaigns. (Coming Soon)</p>
           </div>
       )}

       {view === 'reports' && (
           <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
               <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
                   <FileText size={32} />
               </div>
               <h2 className="text-xl font-bold text-slate-900 mb-2">Campaign Reports</h2>
               <p className="text-slate-500 max-w-md mx-auto">Download detailed PDF reports of your campaign performance. (Coming Soon)</p>
           </div>
       )}

       {view === 'create' && (
           <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-in zoom-in duration-300">
               <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                   <div>
                       <h2 className="text-xl font-bold text-slate-900">Campaign Wizard</h2>
                       <p className="text-sm text-slate-500">Launch a new growth campaign in 3 steps.</p>
                   </div>
                   <button onClick={() => setView('list')} className="p-2 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"><X size={20} /></button>
               </div>
               
               <div className="p-8">
                   <div className="flex items-center justify-center mb-12">
                       <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${step >= 1 ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-100 text-slate-400'}`}>1</div>
                       <div className="w-24 h-1 bg-slate-100 mx-2 rounded-full overflow-hidden"><div className={`h-full bg-indigo-600 transition-all duration-500 ease-out ${step >= 2 ? 'w-full' : 'w-0'}`}></div></div>
                       <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${step >= 2 ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-100 text-slate-400'}`}>2</div>
                       <div className="w-24 h-1 bg-slate-100 mx-2 rounded-full overflow-hidden"><div className={`h-full bg-indigo-600 transition-all duration-500 ease-out ${step >= 3 ? 'w-full' : 'w-0'}`}></div></div>
                       <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${step >= 3 ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-100 text-slate-400'}`}>3</div>
                   </div>

                   {step === 1 && (
                       <div className="space-y-6 max-w-2xl mx-auto animate-in slide-in-from-right duration-300">
                           <div className="text-center mb-8">
                               <h3 className="text-2xl font-bold text-slate-900">Campaign Basics</h3>
                               <p className="text-slate-500">Define your goals and identity.</p>
                           </div>
                           <div>
                               <label className="block text-sm font-bold text-slate-700 mb-2">Campaign Name</label>
                               <input type="text" className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-lg" placeholder="e.g. Summer Launch 2024" autoFocus />
                           </div>
                           <div>
                               <label className="block text-sm font-bold text-slate-700 mb-2">Objective</label>
                               <div className="grid grid-cols-3 gap-4">
                                   {['Sales', 'Awareness', 'Engagement'].map(obj => (
                                       <button key={obj} className="p-6 border-2 border-slate-100 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 text-slate-600 font-bold transition-all hover:scale-105 active:scale-95 flex flex-col items-center gap-2">
                                           {obj === 'Sales' && <DollarSign className="mb-1 text-green-500" />}
                                           {obj === 'Awareness' && <Target className="mb-1 text-blue-500" />}
                                           {obj === 'Engagement' && <PieChart className="mb-1 text-purple-500" />}
                                           {obj}
                                       </button>
                                   ))}
                               </div>
                           </div>
                       </div>
                   )}

                   {step === 2 && (
                       <div className="space-y-6 max-w-2xl mx-auto animate-in slide-in-from-right duration-300">
                            <div className="text-center mb-8">
                               <h3 className="text-2xl font-bold text-slate-900">Target & Budget</h3>
                               <p className="text-slate-500">Where and how much?</p>
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                               {['Instagram', 'LinkedIn', 'Twitter', 'TikTok', 'Meta Ads', 'Google Ads'].map(p => (
                                   <button key={p} className="p-4 border-2 border-slate-100 rounded-xl text-left hover:border-indigo-500 hover:bg-indigo-50 font-medium transition-all">{p}</button>
                               ))}
                           </div>
                           <div>
                               <label className="block text-sm font-bold text-slate-700 mb-2">Total Budget</label>
                               <div className="relative">
                                   <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                                   <input type="number" className="w-full pl-8 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-lg" placeholder="1000.00" />
                               </div>
                           </div>
                       </div>
                   )}

                   {step === 3 && (
                        <div className="text-center py-12 animate-in zoom-in duration-300">
                            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-6 shadow-xl shadow-green-100">
                                <Check size={48} />
                            </div>
                            <h3 className="text-3xl font-bold text-slate-900">Ready for Liftoff!</h3>
                            <p className="text-slate-500 mt-2 text-lg">Your campaign configuration is complete.</p>
                        </div>
                   )}

                   <div className="flex justify-between mt-12 pt-6 border-t border-slate-100">
                       {step > 1 ? (
                           <button onClick={() => setStep(step - 1)} className="text-slate-500 hover:text-slate-800 font-medium px-4">Back</button>
                       ) : <div></div>}
                       
                       {step < 3 ? (
                           <button onClick={() => setStep(step + 1)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all hover:translate-x-1">
                               Next Step <ArrowRight size={20} />
                           </button>
                       ) : (
                           <button onClick={() => setView('list')} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all hover:scale-105">
                               Launch Campaign
                           </button>
                       )}
                   </div>
               </div>
           </div>
       )}
    </div>
  );
};