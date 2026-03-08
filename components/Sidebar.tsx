
import React, { useState } from 'react';
import {
  LayoutDashboard,
  Sparkles,
  BarChart3,
  Calendar,
  PenTool,
  IdCard,
  ShoppingBag,
  Users,
  Settings,
  Share2,
  Bell,
  Rocket,
  Image,
  Shield,
  CreditCard,
  FileText,
  LineChart,
  PieChart,
  Building2,
  LifeBuoy,
  Globe,
  Database,
  Server,
  Activity,
  Ticket,
  LogOut,
  ChevronUp,
  UserCircle
} from 'lucide-react';
import { UserRole, NavGroup, NavItem } from '../types';

interface SidebarProps {
  currentRole: UserRole;
  currentPath: string;
  onNavigate: (path: string) => void;
  onLogout: () => void;
}

const USER_NAV_GROUPS: NavGroup[] = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, path: '/', allowedRoles: Object.values(UserRole) },
      { label: 'Workspaces', icon: Building2, path: '/workspaces', allowedRoles: Object.values(UserRole) },
    ]
  },
  {
    title: 'AI Studio',
    items: [
      { label: 'AI Tools', icon: Sparkles, path: '/ai', allowedRoles: [UserRole.OWNER, UserRole.ADMIN, UserRole.MEMBER, UserRole.DESIGNER] },
    ]
  },
  {
    title: 'Content Lab',
    items: [
      { label: 'Planner', icon: Calendar, path: '/scheduler', allowedRoles: [UserRole.OWNER, UserRole.ADMIN, UserRole.MEMBER] },
      { label: 'Posts', icon: FileText, path: '/posts', allowedRoles: [UserRole.OWNER, UserRole.ADMIN, UserRole.MEMBER, UserRole.DESIGNER] },
      { label: 'Design Requests', icon: PenTool, path: '/design', allowedRoles: [UserRole.OWNER, UserRole.ADMIN, UserRole.MEMBER, UserRole.DESIGNER, UserRole.CLIENT] },
    ]
  },
  {
    title: 'Channels',
    items: [
      { label: 'Social Profiles', icon: Share2, path: '/social-profiles', allowedRoles: [UserRole.OWNER, UserRole.ADMIN] },
    ]
  },
  {
    title: 'Analytics Hub',
    items: [
      { label: 'Social Analytics', icon: BarChart3, path: '/analytics', allowedRoles: [UserRole.OWNER, UserRole.ADMIN, UserRole.CLIENT] },
      { label: 'Store Analytics', icon: LineChart, path: '/store-analytics', allowedRoles: [UserRole.OWNER, UserRole.ADMIN] },
      { label: 'SVC Analytics', icon: PieChart, path: '/svc-analytics', allowedRoles: [UserRole.OWNER, UserRole.ADMIN, UserRole.MEMBER] },
    ]
  },
  {
    title: 'Commerce Suite',
    items: [
      { label: 'Store Builder', icon: ShoppingBag, path: '/store', allowedRoles: [UserRole.OWNER, UserRole.ADMIN] },
    ]
  },
  {
    title: 'Identity Kit',
    items: [
      { label: 'SVC Builder', icon: IdCard, path: '/svc', allowedRoles: [UserRole.OWNER, UserRole.ADMIN, UserRole.MEMBER] },
    ]
  },
  {
    title: 'Campaigns',
    items: [
      { label: 'Ads Campaigns', icon: Rocket, path: '/campaigns', allowedRoles: [UserRole.OWNER, UserRole.ADMIN, UserRole.MEMBER] },
    ]
  },
  {
    title: 'Workspace',
    items: [
      { label: 'Members', icon: Users, path: '/team', allowedRoles: [UserRole.OWNER, UserRole.ADMIN] },
      { label: 'Roles', icon: Shield, path: '/roles', allowedRoles: [UserRole.OWNER, UserRole.ADMIN] },
      { label: 'Settings', icon: Settings, path: '/settings', allowedRoles: [UserRole.OWNER, UserRole.ADMIN] },
      { label: 'Billing & Plans', icon: CreditCard, path: '/billing', allowedRoles: [UserRole.OWNER, UserRole.ADMIN] },
      { label: 'My Profile', icon: UserCircle, path: '/profile', allowedRoles: Object.values(UserRole) },
    ]
  },
  {
    title: 'Support',
    items: [
      { label: 'Customer Support', icon: LifeBuoy, path: '/support', allowedRoles: Object.values(UserRole) },
    ]
  },
];

// Distinct Navigation for Super Admin
const ADMIN_NAV_GROUPS: NavGroup[] = [
  {
    title: 'HQ Command',
    items: [
      { label: 'Global Dashboard', icon: Activity, path: '/admin', allowedRoles: [UserRole.SUPER_ADMIN] },
      { label: 'Revenue Analytics', icon: LineChart, path: '/admin/revenue', allowedRoles: [UserRole.SUPER_ADMIN] },
    ]
  },
  {
    title: 'Management',
    items: [
      { label: 'Tenants & Users', icon: Building2, path: '/admin/users', allowedRoles: [UserRole.SUPER_ADMIN] },
      { label: 'Plans & Billing', icon: CreditCard, path: '/admin/plans', allowedRoles: [UserRole.SUPER_ADMIN] },
      { label: 'Support Desk', icon: Ticket, path: '/admin/support', allowedRoles: [UserRole.SUPER_ADMIN] },
    ]
  },
  {
    title: 'Platform Intelligence',
    items: [
      { label: 'Social Stats', icon: Share2, path: '/admin/social-stats', allowedRoles: [UserRole.SUPER_ADMIN] },
      { label: 'Store Stats', icon: ShoppingBag, path: '/admin/store-stats', allowedRoles: [UserRole.SUPER_ADMIN] },
    ]
  },
  {
    title: 'System',
    items: [
      { label: 'System Logs', icon: Database, path: '/admin/logs', allowedRoles: [UserRole.SUPER_ADMIN] },
      { label: 'Settings', icon: Settings, path: '/admin/settings', allowedRoles: [UserRole.SUPER_ADMIN] },
    ]
  }
];

import { jwtDecode } from 'jwt-decode';

export const Sidebar: React.FC<SidebarProps> = ({ currentRole, currentPath, onNavigate, onLogout }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const token = localStorage.getItem('socialknoks_token');
  let user: any = null;
  if (token) {
    try { user = jwtDecode(token); } catch (e) { }
  }

  const activeNavGroups = currentRole === UserRole.SUPER_ADMIN ? ADMIN_NAV_GROUPS : USER_NAV_GROUPS;

  const renderItem = (item: NavItem) => {
    // Basic role check, though activeNavGroups handles most of it
    if (item.allowedRoles.length > 0 && !item.allowedRoles.includes(currentRole) && !item.allowedRoles.includes(UserRole.SUPER_ADMIN)) return null;

    const isActive = currentPath === item.path;
    return (
      <button
        key={item.path}
        onClick={() => onNavigate(item.path)}
        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group mb-1 ${isActive
          ? currentRole === UserRole.SUPER_ADMIN
            ? 'bg-slate-800 text-white shadow-md'
            : 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
      >
        <item.icon size={18} className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
        {item.label}
      </button>
    );
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col h-full sticky top-0 overflow-hidden z-20">
      <div className={`p-6 flex items-center gap-3 border-b border-slate-100 ${currentRole === UserRole.SUPER_ADMIN ? 'bg-slate-50' : ''}`}>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg ${currentRole === UserRole.SUPER_ADMIN ? 'bg-slate-900 shadow-slate-300' : 'bg-indigo-600 shadow-indigo-200'}`}>
          {currentRole === UserRole.SUPER_ADMIN ? 'H' : 'C'}
        </div>
        <div>
          <span className="text-xl font-bold text-slate-800 tracking-tight block leading-none">
            {currentRole === UserRole.SUPER_ADMIN ? 'HQ Admin' : 'Codexia'}
          </span>
          {currentRole === UserRole.SUPER_ADMIN && <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Super Admin</span>}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-6 scrollbar-hide">
        {activeNavGroups.map((group, idx) => {
          // Verify if we should show the group title (only if it has visible items)
          // For admin, we show all groups in the list
          return (
            <div key={idx}>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">{group.title}</h3>
              <div className="space-y-0.5">
                {group.items.map(renderItem)}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <button
          onClick={() => onNavigate('/notifications')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all mb-2 ${currentPath === '/notifications' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:bg-white'}`}
        >
          <Bell size={18} />
          Notifications
          <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">3</span>
        </button>

        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="w-full flex items-center gap-3 p-2 rounded-lg mt-2 hover:bg-white transition-colors cursor-pointer group"
          >
            {user?.picture ? (
              <img src={user.picture} alt={user.name || "User"} className="w-8 h-8 rounded-full shadow-md object-cover" />
            ) : (
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md ${currentRole === UserRole.SUPER_ADMIN ? 'bg-slate-800' : 'bg-gradient-to-tr from-indigo-500 to-purple-500'}`}>
                {user?.name ? user.name[0].toUpperCase() : user?.email ? user.email[0].toUpperCase() : currentRole === UserRole.SUPER_ADMIN ? 'SA' : currentRole[0]}
              </div>
            )}
            <div className="flex-1 min-w-0 text-left">
              <p className="text-xs font-semibold text-slate-900 truncate">{user?.name || user?.email?.split('@')[0] || "Current User"}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email || currentRole}</p>
            </div>
            <ChevronUp size={14} className={`text-slate-400 transition-transform duration-200 ${userMenuOpen ? '' : 'rotate-180'}`} />
          </button>

          {/* Dropdown Menu */}
          {userMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
                <button
                  onClick={() => { setUserMenuOpen(false); onNavigate('/settings'); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Settings size={15} className="text-slate-400" />
                  Settings
                </button>
                <div className="border-t border-slate-100 my-1" />
                <button
                  onClick={() => { setUserMenuOpen(false); onLogout(); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </aside>
  );
};
