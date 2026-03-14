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
import { SocialCallback } from './components/SocialCallback';
import { SuperAdminDashboard } from './components/SuperAdminDashboard';
import { AcceptInvite } from './components/AcceptInvite';
import { Menu, Search, ChevronDown, X, Building2, PenSquare, Check, Plus, FileText, Shield } from 'lucide-react';

import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Restore session from localStorage on first load
  const existingToken = (() => { try { return localStorage.getItem('sk_agency_token') || localStorage.getItem('socialknoks_token'); } catch { return null; } })();

  const [authState, setAuthState] = useState<'loading' | 'login' | 'onboarding' | 'app'>(() => {
    if (location.pathname === '/auth-callback') return 'loading'; 
    if (!existingToken || existingToken === 'null' || existingToken === 'undefined') {
      return 'login';
    }
    if (localStorage.getItem('socialknoks_onboarding_pending') === 'true') {
      return 'onboarding';
    }
    return 'loading'; // Will verify token
  });
  
  const [currentRole, setCurrentRole] = useState<UserRole>(UserRole.OWNER);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showTourOverlay, setShowTourOverlay] = useState(false);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace>({
    id: '', name: 'Loading...', plan: '', initials: '...', color: 'bg-slate-100 text-slate-600'
  });

  // UI States
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [rolesConfig, setRolesConfig] = useState<any[]>([]);

  // TODO: Replace with your actual module access logic using rolesConfig
  const hasModuleAccess = (moduleName: string) => {
    return true; 
  };

  const handlePostSuccess = () => {
    setRefreshKey(prev => prev + 1);
    setEditingPost(null);
  };

  const handleEdit = (post: any) => {
    setEditingPost(post);
    setIsComposeOpen(true);
  };

  const onNavigate = (path: string) => {
    navigate(path);
  };

  // On mount: if token saved, ask backend whether onboarding was completed
  useEffect(() => {
    if (location.pathname === '/auth-callback' || location.pathname === '/social-callback' || location.pathname === '/accept-invite') {
      return;
    }

    if (authState === 'login' || authState === 'onboarding') return;

    if (authState !== 'loading') return;
    const token = localStorage.getItem('sk_agency_token') || localStorage.getItem('socialknoks_token');
    if (!token) { setAuthState('login'); return; }

    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/onboarding/status`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        setAuthState(data.onboarding_completed ? 'app' : 'onboarding');
      })
      .catch(() => {
        localStorage.removeItem('sk_agency_token');
        localStorage.removeItem('socialknoks_token');
        setAuthState('login');
      });
  }, [authState, location.pathname]);

  // Sync authState with URL
  useEffect(() => {
    if (location.pathname === '/auth-callback' || location.pathname === '/social-callback' || location.pathname === '/accept-invite') return;

    const showLogin = location.pathname === '/login' || location.pathname === '/register';

    if (authState === 'login' && !showLogin) {
      navigate('/login');
    } else if (authState === 'onboarding' && !location.pathname.startsWith('/onboarding')) {
      navigate('/onboarding');
    } else if (authState === 'app' && showLogin) {
      navigate('/');
    }
  }, [authState, location.pathname, navigate]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  // Fetch user workspaces when entering the app
  useEffect(() => {
    if (authState === 'app') {
      const token = localStorage.getItem('sk_agency_token') || localStorage.getItem('socialknoks_token');
      if (token) {
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/workspaces/my`, {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then(res => res.json())
          .then(data => {
            if (data.workspaces && data.workspaces.length > 0) {
              setWorkspaces(data.workspaces);
              
              const mapRole = (roleStr?: string): UserRole => {
                if (!roleStr) return UserRole.OWNER;
                const normalized = roleStr.toLowerCase();
                if (normalized === 'admin') return UserRole.ADMIN;
                if (normalized === 'designer') return UserRole.DESIGNER;
                if (normalized === 'member') return UserRole.MEMBER;
                if (normalized === 'client') return UserRole.CLIENT;
                if (normalized === 'guest') return UserRole.GUEST;
                return UserRole.OWNER;
              };

              const firstWs = data.workspaces[0];
              setCurrentWorkspace(firstWs);
              
              if (currentRole !== UserRole.SUPER_ADMIN) {
                 setCurrentRole(mapRole(firstWs.my_role));
              }
            }
          })
          .catch(err => console.error("Failed to fetch workspaces:", err));
      }
    }
  }, [authState]);


  // Update role dynamically when switching workspaces
  useEffect(() => {
    if (currentWorkspace && currentWorkspace.my_role && currentRole !== UserRole.SUPER_ADMIN) {
       const mapRole = (roleStr: string): UserRole => {
          const normalized = roleStr.toLowerCase();
          if (normalized === 'admin') return UserRole.ADMIN;
          if (normalized === 'designer') return UserRole.DESIGNER;
          if (normalized === 'member') return UserRole.MEMBER;
          if (normalized === 'client') return UserRole.CLIENT;
          if (normalized === 'guest') return UserRole.GUEST;
          return UserRole.OWNER;
       };
       setCurrentRole(mapRole(currentWorkspace.my_role as string));
    }
  }, [currentWorkspace]);

  const handleLogin = (token?: string, isNew?: boolean) => {
    if (isNew) {
      setAuthState('onboarding');
      navigate('/onboarding');
    } else {
      setAuthState('loading');
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('sk_agency_token');
      localStorage.removeItem('socialknoks_token');
    } catch { }
    setAuthState('login');
    navigate('/login');
  };

  const handleOnboardingComplete = () => {
    localStorage.removeItem('socialknoks_onboarding_pending');
    setAuthState('app');
    setShowTourOverlay(true);
    navigate('/');
  };

  if (authState === 'loading' && (location.pathname !== '/auth-callback' && location.pathname !== '/social-callback' && location.pathname !== '/accept-invite')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl animate-pulse">C</div>
          <p className="text-slate-500 text-sm">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/auth-callback" element={<AuthCallback />} />
      <Route path="/social-callback" element={<SocialCallback />} />
      <Route path="/accept-invite" element={<AcceptInvite />} />
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route path="/register" element={<Login onLogin={handleLogin} />} />
      <Route path="/onboarding" element={<Onboarding onComplete={handleOnboardingComplete} />} />
      
      {/* App Shell Routes */}
      <Route path="*" element={
        authState === 'app' ? (
          <div className="flex h-screen bg-slate-50 relative">
            {isComposeOpen && (
              <ComposeModal
                isOpen={isComposeOpen}
                initialPost={editingPost}
                onClose={() => {
                  setIsComposeOpen(false);
                  setEditingPost(null);
                }}
                workspaceId={currentWorkspace.id}
                onSuccess={handlePostSuccess}
              />
            )}

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

            {isSidebarOpen && (
              <div
                className="fixed inset-0 bg-black/20 z-40 md:hidden"
                onClick={() => setIsSidebarOpen(false)}
              />
            )}

            <div className={`fixed inset-y-0 left-0 z-50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-200 ease-in-out`}>
              <Sidebar currentRole={currentRole} currentPath={location.pathname} onNavigate={onNavigate} onLogout={handleLogout} hasModuleAccess={hasModuleAccess} currentWorkspace={currentWorkspace} />
            </div>

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
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
                  {currentRole !== UserRole.SUPER_ADMIN && (
                    <button
                      onClick={() => setIsComposeOpen(true)}
                      className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all hover:scale-105 active:scale-95"
                    >
                      <PenSquare size={16} />
                      <span className="hidden sm:inline">Compose</span>
                    </button>
                  )}

                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700 px-2 py-1.5 rounded-lg">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm ${currentRole === UserRole.SUPER_ADMIN ? 'bg-slate-800' : 'bg-gradient-to-tr from-indigo-500 to-purple-500'}`}>
                      {currentRole === UserRole.SUPER_ADMIN ? 'SA' : currentRole[0]}
                    </div>
                    <span className="hidden md:inline">{currentRole}</span>
                  </div>
                </div>
              </header>

              <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
                <div className="max-w-7xl mx-auto">
                   <Routes>
                      {/* Dashboard / Root */}
                      <Route path="/" element={
                        currentRole === UserRole.SUPER_ADMIN 
                        ? <SuperAdminDashboard /> 
                        : (hasModuleAccess('Dashboard') ? <Dashboard onNavigate={onNavigate} onCompose={() => setIsComposeOpen(true)} /> : <div className="p-8 text-center text-slate-500 font-bold">Access Denied</div>)
                      } />

                      {/* Super Admin Specific */}
                      <Route path="/admin" element={<SuperAdminDashboard />} />

                      {/* App Routes */}
                      <Route path="/workspaces" element={<Workspaces workspaces={workspaces} currentWorkspaceId={currentWorkspace.id} onSwitchWorkspace={setCurrentWorkspace} onNavigate={onNavigate} />} />
                      <Route path="/ai" element={hasModuleAccess('AI Studio') ? <AIAssistant /> : <div className="p-8 text-center text-slate-500 font-bold">Access Denied</div>} />
                      <Route path="/store" element={hasModuleAccess('Store') ? <StoreBuilder /> : <div className="p-8 text-center text-slate-500 font-bold">Access Denied</div>} />
                      <Route path="/svc" element={<SVCBuilder />} />
                      <Route path="/campaigns" element={<Campaigns />} />
                      <Route path="/analytics" element={hasModuleAccess('Analytics') ? <Analytics currentWorkspace={currentWorkspace} /> : <div className="p-8 text-center text-slate-500 font-bold">Access Denied</div>} />
                      <Route path="/store-analytics" element={hasModuleAccess('Analytics') ? <StoreAnalytics /> : <div className="p-8 text-center text-slate-500 font-bold">Access Denied</div>} />
                      <Route path="/svc-analytics" element={hasModuleAccess('Analytics') ? <SVCAnalytics /> : <div className="p-8 text-center text-slate-500 font-bold">Access Denied</div>} />
                      <Route path="/social-profiles" element={<SocialProfiles currentWorkspace={currentWorkspace} />} />
                      <Route path="/scheduler" element={hasModuleAccess('Content Lab') ? <Scheduler onCompose={() => setIsComposeOpen(true)} workspaceId={currentWorkspace.id} /> : <div className="p-8 text-center text-slate-500 font-bold">Access Denied</div>} />
                      <Route path="/posts" element={hasModuleAccess('Content Lab') ? <Posts onCompose={() => setIsComposeOpen(true)} onEdit={handleEdit} workspaceId={currentWorkspace.id} refreshKey={refreshKey} /> : <div className="p-8 text-center text-slate-500 font-bold">Access Denied</div>} />
                      <Route path="/design" element={
                        (currentRole === UserRole.SUPER_ADMIN || currentRole === UserRole.OWNER || currentRole === UserRole.DESIGNER)
                        ? (hasModuleAccess('Content Lab') ? <DesignRequests workspaceId={currentWorkspace.id} /> : <div className="p-8 text-center text-slate-500 font-bold">Access Denied</div>)
                        : (
                          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                            <Shield size={48} className="text-slate-300 mb-4" />
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">Access Denied</h2>
                            <p className="text-slate-500 max-w-md">Only Workspace Owners and Designers can access the Design Requests portal.</p>
                          </div>
                        )
                      } />
                      <Route path="/team" element={hasModuleAccess('Settings') ? <Team currentWorkspace={currentWorkspace} /> : <div className="p-8 text-center text-slate-500 font-bold">Access Denied</div>} />
                      <Route path="/roles" element={hasModuleAccess('Settings') ? <RolesPermissions currentWorkspace={currentWorkspace} /> : <div className="p-8 text-center text-slate-500 font-bold">Access Denied</div>} />
                      <Route path="/settings" element={hasModuleAccess('Settings') ? <Settings currentWorkspace={currentWorkspace} /> : <div className="p-8 text-center text-slate-500 font-bold">Access Denied</div>} />
                      <Route path="/billing" element={hasModuleAccess('Settings') ? <Billing /> : <div className="p-8 text-center text-slate-500 font-bold">Access Denied</div>} />
                      <Route path="/notifications" element={<Notifications />} />
                      <Route path="/support" element={<CustomerSupport />} />
                      <Route path="/profile" element={<ProfileSettings />} />
                   </Routes>
                </div>
              </main>
            </div>
          </div>
        ) : (
          <Navigate to="/login" replace />
        )
      } />
    </Routes>
  );
};

export default App;