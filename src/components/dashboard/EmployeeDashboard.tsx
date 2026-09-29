import React from 'react';
import {
  Calendar,
  Car,
  Clock,
  FileCheck,
  FileText,
  HeartPulse,
  Megaphone,
  ShieldCheck,
  Umbrella,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Plus,
} from 'lucide-react';
import { Announcement, Employee, LeaveRequest, VehicleRequest, OtherRequest } from '../../types';

interface EmployeeDashboardProps {
  employee: Employee | null;
  leaveRequests: LeaveRequest[];
  vehicleRequests: VehicleRequest[];
  otherRequests: OtherRequest[];
  announcements: Announcement[];
  onNavigate: (tabId: string) => void;
  onOpenLeaveModal: () => void;
  onOpenVehicleModal: () => void;
  onOpenOtherRequestModal: () => void;
}

export const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({
  employee,
  leaveRequests,
  vehicleRequests,
  otherRequests,
  announcements,
  onNavigate,
  onOpenLeaveModal,
  onOpenVehicleModal,
  onOpenOtherRequestModal,
}) => {
  // Calculate stats
  const pendingLeaves = leaveRequests.filter(r => r.status === 'pending');
  const pendingVehicles = vehicleRequests.filter(r => r.status === 'pending');
  const pendingOthers = otherRequests.filter(r => r.status === 'pending');
  const totalPending = pendingLeaves.length + pendingVehicles.length + pendingOthers.length;

  // Combine recent requests
  const recentRequests = [
    ...leaveRequests.map(r => ({
      id: r.id,
      number: r.requestNumber,
      type: `${r.leaveType} Leave`,
      date: r.startDate,
      status: r.status,
      category: 'leave',
      detail: `${r.days} day(s)`,
    })),
    ...vehicleRequests.map(r => ({
      id: r.id,
      number: r.requestNumber,
      type: 'Vehicle Request',
      date: r.date,
      status: r.status,
      category: 'vehicle',
      detail: `${r.pickupLocation.split(',')[0]} → ${r.destination.split(',')[0]}`,
    })),
    ...otherRequests.map(r => ({
      id: r.id,
      number: r.requestNumber,
      type: r.title,
      date: r.createdAt.split('T')[0],
      status: r.status,
      category: 'other',
      detail: r.requestType.replace('_', ' ').toUpperCase(),
    })),
  ].sort((a, b) => (b.date > a.date ? 1 : -1)).slice(0, 5);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Welcome Card with Employee Profile & Quick Actions */}
      <div className="bg-gradient-to-r from-[#0B2545] via-[#10335c] to-[#0B2545] rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        {/* Subtle decorative background watermarks */}
        <div className="absolute right-0 top-0 bottom-0 w-80 opacity-5 pointer-events-none flex items-center justify-center">
          <ShieldCheck className="w-96 h-96 -mr-16" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-white/20 shadow-inner bg-white/10 flex-shrink-0">
              {employee?.photoURL ? (
                <img
                  src={employee.photoURL}
                  alt={employee.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-2xl text-white">
                  {employee?.name?.charAt(0) || 'D'}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B00] bg-[#FF6B00]/15 px-2.5 py-0.5 rounded-full border border-[#FF6B00]/30">
                  {employee?.employeeId || 'DSI-1002'}
                </span>
                <span className="text-xs text-slate-300 font-medium">
                  {employee?.department || 'Operations & Maintenance'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold mt-1 text-white">
                Welcome back, {employee?.name || 'Staff Member'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                {employee?.designation} · Reporting to: <span className="text-white font-medium">{employee?.reportingManager}</span>
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenLeaveModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-[#FF6B00] hover:bg-[#e05e00] text-white shadow-md shadow-orange-950/20 transition-all hover:scale-102"
            >
              <Calendar className="w-4 h-4" />
              Apply for Leave
            </button>

            <button
              onClick={onOpenVehicleModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-white/15 hover:bg-white/25 text-white border border-white/20 transition-all hover:scale-102 backdrop-blur-xs"
            >
              <Car className="w-4 h-4 text-[#FF6B00]" />
              Vehicle Request
            </button>

            <button
              onClick={onOpenOtherRequestModal}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-colors"
            >
              <Plus className="w-4 h-4 text-slate-300" />
              New Request
            </button>
          </div>
        </div>
      </div>

      {/* 2. Leave Balance Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#FF6B00]" />
            Leave Balance (Days)
          </h2>
          <button
            onClick={() => onNavigate('leave')}
            className="text-xs font-semibold text-[#0B2545] hover:text-[#FF6B00] flex items-center gap-1 transition-colors"
          >
            Leave History & Application
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Annual Leave */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Annual Leave</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0B2545] flex items-center justify-center">
                <Umbrella className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#0B2545]">
                {employee?.annualLeaveBalance ?? 28}
              </span>
              <span className="text-xs font-medium text-slate-400">/ 30 days</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-[#0B2545] h-full rounded-full transition-all"
                style={{ width: `${((employee?.annualLeaveBalance ?? 28) / 30) * 100}%` }}
              />
            </div>
          </div>

          {/* Sick Leave */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Sick Leave</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <HeartPulse className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-800">
                {employee?.sickLeaveBalance ?? 15}
              </span>
              <span className="text-xs font-medium text-slate-400">/ 15 days</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all"
                style={{ width: `${((employee?.sickLeaveBalance ?? 15) / 15) * 100}%` }}
              />
            </div>
          </div>

          {/* Emergency Leave */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Emergency</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <AlertCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-800">
                {employee?.emergencyLeaveBalance ?? 5}
              </span>
              <span className="text-xs font-medium text-slate-400">/ 5 days</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all"
                style={{ width: `${((employee?.emergencyLeaveBalance ?? 5) / 5) * 100}%` }}
              />
            </div>
          </div>

          {/* Pending Requests Counter */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50/50 rounded-2xl p-4 sm:p-5 border border-orange-200/80 shadow-xs hover:border-orange-300 transition-all">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B00]">Pending Requests</span>
              <div className="w-8 h-8 rounded-lg bg-[#FF6B00] text-white flex items-center justify-center shadow-xs">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#FF6B00]">
                {totalPending}
              </span>
              <span className="text-xs font-medium text-slate-600">under review</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-3 font-medium flex items-center gap-1.5">
              <span>{pendingLeaves.length} Leave</span> · <span>{pendingVehicles.length} Vehicle</span> · <span>{pendingOthers.length} Other</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Two-Column Layout: Recent Requests & Latest Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Requests Center (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-[#0B2545]" />
                <h3 className="font-bold text-slate-900 text-base">Recent Requests</h3>
              </div>
              <button
                onClick={() => onNavigate('requests')}
                className="text-xs font-semibold text-[#0B2545] hover:text-[#FF6B00] flex items-center gap-1"
              >
                View All
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {recentRequests.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <FileText className="w-10 h-10 mx-auto opacity-40 mb-2" />
                <p className="text-sm font-medium">No recent requests recorded.</p>
                <p className="text-xs text-slate-400 mt-1">Submit your first leave or vehicle request using the buttons above.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentRequests.map((req) => (
                  <div
                    key={req.id}
                    onClick={() => onNavigate('requests')}
                    className="py-3 sm:py-3.5 flex items-center justify-between hover:bg-slate-50/80 -mx-2 px-2 rounded-xl cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 flex-shrink-0">
                        {req.category === 'leave' ? (
                          <Calendar className="w-4 h-4 text-[#0B2545]" />
                        ) : req.category === 'vehicle' ? (
                          <Car className="w-4 h-4 text-[#FF6B00]" />
                        ) : (
                          <FileText className="w-4 h-4 text-slate-600" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{req.type}</span>
                          <span className="text-[10px] font-mono text-slate-400">{req.number}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 truncate max-w-xs sm:max-w-md">
                          {req.detail} · {req.date}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {getStatusBadge(req.status)}
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>DSI Unified Self-Service Center</span>
            <button
              onClick={onOpenOtherRequestModal}
              className="text-[#0B2545] font-bold hover:underline"
            >
              + Submit Certificate / Letter Request
            </button>
          </div>
        </div>

        {/* Right Column: Company Announcements & Safety Circulars (1 Col) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-[#FF6B00]" />
                <h3 className="font-bold text-slate-900 text-base">Announcements</h3>
              </div>
              <button
                onClick={() => onNavigate('announcements')}
                className="text-xs font-semibold text-[#0B2545] hover:text-[#FF6B00] flex items-center gap-1"
              >
                All Notice
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {announcements.slice(0, 3).map((ann) => (
                <div
                  key={ann.id}
                  onClick={() => onNavigate('announcements')}
                  className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100/70 border border-slate-200/70 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                        ann.priority === 'urgent'
                          ? 'bg-rose-100 text-rose-800'
                          : ann.category === 'Safety'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-[#0B2545]'
                      }`}
                    >
                      {ann.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {new Date(ann.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1 leading-snug">
                    {ann.title}
                  </h4>
                  <p className="text-[11px] text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                    {ann.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Iqama & Compliance Notification */}
          <div className="mt-4 p-3 rounded-xl bg-blue-50/70 border border-blue-100 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#0B2545] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-[#0B2545]">Iqama & Passport Status</p>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Iqama valid until {employee?.iqamaExpiry || '2027-05-14'}. Check your documents under My Profile.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
