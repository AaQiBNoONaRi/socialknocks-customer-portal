import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Instagram, Facebook, Clock, X, FileText } from 'lucide-react';

interface ScheduledPost {
    id: string;
    content: string;
    platform: string;
    platforms?: string[];
    scheduled_at: string;
    media?: string;
    status: string;
}

interface SchedulerProps {
    onCompose: () => void;
    workspaceId?: string;
}

const PLATFORM_COLORS: Record<string, string> = {
    Facebook: 'bg-blue-50 border-blue-200 text-blue-700',
    Instagram: 'bg-pink-50 border-pink-200 text-pink-700',
    default: 'bg-indigo-50 border-indigo-200 text-indigo-700',
};

const PLATFORM_ICON_COLORS: Record<string, string> = {
    Facebook: 'bg-blue-100 text-blue-600',
    Instagram: 'bg-pink-100 text-pink-600',
    default: 'bg-indigo-100 text-indigo-600',
};

function getPlatformIcon(platform: string) {
    if (platform?.toLowerCase() === 'instagram') return <Instagram size={12} />;
    if (platform?.toLowerCase() === 'facebook') return <Facebook size={12} />;
    return <FileText size={12} />;
}

export const Scheduler: React.FC<SchedulerProps> = ({ onCompose, workspaceId }) => {
    const now = new Date();
    const [viewYear, setViewYear] = useState(now.getFullYear());
    const [viewMonth, setViewMonth] = useState(now.getMonth()); // 0-indexed
    const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();

    // Fetch scheduled posts from dedicated `scheduled` collection
    useEffect(() => {
        if (!workspaceId) return;
        setIsLoading(true);
        fetch(`http://localhost:8000/api/posts/scheduled/${workspaceId}`)
            .then(r => r.ok ? r.json() : null)
            .then(data => {
                if (data?.posts) setScheduledPosts(data.posts);
            })
            .catch(() => { })
            .finally(() => setIsLoading(false));
    }, [workspaceId]);

    const prevMonth = () => {
        if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
        else setViewMonth(m => m - 1);
    };

    const nextMonth = () => {
        if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
        else setViewMonth(m => m + 1);
    };

    const getPostsForDay = (day: number) => {
        return scheduledPosts.filter(p => {
            if (!p.scheduled_at) return false;
            const d = new Date(p.scheduled_at);
            return d.getDate() === day && d.getMonth() === viewMonth && d.getFullYear() === viewYear;
        });
    };

    const getPostsForDate = (date: Date) => {
        return scheduledPosts.filter(p => {
            if (!p.scheduled_at) return false;
            const d = new Date(p.scheduled_at);
            return d.getDate() === date.getDate() &&
                d.getMonth() === date.getMonth() &&
                d.getFullYear() === date.getFullYear();
        });
    };

    const formatTime = (isoStr: string) => {
        try {
            return new Date(isoStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        } catch { return ''; }
    };

    const today = new Date();

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col animate-in fade-in duration-500 relative">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded uppercase tracking-wider">Content Lab</span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Planner</h1>
                    <p className="text-slate-500">Visualize and schedule your content strategy.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
                        <button onClick={prevMonth} className="p-2 hover:bg-slate-50 rounded-md text-slate-600 transition-colors">
                            <ChevronLeft size={20} />
                        </button>
                        <span className="px-4 font-bold text-slate-700 text-sm min-w-[140px] text-center">
                            {monthNames[viewMonth]} {viewYear}
                        </span>
                        <button onClick={nextMonth} className="p-2 hover:bg-slate-50 rounded-md text-slate-600 transition-colors">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                    <button
                        onClick={onCompose}
                        className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all hover:scale-105 active:scale-95"
                    >
                        <Plus size={18} /> New Post
                    </button>
                </div>
            </div>

            {/* Legend */}
            <div className="flex gap-3 mb-4 flex-shrink-0">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <div className="w-3 h-3 rounded-full bg-blue-400" /> Facebook
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <div className="w-3 h-3 rounded-full bg-pink-400" /> Instagram
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <div className="w-3 h-3 rounded-full bg-indigo-400" /> Other
                </div>
                {isLoading && <span className="text-xs text-slate-400 ml-2 animate-pulse">Loading posts...</span>}
                {!isLoading && scheduledPosts.length > 0 && (
                    <span className="text-xs text-indigo-600 font-bold ml-2">{scheduledPosts.length} scheduled post{scheduledPosts.length !== 1 ? 's' : ''}</span>
                )}
            </div>

            {/* Calendar */}
            <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col overflow-hidden">
                {/* Day headers */}
                <div className="grid grid-cols-7 border-b border-slate-200">
                    {days.map(day => (
                        <div key={day} className="py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-50 border-r border-slate-100 last:border-r-0">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Day cells */}
                <div className="flex-1 grid grid-cols-7 auto-rows-fr">
                    {/* Empty leading cells */}
                    {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                        <div key={`prev-${i}`} className="border-b border-r border-slate-100 bg-slate-50/50 min-h-[100px]" />
                    ))}

                    {/* Actual days */}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const dayPosts = getPostsForDay(day);
                        const isToday = day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
                        const isPast = new Date(viewYear, viewMonth, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());

                        return (
                            <div
                                key={day}
                                onClick={() => setSelectedDate(new Date(viewYear, viewMonth, day))}
                                className={`border-b border-r border-slate-100 p-2 min-h-[100px] relative hover:bg-slate-50 transition-colors group cursor-pointer ${isPast ? 'bg-slate-50/30' : ''}`}
                            >
                                <span className={`text-sm font-bold inline-flex items-center justify-center w-7 h-7 rounded-full ${isToday ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' :
                                    isPast ? 'text-slate-400' : 'text-slate-700'
                                    }`}>
                                    {day}
                                </span>

                                <div className="mt-1 space-y-1">
                                    {dayPosts.slice(0, 3).map(post => {
                                        const plat = post.platform || (post.platforms?.[0] ?? 'default');
                                        const color = PLATFORM_COLORS[plat] || PLATFORM_COLORS.default;
                                        return (
                                            <div key={post.id} className={`text-[10px] px-1.5 py-0.5 rounded border truncate flex items-center gap-1 font-medium ${color}`}>
                                                {getPlatformIcon(plat)}
                                                <span className="truncate">{post.content}</span>
                                            </div>
                                        );
                                    })}
                                    {dayPosts.length > 3 && (
                                        <div className="text-[10px] text-slate-400 font-bold pl-1">+{dayPosts.length - 3} more</div>
                                    )}
                                </div>

                                {/* Quick-add button */}
                                <button
                                    onClick={e => { e.stopPropagation(); onCompose(); }}
                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-md shadow-sm transition-all"
                                    title="Schedule Post"
                                >
                                    <Plus size={14} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Day Detail Modal */}
            {selectedDate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedDate(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                <CalendarIcon size={18} className="text-indigo-600" />
                                {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                            </h3>
                            <button onClick={() => setSelectedDate(null)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-200 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Scheduled Posts</h4>
                            {getPostsForDate(selectedDate).length > 0 ? (
                                getPostsForDate(selectedDate).map(post => {
                                    const plat = post.platform || (post.platforms?.[0] ?? 'Unknown');
                                    const iconColor = PLATFORM_ICON_COLORS[plat] || PLATFORM_ICON_COLORS.default;
                                    return (
                                        <div key={post.id} className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${iconColor}`}>
                                                {getPlatformIcon(plat)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-slate-800 line-clamp-2">{post.content}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs text-slate-500 font-medium">{plat}</span>
                                                    {post.scheduled_at && (
                                                        <span className="flex items-center gap-1 text-xs text-indigo-500 font-bold">
                                                            <Clock size={10} />
                                                            {formatTime(post.scheduled_at)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                    <CalendarIcon size={24} className="mx-auto mb-2 opacity-40" />
                                    <p className="text-sm">No posts scheduled for this day.</p>
                                </div>
                            )}
                        </div>

                        <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
                            <button
                                onClick={() => { setSelectedDate(null); onCompose(); }}
                                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-bold text-sm shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2"
                            >
                                <Plus size={16} /> Schedule Post
                            </button>
                            <button
                                onClick={() => setSelectedDate(null)}
                                className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};