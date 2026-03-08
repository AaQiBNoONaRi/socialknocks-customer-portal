import React, { useState } from 'react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
    DollarSign, ShoppingBag, Users, TrendingUp, Calendar, Download, 
    ArrowUpRight, ArrowDownRight, Package, CreditCard
} from 'lucide-react';

const salesData = [
    { name: 'Mon', revenue: 1400, orders: 24 },
    { name: 'Tue', revenue: 2200, orders: 35 },
    { name: 'Wed', revenue: 1800, orders: 28 },
    { name: 'Thu', revenue: 2800, orders: 42 },
    { name: 'Fri', revenue: 3500, orders: 55 },
    { name: 'Sat', revenue: 4200, orders: 68 },
    { name: 'Sun', revenue: 3800, orders: 60 },
];

const categoryData = [
    { name: 'Electronics', value: 45 },
    { name: 'Clothing', value: 30 },
    { name: 'Accessories', value: 15 },
    { name: 'Home', value: 10 },
];

const topProducts = [
    { id: 1, name: 'Minimalist Watch', revenue: 4500, sales: 120, trend: '+12%' },
    { id: 2, name: 'Leather Backpack', revenue: 3200, sales: 85, trend: '+5%' },
    { id: 3, name: 'Wireless Earbuds', revenue: 2800, sales: 150, trend: '+18%' },
    { id: 4, name: 'Smart Home Hub', revenue: 1900, sales: 45, trend: '-2%' },
];

const COLORS = ['#4f46e5', '#8b5cf6', '#ec4899', '#f59e0b'];

const KPICard = ({ title, value, change, isPositive, icon: Icon, colorClass }: any) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl text-white ${colorClass}`}>
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

export const StoreAnalytics: React.FC = () => {
    const [dateRange, setDateRange] = useState('Last 30 Days');

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                     <div className="flex items-center gap-2 mb-2">
                         <span className="px-2 py-1 bg-teal-50 text-teal-700 text-xs font-bold rounded uppercase tracking-wider">Analytics Hub</span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Store Analytics</h1>
                    <p className="text-slate-500">Deep dive into your revenue, orders, and product performance.</p>
                </div>
                <div className="flex items-center gap-3">
                     <button className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 flex items-center gap-2 hover:bg-slate-50 shadow-sm transition-all">
                        <Calendar size={16} className="text-slate-400" /> 
                        {dateRange}
                    </button>
                     <button className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all">
                        <Download size={16} /> Export Report
                     </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard title="Total Revenue" value="$45,231" change="+14%" isPositive={true} icon={DollarSign} colorClass="bg-green-500" />
                <KPICard title="Total Orders" value="1,205" change="+8%" isPositive={true} icon={ShoppingBag} colorClass="bg-blue-500" />
                <KPICard title="Avg. Order Value" value="$85.20" change="+2.4%" isPositive={true} icon={CreditCard} colorClass="bg-purple-500" />
                <KPICard title="Conversion Rate" value="3.2%" change="-0.5%" isPositive={false} icon={TrendingUp} colorClass="bg-amber-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-1">Revenue Trend</h3>
                    <p className="text-sm text-slate-500 mb-6">Sales performance over the selected period</p>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={salesData}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Sales by Category */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-1">Sales by Category</h3>
                    <p className="text-sm text-slate-500 mb-6">Revenue distribution across catalog</p>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
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

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200">
                    <h3 className="text-lg font-bold text-slate-900">Top Performing Products</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                            <tr>
                                <th className="px-6 py-4">Product Name</th>
                                <th className="px-6 py-4 text-right">Units Sold</th>
                                <th className="px-6 py-4 text-right">Revenue</th>
                                <th className="px-6 py-4 text-right">Trend</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {topProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                                                <Package size={20} />
                                            </div>
                                            <span className="font-bold text-slate-900">{product.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right text-slate-700 font-medium">{product.sales}</td>
                                    <td className="px-6 py-4 text-right font-bold text-slate-900">${product.revenue.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${product.trend.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {product.trend}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};