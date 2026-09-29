import React from 'react';
import {
  AlertCircle,
  Bell,
  Calendar,
  Car,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileCheck,
  Megaphone,
  X,
} from 'lucide-react';
import { NotificationItem } from '../../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
  onNavigate: (tabId: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onNavigate,
}) => {
  if (!isOpen) return null;

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'leave_update':
        return <Calendar className="w-4 h-4 text-[#0B2545]" />;
      case 'vehicle_update':
        return <Car className="w-4 h-4 text-[#FF6B00]" />;
      case 'announcement':
        return <Megaphone className="w-4 h-4 text-amber-600" />;
      default:
        return <Bell className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-2xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#FF6B00]" />
            <h3 className="font-bold text-slate-900 text-base">Notifications</h3>
            <span className="text-xs bg-orange-100 text-[#FF6B00] font-bold px-2 py-0.5 rounded-full">
              {notifications.filter(n => !n.read).length} Unread
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {notifications.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <Bell className="w-10 h-10 mx-auto opacity-30 mb-2" />
              <p className="text-sm font-semibold">All caught up!</p>
              <p className="text-xs text-slate-400 mt-1">No new updates or alerts.</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => {
                  if (!notif.read) onMarkAsRead(notif.id);
                  if (notif.link) {
                    onNavigate(notif.link);
                    onClose();
                  }
                }}
                className={`p-4 transition-colors cursor-pointer flex items-start gap-3 ${
                  notif.read ? 'bg-white hover:bg-slate-50' : 'bg-orange-50/40 hover:bg-orange-50/70'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  {getIcon(notif.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className={`text-xs ${notif.read ? 'font-semibold text-slate-800' : 'font-bold text-slate-900'}`}>
                      {notif.title}
                    </h4>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-[#FF6B00] flex-shrink-0" />
                    )}
                  </div>

                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    {notif.message}
                  </p>

                  <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400">
                    <span>{new Date(notif.createdAt).toLocaleDateString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
                    {notif.link && (
                      <span className="text-[#0B2545] font-semibold flex items-center gap-0.5 hover:underline">
                        Open view <ExternalLink className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50 text-center">
          <p className="text-[11px] text-slate-500">
            DSI Real-time Portal Broadcasts · Eastern Province
          </p>
        </div>
      </div>
    </>
  );
};
