import React, { useState } from 'react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
    Scan, Smartphone, Users, MapPin, Calendar, Download, 
    ArrowUpRight, ExternalLink, Save
} from 'lucide-react';

const scanHistory = [
    { name: 'Mon', scans: 45, unique: 30 },
    { name: 'Tue', scans: 52, unique: 35 },
    { name: 'Wed', scans: 38, unique: 28 },
    { name: 'Thu', scans: 65, unique: 45 },
    { name: 'Fri', scans: 89, unique: 60 },
    { name: 'Sat', scans: 120, unique: 95 },
    { name: 'Sun', scans: 95, unique: 70 },
];

const deviceData = [
    { name: 'iPhone', value: 65 },
    { name: 'Android', value: 30 },
    { name: 'Desktop', value: 5 },
];

const actionData = [
    { name: 'Save Contact', value: 245 },
    { name: 'Email Click', value: 120 },
    { name: 'Website Visit', value: 85 },
    { name: 'Social Link', value: 150 },
];

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899'];

const StatCard = ({ title, value, subtext, icon: Icon }: any) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Icon size={24} />
        </div>
        <div>
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{value}</h3>
            <p className="text-sm font-bold text-slate-700">{title}</p>
            <p className="text-xs text-slate-500 mt-1">{subtext}</p>
        </div>
    </div>
);

export const SVCAnalytics: React.FC = () => {
    const [dateRange, setDateRange] = useState('Last 7 Days');

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                     <div className="flex items-center gap-2 mb-2">
                         <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded uppercase tracking-wider">Analytics Hub</span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">SVC Analytics</h1>
                    <p className="text-slate-500">Track digital card performance, scans, and engagement.</p>
                </div>
                <div className="flex items-center gap-3">
                     <button className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 flex items-center gap-2 hover:bg-slate-50 shadow-sm transition-all">
                        <Calendar size={16} className="text-slate-400" /> 
                        {dateRange}
                    </button>
                     <button className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all">
                        <Download size={16} /> Export Data
                     </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Scans" value="1,245" subtext="+120 from last week" icon={Scan} />
                <StatCard title="Unique Visitors" value="892" subtext="72% conversion rate" icon={Users} />
                <StatCard title="Contact Saves" value="340" subtext="Top performing action" icon={Save} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Scans Chart */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-1">Scan Activity</h3>
                    <p className="text-sm text-slate-500 mb-6">Total scans vs unique visitors</p>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={scanHistory} barGap={4}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                                <Legend />
                                <Bar dataKey="scans" fill="#6366f1" radius={[4, 4, 0, 0]} name="Total Scans" />
                                <Bar dataKey="unique" fill="#a5b4fc" radius={[4, 4, 0, 0]} name="Unique Visitors" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Device & Location */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Device Breakdown</h3>
                        <div className="h-48 flex items-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={deviceData}
                                        innerRadius={40}
                                        outerRadius={70}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {deviceData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{borderRadius: '12px', border: 'none'}} />
                                    <Legend layout="vertical" verticalAlign="middle" align="right" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex-1">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Top Interaction</h3>
                        <div className="space-y-4">
                            {actionData.map((action, idx) => (
                                <div key={idx} className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="font-bold text-slate-700">{action.name}</span>
                                            <span className="text-slate-500">{action.value} clicks</span>
                                        </div>
                                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full rounded-full" 
                                                style={{ width: `${(action.value / 300) * 100}%`, backgroundColor: COLORS[idx] }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};