
import React from 'react';
import {
    Activity, DollarSign, Users, Server, AlertTriangle, TrendingUp,
    Globe, Shield, BarChart3, Clock, CheckCircle, Search
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar
} from 'recharts';

const revenueData = [
    { name: 'Jan', mrr: 45000, new: 12000 },
    { name: 'Feb', mrr: 52000, new: 14000 },
    { name: 'Mar', mrr: 48000, new: 11000 },
    { name: 'Apr', mrr: 61000, new: 18000 },
    { name: 'May', mrr: 55000, new: 13000 },
    { name: 'Jun', mrr: 67000, new: 21000 },
    { name: 'Jul', mrr: 78000, new: 25000 },
];

const churnData = [
    { name: 'Week 1', churn: 1.2 },
    { name: 'Week 2', churn: 0.8 },
    { name: 'Week 3', churn: 1.5 },
    { name: 'Week 4', churn: 0.5 },
];

const StatCard = ({ title, value, subtext, icon: Icon, color, trend }: any) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-opacity-100`}>
                <Icon size={24} className={color.replace('bg-', 'text-')} />
            </div>
            <span className={`px-2 py-1 rounded-lg text-xs font-bold ${trend.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {trend}
            </span>
        </div>
        <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{value}</h3>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-xs text-slate-400 mt-1">{subtext}</p>
    </div>
);

export const SuperAdminDashboard: React.FC = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-slate-900 text-white text-xs font-bold rounded uppercase tracking-wider flex items-center gap-1">
                            <Shield size={10} /> HQ Admin
                        </span>
                        <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                            <Activity size={10} /> Systems Operational
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Global Command Center</h1>
                    <p className="text-slate-500">Real-time overview of platform health, revenue, and tenants.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search Tenant / User..."
                            className="pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-slate-900 outline-none w-64"
                        />
                    </div>
                    <button className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all">
                        <BarChart3 size={18} /> Financial Report
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Monthly Recurring Rev."
                    value="$78,450"
                    subtext="Run rate: $941k/yr"
                    icon={DollarSign}
                    color="bg-emerald-500 text-emerald-600"
                    trend="+12.5%"
                />
                <StatCard
                    title="Active Workspaces"
                    value="1,240"
                    subtext="45 new this week"
                    icon={Globe}
                    color="bg-blue-500 text-blue-600"
                    trend="+3.8%"
                />
                <StatCard
                    title="Total Users"
                    value="4,892"
                    subtext="Avg 3.9 per workspace"
                    icon={Users}
                    color="bg-indigo-500 text-indigo-600"
                    trend="+5.2%"
                />
                <StatCard
                    title="System Load"
                    value="34%"
                    subtext="API Latency: 45ms"
                    icon={Server}
                    color="bg-slate-500 text-slate-600"
                    trend="-2.1%"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">Revenue Velocity</h3>
                            <p className="text-sm text-slate-500">MRR Growth vs New Sales</p>
                        </div>
                        <div className="flex gap-2">
                            <span className="flex items-center gap-1 text-xs font-bold text-slate-600"><div className="w-2 h-2 rounded-full bg-slate-900"></div> MRR</span>
                            <span className="flex items-center gap-1 text-xs font-bold text-slate-600"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> New Biz</span>
                        </div>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorMRR" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0f172a" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Area type="monotone" dataKey="mrr" stroke="#0f172a" strokeWidth={3} fillOpacity={1} fill="url(#colorMRR)" />
                                <Area type="monotone" dataKey="new" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorNew)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Alerts & Feed */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <AlertTriangle size={20} className="text-amber-500" />
                            System Alerts
                        </h3>
                        <div className="space-y-3">
                            <div className="flex gap-3 p-3 bg-red-50 rounded-xl border border-red-100">
                                <div className="mt-1"><AlertTriangle size={16} className="text-red-600" /></div>
                                <div>
                                    <p className="text-sm font-bold text-red-900">Stripe Webhook Failed</p>
                                    <p className="text-xs text-red-700">3 failed events in last hour.</p>
                                </div>
                            </div>
                            <div className="flex gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
                                <div className="mt-1"><Activity size={16} className="text-amber-600" /></div>
                                <div>
                                    <p className="text-sm font-bold text-amber-900">High API Latency</p>
                                    <p className="text-xs text-amber-700">OpenAI response time {'>'}  2s.</p>
                                </div>
                            </div>
                            <div className="flex gap-3 p-3 bg-green-50 rounded-xl border border-green-100">
                                <div className="mt-1"><CheckCircle size={16} className="text-green-600" /></div>
                                <div>
                                    <p className="text-sm font-bold text-green-900">DB Backup Complete</p>
                                    <p className="text-xs text-green-700">Snapshot created at 04:00 AM.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 p-6 rounded-3xl shadow-lg text-white">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <TrendingUp size={20} className="text-indigo-400" />
                            Live Activity
                        </h3>
                        <div className="space-y-4">
                            {[
                                { text: 'New Enterprise signup: Acme Corp', time: '2m ago' },
                                { text: 'User upgraded to Pro Plan', time: '15m ago' },
                                { text: 'Ticket #492 closed by Support', time: '42m ago' },
                                { text: 'New Store created: "MyShop"', time: '1h ago' },
                            ].map((item, i) => (
                                <div key={i} className="flex justify-between items-start text-sm border-b border-white/10 last:border-0 pb-2 last:pb-0">
                                    <span className="text-slate-300">{item.text}</span>
                                    <span className="text-xs text-slate-500 whitespace-nowrap ml-2">{item.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
