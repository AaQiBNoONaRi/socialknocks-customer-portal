import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Facebook, Loader2, User, AlertCircle } from 'lucide-react';

const API_BASE = 'http://localhost:8000';

interface LoginProps {
  onLogin: (token: string, isNew: boolean) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlError = params.get('error');
    if (urlError === 'AccountPending') {
      setError('Your account is pending approval. Please contact support.');
    } else if (urlError === 'AccountBanned') {
      setError('Your account has been banned.');
    } else if (urlError === 'EmailRequired') {
      setError('Email is required for authentication.');
    } else if (urlError === 'GoogleNotConfigured') {
      setError('Google login is not currently configured for this environment.');
    } else if (urlError === 'FacebookNotConfigured') {
      setError('Facebook login is not currently configured for this environment.');
    } else if (urlError) {
      setError('Authentication failed. Please try again.');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isSignUp) {
        // â”€â”€ REGISTER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        // 1. Create the user account via the admin create-test-admin endpoint
        //    (re-uses the existing backend route that stores email + password_hash)
        const regRes = await fetch(`${API_BASE}/auth/admin/create-test-admin`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name }),
        });

        if (!regRes.ok) {
          const data = await regRes.json().catch(() => ({}));
          // "Admin already exists" is fine â€” just log them in
          if (!data?.message?.includes('already exists')) {
            throw new Error(data?.detail || 'Registration failed. Please try again.');
          }
        }

        // 2. Immediately log in after registration
        const loginRes = await fetch(`${API_BASE}/auth/admin/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (!loginRes.ok) {
          const data = await loginRes.json().catch(() => ({}));
          throw new Error(data?.detail || 'Login after registration failed.');
        }

        const loginData = await loginRes.json();
        localStorage.setItem('sk_agency_token', loginData.token);
        onLogin(loginData.token, true);
      } else {
        // â”€â”€ LOGIN â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        const loginRes = await fetch(`${API_BASE}/auth/admin/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (!loginRes.ok) {
          const data = await loginRes.json().catch(() => ({}));
          throw new Error(data?.detail || 'Invalid email or password.');
        }

        const data = await loginRes.json();
        localStorage.setItem('sk_agency_token', data.token);
        onLogin(data.token, false);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Is the backend running?');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const origin = encodeURIComponent(window.location.origin); // http://localhost:3000
    window.location.href = `${API_BASE}/auth/google/login?origin=${origin}`;
  };

  const handleFacebookLogin = () => {
    const origin = encodeURIComponent(window.location.origin); // http://localhost:3000
    window.location.href = `${API_BASE}/auth/facebook/login?origin=${origin}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">N</div>
            <h1 className="text-2xl font-bold text-slate-900">{isSignUp ? 'Create an Account' : 'Welcome Back'}</h1>
            <p className="text-slate-500 mt-2">
              {isSignUp ? 'Start managing your agency workspace today.' : 'Sign in to access your Nexus workspace.'}
            </p>
          </div>

          {error && (
            <div className="mb-4 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="Jane Smith"
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
                  placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
              {isLoading ? 'Please wait...' : isSignUp ? 'Get Started' : 'Sign In'}
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

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={handleGoogleLogin}
                className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700"
              >
                <div className="w-5 h-5 font-bold text-slate-600">G</div>
                Google
              </button>
              <button
                onClick={handleFacebookLogin}
                className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700"
              >
                <Facebook size={18} className="text-[#1877f2]" />
                Facebook
              </button>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-600">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
              className="text-indigo-600 font-medium hover:text-indigo-500"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
