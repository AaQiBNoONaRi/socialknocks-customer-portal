import React, { useEffect } from 'react';

export const AuthCallback: React.FC = () => {
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const isNew = params.get('is_new') === 'true';

        if (token) {
            // Save token to localStorage (or your preferred auth context)
            localStorage.setItem('socialknoks_token', token);
            if (isNew) {
                localStorage.setItem('socialknoks_onboarding_pending', 'true');
            }
            // Redirect to dashboard
            window.location.href = '/';
        } else {
            console.error("No token found in callback URL");
            window.location.href = '/';
        }
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <h2 className="mt-4 text-xl font-medium text-slate-900">Completing login...</h2>
                <p className="mt-2 text-sm text-slate-500">Please wait while we redirect you.</p>
            </div>
        </div>
    );
};
