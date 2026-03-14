const API_BASE = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE || 'http://localhost:8000';

export const createPredisDesign = async (payload: any) => {
  const res = await fetch(`${API_BASE}/ai/predis/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || 'Predis create failed');
  }

  return res.json();
};

export default { createPredisDesign };
