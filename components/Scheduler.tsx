import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Instagram, Linkedin, Twitter, Filter, X, Clock } from 'lucide-react';
import { CalendarEvent } from '../types';

const MOCK_EVENTS: CalendarEvent[] = [
    { id: '1', title: 'Summer Collection Launch', date: new Date(), type: 'post', platform: 'Instagram' },
    { id: '2', title: 'CEO Interview', date: new Date(new Date().setDate(new Date().getDate() + 2)), type: 'post', platform: 'LinkedIn' },
    { id: '3', title: 'Weekend Promo', date: new Date(new Date().setDate(new Date().getDate() + 5)), type: 'campaign' },
];

interface SchedulerProps {
    onCompose: () => void;
}

export const Scheduler: React.FC<SchedulerProps> = ({ onCompose }) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const currentDate = new Date();
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const renderEventIcon = (platform?: string) => {
        switch(platform) {
            case 'Instagram': return <Instagram size={12} />;
            case 'LinkedIn': return <Linkedin size={12} />;
            case 'Twitter': return <Twitter size={12} />;
            default: return null;
        }
    }

    const handleDateClick = (date: Date) => {
        setSelectedDate(date);
    };

    const handleCloseModal = () => {
        setSelectedDate(null);
    };

    const getEventsForDate = (date: Date) => {
        return MOCK_EVENTS.filter(e => 
            e.date.getDate() === date.getDate() && 
            e.date.getMonth() === date.getMonth() && 
            e.date.getFullYear() === date.getFullYear()
        );
    }

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col animate-in fade-in duration-500 relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded uppercase tracking-wider">Content Lab</span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Planner</h1>
                    <p className="text-slate-500">Visualize and schedule your content strategy.</p>
                </div>
                <div className="flex items-center gap-4">
                    <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg border border-transparent hover:border-slate-200 transition-all">
                        <Filter size={20} />
                    </button>
                    <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
                        <button className="p-2 hover:bg-slate-50 rounded-md text-slate-600"><ChevronLeft size={20} /></button>
                        <span className="px-4 font-bold text-slate-700 text-sm">October 2024</span>
                        <button className="p-2 hover:bg-slate-50 rounded-md text-slate-600"><ChevronRight size={20} /></button>
                    </div>
                    <button 
                        onClick={onCompose}
                        className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all hover:scale-105 active:scale-95"
                    >
                        <Plus size={18} /> New Post
                    </button>
                </div>
            </div>

            <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col overflow-hidden">
                {/* Header */}
                <div className="grid grid-cols-7 border-b border-slate-200">
                    {days.map(day => (
                        <div key={day} className="py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-50 border-r border-slate-100 last:border-r-0">
                            {day}
                        </div>
                    ))}
                </div>
                
                {/* Grid */}
                <div className="flex-1 grid grid-cols-7 auto-rows-fr">
                    {/* Empty cells for previous month */}
                    {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                        <div key={`prev-${i}`} className="border-b border-r border-slate-100 bg-slate-50/50 min-h-[100px]"></div>
                    ))}
                    
                    {/* Days */}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                        const dayEvents = MOCK_EVENTS.filter(e => e.date.getDate() === day);
                        const isToday = day === new Date().getDate();

                        return (
                            <div 
                                key={day} 
                                onClick={() => handleDateClick(date)}
                                className="border-b border-r border-slate-100 p-2 min-h-[100px] relative hover:bg-slate-50 transition-colors group cursor-pointer"
                            >
                                <span className={`text-sm font-bold ${
                                    isToday ? 'bg-indigo-600 text-white w-7 h-7 flex items-center justify-center rounded-full shadow-md shadow-indigo-200' : 'text-slate-700'
                                }`}>
                                    {day}
                                </span>
                                
                                <div className="mt-2 space-y-1">
                                    {dayEvents.map((event) => (
                                        <div key={event.id} className={`text-xs p-1.5 rounded-lg border truncate cursor-pointer hover:opacity-80 transition-opacity ${
                                            event.type === 'campaign' ? 'bg-purple-50 border-purple-200 text-purple-700 font-medium' : 'bg-indigo-50 border-indigo-200 text-indigo-700 font-medium'
                                        }`}>
                                            <div className="flex items-center gap-1.5">
                                                {renderEventIcon(event.platform)}
                                                <span className="truncate">{event.title}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button 
                                    onClick={(e) => { e.stopPropagation(); onCompose(); }}
                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-md shadow-sm transition-all"
                                    title="Add Post"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Date Details Modal */}
            {selectedDate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={handleCloseModal}>
                    <div 
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                <CalendarIcon size={18} className="text-indigo-600" />
                                {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' })}
                            </h3>
                            <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-200 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="p-4 space-y-4">
                            <div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Scheduled Content</h4>
                                <div className="space-y-2">
                                    {getEventsForDate(selectedDate).length > 0 ? (
                                        getEventsForDate(selectedDate).map(event => (
                                            <div key={event.id} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${event.type === 'campaign' ? 'bg-purple-100 text-purple-600' : 'bg-indigo-100 text-indigo-600'}`}>
                                                    {event.type === 'campaign' ? <CalendarIcon size={14} /> : renderEventIcon(event.platform) || <CalendarIcon size={14} />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-slate-900 truncate">{event.title}</p>
                                                    <p className="text-xs text-slate-500 capitalize">{event.type} • {event.platform || 'All Platforms'}</p>
                                                </div>
                                                <div className="text-xs font-medium text-slate-400">10:00 AM</div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-6 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                            <p className="text-sm">No content scheduled.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
                            <button 
                                onClick={() => { handleCloseModal(); onCompose(); }}
                                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-bold text-sm shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2"
                            >
                                <Plus size={16} /> Schedule Post
                            </button>
                            <button 
                                onClick={handleCloseModal}
                                className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-colors"
                            >
                                View Day
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};