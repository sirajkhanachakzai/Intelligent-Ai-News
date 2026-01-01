
import React from 'react';
import { AppNotification } from '../types';
import { X, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

interface NotificationsPanelProps {
  notifications: AppNotification[];
  onClose: () => void;
  onMarkRead: (id: string) => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ notifications, onClose, onMarkRead }) => {
  return (
    <div className="absolute right-0 mt-4 w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
      <div className="p-4 border-b bg-slate-50 flex items-center justify-between">
        <h3 className="font-bold text-slate-900">Notifications</h3>
        <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-10 text-center flex flex-col items-center gap-3">
             <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-slate-300" />
             </div>
             <p className="text-sm text-slate-500 font-medium">All quiet in the briefing room.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {notifications.map((n) => (
              <div 
                key={n.id} 
                className={`p-4 flex gap-4 hover:bg-slate-50 transition-colors group relative ${!n.isRead ? 'bg-blue-50/30' : ''}`}
                onClick={() => onMarkRead(n.id)}
              >
                <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${n.type === 'breaking' ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'}`}>
                  {n.type === 'breaking' ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-slate-900">{n.title}</p>
                    <span className="text-[10px] text-slate-400 font-medium">{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                </div>
                {!n.isRead && (
                  <div className="absolute top-4 right-4 w-2 h-2 bg-blue-600 rounded-full" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-3 border-t bg-slate-50 text-center">
        <button className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-widest">
          View All Intelligence
        </button>
      </div>
    </div>
  );
};

export default NotificationsPanel;
