import React, { useState, useEffect, useRef } from 'react';
import {
    LifeBuoy, Plus, Clock, CheckCircle, X, Send,
    FileText, ChevronRight, HelpCircle, Loader2,
    RefreshCw, AlertCircle, ChevronLeft, MessageSquare
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface Ticket {
    id: string;       // full Mongo ID (used for API calls)
    subject: string;
    category: string;
    priority: string;
    status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
    message: string;  // original message
    date: string;
    lastUpdate: string;
}

interface Message {
    sender_name: string;
    sender_role: string;
    message: string;
    internal: boolean;
    created_at: string;
}

const getStatusStyle = (status: string) => {
    switch (status) {
        case 'Open': return 'bg-blue-100 text-blue-700';
        case 'In Progress': return 'bg-amber-100 text-amber-700';
        case 'Resolved': return 'bg-green-100 text-green-700';
        case 'Closed': return 'bg-slate-100 text-slate-700';
        default: return 'bg-slate-100 text-slate-600';
    }
};

const getPriorityStyle = (priority: string) => {
    switch (priority) {
        case 'High': return 'text-red-600 bg-red-50';
        case 'Medium': return 'text-amber-600 bg-amber-50';
        case 'Low': return 'text-green-600 bg-green-50';
        default: return 'text-slate-600 bg-slate-50';
    }
};

export const CustomerSupport: React.FC = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState('');
    const [replyText, setReplyText] = useState('');
    const bottomRef = useRef<HTMLDivElement>(null);

    const [formData, setFormData] = useState({
        subject: '',
        category: 'Technical',
        priority: 'Medium',
        message: ''
    });

    const getToken = () =>
        localStorage.getItem('sk_agency_token') ||
        localStorage.getItem('socialknoks_token') || '';

    const fetchTickets = async () => {
        setIsLoading(true);
        setError('');
        try {
            const res = await fetch(`${API_BASE}/api/tickets`, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            if (res.ok) {
                const data = await res.json();
                setTickets(data.tickets || []);
            } else {
                setError('Failed to load your tickets.');
            }
        } catch {
            setError('Network error. Please check your connection.');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchMessages = async (ticketId: string) => {
        setLoadingMessages(true);
        try {
            const res = await fetch(`${API_BASE}/api/tickets/${ticketId}/messages`, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            if (res.ok) {
                const data = await res.json();
                setMessages(data.messages || []);
            }
        } catch (e) {
            console.error('Failed to fetch messages', e);
        } finally {
            setLoadingMessages(false);
        }
    };

    const handleSelectTicket = (ticket: Ticket) => {
        setSelectedTicket(ticket);
        setReplyText('');
        setMessages([]);
        fetchMessages(ticket.id);
    };

    const handleSendReply = async () => {
        if (!replyText.trim() || !selectedTicket || isSending) return;
        setIsSending(true);
        try {
            const res = await fetch(`${API_BASE}/api/tickets/${selectedTicket.id}/reply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`
                },
                body: JSON.stringify({ message: replyText.trim(), internal: false })
            });
            if (res.ok) {
                const data = await res.json();
                setMessages(prev => [...prev, data.reply]);
                setReplyText('');
                setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
            }
        } catch (e) {
            console.error('Failed to send reply', e);
        } finally {
            setIsSending(false);
        }
    };

    useEffect(() => { fetchTickets(); }, []);

    useEffect(() => {
        if (messages.length > 0) {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleCreateTicket = async () => {
        if (!formData.subject || !formData.message) return;
        setIsSubmitting(true);
        try {
            const res = await fetch(`${API_BASE}/api/tickets`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`
                },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                const data = await res.json();
                setTickets([data.ticket, ...tickets]);
                setIsCreateModalOpen(false);
                setFormData({ subject: '', category: 'Technical', priority: 'Medium', message: '' });
            } else {
                const d = await res.json().catch(() => ({}));
                setError(d?.detail || 'Failed to submit ticket.');
            }
        } catch {
            setError('Network error. Could not submit ticket.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // ── Chat panel view ──────────────────────────────────────────────────────────
    if (selectedTicket) {
        return (
            <div className="flex flex-col h-[calc(100vh-8rem)] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-200">
                {/* Chat header */}
                <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-start gap-3">
                    <button
                        onClick={() => { setSelectedTicket(null); setMessages([]); }}
                        className="mt-0.5 p-2 rounded-xl hover:bg-slate-200 text-slate-500 transition-colors shrink-0"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="text-xs font-mono text-slate-400">#{selectedTicket.id.slice(-6)}</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${getStatusStyle(selectedTicket.status)}`}>
                                {selectedTicket.status}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${getPriorityStyle(selectedTicket.priority)}`}>
                                {selectedTicket.priority} Priority
                            </span>
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                                <HelpCircle size={11} /> {selectedTicket.category}
                            </span>
                        </div>
                        <h2 className="font-bold text-slate-900 text-base leading-tight line-clamp-1">{selectedTicket.subject}</h2>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-gradient-to-b from-slate-50/60 to-white">
                    {/* Original user message — always shown */}
                    <div className="flex gap-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm shrink-0 mt-1">
                            Y
                        </div>
                        <div className="flex-1 max-w-[560px]">
                            <div className="flex items-baseline gap-2 mb-1.5">
                                <span className="text-sm font-bold text-slate-900">You</span>
                                <span className="text-xs text-slate-400">{selectedTicket.date}</span>
                            </div>
                            <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none shadow-sm text-sm text-slate-700 leading-relaxed">
                                {selectedTicket.message}
                            </div>
                        </div>
                    </div>

                    {/* Divider if there are replies */}
                    {(loadingMessages || messages.length > 0) && (
                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-px bg-slate-200" />
                            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">Conversation</span>
                            <div className="flex-1 h-px bg-slate-200" />
                        </div>
                    )}

                    {/* Loading messages */}
                    {loadingMessages ? (
                        <div className="flex items-center justify-center py-4 text-slate-400">
                            <Loader2 size={16} className="animate-spin mr-2" /> Loading conversation...
                        </div>
                    ) : (
                        messages.map((msg, i) => {
                            const isAdmin = msg.sender_role === 'super_admin' || msg.sender_role === 'admin';
                            // Skip internal notes — users should not see them
                            if (msg.internal) return null;

                            return isAdmin ? (
                                // Admin reply — right side, indigo
                                <div key={i} className="flex gap-3 flex-row-reverse">
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shrink-0 mt-1">
                                        <LifeBuoy size={16} className="text-white" />
                                    </div>
                                    <div className="flex-1 max-w-[560px] text-right">
                                        <div className="flex items-baseline gap-2 mb-1.5 justify-end">
                                            <span className="text-xs text-slate-400">{msg.created_at}</span>
                                            <span className="text-sm font-bold text-slate-900">Support Team</span>
                                        </div>
                                        <div className="bg-indigo-600 text-white p-4 rounded-2xl rounded-tr-none shadow-sm text-sm leading-relaxed text-left inline-block max-w-full">
                                            {msg.message}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                // User reply — left side
                                <div key={i} className="flex gap-3">
                                    <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm shrink-0 mt-1">
                                        Y
                                    </div>
                                    <div className="flex-1 max-w-[560px]">
                                        <div className="flex items-baseline gap-2 mb-1.5">
                                            <span className="text-sm font-bold text-slate-900">You</span>
                                            <span className="text-xs text-slate-400">{msg.created_at}</span>
                                        </div>
                                        <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none shadow-sm text-sm text-slate-700 leading-relaxed">
                                            {msg.message}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}

                    <div ref={bottomRef} />
                </div>

                {/* Reply input */}
                <div className="p-4 border-t border-slate-200 bg-white">
                    {selectedTicket.status === 'Resolved' ? (
                        <div className="text-center py-3 text-sm text-slate-400 bg-slate-50 rounded-xl border border-slate-200">
                            ✅ This ticket has been resolved. <button onClick={() => setIsCreateModalOpen(true)} className="text-indigo-600 font-bold hover:underline">Open a new ticket</button> if you need further help.
                        </div>
                    ) : (
                        <div className="flex gap-3 items-end">
                            <div className="flex-1 border border-slate-300 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-400 focus-within:border-indigo-400 transition-all">
                                <textarea
                                    value={replyText}
                                    onChange={e => setReplyText(e.target.value)}
                                    placeholder="Add a reply or clarification..."
                                    rows={2}
                                    className="w-full p-3 text-sm focus:outline-none resize-none bg-white"
                                    onKeyDown={e => {
                                        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendReply(); }
                                    }}
                                />
                            </div>
                            <button
                                onClick={handleSendReply}
                                disabled={!replyText.trim() || isSending}
                                className="p-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-2xl transition-colors shrink-0"
                            >
                                {isSending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                            </button>
                        </div>
                    )}
                    <p className="text-xs text-slate-400 mt-2">Press Enter to send · Shift+Enter for new line</p>
                </div>
            </div>
        );
    }

    // ── Ticket list view ─────────────────────────────────────────────────────────
    return (
        <div className="space-y-6 animate-in fade-in duration-500 relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-sky-50 text-sky-700 text-xs font-bold rounded uppercase tracking-wider">SocialKnocks HQ</span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Customer Support</h1>
                    <p className="text-slate-500">Need help? Submit a ticket or continue an ongoing conversation.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={fetchTickets} className="p-2.5 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors" title="Refresh">
                        <RefreshCw size={18} />
                    </button>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all"
                    >
                        <Plus size={20} /> New Ticket
                    </button>
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                    <AlertCircle size={16} /> {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                <FileText size={20} className="text-slate-400" />
                                Your Tickets
                                <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">{tickets.length}</span>
                            </h3>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-16 text-slate-400">
                                    <Loader2 size={24} className="animate-spin mr-2" /> Loading tickets...
                                </div>
                            ) : tickets.length > 0 ? (
                                tickets.map(ticket => (
                                    <div
                                        key={ticket.id}
                                        onClick={() => handleSelectTicket(ticket)}
                                        className="p-5 hover:bg-slate-50 transition-colors group cursor-pointer"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-3">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${getStatusStyle(ticket.status)}`}>
                                                    {ticket.status}
                                                </span>
                                                <span className="text-xs font-mono text-slate-400">#{ticket.id.slice(-6)}</span>
                                            </div>
                                            <span className={`text-xs font-bold px-2 py-1 rounded-lg ${getPriorityStyle(ticket.priority)}`}>
                                                {ticket.priority} Priority
                                            </span>
                                        </div>
                                        <h4 className="text-base font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors flex items-center gap-2">
                                            {ticket.subject}
                                            <MessageSquare size={14} className="text-slate-300 group-hover:text-indigo-400 transition-colors" />
                                        </h4>
                                        <p className="text-slate-500 text-sm mb-3 line-clamp-2">{ticket.message}</p>
                                        <div className="flex items-center gap-4 text-xs text-slate-400">
                                            <span className="flex items-center gap-1"><Clock size={11} /> {ticket.lastUpdate}</span>
                                            <span className="flex items-center gap-1"><HelpCircle size={11} /> {ticket.category}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-16">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                                        <LifeBuoy size={32} />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900">No Tickets Yet</h3>
                                    <p className="text-slate-500 mb-4">You haven't submitted any support requests.</p>
                                    <button
                                        onClick={() => setIsCreateModalOpen(true)}
                                        className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors"
                                    >
                                        Open Your First Ticket
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-slate-900 to-indigo-900 rounded-2xl p-6 text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
                                <LifeBuoy size={24} className="text-white" />
                            </div>
                            <h3 className="text-lg font-bold mb-2">SocialKnocks HQ</h3>
                            <p className="text-indigo-200 text-sm mb-6 leading-relaxed">
                                Available Mon–Fri, 9am–6pm EST. High priority tickets answered within 2 hours.
                            </p>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm text-indigo-100 bg-white/5 p-3 rounded-lg border border-white/10">
                                    <CheckCircle size={16} className="text-green-400 shrink-0" />
                                    <span>Average Response: &lt; 4 hrs</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-indigo-100 bg-white/5 p-3 rounded-lg border border-white/10">
                                    <CheckCircle size={16} className="text-green-400 shrink-0" />
                                    <span>Satisfaction Rate: 98%</span>
                                </div>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/30 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2" />
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-4">Quick Help</h3>
                        <div className="space-y-1">
                            {['How to reset my password?', 'Billing cycle explanation', 'Connecting Instagram API', 'User roles & permissions'].map((topic, i) => (
                                <button key={i} className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-slate-50 text-sm text-slate-600 hover:text-indigo-600 flex justify-between items-center group transition-colors">
                                    {topic}
                                    <ChevronRight size={14} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Ticket Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Open New Ticket</h3>
                                <p className="text-sm text-slate-500">Describe your issue for the support team.</p>
                            </div>
                            <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1"><X size={20} /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Subject</label>
                                <input
                                    type="text"
                                    value={formData.subject}
                                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                    placeholder="e.g. Cannot update store inventory"
                                    className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    autoFocus
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                                    <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                                        <option>Technical</option><option>Billing</option>
                                        <option>Feature Request</option><option>Account</option><option>Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Priority</label>
                                    <select value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value })} className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                                        <option>Low</option><option>Medium</option><option>High</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Message</label>
                                <textarea value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} rows={5} placeholder="Please provide as much detail as possible..." className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none" />
                            </div>
                            <button
                                onClick={handleCreateTicket}
                                disabled={!formData.subject || !formData.message || isSubmitting}
                                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                            >
                                {isSubmitting ? <><Loader2 size={18} className="animate-spin" /> Sending...</> : <><Send size={18} /> Submit Ticket</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};