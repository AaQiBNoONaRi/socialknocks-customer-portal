import React, { useState } from 'react';
import { Package, Plus, Search, Edit2, Trash2, DollarSign, ShoppingBag, Users, MoreHorizontal, Globe, ChevronLeft, BarChart3, ExternalLink, CheckCircle, AlertCircle, X, Loader2, Store } from 'lucide-react';
import { Product, Order } from '../types';

// Mock Data for the Stores List
interface StoreSummary {
    id: string;
    name: string;
    url: string;
    status: 'Active' | 'Maintenance' | 'Draft';
    revenue: number;
    orders: number;
    visitors: number;
    image: string;
}

const MOCK_STORES_LIST: StoreSummary[] = [
    { id: '1', name: 'Nexus Merch', url: 'shop.nexus.agency', status: 'Active', revenue: 12450, orders: 156, visitors: 1200, image: 'https://picsum.photos/50?s=1' },
    { id: '2', name: 'Client Demo Store', url: 'demo.nexus.agency', status: 'Draft', revenue: 0, orders: 0, visitors: 45, image: 'https://picsum.photos/50?s=2' },
];

const MAX_STORES = 3; // Simulating Plan Limit

// Mock Data for Inner Details
const MOCK_PRODUCTS: Product[] = [
    { id: '1', name: 'Minimalist Watch', price: 129.99, stock: 45, category: 'Accessories', image: 'https://picsum.photos/100/100?random=1', sales: 12 },
    { id: '2', name: 'Leather Backpack', price: 249.50, stock: 12, category: 'Bags', image: 'https://picsum.photos/100/100?random=2', sales: 8 },
    { id: '3', name: 'Wireless Earbuds', price: 89.00, stock: 120, category: 'Electronics', image: 'https://picsum.photos/100/100?random=3', sales: 45 },
];

const MOCK_ORDERS: Order[] = [
    { id: '#ORD-7829', customer: 'Alice Smith', date: 'Oct 24, 2024', total: 129.99, status: 'Pending', items: 1 },
    { id: '#ORD-7830', customer: 'Bob Jones', date: 'Oct 23, 2024', total: 499.00, status: 'Shipped', items: 2 },
    { id: '#ORD-7831', customer: 'Charlie Day', date: 'Oct 23, 2024', total: 89.00, status: 'Delivered', items: 1 },
];

export const StoreBuilder: React.FC = () => {
  // View State: 'list' (All Stores) or 'manage' (Single Store Details)
  const [view, setView] = useState<'list' | 'manage'>('list');
  const [activeStore, setActiveStore] = useState<StoreSummary | null>(null);
  
  // Manage View State
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'builder'>('products');
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState('');

  // Store List State
  const [stores, setStores] = useState<StoreSummary[]>(MOCK_STORES_LIST);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newStoreName, setNewStoreName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const usedSlots = stores.length;
  const availableSlots = MAX_STORES - usedSlots;

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleCreateStore = async () => {
      if (!newStoreName || usedSlots >= MAX_STORES) return;
      setIsCreating(true);
      // Simulate API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newStore: StoreSummary = {
          id: Date.now().toString(),
          name: newStoreName,
          url: `${newStoreName.toLowerCase().replace(/\s/g, '-')}.nexus.shop`,
          status: 'Draft',
          revenue: 0,
          orders: 0,
          visitors: 0,
          image: `https://picsum.photos/50?random=${Date.now()}`
      };

      setStores([...stores, newStore]);
      setIsCreating(false);
      setIsCreateModalOpen(false);
      setNewStoreName('');
  };

  const handleManageStore = (store: StoreSummary) => {
      setActiveStore(store);
      setView('manage');
      setActiveTab('products'); // Reset tab
  };

  const StatBadge = ({ icon: Icon, label, value }: any) => (
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
              <Icon size={24} />
          </div>
          <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">{label}</p>
              <h4 className="text-2xl font-bold text-slate-900">{value}</h4>
          </div>
      </div>
  );

  // --- VIEW: STORES LIST ---
  if (view === 'list') {
      return (
        <div className="space-y-8 animate-in fade-in duration-500 relative">
            {/* Header with Usage */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                     <div className="flex items-center gap-2 mb-2">
                         <span className="px-2 py-1 bg-teal-50 text-teal-700 text-xs font-bold rounded uppercase tracking-wider">Commerce Suite</span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Store Builder</h1>
                    <p className="text-slate-500">Create and manage your e-commerce storefronts.</p>
                </div>
                
                <div className="flex items-center gap-6">
                     <div className="hidden md:flex flex-col items-end">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Plan Usage</span>
                        <div className="flex items-center gap-2">
                            <span className={`text-sm font-bold ${availableSlots === 0 ? 'text-amber-600' : 'text-slate-700'}`}>
                                {usedSlots} / {MAX_STORES} Stores
                            </span>
                            <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full rounded-full transition-all duration-500 ${availableSlots === 0 ? 'bg-amber-500' : 'bg-indigo-600'}`} 
                                    style={{ width: `${(usedSlots / MAX_STORES) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                     </div>
                     <button 
                        onClick={() => setIsCreateModalOpen(true)}
                        disabled={usedSlots >= MAX_STORES}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                        <Plus size={20} /> Create New Store
                     </button>
                </div>
            </div>

            {/* Stores List Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Store Name</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Revenue</th>
                            <th className="px-6 py-4 text-right">Orders</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {stores.map((store) => (
                            <tr key={store.id} className="hover:bg-slate-50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                                            {store.image ? <img src={store.image} className="w-full h-full object-cover rounded-xl" alt="Store" /> : <Store size={20} />}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900">{store.name}</h3>
                                            <a href="#" className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
                                                {store.url} <ExternalLink size={10} />
                                            </a>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1.5">
                                        {store.status === 'Active' ? <CheckCircle size={16} className="text-green-500" /> : <AlertCircle size={16} className="text-slate-400" />}
                                        <span className={`text-sm font-bold ${store.status === 'Active' ? 'text-green-700' : 'text-slate-600'}`}>
                                            {store.status}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right font-bold text-slate-900">${store.revenue.toLocaleString()}</td>
                                <td className="px-6 py-4 text-right text-slate-600 font-medium">{store.orders}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                            <BarChart3 size={18} />
                                        </button>
                                        <button 
                                            onClick={() => handleManageStore(store)}
                                            className="px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 shadow-md transition-all"
                                        >
                                            Manage
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Create Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-900">Create New Store</h3>
                            <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Store Name</label>
                                <input 
                                    type="text" 
                                    value={newStoreName}
                                    onChange={(e) => setNewStoreName(e.target.value)}
                                    placeholder="e.g. My Awesome Brand"
                                    className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    autoFocus
                                />
                            </div>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start gap-3">
                                <DollarSign size={20} className="text-slate-400 mt-0.5" />
                                <div className="text-sm">
                                    <p className="font-bold text-slate-700">Additional Cost</p>
                                    <p className="text-slate-500">Creating this store will add $15/mo to your next billing cycle.</p>
                                </div>
                            </div>
                            <button 
                                onClick={handleCreateStore}
                                disabled={!newStoreName || isCreating}
                                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                            >
                                {isCreating && <Loader2 size={18} className="animate-spin" />}
                                {isCreating ? 'Creating...' : 'Launch Store'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
      );
  }

  // --- VIEW: SINGLE STORE MANAGEMENT ---
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Detail Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6">
         <div className="flex items-center gap-4">
             <button 
                onClick={() => setView('list')}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
             >
                 <ChevronLeft size={24} />
             </button>
             <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                 {activeStore?.image ? <img src={activeStore.image} className="w-full h-full object-cover" /> : <Store size={24} />}
             </div>
             <div>
                 <h1 className="text-2xl font-bold text-slate-900">{activeStore?.name}</h1>
                 <div className="flex items-center gap-2 text-sm text-slate-500">
                     <Globe size={14} /> {activeStore?.url}
                     <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${activeStore?.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                         {activeStore?.status}
                     </span>
                 </div>
             </div>
         </div>
         
         <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm overflow-x-auto max-w-full">
            {[
                { id: 'builder', label: 'Builder', icon: Edit2 },
                { id: 'products', label: 'Products', icon: Package },
                { id: 'orders', label: 'Orders', icon: ShoppingBag },
            ].map((tab) => (
                <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                        activeTab === tab.id 
                        ? 'bg-indigo-600 text-white shadow-md' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                >
                    <tab.icon size={16} />
                    {tab.label}
                </button>
            ))}
        </div>
      </div>

      {activeTab === 'products' && (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatBadge icon={DollarSign} label="Total Revenue" value={`$${activeStore?.revenue.toLocaleString()}`} />
                <StatBadge icon={ShoppingBag} label="Total Orders" value={activeStore?.orders} />
                <StatBadge icon={Package} label="Low Stock" value="3 Items" />
             </div>

             <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search products..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-lg shadow-indigo-200">
                        <Plus size={18} />
                        Add Product
                    </button>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Product</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4">Stock</th>
                                <th className="px-6 py-4">Sales</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover bg-slate-100 border border-slate-200" />
                                            <span className="font-bold text-slate-900">{product.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 text-sm font-medium">{product.category}</td>
                                    <td className="px-6 py-4 font-bold text-slate-900">${product.price.toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${product.stock < 20 ? 'bg-amber-500' : 'bg-green-500'}`}></div>
                                            <span className={`text-sm font-medium ${product.stock < 20 ? 'text-amber-600' : 'text-slate-600'}`}>
                                                {product.stock} in stock
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 font-medium">{product.sales}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                                <Edit2 size={16} />
                                            </button>
                                            <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
         </div>
      )}

      {activeTab === 'orders' && (
           <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-right duration-300">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Order ID</th>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Total</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {MOCK_ORDERS.map((order) => (
                            <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-bold text-indigo-600">{order.id}</td>
                                <td className="px-6 py-4 text-slate-900 font-medium">{order.customer}</td>
                                <td className="px-6 py-4 text-slate-500 text-sm">{order.date}</td>
                                <td className="px-6 py-4 font-bold text-slate-900">${order.total.toFixed(2)}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                                        order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                        order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                                        'bg-amber-100 text-amber-700'
                                    }`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
           </div>
      )}

      {activeTab === 'builder' && (
           <div className="text-center py-24 bg-white rounded-2xl border border-slate-200 animate-in slide-in-from-right duration-300">
               <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                   <Edit2 size={32} />
               </div>
               <h3 className="text-lg font-bold text-slate-900 mb-2">Visual Store Builder</h3>
               <p className="text-slate-500 mb-6">Drag and drop components to build your storefront for <span className="text-indigo-600 font-bold">{activeStore?.name}</span>.</p>
               <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg">Launch Editor</button>
           </div>
      )}
    </div>
  );
};