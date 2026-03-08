import React from 'react';

type PredisResult = {
  id?: string;
  url?: string;
  [key: string]: any;
};

export default function PredisModal({ open, onClose, result }: { open: boolean; onClose: () => void; result: PredisResult | null; }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-2xl bg-white rounded-xl p-6">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-bold">Predis Export Result</h3>
          <button onClick={onClose} className="text-slate-500">Close</button>
        </div>
        <div className="mt-4">
          {!result && <div className="text-slate-500">No result returned.</div>}
          {result && (
            <div className="space-y-3">
              {result.url && (
                <div>
                  <div className="text-sm text-slate-600">Design URL</div>
                  <a href={result.url} target="_blank" rel="noreferrer" className="text-indigo-600 underline">{result.url}</a>
                </div>
              )}
              {result.id && (
                <div>
                  <div className="text-sm text-slate-600">Design ID</div>
                  <div className="font-mono text-sm text-slate-800">{result.id}</div>
                </div>
              )}
              <div>
                <div className="text-sm text-slate-600">Full Response</div>
                <pre className="bg-slate-100 p-3 rounded text-xs overflow-auto">{JSON.stringify(result, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
