import React, { useState } from 'react';
import {
  AlertCircle,
  Calendar,
  Car,
  CheckCircle2,
  Clock,
  FileCheck,
  FileText,
  Filter,
  Layers,
  Plus,
  Search,
  Timer,
  X,
  XCircle,
} from 'lucide-react';
import { Employee, LeaveRequest, OtherRequest, OtherRequestType, VehicleRequest } from '../../types';

interface RequestCenterProps {
  employee: Employee | null;
  leaveRequests: LeaveRequest[];
  vehicleRequests: VehicleRequest[];
  otherRequests: OtherRequest[];
  onSubmitOtherRequest: (req: Omit<OtherRequest, 'id' | 'requestNumber' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onOpenLeaveModal: () => void;
  onOpenVehicleModal: () => void;
  isOtherModalOpen?: boolean;
  onCloseOtherModal?: () => void;
}

export const RequestCenter: React.FC<RequestCenterProps> = ({
  employee,
  leaveRequests,
  vehicleRequests,
  otherRequests,
  onSubmitOtherRequest,
  onOpenLeaveModal,
  onOpenVehicleModal,
  isOtherModalOpen = false,
  onCloseOtherModal,
}) => {
  const [internalModalOpen, setInternalModalOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState<'all' | 'leave' | 'vehicle' | 'certificate' | 'overtime' | 'other'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);

  // New Other Request Form State
  const [requestType, setRequestType] = useState<OtherRequestType>('salary_letter');
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [overtimeHours, setOvertimeHours] = useState(4);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const showModal = isOtherModalOpen || internalModalOpen;
  const handleCloseModal = () => {
    setInternalModalOpen(false);
    onCloseOtherModal?.();
    setFormError('');
  };

  const handleOtherSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!title.trim()) {
      setFormError('Please enter a request title.');
      return;
    }
    if (!details.trim()) {
      setFormError('Please provide details for this request.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmitOtherRequest({
        userId: employee?.userId || 'seed-usr-1002',
        employeeId: employee?.employeeId || 'DSI-1002',
        employeeName: employee?.name || 'Staff Member',
        department: employee?.department || 'Operations',
        requestType,
        title: title.trim(),
        details: details.trim(),
        overtimeHours: requestType === 'overtime' ? Number(overtimeHours) : undefined,
        status: 'pending',
      });

      setTitle('');
      setDetails('');
      handleCloseModal();
    } catch (err: any) {
      setFormError(err?.message || 'Failed to submit request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Harmonize all requests into one list
  const allRequests = [
    ...leaveRequests.map(r => ({
      ...r,
      kind: 'leave' as const,
      displayTitle: `${r.leaveType} Leave Application`,
      dateDisplay: r.startDate,
      summary: `${r.days} days (${r.startDate} to ${r.endDate}) - ${r.reason}`,
    })),
    ...vehicleRequests.map(r => ({
      ...r,
      kind: 'vehicle' as const,
      displayTitle: `Vehicle Dispatch: ${r.pickupLocation.split(',')[0]} → ${r.destination.split(',')[0]}`,
      dateDisplay: r.date,
      summary: `Time: ${r.requiredTime} (${r.passengersCount} pax) - ${r.purpose}`,
    })),
    ...otherRequests.map(r => ({
      ...r,
      kind: (r.requestType === 'certificate' || r.requestType === 'salary_letter' || r.requestType === 'experience_letter'
        ? 'certificate'
        : r.requestType === 'overtime'
        ? 'overtime'
        : 'other') as 'certificate' | 'overtime' | 'other',
      displayTitle: r.title,
      dateDisplay: r.createdAt.split('T')[0],
      summary: r.requestType === 'overtime' ? `${r.overtimeHours} hrs overtime: ${r.details}` : r.details,
    })),
  ].sort((a, b) => (b.dateDisplay > a.dateDisplay ? 1 : -1));

  const filteredRequests = allRequests.filter(item => {
    if (typeFilter !== 'all' && item.kind !== typeFilter) return false;
    if (statusFilter !== 'all' && item.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNum = item.requestNumber.toLowerCase().includes(q);
      const matchTitle = item.displayTitle.toLowerCase().includes(q);
      const matchSummary = item.summary.toLowerCase().includes(q);
      if (!matchNum && !matchTitle && !matchSummary) return false;
    }
    return true;
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

  const getKindIcon = (kind: string) => {
    switch (kind) {
      case 'leave':
        return <Calendar className="w-4 h-4 text-[#0B2545]" />;
      case 'vehicle':
        return <Car className="w-4 h-4 text-[#FF6B00]" />;
      case 'overtime':
        return <Timer className="w-4 h-4 text-purple-600" />;
      default:
        return <FileText className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Unified Request Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">My Requests</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            One simple request center for Leave, Vehicle, Certificate, Overtime, and General HR inquiries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setInternalModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-[#0B2545] hover:bg-[#123966] text-white shadow-xs"
          >
            <Plus className="w-4 h-4 text-[#FF6B00]" />
            HR / Overtime Request
          </button>

          <button
            onClick={onOpenLeaveModal}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-blue-50 text-[#0B2545] hover:bg-blue-100 transition-colors"
          >
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">Apply</span> Leave
          </button>

          <button
            onClick={onOpenVehicleModal}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-orange-50 text-[#FF6B00] hover:bg-orange-100 transition-colors"
          >
            <Car className="w-4 h-4" />
            <span className="hidden sm:inline">Book</span> Vehicle
          </button>
        </div>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by request number, title, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#0B2545] outline-none"
            />
          </div>

          {/* Status Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${
                  statusFilter === status
                    ? 'bg-[#0B2545] text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Category Type Filter Pills */}
        <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100 overflow-x-auto">
          {[
            { id: 'all', label: 'All Requests' },
            { id: 'leave', label: 'Leave' },
            { id: 'vehicle', label: 'Vehicle' },
            { id: 'certificate', label: 'Certificate / Letters' },
            { id: 'overtime', label: 'Overtime' },
            { id: 'other', label: 'Other' },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setTypeFilter(type.id as any)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                typeFilter === type.id
                  ? 'bg-[#FF6B00] text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Requests Table / Card List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-[#0B2545]" />
            <h2 className="font-bold text-slate-900 text-base">Request Center History</h2>
            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-semibold">
              {filteredRequests.length} results
            </span>
          </div>
        </div>

        {filteredRequests.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <FileCheck className="w-12 h-12 mx-auto opacity-30 mb-2" />
            <p className="text-sm font-semibold">No requests match your current filters.</p>
            <p className="text-xs text-slate-400 mt-1">Try clearing filters or search query.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredRequests.map((req) => (
              <div
                key={req.id}
                onClick={() => setSelectedRequest(req)}
                className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {getKindIcon(req.kind)}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#0B2545] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                        {req.requestNumber}
                      </span>
                      <span className="font-bold text-slate-900 text-sm">{req.displayTitle}</span>
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        • {req.kind}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-1 line-clamp-1 max-w-xl">
                      {req.summary}
                    </p>

                    <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-400">
                      <span>Submitted: {new Date(req.createdAt).toLocaleDateString('en-GB')}</span>
                      <span>Target Date: {req.dateDisplay}</span>
                      {req.reviewedBy && (
                        <span className="text-slate-500 font-medium">Reviewed by {req.reviewedBy}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                  {getStatusBadge(req.status)}
                  <span className="text-[11px] font-bold text-[#0B2545] hover:underline">
                    View Details →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-[#FF6B00]" />
                <h3 className="font-bold text-slate-900 text-base">Request Details</h3>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Request Number</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">{selectedRequest.requestNumber}</span>
                </div>
                {getStatusBadge(selectedRequest.status)}
              </div>

              <div>
                <span className="text-slate-400 font-medium block">Title / Type</span>
                <span className="font-bold text-slate-800 text-sm">{selectedRequest.displayTitle}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl">
                <div>
                  <span className="text-slate-400 font-medium block">Applicant</span>
                  <span className="font-semibold text-slate-800">{selectedRequest.employeeName}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Department</span>
                  <span className="font-semibold text-slate-800">{selectedRequest.department}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-medium block mb-1">Details & Justification</span>
                <p className="p-3 bg-slate-50 rounded-xl text-slate-700 leading-relaxed border border-slate-100">
                  {selectedRequest.reason || selectedRequest.purpose || selectedRequest.details}
                </p>
              </div>

              {selectedRequest.supervisorNote && (
                <div>
                  <span className="text-[#0B2545] font-bold block mb-1">Supervisor Review Remarks</span>
                  <p className="p-3 bg-blue-50/70 rounded-xl text-slate-700 border border-blue-100 leading-relaxed">
                    {selectedRequest.supervisorNote}
                  </p>
                </div>
              )}

              {selectedRequest.adminNote && (
                <div>
                  <span className="text-[#0B2545] font-bold block mb-1">HR Administration Note</span>
                  <p className="p-3 bg-blue-50/70 rounded-xl text-slate-700 border border-blue-100 leading-relaxed">
                    {selectedRequest.adminNote}
                  </p>
                </div>
              )}

              {selectedRequest.assignedVehicle && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                  <span className="text-emerald-800 font-bold block">Assigned Transport</span>
                  <p className="text-emerald-900 mt-1 font-semibold">
                    {selectedRequest.assignedVehicle} · Driver: {selectedRequest.assignedDriver} ({selectedRequest.driverPhone})
                  </p>
                </div>
              )}
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setSelectedRequest(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 text-white hover:bg-slate-700"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Create Other Request Modal (Certificate / Overtime / Letters) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#FF6B00]" />
                <h3 className="font-bold text-slate-900 text-base">New Employee Request</h3>
              </div>
              <button
                onClick={handleCloseModal}
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

            <form onSubmit={handleOtherSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Request Category *
                </label>
                <select
                  value={requestType}
                  onChange={(e) => {
                    const val = e.target.value as OtherRequestType;
                    setRequestType(val);
                    if (val === 'salary_letter' && !title) setTitle('Salary Certificate / Bank Letter');
                    else if (val === 'experience_letter' && !title) setTitle('Experience & Service Certificate');
                    else if (val === 'overtime' && !title) setTitle('Site Overtime Approval Request');
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B2545] outline-none"
                >
                  <option value="salary_letter">Salary Certificate (Bank Loan / Embassy NOC)</option>
                  <option value="experience_letter">Experience / Service Letter</option>
                  <option value="certificate">Chamber of Commerce Attestation</option>
                  <option value="overtime">Overtime Hours Approval</option>
                  <option value="other">Other Official Request</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Request Subject / Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Salary Certificate addressed to Alinma Bank"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B2545] outline-none"
                />
              </div>

              {requestType === 'overtime' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Overtime Hours Claimed *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    step="0.5"
                    value={overtimeHours}
                    onChange={(e) => setOvertimeHours(parseFloat(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B2545] outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Details & Specific Requirements *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Specify recipient organization, purpose, dates of extra site shifts, or special instructions..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B2545] outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#FF6B00] hover:bg-[#e05e00] text-white shadow-xs transition-colors"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
