import React, { useState } from 'react';
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Filter,
  HeartPulse,
  Plus,
  Umbrella,
  X,
  XCircle,
} from 'lucide-react';
import { Employee, LeaveRequest, LeaveType } from '../../types';

interface LeaveSectionProps {
  employee: Employee | null;
  leaveRequests: LeaveRequest[];
  onSubmitLeaveRequest: (req: Omit<LeaveRequest, 'id' | 'requestNumber' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  isModalOpen?: boolean;
  onCloseModal?: () => void;
}

export const LeaveSection: React.FC<LeaveSectionProps> = ({
  employee,
  leaveRequests,
  onSubmitLeaveRequest,
  isModalOpen = false,
  onCloseModal,
}) => {
  const [internalModalOpen, setInternalModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Form State
  const [leaveType, setLeaveType] = useState<LeaveType>('Annual');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [attachmentName, setAttachmentName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const showModal = isModalOpen || internalModalOpen;
  const handleClose = () => {
    setInternalModalOpen(false);
    onCloseModal?.();
    setFormError('');
  };

  // Calculate days between dates
  const calculateDays = (start: string, end: string): number => {
    if (!start || !end) return 0;
    const s = new Date(start);
    const e = new Date(end);
    const diff = e.getTime() - s.getTime();
    if (diff < 0) return 0;
    return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
  };

  const calculatedDays = calculateDays(startDate, endDate);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!startDate || !endDate) {
      setFormError('Please select both start and end dates.');
      return;
    }
    if (calculatedDays <= 0) {
      setFormError('End date must be after or on the start date.');
      return;
    }
    if (!reason.trim()) {
      setFormError('Please provide a reason for the leave.');
      return;
    }

    // Check balance for annual leave
    if (leaveType === 'Annual' && employee && calculatedDays > employee.annualLeaveBalance) {
      setFormError(`Insufficient annual leave balance. You currently have ${employee.annualLeaveBalance} days available.`);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmitLeaveRequest({
        userId: employee?.userId || 'seed-usr-1002',
        employeeId: employee?.employeeId || 'DSI-1002',
        employeeName: employee?.name || 'Staff Member',
        department: employee?.department || 'Operations',
        leaveType,
        startDate,
        endDate,
        days: calculatedDays,
        reason: reason.trim(),
        attachmentName: attachmentName || undefined,
        status: 'pending',
      });

      // Reset
      setStartDate('');
      setEndDate('');
      setReason('');
      setAttachmentName('');
      handleClose();
    } catch (err: any) {
      setFormError(err?.message || 'Failed to submit leave application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredRequests = leaveRequests.filter((r) => {
    if (statusFilter === 'all') return true;
    return r.status === statusFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Quick Apply */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Leave Management</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Track leave entitlements, apply for vacation or emergency leave, and view approvals.
          </p>
        </div>

        <button
          onClick={() => setInternalModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-[#FF6B00] hover:bg-[#e05e00] text-white shadow-xs transition-all hover:scale-102"
        >
          <Plus className="w-4 h-4" />
          Apply for Leave
        </button>
      </div>

      {/* 2. Leave Entitlements Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Annual Leave</span>
            <Umbrella className="w-4 h-4 text-[#0B2545]" />
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-[#0B2545]">{employee?.annualLeaveBalance ?? 28}</span>
            <span className="text-xs text-slate-400">/ 30 days</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Accrued paid vacation</p>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Sick Leave</span>
            <HeartPulse className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-slate-800">{employee?.sickLeaveBalance ?? 15}</span>
            <span className="text-xs text-slate-400">/ 15 days</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Requires medical report</p>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Emergency Leave</span>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-slate-800">{employee?.emergencyLeaveBalance ?? 5}</span>
            <span className="text-xs text-slate-400">/ 5 days</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Family & urgent affairs</p>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Unpaid Leave</span>
            <Calendar className="w-4 h-4 text-slate-500" />
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-slate-800">{employee?.unpaidLeaveBalance ?? 30}</span>
            <span className="text-xs text-slate-400">available</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Subject to management approval</p>
        </div>
      </div>

      {/* 3. Leave Requests History */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#0B2545]" />
            <h2 className="font-bold text-slate-900 text-base">Leave Applications & History</h2>
            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-semibold">
              {filteredRequests.length}
            </span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-colors ${
                  statusFilter === status
                    ? 'bg-[#0B2545] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {filteredRequests.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <Calendar className="w-12 h-12 mx-auto opacity-30 mb-2" />
            <p className="text-sm font-semibold">No leave applications found in this view.</p>
            <p className="text-xs text-slate-400 mt-1">Click "Apply for Leave" above to create an application.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredRequests.map((req) => (
              <div key={req.id} className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-[#0B2545] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                      {req.requestNumber}
                    </span>
                    <span className="font-bold text-slate-900 text-sm">{req.leaveType} Leave</span>
                    <span className="text-xs font-semibold text-slate-500">
                      ({req.days} {req.days === 1 ? 'day' : 'days'})
                    </span>
                  </div>

                  <div>{getStatusBadge(req.status)}</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600 mb-2">
                  <div>
                    <span className="text-slate-400">Duration: </span>
                    <span className="font-semibold text-slate-800">
                      {req.startDate} to {req.endDate}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Applied On: </span>
                    <span className="font-medium text-slate-700">
                      {new Date(req.createdAt).toLocaleDateString('en-GB')}
                    </span>
                  </div>
                  {req.attachmentName && (
                    <div className="flex items-center gap-1 text-slate-500">
                      <FileText className="w-3.5 h-3.5 text-[#FF6B00]" />
                      <span className="truncate">{req.attachmentName}</span>
                    </div>
                  )}
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs">
                  <p className="text-slate-700">
                    <span className="font-bold text-slate-600">Reason: </span>
                    {req.reason}
                  </p>

                  {req.supervisorNote && (
                    <div className="mt-1.5 pt-1.5 border-t border-slate-200/60 text-[11px] text-slate-600">
                      <span className="font-bold text-[#0B2545]">
                        Supervisor Note ({req.reviewedBy}):{' '}
                      </span>
                      {req.supervisorNote}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Apply for Leave Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#FF6B00]" />
                <h3 className="font-bold text-slate-900 text-base">Apply for Leave</h3>
              </div>
              <button
                onClick={handleClose}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Leave Type *
                </label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as LeaveType)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B2545] outline-none"
                >
                  <option value="Annual">Annual Vacation Leave (Available: {employee?.annualLeaveBalance ?? 28} days)</option>
                  <option value="Sick">Sick / Medical Leave (Available: {employee?.sickLeaveBalance ?? 15} days)</option>
                  <option value="Emergency">Emergency Leave (Available: {employee?.emergencyLeaveBalance ?? 5} days)</option>
                  <option value="Unpaid">Unpaid Leave</option>
                  <option value="Paternity">Paternity Leave (3 days statutory)</option>
                  <option value="Hajj">Hajj Pilgrimage Leave (Once in service)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B2545] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    End Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B2545] outline-none"
                  />
                </div>
              </div>

              {calculatedDays > 0 && (
                <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-xs flex items-center justify-between">
                  <span className="text-[#0B2545] font-semibold">Total Days Requested:</span>
                  <span className="font-extrabold text-[#0B2545] text-sm">
                    {calculatedDays} {calculatedDays === 1 ? 'day' : 'days'}
                  </span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Reason for Leave *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide reason, travel destination, or emergency details..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B2545] outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Attachment (Optional, e.g. Flight ticket or Doctor note)
                </label>
                <input
                  type="file"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setAttachmentName(e.target.files[0].name);
                    }
                  }}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-[#0B2545] hover:file:bg-blue-100"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#FF6B00] hover:bg-[#e05e00] text-white shadow-xs transition-colors"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Leave Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
