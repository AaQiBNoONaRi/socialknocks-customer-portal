import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Github, Linkedin, Facebook, Loader2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface LoginProps {
  onLogin: (token?: string, isNew?: boolean) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isSignUp = location.pathname === '/register';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSocialLoading, setIsSocialLoading] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    if (email && password) {
      try {
        if (isSignUp) {
          // ──────────────── REGISTER ──────────────────────────────────────────────
          // 1. Create the user account via the dedicated register endpoint
          const payload: any = { email, password };
          if (name.trim()) payload.name = name.trim();
          
          const regRes = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
          });

          if (!regRes.ok) {
            const data = await regRes.json().catch(() => ({}));
            throw new Error(data?.detail || 'Registration failed. Please try again.');
          }

          const loginData = await regRes.json();
          localStorage.setItem('sk_agency_token', loginData.token);
          localStorage.setItem('socialknoks_token', loginData.token);
          if (loginData.role) localStorage.setItem('socialknoks_role', loginData.role);
          onLogin(loginData.token, true);

        } else {
          // ──────────────── LOGIN ───────────────────────────────────────────────────
          const loginRes = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({ email, password }),
          });

          if (!loginRes.ok) {
            const data = await loginRes.json().catch(() => ({}));
            throw new Error(data?.detail || 'Invalid email or password.');
          }

          const data = await loginRes.json();
          if (data.token) {
            localStorage.setItem('sk_agency_token', data.token);
            localStorage.setItem('socialknoks_token', data.token);
            if (data.role) localStorage.setItem('socialknoks_role', data.role);
            onLogin(data.token, false);
          } else {
            throw new Error("Missing token from server response.");
          }
        }
      } catch (err: any) {
        console.error("Login request failed:", err);
        setErrorMsg(err.message || "Failed to connect to the server.");
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    setIsSocialLoading(provider);
    const origin = encodeURIComponent(window.location.origin); // http://localhost:3000
    
    if (provider === 'google') {
      window.location.href = `${API_BASE}/auth/google/login?origin=${origin}`;
    } else if (provider === 'facebook') {
      window.location.href = `${API_BASE}/auth/facebook/login?origin=${origin}`;
    } else {
      // Simulate OAuth delay/process for others (like linkedin)
      setTimeout(() => {
        setIsSocialLoading(null);
        onLogin();
      }, 800);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">C</div>
            <h1 className="text-2xl font-bold text-slate-900">{isSignUp ? 'Create an Account' : 'Welcome Back'}</h1>
            <p className="text-slate-500 mt-2">
              {isSignUp ? 'Start managing your agency workspace today.' : 'Sign in to access your Codexia workspace.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center">
                {errorMsg}
              </div>
            )}
            
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 font-bold flex items-center justify-center">@</div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="John Doe"
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="name@company.com"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  {isSignUp ? 'Get Started' : 'Sign In'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <button
                onClick={() => handleSocialLogin('google')}
                disabled={!!isSocialLoading || isLoading}
                className="flex items-center justify-center py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                {isSocialLoading === 'google' ? <Loader2 size={20} className="animate-spin text-slate-600" /> : <div className="w-5 h-5 text-slate-600 font-bold">G</div>}
              </button>
              <button
                onClick={() => handleSocialLogin('linkedin')}
                disabled={!!isSocialLoading || isLoading}
                className="flex items-center justify-center py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                {isSocialLoading === 'linkedin' ? <Loader2 size={20} className="animate-spin text-[#0077b5]" /> : <Linkedin size={20} className="text-[#0077b5]" />}
              </button>
              <button
                onClick={() => handleSocialLogin('facebook')}
                disabled={!!isSocialLoading || isLoading}
                className="flex items-center justify-center py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                {isSocialLoading === 'facebook' ? <Loader2 size={20} className="animate-spin text-[#1877f2]" /> : <Facebook size={20} className="text-[#1877f2]" />}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-600">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => navigate(isSignUp ? '/login' : '/register')}
              disabled={isLoading}
              className="text-indigo-600 font-medium hover:text-indigo-500 disabled:opacity-50"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};