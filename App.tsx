
import React, { useState, useEffect } from 'react';
import { UserRole, Workspace } from './types';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { AIAssistant } from './components/AIAssistant';
import { StoreBuilder } from './components/StoreBuilder';
import { SVCBuilder } from './components/SVCBuilder';
import { Campaigns } from './components/Campaigns';
import { Analytics } from './components/Analytics';
import { StoreAnalytics } from './components/StoreAnalytics';
import { SVCAnalytics } from './components/SVCAnalytics';
import { Scheduler } from './components/Scheduler';
import { DesignRequests } from './components/DesignRequests';
import { Posts } from './components/Posts';
import { Team } from './components/Team';
import { RolesPermissions } from './components/RolesPermissions';
import { SocialProfiles } from './components/SocialProfiles';
import { Clients } from './components/Clients';
import { Settings } from './components/Settings';
import { Billing } from './components/Billing';
import { Notifications } from './components/Notifications';
import { Workspaces } from './components/Workspaces';
import { Login } from './components/Login';
import { Onboarding } from './components/Onboarding';
import { ComposeModal } from './components/ComposeModal';
import { CustomerSupport } from './components/CustomerSupport';
import { AuthCallback } from './components/AuthCallback';
import { ProfileSettings } from './components/ProfileSettings';
import { SuperAdminDashboard } from './components/SuperAdminDashboard';
import { Menu, Search, ChevronDown, X, Building2, PenSquare, Check, Plus, FileText, Shield } from 'lucide-react';

// Mock simple router
const Router = ({
  path,
  role,
  onNavigate,
  onCompose,
  currentWorkspace,
  onSwitchWorkspace,
  workspaces
}: {
  path: string,
  role: UserRole,
  onNavigate: (path: string) => void,
  onCompose: () => void,
  currentWorkspace: Workspace,
  onSwitchWorkspace: (ws: Workspace) => void,
  workspaces: Workspace[]
}) => {
  // Super Admin Routes
  if (role === UserRole.SUPER_ADMIN) {
    if (path === '/admin' || path === '/') return <SuperAdminDashboard />;
    // For now, redirect other admin paths to dashboard or show placeholders
    if (path.startsWith('/admin/')) return <SuperAdminDashboard />;
  }

  // Standard User Routes
  switch (path) {
    case '/': return <Dashboard onNavigate={onNavigate} onCompose={onCompose} />;
    case '/workspaces': return <Workspaces workspaces={workspaces} currentWorkspaceId={currentWorkspace.id} onSwitchWorkspace={onSwitchWorkspace} onNavigate={onNavigate} />;
    case '/ai': return <AIAssistant />;
    case '/store': return <StoreBuilder />;
    case '/svc': return <SVCBuilder />;
    case '/campaigns': return <Campaigns />;
    case '/analytics': return <Analytics />;
    case '/store-analytics': return <StoreAnalytics />;
    case '/svc-analytics': return <SVCAnalytics />;
    case '/scheduler': return <Scheduler onCompose={onCompose} />;
    case '/posts': return <Posts onCompose={onCompose} />;
    case '/design': return <DesignRequests />;
    case '/team': return <Team />;
    case '/roles': return <RolesPermissions />;
    case '/social-profiles': return <SocialProfiles />;
    case '/clients': return <Clients />;
    case '/settings': return <Settings currentWorkspace={currentWorkspace} />;
    case '/billing': return <Billing />;
    case '/notifications': return <Notifications />;
    case '/support': return <CustomerSupport />;
    case '/profile': return <ProfileSettings />;
    // Fallback for admin user navigating to regular pages
    default: return <Dashboard onNavigate={onNavigate} onCompose={onCompose} />;
  }
};

const App: React.FC = () => {
  // Restore session from localStorage on first load
  const existingToken = (() => { try { return localStorage.getItem('sk_agency_token') || localStorage.getItem('socialknoks_token'); } catch { return null; } })();

  const [authState, setAuthState] = useState<'loading' | 'login' | 'onboarding' | 'app'>(() => {
    if (window.location.pathname === '/auth-callback') return 'loading'; // Will be handled shortly
    if (!existingToken || existingToken === 'null' || existingToken === 'undefined') {
      return 'login';
    }
    if (localStorage.getItem('socialknoks_onboarding_pending') === 'true') {
      return 'onboarding';
    }
    return 'loading'; // Will verify token
  });
  const [currentRole, setCurrentRole] = useState<UserRole>(UserRole.OWNER);
  const [currentPath, setCurrentPath] = useState('/');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showTourOverlay, setShowTourOverlay] = useState(false);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace>({
    id: '', name: 'Loading...', plan: '', initials: '...', color: 'bg-slate-100 text-slate-600'
  });

  // UI States
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const [isRoleOpen, setIsRoleOpen] = useState(false);

  // On mount: if token saved, ask backend whether onboarding was completed
  useEffect(() => {
    if (window.location.pathname === '/auth-callback') {
      // Handled below
      return;
    }

    // Skip loading check if we already decided it's login or onboarding based on local storage
    if (authState === 'login' || authState === 'onboarding') return;

    if (authState !== 'loading') return;
    const token = localStorage.getItem('sk_agency_token') || localStorage.getItem('socialknoks_token');
    if (!token) { setAuthState('login'); return; }

    fetch('http://localhost:8000/api/onboarding/status', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => setAuthState(data.onboarding_completed ? 'app' : 'onboarding'))
      .catch(() => {
        // Token invalid or network error — send back to login
        localStorage.removeItem('sk_agency_token');
        localStorage.removeItem('socialknoks_token');
        setAuthState('login');
      });
  }, [authState]);
  // Close mobile sidebar on route change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [currentPath]);

  // Fetch user workspaces when entering the app
  useEffect(() => {
    if (authState === 'app') {
      const token = localStorage.getItem('sk_agency_token') || localStorage.getItem('socialknoks_token');
      if (token) {
        fetch('http://localhost:8000/api/workspaces/my', {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then(res => res.json())
          .then(data => {
            if (data.workspaces && data.workspaces.length > 0) {
              setWorkspaces(data.workspaces);
              setCurrentWorkspace(data.workspaces[0]);
            }
          })
          .catch(err => console.error("Failed to fetch workspaces:", err));
      }
    }
  }, [authState]);
  const handleRoleChange = (newRole: UserRole) => {
    setCurrentRole(newRole);
    setIsRoleOpen(false);
    if (newRole === UserRole.SUPER_ADMIN) {
      setCurrentPath('/admin');
    } else {
      setCurrentPath('/');
    }
  };

  const handleLogin = (token?: string, isNew?: boolean) => {
    if (isNew) {
      // Brand new registration → always show onboarding
      setAuthState('onboarding');
    } else {
      // Returning login → check if they already completed onboarding
      setAuthState('loading');
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('sk_agency_token');
      localStorage.removeItem('socialknoks_token');
    } catch { }
    setAuthState('login');
  };

  const handleOnboardingComplete = () => {
    localStorage.removeItem('socialknoks_onboarding_pending');
    setAuthState('app');
    setShowTourOverlay(true);
  };

  // Check for auth callback path first
  if (window.location.pathname === '/auth-callback') {
    return <AuthCallback />;
  }

  if (authState === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl animate-pulse">C</div>
          <p className="text-slate-500 text-sm">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  if (authState === 'login') {
    return <Login onLogin={handleLogin} />;
  }


  if (authState === 'onboarding') {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 relative">
      <ComposeModal isOpen={isComposeOpen} onClose={() => setIsComposeOpen(false)} />

      {/* Tour Overlay - Simple highlighting */}
      {showTourOverlay && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full relative shadow-2xl animate-in fade-in zoom-in duration-300">
            <button
              aria-label="Close tour"
              title="Close tour"
              onClick={() => setShowTourOverlay(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome to your Dashboard!</h2>
            <p className="text-slate-600 mb-6">
              This is your command center. Use the sidebar on the left to navigate between your AI tools, campaigns, and store settings.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowTourOverlay(false)}
                className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium"
              >
                Got it, let's work
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Mobile Responsive */}
      <div className={`fixed inset-y-0 left-0 z-50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-200 ease-in-out`}>
        <Sidebar currentRole={currentRole} currentPath={currentPath} onNavigate={setCurrentPath} onLogout={handleLogout} />
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3 md:gap-4">
            <button
              aria-label="Open sidebar"
              title="Open sidebar"
              className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>

            {/* Workspace Selector (Hidden for Super Admin) */}
            {currentRole !== UserRole.SUPER_ADMIN ? (
              <div className="relative">
                <button
                  onClick={() => setIsWorkspaceOpen(!isWorkspaceOpen)}
                  className="flex items-center gap-2 text-slate-700 hover:bg-slate-100 px-3 py-2 rounded-lg transition-colors border border-transparent hover:border-slate-200"
                >
                  <div className={`w-6 h-6 rounded flex items-center justify-center ${currentWorkspace.color}`}>
                    <Building2 size={14} />
                  </div>
                  <div className="text-left hidden sm:block">
                    <span className="block text-sm font-bold leading-none">{currentWorkspace.name}</span>
                    <span className="text-[10px] text-slate-500 font-medium leading-none">{currentWorkspace.plan}</span>
                  </div>
                  <ChevronDown size={14} className={`text-slate-400 transition-transform ${isWorkspaceOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown content */}
                {isWorkspaceOpen && workspaces && workspaces.length > 0 && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsWorkspaceOpen(false)} />
                    <div className="absolute left-0 top-full mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                      <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Switch Workspace</div>
                      {workspaces.map((ws: Workspace) => (
                        <button
                          key={ws.id}
                          onClick={() => {
                            setCurrentWorkspace(ws);
                            setIsWorkspaceOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50 flex items-center gap-3 transition-colors group"
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${ws.color}`}>
                            {ws.initials}
                          </div>
                          <div className="flex-1">
                            <span className={`block font-medium leading-none mb-1 ${currentWorkspace.id === ws.id ? 'text-indigo-600' : 'text-slate-700'}`}>{ws.name}</span>
                            <span className="text-[10px] text-slate-400 font-medium">{ws.plan}</span>
                          </div>
                          {currentWorkspace.id === ws.id && <Check size={14} className="text-indigo-600" />}
                        </button>
                      ))}
                    </div>
                  </>
                )}

              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-900 text-white rounded-lg">
                <Shield size={14} />
                <span className="text-sm font-bold">God Mode</span>
              </div>
            )}

            <div className="h-6 w-px bg-slate-200 hidden md:block"></div>

            {/* Simple Global Search */}
            <div className="hidden lg:flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-lg text-slate-500 w-64 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:bg-white transition-all">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search anything..."
                className="bg-transparent border-none outline-none text-sm w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            {/* Compose Button (Hidden for Super Admin) */}
            {currentRole !== UserRole.SUPER_ADMIN && (
              <button
                onClick={() => setIsComposeOpen(true)}
                className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all hover:scale-105 active:scale-95"
              >
                <PenSquare size={16} />
                <span className="hidden sm:inline">Compose</span>
              </button>
            )}

            {/* Role Switcher for Demo */}
            <div className="relative">
              <button
                onClick={() => setIsRoleOpen(!isRoleOpen)}
                className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:bg-slate-100 px-2 py-1.5 rounded-lg transition-colors"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm ${currentRole === UserRole.SUPER_ADMIN ? 'bg-slate-800' : 'bg-gradient-to-tr from-indigo-500 to-purple-500'}`}>
                  {currentRole === UserRole.SUPER_ADMIN ? 'SA' : currentRole[0]}
                </div>
                <span className="hidden md:inline">{currentRole}</span>
                <ChevronDown size={14} className="text-slate-400 hidden md:block" />
              </button>

              {isRoleOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsRoleOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50">
                    <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Switch Role (Demo)</div>
                    {Object.values(UserRole).map((role) => (
                      <button
                        key={role}
                        onClick={() => handleRoleChange(role)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 flex items-center justify-between ${currentRole === role ? 'text-indigo-600 font-bold' : 'text-slate-600'}`}
                      >
                        {role}
                        {currentRole === role && <Check size={14} />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto">
            <Router
              path={currentPath}
              role={currentRole}
              onNavigate={setCurrentPath}
              onCompose={() => setIsComposeOpen(true)}
              currentWorkspace={currentWorkspace}
              onSwitchWorkspace={setCurrentWorkspace}
              workspaces={workspaces}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
