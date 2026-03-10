import React, { useEffect } from 'react';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

export const SocialCallback: React.FC = () => {
    useEffect(() => {
        // Parse the URL parameters
        const params = new URLSearchParams(window.location.search);
        const data: Record<string, string> = {};
        params.forEach((value, key) => {
            data[key] = value;
        });

        // Send message to the opening window (Onboarding or Settings)
        if (window.opener) {
            window.opener.postMessage(data, window.location.origin);

            // Close the popup after a short delay to show success
            setTimeout(() => {
                window.close();
            }, 1500);
        } else {
            console.error('No opener window found. Cannot send social connect data.');
        }
    }, []);

    const params = new URLSearchParams(window.location.search);
    const success = params.get('success') === 'true';
    const platform = params.get('platform') || 'Social Media';
    const pageName = params.get('page_name');

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="max-w-sm w-full bg-white rounded-3xl shadow-xl p-8 border border-slate-100 text-center animate-in zoom-in duration-300">
                {success ? (
                    <>
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <CheckCircle2 size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Connected!</h2>
                        <p className="text-slate-500 mb-4">
                            Successfully connected to <span className="font-bold text-slate-700 capitalize">{platform}</span>
                            {pageName ? ` (${pageName})` : ''}.
                        </p>
                        <div className="flex items-center justify-center gap-2 text-indigo-600 font-medium text-sm">
                            <Loader2 className="animate-spin" size={16} />
                            <span>Closing window...</span>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <XCircle size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Connection Failed</h2>
                        <p className="text-red-500 mb-6 px-4">
                            {params.get('error') || 'An unknown error occurred during authentication.'}
                        </p>
                        <button
                            onClick={() => window.close()}
                            className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
                        >
                            Close Window
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};
