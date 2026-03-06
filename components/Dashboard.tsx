import React from 'react';
import { TrendingUp, Users, Eye, Megaphone, Plus, PenTool, Share2, ArrowUpRight, Activity, PenSquare } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const data = [
  { name: 'Mon', active: 4000, reach: 2400 },
  { name: 'Tue', active: 3000, reach: 1398 },
  { name: 'Wed', active: 2000, reach: 9800 },
  { name: 'Thu', active: 2780, reach: 3908 },
  { name: 'Fri', active: 1890, reach: 4800 },
  { name: 'Sat', active: 2390, reach: 3800 },
  { name: 'Sun', active: 3490, reach: 4300 },
];

const campaignData = [
    { name: 'Summer', roi: 400 },
    { name: 'Back to School', roi: 300 },
    { name: 'Black Friday', roi: 550 },
    { name: 'Holiday', roi: 450 },
];

const StatCard = ({ title, value, change, icon: Icon, colorClass }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${colorClass} text-white shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform`}>
        <Icon size={22} />
      </div>
      <span className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded-lg text-xs font-bold">
        <TrendingUp size={12} className="mr-1" /> {change}
      </span>
    </div>
    <div>
        <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{value}</h3>
        <p className="text-sm font-medium text-slate-500 mt-1">{title}</p>
    </div>
  </div>
);

const QuickAction = ({ icon: Icon, label, onClick, color }: any) => (
    <button 
        onClick={onClick}
        className="flex flex-col items-center justify-center p-6 bg-white border border-slate-100 rounded-2xl hover:border-indigo-200 hover:shadow-lg hover:-translate-y-1 transition-all group w-full"
    >
        <div className={`p-3 rounded-full ${color} text-white mb-3 group-hover:scale-110 transition-transform shadow-md`}>
            <Icon size={24} />
        </div>
        <span className="text-sm font-semibold text-slate-700">{label}</span>
    </button>
);

interface DashboardProps {
    onNavigate: (path: string) => void;
    onCompose: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate, onCompose }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
            <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded uppercase tracking-wider">Social Command Center</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
            <p className="text-slate-500 mt-1">Real-time insights and quick actions for your workspace.</p>
        </div>
        <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                Customize Layout
            </button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-colors flex items-center gap-2">
                <Activity size={16} /> View Reports
            </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Followers" value="124.5k" change="+12%" icon={Users} colorClass="bg-gradient-to-br from-blue-500 to-blue-600" />
        <StatCard title="Total Reach" value="892.1k" change="+5.4%" icon={Eye} colorClass="bg-gradient-to-br from-indigo-500 to-indigo-600" />
        <StatCard title="Active Campaigns" value="12" change="+2" icon={Megaphone} colorClass="bg-gradient-to-br from-purple-500 to-purple-600" />
        <StatCard title="Pending Requests" value="5" change="-2" icon={PenTool} colorClass="bg-gradient-to-br from-amber-500 to-amber-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-xl font-bold text-slate-900">Engagement Trends</h3>
                    <p className="text-sm text-slate-500">Reach performance over the last 7 days</p>
                </div>
                <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors">
                    <ArrowUpRight size={20} />
                </button>
            </div>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                        <Tooltip 
                            contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                        />
                        <Area type="monotone" dataKey="reach" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorReach)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 h-full">
                <QuickAction icon={PenSquare} label="Create Post" onClick={onCompose} color="bg-gradient-to-r from-indigo-600 to-violet-600" />
                <QuickAction icon={Megaphone} label="New Campaign" onClick={() => onNavigate('/campaigns')} color="bg-pink-600" />
                <QuickAction icon={Plus} label="AI Generator" onClick={() => onNavigate('/ai')} color="bg-indigo-600" />
                <QuickAction icon={Share2} label="Connect Profile" onClick={() => onNavigate('/social-profiles')} color="bg-emerald-500" />
            </div>
        </div>
      </div>

       {/* Secondary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Campaign ROI</h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={campaignData}>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                         <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                         <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px'}} />
                         <Bar dataKey="roi" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={40} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

       <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
                <button className="text-sm text-indigo-600 font-medium hover:text-indigo-700">View All</button>
            </div>
            <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 text-sm font-bold text-slate-600 border border-slate-200">
                            JD
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-slate-800 font-medium">John Doe approved <span className="text-indigo-600">Campaign #{100+i}</span></p>
                            <p className="text-xs text-slate-400 mt-1">2 hours ago • Marketing Team</p>
                        </div>
                        <div className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full">
                            Done
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};