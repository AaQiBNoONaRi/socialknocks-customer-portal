import React, { useState, useEffect } from 'react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell, BarChart, Bar, Legend 
} from 'recharts';
import { 
    Download, Calendar, ArrowUpRight, ArrowDownRight, 
    Users, Eye, MousePointerClick, Share2, MessageCircle, Heart, 
    TrendingUp, DollarSign, Layers, Target, Facebook, Instagram, Linkedin, Twitter, Youtube, Video 
} from 'lucide-react';
import { Workspace } from '../types';

interface AnalyticsProps {
    currentWorkspace: Workspace;
}

const getToken = () =>
    localStorage.getItem('sk_agency_token') ||
    localStorage.getItem('socialknoks_token') || '';

// --- Mock Data ---

const socialGrowthData = [
    { name: 'Mon', followers: 12400, reach: 45000 },
    { name: 'Tue', followers: 12450, reach: 52000 },
    { name: 'Wed', followers: 12580, reach: 48000 },
    { name: 'Thu', followers: 12690, reach: 61000 },
    { name: 'Fri', followers: 12800, reach: 55000 },
    { name: 'Sat', followers: 12950, reach: 67000 },
    { name: 'Sun', followers: 13100, reach: 72000 },
];

const audienceAgeData = [
    { name: '18-24', value: 25 },
    { name: '25-34', value: 45 },
    { name: '35-44', value: 20 },
    { name: '45+', value: 10 },
];

const postPerformanceData = [
    { id: 1, title: 'Summer Collection Launch', platform: 'Instagram', type: 'Reel', likes: 1205, comments: 45, shares: 120, reach: 15000, date: 'Oct 24', image: 'https://picsum.photos/50?1' },
    { id: 2, title: '5 Tips for Productivity', platform: 'LinkedIn', type: 'Carousel', likes: 450, comments: 89, shares: 230, reach: 8500, date: 'Oct 23', image: 'https://picsum.photos/50?2' },
    { id: 3, title: 'Flash Sale Alert', platform: 'Twitter', type: 'Text', likes: 89, comments: 12, shares: 45, reach: 4200, date: 'Oct 22', image: 'https://picsum.photos/50?3' },
    { id: 4, title: 'Behind the Scenes', platform: 'Instagram', type: 'Story', likes: 0, comments: 0, shares: 0, reach: 3200, date: 'Oct 21', image: 'https://picsum.photos/50?4' },
    { id: 5, title: 'Customer Spotlight', platform: 'Facebook', type: 'Image', likes: 230, comments: 34, shares: 12, reach: 6000, date: 'Oct 20', image: 'https://picsum.photos/50?5' },
];

const campaignFunnelData = [
    { name: 'Impressions', value: 120000, fill: '#6366f1' },
    { name: 'Clicks', value: 45000, fill: '#8b5cf6' },
    { name: 'Signups', value: 12000, fill: '#ec4899' },
    { name: 'Purchases', value: 3500, fill: '#10b981' },
];

const campaignROIData = [
    { name: 'Instagram', spend: 4000, return: 12000 },
    { name: 'Facebook', spend: 3000, return: 8500 },
    { name: 'LinkedIn', spend: 5000, return: 7200 },
    { name: 'Google Ads', spend: 2000, return: 6800 },
];

const PAGE_PERFORMANCE = [
    { id: 1, name: 'Nexus Agency', platform: 'Facebook', followers: '45.2K', reach: '120K', engagement: '3.2%', trend: '+1.2%', icon: Facebook, color: 'text-blue-600 bg-blue-50' },
    { id: 2, name: 'nexus_agency', platform: 'Instagram', followers: '12.4K', reach: '85K', engagement: '5.8%', trend: '+4.5%', icon: Instagram, color: 'text-pink-600 bg-pink-50' },
    { id: 3, name: 'Nexus Agency', platform: 'LinkedIn', followers: '5.8K', reach: '12K', engagement: '2.1%', trend: '+0.5%', icon: Linkedin, color: 'text-blue-700 bg-blue-50' },
    { id: 4, name: '@nexus_updates', platform: 'Twitter', followers: '8.9K', reach: '45K', engagement: '1.5%', trend: '-0.2%', icon: Twitter, color: 'text-slate-900 bg-slate-100' },
];

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b'];
const PLATFORM_COLORS: Record<string, string> = {
    'Instagram': 'text-pink-600 bg-pink-50',
    'LinkedIn': 'text-blue-700 bg-blue-50',
    'Twitter': 'text-slate-900 bg-slate-100',
    'Facebook': 'text-blue-600 bg-blue-50',
};

// --- Sub Components ---

const KPICard = ({ title, value, change, isPositive, icon: Icon }: any) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-slate-50 rounded-xl text-slate-500">
                <Icon size={20} />
            </div>
            <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {change}
            </span>
        </div>
        <h3 className="text-3xl font-bold text-slate-900 tracking-tight mb-1">{value}</h3>
        <p className="text-sm text-slate-500 font-medium">{title}</p>
    </div>
);

export const Analytics: React.FC<AnalyticsProps> = ({ currentWorkspace }) => {
    const [activeTab, setActiveTab] = useState<'social' | 'posts' | 'campaign'>('social');
    const [dateRange, setDateRange] = useState('Last 30 Days');
    const [stats, setStats] = useState<any[]>([]);
    const [postStats, setPostStats] = useState<any[]>([]);
    const [funnelData, setFunnelData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [postsLoading, setPostsLoading] = useState(false);
    const [campaignLoading, setCampaignLoading] = useState(false);
    const [summary, setSummary] = useState({ total_followers: 0, total_reach: 0 });

    const fetchAnalytics = async () => {
        const token = getToken();
        if (!token || !currentWorkspace?.id) {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/analytics/social/${currentWorkspace.id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await res.json();
            if (result.success) {
                setStats(result.data);
                setSummary(result.summary);
            }
        } catch (err) {
            console.error("Failed to fetch analytics:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchPostsAnalytics = async () => {
        const token = getToken();
        if (!token || !currentWorkspace?.id) return;
        setPostsLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/analytics/posts/${currentWorkspace.id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await res.json();
            if (result.success) {
                setPostStats(result.data);
            }
        } catch (err) {
            console.error("Failed to fetch post analytics:", err);
        } finally {
            setPostsLoading(false);
        }
    };

    const fetchCampaignAnalytics = async () => {
        const token = getToken();
        if (!token || !currentWorkspace?.id) return;
        setCampaignLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/analytics/campaign/${currentWorkspace.id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await res.json();
            if (result.success) {
                setFunnelData(result.funnel);
            }
        } catch (err) {
            console.error("Failed to fetch campaign analytics:", err);
        } finally {
            setCampaignLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'social') fetchAnalytics();
        if (activeTab === 'posts') fetchPostsAnalytics();
        if (activeTab === 'campaign') fetchCampaignAnalytics();
    }, [currentWorkspace.id, activeTab]);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                     <div className="flex items-center gap-2 mb-2">
                         <span className="px-2 py-1 bg-cyan-50 text-cyan-700 text-xs font-bold rounded uppercase tracking-wider">Analytics Hub</span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Social Profile Analytics</h1>
                    <p className="text-slate-500">Track growth and performance across all your connected pages.</p>
                </div>
                <div className="flex items-center gap-3">
                     <div className="relative group">
                        <button className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 flex items-center gap-2 hover:bg-slate-50 shadow-sm transition-all">
                            <Calendar size={16} className="text-slate-400" /> 
                            {dateRange}
                        </button>
                        {/* Mock Dropdown */}
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl p-1 hidden group-hover:block z-20">
                            {['Last 7 Days', 'Last 30 Days', 'This Quarter', 'Year to Date'].map(range => (
                                <button key={range} onClick={() => setDateRange(range)} className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-slate-50 text-slate-600 font-medium">
                                    {range}
                                </button>
                            ))}
                        </div>
                     </div>
                     <button className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all">
                        <Download size={16} /> Export Report
                     </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-slate-200">
                <div className="flex space-x-8 overflow-x-auto">
                    {[
                        { id: 'social', label: 'Social Overview', icon: Users },
                        { id: 'posts', label: 'Content Performance', icon: Layers },
                        { id: 'campaign', label: 'Campaign Intelligence', icon: Target },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`pb-4 text-sm font-bold flex items-center gap-2 transition-all border-b-2 px-2 whitespace-nowrap ${
                                activeTab === tab.id 
                                    ? 'border-indigo-600 text-indigo-600' 
                                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                            }`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* --- TAB: SOCIAL OVERVIEW --- */}
            {activeTab === 'social' && (
                <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <KPICard title="Total Followers" value={loading ? "..." : summary.total_followers.toLocaleString()} change="+12%" isPositive={true} icon={Users} />
                        <KPICard title="Accounts Reached" value={loading ? "..." : summary.total_reach.toLocaleString()} change="+5.4%" isPositive={true} icon={Eye} />
                        <KPICard title="Avg. Engagement" value="4.8%" change="-0.2%" isPositive={false} icon={MousePointerClick} />
                        <KPICard title="Link Clicks" value="8,920" change="+18%" isPositive={true} icon={MousePointerClick} />
                    </div>

                    {/* Connected Pages Performance */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-200">
                            <h3 className="text-lg font-bold text-slate-900">Connected Pages Performance</h3>
                            <p className="text-sm text-slate-500">Breakdown of metrics by social profile.</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                                    <tr>
                                        <th className="px-6 py-4">Page / Profile</th>
                                        <th className="px-6 py-4">Platform</th>
                                        <th className="px-6 py-4">Followers</th>
                                        <th className="px-6 py-4">Reach</th>
                                        <th className="px-6 py-4">Engagement</th>
                                        <th className="px-6 py-4 text-right">Trend</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-8 text-center text-slate-400 font-medium italic">Loading real-time stats...</td>
                                        </tr>
                                    ) : stats.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-8 text-center text-slate-400 font-medium italic">No profiles connected. Go to "Social Profiles" to connect your accounts.</td>
                                        </tr>
                                    ) : stats.map((page) => (
                                        <tr key={page.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 font-bold text-slate-900">{page.name}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className={`p-1.5 rounded-lg ${PLATFORM_COLORS[page.platform.charAt(0).toUpperCase() + page.platform.slice(1)]}`}>
                                                        {page.platform === 'facebook' ? <Facebook size={14} /> : <Instagram size={14} />}
                                                    </div>
                                                    <span className="text-sm text-slate-600 capitalize">{page.platform}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-700 font-medium">{page.followers.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-slate-700 font-medium">{page.reach.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-slate-700 font-medium">{page.engagement_rate}%</td>
                                            <td className="px-6 py-4 text-right">
                                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${page.trend.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {page.trend}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Growth Chart */}
                        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 mb-6">Growth Trends</h3>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={socialGrowthData}>
                                        <defs>
                                            <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                                        <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                                        <Area type="monotone" dataKey="reach" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorReach)" name="Reach" />
                                        <Area type="monotone" dataKey="followers" stroke="#ec4899" strokeWidth={3} fill="none" name="Followers" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Audience Demographics */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Audience Age</h3>
                            <p className="text-sm text-slate-500 mb-6">Distribution by age group</p>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={audienceAgeData}
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {audienceAgeData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{borderRadius: '12px', border: 'none'}} />
                                        <Legend verticalAlign="bottom" height={36}/>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- TAB: CONTENT PERFORMANCE --- */}
            {activeTab === 'posts' && (
                <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Top Performing Posts</h3>
                                <p className="text-sm text-slate-500">Based on engagement and reach metrics.</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors">By Likes</button>
                                <button className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors">By Reach</button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                                    <tr>
                                        <th className="px-6 py-4">Content</th>
                                        <th className="px-6 py-4">Platform</th>
                                        <th className="px-6 py-4 text-center">Likes</th>
                                        <th className="px-6 py-4 text-center">Comments</th>
                                        <th className="px-6 py-4 text-center">Shares</th>
                                        <th className="px-6 py-4 text-right">Reach</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {postsLoading ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-medium italic">Fetching your latest posts performance...</td>
                                        </tr>
                                    ) : postStats.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-medium italic">No recent posts found for the connected accounts.</td>
                                        </tr>
                                    ) : postStats.map((post) => (
                                        <tr key={post.id} className="hover:bg-slate-50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img src={post.image} alt="Thumbnail" className="w-12 h-12 rounded-lg object-cover border border-slate-100 group-hover:border-indigo-200 transition-colors" />
                                                    <div>
                                                        <p className="font-bold text-slate-900 text-sm truncate max-w-[200px]">{post.title}</p>
                                                        <p className="text-xs text-slate-500">{new Date(post.date).toLocaleDateString()} • Published</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${PLATFORM_COLORS[post.platform.charAt(0).toUpperCase() + post.platform.slice(1)] || 'bg-slate-100 text-slate-600'}`}>
                                                    {post.platform}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-1 text-sm font-medium text-slate-700">
                                                    <Heart size={14} className="text-rose-500" /> {post.likes.toLocaleString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-1 text-sm font-medium text-slate-700">
                                                    <MessageCircle size={14} className="text-blue-500" /> {post.comments.toLocaleString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-1 text-sm font-medium text-slate-700">
                                                    <Share2 size={14} className="text-green-500" /> {post.shares.toLocaleString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="font-bold text-slate-900">{post.reach.toLocaleString()}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-4 bg-slate-50 border-t border-slate-200 text-center">
                            <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700">View All Posts</button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- TAB: CAMPAIGN INTELLIGENCE --- */}
            {activeTab === 'campaign' && (
                <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Conversion Funnel */}
                        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 mb-1">Conversion Funnel</h3>
                            <p className="text-sm text-slate-500 mb-8">Drop-off rates from impression to purchase</p>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        layout="vertical"
                                        data={funnelData.length > 0 ? funnelData : funnelData}
                                        margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                        <XAxis type="number" hide />
                                        <YAxis
                                            dataKey="name"
                                            type="category"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                                        />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                            cursor={{ fill: '#f8fafc' }}
                                        />
                                        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                                            {funnelData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe'][index % 4]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Platform ROI */}
                        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 mb-1">Ad Spend vs. Return</h3>
                            <p className="text-sm text-slate-500 mb-8">ROI Analysis by Platform</p>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={campaignROIData} barGap={0}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                                        <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px'}} />
                                        <Legend />
                                        <Bar dataKey="spend" fill="#cbd5e1" radius={[4, 4, 0, 0]} name="Ad Spend ($)" />
                                        <Bar dataKey="return" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Return ($)" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                     </div>

                     {/* Detailed Stats Cards */}
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <KPICard title="Total Ad Spend" value="$14,200" change="+8%" isPositive={false} icon={DollarSign} />
                        <KPICard title="Conversion Rate" value="2.9%" change="+0.4%" isPositive={true} icon={TrendingUp} />
                        <KPICard title="Cost Per Click (CPC)" value="$1.24" change="-12%" isPositive={true} icon={Target} />
                     </div>
                </div>
            )}
        </div>
    );
};