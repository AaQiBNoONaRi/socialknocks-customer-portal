import React, { useState } from 'react';
import { Bell, Check, Info, AlertTriangle } from 'lucide-react';
import { Notification } from '../types';

const MOCK_NOTIFICATIONS: Notification[] = [
    { id: '1', title: 'New Design Request', message: 'Client X submitted a new request for social banners.', type: 'info', date: '10 min ago', read: false },
    { id: '2', title: 'Campaign Approved', message: 'Summer Sale campaign was approved by Jane.', type: 'success', date: '2 hours ago', read: true },
    { id: '3', title: 'Inventory Low', message: 'Minimalist Watch stock is below 5 units.', type: 'warning', date: '1 day ago', read: true },
];

export const Notifications: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
                <button className="text-sm text-indigo-600 font-medium hover:text-indigo-700">Mark all as read</button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-100">
                {notifications.map((notif) => (
                    <div key={notif.id} className={`p-4 flex items-start gap-4 hover:bg-slate-50 transition-colors ${!notif.read ? 'bg-indigo-50/30' : ''}`}>
                         <div className={`p-2 rounded-full flex-shrink-0 ${
                             notif.type === 'success' ? 'bg-green-100 text-green-600' :
                             notif.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                             'bg-blue-100 text-blue-600'
                         }`}>
                             {notif.type === 'success' ? <Check size={16} /> : notif.type === 'warning' ? <AlertTriangle size={16} /> : <Info size={16} />}
                         </div>
                         <div className="flex-1">
                             <div className="flex justify-between items-start">
                                 <h4 className={`text-sm font-semibold ${!notif.read ? 'text-slate-900' : 'text-slate-700'}`}>{notif.title}</h4>
                                 <span className="text-xs text-slate-400">{notif.date}</span>
                             </div>
                             <p className="text-sm text-slate-600 mt-1">{notif.message}</p>
                         </div>
                         {!notif.read && (
                             <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2"></div>
                         )}
                    </div>
                ))}
            </div>
        </div>
    );
};
