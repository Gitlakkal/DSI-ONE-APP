import React from 'react';
import {
  CalendarDays,
  Car,
  FileCheck,
  FileText,
  Home,
  Megaphone,
  ShieldAlert,
  User,
  Clock,
  Banknote,
  Boxes,
  Truck,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DsiLogo } from '../common/DsiLogo';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  pendingRequestsCount: number;
  onOpenFutureModule: (title: string, desc: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  pendingRequestsCount,
  onOpenFutureModule,
}) => {
  const { effectiveRole } = useAuth();
  const isAdminOrSupervisor = ['supervisor', 'hr_admin', 'super_admin'].includes(effectiveRole);

  const mainNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'leave', label: 'Apply for Leave', icon: CalendarDays },
    { id: 'vehicle', label: 'Vehicle Request', icon: Car },
    { id: 'requests', label: 'My Requests', icon: FileCheck, badge: pendingRequestsCount > 0 ? pendingRequestsCount : null },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
  ];

  const adminNavItems = [
    {
      id: 'admin',
      label: effectiveRole === 'supervisor' ? 'Supervisor Approvals' : 'Admin & Approvals Hub',
      icon: ShieldAlert,
      badge: pendingRequestsCount > 0 ? `${pendingRequestsCount} Pending` : null,
      highlight: true,
    },
  ];

  const modularUpcoming = [
    { id: 'attendance', label: 'Attendance & Clock-In', icon: Clock, desc: 'Geo-fenced biometric Aramco & DSI site timesheet attendance' },
    { id: 'payroll', label: 'Payroll & Payslips', icon: Banknote, desc: 'WPS compliant salary slips and end of service (EOSB) calculator' },
    { id: 'fleet', label: 'Fleet & Equipment', icon: Truck, desc: 'Heavy machinery tracking, maintenance inspection logs, MVPI renewal' },
    { id: 'inventory', label: 'Site Inventory', icon: Boxes, desc: 'Warehouse tool issuance, PPE inventory, consumable tracking' },
  ];

  return (
    <aside className="w-full lg:w-64 bg-white border-r border-slate-200 flex-shrink-0 flex flex-col justify-between p-4 space-y-6">
      <div className="space-y-6">
        {/* Core Employee Self-Service */}
        <div>
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Employee Portal
          </p>
          <nav className="space-y-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-[#0B2545] text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#FF6B00]' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge !== null && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                        isActive
                          ? 'bg-[#FF6B00] text-white'
                          : 'bg-orange-100 text-[#FF6B00]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Supervisor / HR / Admin Management Section */}
        {isAdminOrSupervisor && (
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between px-3 mb-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Management
              </p>
              <span className="text-[10px] px-1.5 py-0.2 rounded font-bold uppercase bg-blue-50 text-[#0B2545]">
                {effectiveRole === 'super_admin' ? 'Super Admin' : effectiveRole === 'hr_admin' ? 'HR Dept' : 'Supervisor'}
              </span>
            </div>
            <nav className="space-y-1">
              {adminNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-[#FF6B00] text-white shadow-sm'
                        : 'text-[#0B2545] bg-blue-50/70 hover:bg-blue-100/70'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#FF6B00]'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${isActive ? 'bg-white text-[#FF6B00]' : 'bg-[#FF6B00] text-white'}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        )}

        {/* Modular Next Modules (Attendance, Payroll, Fleet, Inventory) */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5 px-3 mb-2">
            <Sparkles className="w-3 h-3 text-[#FF6B00]" />
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Future Modules
            </p>
          </div>
          <div className="space-y-1">
            {modularUpcoming.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onOpenFutureModule(item.label, item.desc)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
                    <span>{item.label}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">v2</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* DSI Company Tagline & Location */}
      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center text-center">
        <DsiLogo size="sm" showSubtitle={false} className="mb-1.5" />
        <p className="text-[10px] text-slate-500">Dammam, Kingdom of Saudi Arabia</p>
        <div className="flex items-center justify-center gap-2 mt-2 pt-2 border-t border-slate-200/60 text-[10px] text-slate-400 w-full">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Internal Portal v1.0</span>
        </div>
      </div>
    </aside>
  );
};
