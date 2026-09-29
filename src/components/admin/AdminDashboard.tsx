import React, { useState } from 'react';
import {
  AlertCircle,
  Building,
  Calendar,
  Car,
  CheckCircle2,
  Clock,
  Edit2,
  FileCheck,
  FileText,
  Mail,
  MapPin,
  Megaphone,
  Phone,
  Plus,
  Search,
  Shield,
  ShieldCheck,
  Trash2,
  Truck,
  UserCheck,
  UserPlus,
  Users,
  X,
  XCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  Announcement,
  Employee,
  LeaveRequest,
  OtherRequest,
  UserRole,
  VehicleRequest,
} from '../../types';

interface AdminDashboardProps {
  employees: Employee[];
  leaveRequests: LeaveRequest[];
  vehicleRequests: VehicleRequest[];
  otherRequests: OtherRequest[];
  announcements: Announcement[];
  onApproveLeave: (id: string, note: string) => Promise<void>;
  onRejectLeave: (id: string, note: string) => Promise<void>;
  onApproveVehicle: (id: string, vehicle: string, driver: string, driverPhone: string, note: string) => Promise<void>;
  onRejectVehicle: (id: string, note: string) => Promise<void>;
  onApproveOther: (id: string, note: string) => Promise<void>;
  onRejectOther: (id: string, note: string) => Promise<void>;
  onSaveEmployee: (employee: Employee) => Promise<void>;
  onCreateAnnouncement: (ann: Omit<Announcement, 'id' | 'createdAt'>) => Promise<void>;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  employees,
  leaveRequests,
  vehicleRequests,
  otherRequests,
  announcements,
  onApproveLeave,
  onRejectLeave,
  onApproveVehicle,
  onRejectVehicle,
  onApproveOther,
  onRejectOther,
  onSaveEmployee,
  onCreateAnnouncement,
}) => {
  const { currentEmployee, effectiveRole } = useAuth();
  const [activeAdminTab, setActiveAdminTab] = useState<'requests' | 'employees' | 'roles' | 'announcements'>('requests');

  // Search & Filter
  const [requestFilter, setRequestFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [employeeSearch, setEmployeeSearch] = useState('');

  // Modals
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [vehicleApprovalModalReq, setVehicleApprovalModalReq] = useState<VehicleRequest | null>(null);
  const [reviewNoteModal, setReviewNoteModal] = useState<{
    type: 'leave' | 'other';
    action: 'approve' | 'reject';
    item: any;
  } | null>(null);

  // Vehicle Dispatch Form State
  const [assignedVehicle, setAssignedVehicle] = useState('Toyota Hilux 4x4 (Plate: 8492-KSA)');
  const [assignedDriver, setAssignedDriver] = useState('Mubarak Al-Hajri');
  const [driverPhone, setDriverPhone] = useState('+966 54 991 2288');
  const [dispatchNote, setDispatchNote] = useState('Authorized for site transit.');

  // Generic Review Note State
  const [reviewNoteText, setReviewNoteText] = useState('');

  // Employee Form State
  const [empForm, setEmpForm] = useState<Partial<Employee>>({
    employeeId: '',
    name: '',
    email: '',
    mobile: '+966 5',
    nationality: 'Saudi Arabian',
    department: 'Civil & Construction',
    designation: '',
    joiningDate: new Date().toISOString().split('T')[0],
    reportingManager: 'Eng. Khalid Al-Otaibi',
    iqamaNumber: '',
    iqamaExpiry: '',
    passportNumber: '',
    passportExpiry: '',
    status: 'active',
    annualLeaveBalance: 30,
    sickLeaveBalance: 15,
    emergencyLeaveBalance: 5,
    unpaidLeaveBalance: 30,
  });

  // Calculate Metrics
  const totalEmployeesCount = employees.length;
  const pendingLeaves = leaveRequests.filter(r => r.status === 'pending');
  const pendingVehicles = vehicleRequests.filter(r => r.status === 'pending');
  const pendingOthers = otherRequests.filter(r => r.status === 'pending');
  const totalPendingRequests = pendingLeaves.length + pendingVehicles.length + pendingOthers.length;

  const employeesOnLeave = employees.filter(e => e.status === 'on_leave').length || 1;
  const activeVehicleTrips = vehicleRequests.filter(v => v.status === 'approved').length;

  // Handle Dispatch Approval
  const handleConfirmVehicleApproval = async () => {
    if (!vehicleApprovalModalReq) return;
    try {
      await onApproveVehicle(
        vehicleApprovalModalReq.id,
        assignedVehicle,
        assignedDriver,
        driverPhone,
        dispatchNote
      );
      setVehicleApprovalModalReq(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Review Note Submit
  const handleConfirmReviewNote = async () => {
    if (!reviewNoteModal) return;
    const { type, action, item } = reviewNoteModal;
    try {
      if (type === 'leave') {
        if (action === 'approve') await onApproveLeave(item.id, reviewNoteText || 'Approved by Supervisor/HR.');
        else await onRejectLeave(item.id, reviewNoteText || 'Rejected by Supervisor/HR.');
      } else {
        if (action === 'approve') await onApproveOther(item.id, reviewNoteText || 'Approved by Administration.');
        else await onRejectOther(item.id, reviewNoteText || 'Rejected by Administration.');
      }
      setReviewNoteModal(null);
      setReviewNoteText('');
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Save Employee
  const handleSaveEmployeeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!empForm.employeeId || !empForm.name || !empForm.email) return;

    try {
      await onSaveEmployee({
        employeeId: empForm.employeeId,
        name: empForm.name,
        email: empForm.email,
        mobile: empForm.mobile || '+966 50 000 0000',
        nationality: empForm.nationality || 'Saudi Arabian',
        department: empForm.department || 'Operations',
        designation: empForm.designation || 'Staff',
        joiningDate: empForm.joiningDate || new Date().toISOString().split('T')[0],
        reportingManager: empForm.reportingManager || 'Management',
        iqamaNumber: empForm.iqamaNumber || '1000000000',
        iqamaExpiry: empForm.iqamaExpiry || '2028-12-31',
        passportNumber: empForm.passportNumber || 'N/A',
        passportExpiry: empForm.passportExpiry || '2029-12-31',
        status: (empForm.status as any) || 'active',
        annualLeaveBalance: Number(empForm.annualLeaveBalance) || 30,
        sickLeaveBalance: Number(empForm.sickLeaveBalance) || 15,
        emergencyLeaveBalance: Number(empForm.emergencyLeaveBalance) || 5,
        unpaidLeaveBalance: Number(empForm.unpaidLeaveBalance) || 30,
        photoURL: empForm.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80',
        createdAt: empForm.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      setIsAddEmployeeModalOpen(false);
      setEditingEmployee(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Admin Identity */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Admin & Operations Hub
            </h1>
            <span className="text-xs font-bold text-[#FF6B00] bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
              {effectiveRole === 'super_admin' ? 'Super Admin' : effectiveRole === 'hr_admin' ? 'HR / Admin' : 'Supervisor'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Desert Sides International management console for employee records, leaves, vehicle fleet dispatch, and approvals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEmpForm({
                employeeId: `DSI-${Math.floor(1010 + Math.random() * 900)}`,
                name: '',
                email: '',
                mobile: '+966 5',
                nationality: 'Saudi Arabian',
                department: 'Civil & Construction',
                designation: 'Field Engineer',
                joiningDate: new Date().toISOString().split('T')[0],
                reportingManager: 'Operations Director',
                iqamaNumber: '',
                iqamaExpiry: '2028-12-31',
                passportNumber: '',
                passportExpiry: '2029-12-31',
                status: 'active',
                annualLeaveBalance: 30,
                sickLeaveBalance: 15,
                emergencyLeaveBalance: 5,
                unpaidLeaveBalance: 30,
              });
              setEditingEmployee(null);
              setIsAddEmployeeModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs bg-[#FF6B00] hover:bg-[#e05e00] text-white shadow-xs transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Add Employee
          </button>
        </div>
      </div>

      {/* 2. Admin 4 KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Employees */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Employees</span>
            <Users className="w-4 h-4 text-[#0B2545]" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black text-[#0B2545]">{totalEmployeesCount}</span>
            <span className="text-xs text-slate-400 font-medium">registered</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">DSI Eastern Province staff</p>
        </div>

        {/* Pending Requests */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 rounded-2xl p-4 sm:p-5 border border-amber-200 shadow-xs">
          <div className="flex items-center justify-between text-amber-700 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pending Requests</span>
            <Clock className="w-4 h-4 text-[#FF6B00]" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black text-[#FF6B00]">{totalPendingRequests}</span>
            <span className="text-xs text-amber-800 font-medium">awaiting action</span>
          </div>
          <p className="text-[11px] text-amber-900 mt-2">
            {pendingLeaves.length} Leave · {pendingVehicles.length} Vehicle · {pendingOthers.length} Other
          </p>
        </div>

        {/* Employees on Leave */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Employees on Leave</span>
            <Calendar className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black text-slate-800">{employeesOnLeave}</span>
            <span className="text-xs text-slate-400 font-medium">on approved leave</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Annual & medical leaves</p>
        </div>

        {/* Vehicle Requests */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Vehicle Requests</span>
            <Car className="w-4 h-4 text-purple-600" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black text-slate-800">{vehicleRequests.length}</span>
            <span className="text-xs text-purple-700 font-semibold">{pendingVehicles.length} pending</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">{activeVehicleTrips} trips dispatched</p>
        </div>
      </div>

      {/* 3. Navigation Tabs within Admin */}
      <div className="flex border-b border-slate-200 gap-6 overflow-x-auto">
        <button
          onClick={() => setActiveAdminTab('requests')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition-all ${
            activeAdminTab === 'requests'
              ? 'border-[#FF6B00] text-[#0B2545]'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          Pending Approvals Center ({totalPendingRequests})
        </button>

        <button
          onClick={() => setActiveAdminTab('employees')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition-all ${
            activeAdminTab === 'employees'
              ? 'border-[#FF6B00] text-[#0B2545]'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <Users className="w-4 h-4" />
          Employee Directory ({employees.length})
        </button>

        <button
          onClick={() => setActiveAdminTab('roles')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition-all ${
            activeAdminTab === 'roles'
              ? 'border-[#FF6B00] text-[#0B2545]'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          User Roles & Access Control
        </button>
      </div>

      {/* 4. Tab 1: Pending Approvals Center */}
      {activeAdminTab === 'requests' && (
        <div className="space-y-6">
          {/* Status Filter for Requests */}
          <div className="flex items-center justify-between bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
            <span className="text-xs font-bold text-slate-700">Filter Request Status:</span>
            <div className="flex items-center gap-1.5">
              {(['pending', 'approved', 'rejected', 'all'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setRequestFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${
                    requestFilter === st
                      ? 'bg-[#0B2545] text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Section: Leave Requests Pending Approval */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#0B2545]" />
                <h3 className="font-bold text-slate-900 text-sm">Leave Applications ({leaveRequests.filter(r => requestFilter === 'all' || r.status === requestFilter).length})</h3>
              </div>
            </div>

            {leaveRequests.filter(r => requestFilter === 'all' || r.status === requestFilter).length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">No leave requests in this status.</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {leaveRequests.filter(r => requestFilter === 'all' || r.status === requestFilter).map((req) => (
                  <div key={req.id} className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold text-[#0B2545] bg-blue-50 px-2 py-0.5 rounded">
                          {req.requestNumber}
                        </span>
                        <span className="font-bold text-slate-900 text-sm">{req.employeeName}</span>
                        <span className="text-xs text-slate-400">({req.employeeId} · {req.department})</span>
                      </div>
                      <p className="text-xs text-slate-700">
                        <strong>{req.leaveType} Leave:</strong> {req.startDate} to {req.endDate} ({req.days} days)
                      </p>
                      <p className="text-[11px] text-slate-500 mt-1">Reason: {req.reason}</p>
                      {req.supervisorNote && (
                        <p className="text-[11px] text-blue-700 mt-0.5">Note: {req.supervisorNote} ({req.reviewedBy})</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {req.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => setReviewNoteModal({ type: 'leave', action: 'approve', item: req })}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button
                            onClick={() => setReviewNoteModal({ type: 'leave', action: 'reject', item: req })}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Reject
                          </button>
                        </>
                      ) : (
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full capitalize ${
                          req.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {req.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section: Vehicle Requests & Dispatch */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-[#FF6B00]" />
                <h3 className="font-bold text-slate-900 text-sm">Vehicle Dispatch Bookings ({vehicleRequests.filter(r => requestFilter === 'all' || r.status === requestFilter).length})</h3>
              </div>
            </div>

            {vehicleRequests.filter(r => requestFilter === 'all' || r.status === requestFilter).length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">No vehicle requests in this status.</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {vehicleRequests.filter(r => requestFilter === 'all' || r.status === requestFilter).map((req) => (
                  <div key={req.id} className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold text-[#0B2545] bg-blue-50 px-2 py-0.5 rounded">
                          {req.requestNumber}
                        </span>
                        <span className="font-bold text-slate-900 text-sm">{req.employeeName}</span>
                        <span className="text-xs text-slate-400">({req.employeeId})</span>
                      </div>
                      <p className="text-xs text-slate-700">
                        <strong>Route:</strong> {req.pickupLocation} → {req.destination} ({req.date} at {req.requiredTime})
                      </p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Purpose: {req.purpose} ({req.passengersCount} pax)
                      </p>
                      {req.assignedVehicle && (
                        <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                          Assigned: {req.assignedVehicle} · Driver: {req.assignedDriver} ({req.driverPhone})
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {req.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => {
                              setVehicleApprovalModalReq(req);
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#FF6B00] hover:bg-[#e05e00] text-white shadow-2xs"
                          >
                            <Truck className="w-3.5 h-3.5" /> Approve & Assign Driver
                          </button>
                          <button
                            onClick={() => onRejectVehicle(req.id, 'Vehicle not available at required time')}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Reject
                          </button>
                        </>
                      ) : (
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full capitalize ${
                          req.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {req.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section: Other / Certificate Requests */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-600" />
                <h3 className="font-bold text-slate-900 text-sm">Certificate & Overtime Inquiries ({otherRequests.filter(r => requestFilter === 'all' || r.status === requestFilter).length})</h3>
              </div>
            </div>

            {otherRequests.filter(r => requestFilter === 'all' || r.status === requestFilter).length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">No inquiries in this status.</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {otherRequests.filter(r => requestFilter === 'all' || r.status === requestFilter).map((req) => (
                  <div key={req.id} className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold text-[#0B2545] bg-blue-50 px-2 py-0.5 rounded">
                          {req.requestNumber}
                        </span>
                        <span className="font-bold text-slate-900 text-sm">{req.title}</span>
                        <span className="text-xs text-slate-400">({req.employeeName})</span>
                      </div>
                      <p className="text-xs text-slate-700">{req.details}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {req.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => setReviewNoteModal({ type: 'other', action: 'approve', item: req })}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Approve & Stamp
                          </button>
                          <button
                            onClick={() => setReviewNoteModal({ type: 'other', action: 'reject', item: req })}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Reject
                          </button>
                        </>
                      ) : (
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full capitalize ${
                          req.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {req.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. Tab 2: Employee Directory */}
      {activeAdminTab === 'employees' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search staff by name, employee ID, designation, or department..."
                value={employeeSearch}
                onChange={(e) => setEmployeeSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#0B2545] outline-none"
              />
            </div>

            <button
              onClick={() => {
                setEmpForm({
                  employeeId: `DSI-${Math.floor(1010 + Math.random() * 900)}`,
                  name: '',
                  email: '',
                  mobile: '+966 5',
                  nationality: 'Saudi Arabian',
                  department: 'Civil & Construction',
                  designation: '',
                  joiningDate: new Date().toISOString().split('T')[0],
                  reportingManager: 'Management',
                  iqamaNumber: '',
                  iqamaExpiry: '2028-12-31',
                  passportNumber: '',
                  passportExpiry: '2029-12-31',
                  status: 'active',
                  annualLeaveBalance: 30,
                  sickLeaveBalance: 15,
                  emergencyLeaveBalance: 5,
                  unpaidLeaveBalance: 30,
                });
                setEditingEmployee(null);
                setIsAddEmployeeModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs bg-[#FF6B00] hover:bg-[#e05e00] text-white shadow-xs whitespace-nowrap"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Add Employee
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Employee</th>
                    <th className="py-3 px-4">Department & Role</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Iqama / Passport</th>
                    <th className="py-3 px-4">Annual Balance</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {employees
                    .filter((e) => {
                      if (!employeeSearch.trim()) return true;
                      const q = employeeSearch.toLowerCase();
                      return (
                        e.name.toLowerCase().includes(q) ||
                        e.employeeId.toLowerCase().includes(q) ||
                        e.department.toLowerCase().includes(q) ||
                        e.designation.toLowerCase().includes(q)
                      );
                    })
                    .map((emp) => (
                      <tr key={emp.employeeId} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 flex-shrink-0">
                              {emp.photoURL ? (
                                <img src={emp.photoURL} alt={emp.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center font-bold text-xs">
                                  {emp.name.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{emp.name}</p>
                              <p className="font-mono text-[10px] text-slate-400">{emp.employeeId}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <p className="font-semibold text-slate-800">{emp.department}</p>
                          <p className="text-[11px] text-slate-500">{emp.designation}</p>
                        </td>

                        <td className="py-3 px-4">
                          <p className="text-slate-800 font-medium">{emp.mobile}</p>
                          <p className="text-[11px] text-slate-500 truncate max-w-[140px]">{emp.email}</p>
                        </td>

                        <td className="py-3 px-4">
                          <p className="font-mono text-slate-800">Iqama: {emp.iqamaNumber || 'Saudi National'}</p>
                          <p className="text-[11px] text-slate-400">Exp: {emp.iqamaExpiry || 'N/A'}</p>
                        </td>

                        <td className="py-3 px-4">
                          <span className="font-extrabold text-[#0B2545]">{emp.annualLeaveBalance}</span>
                          <span className="text-slate-400"> days</span>
                        </td>

                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                            emp.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {emp.status.replace('_', ' ')}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              setEmpForm({ ...emp });
                              setEditingEmployee(emp);
                              setIsAddEmployeeModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-[#0B2545] hover:bg-slate-100 transition-colors"
                            title="Edit Employee"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 6. Tab 3: User Roles & Access Control (RBAC) */}
      {activeAdminTab === 'roles' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#FF6B00]" />
                Role-Based Access Control Architecture (RBAC)
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Enforcing multi-tier role permissions according to Saudi Arabia company structure.
              </p>
            </div>

            <span className="text-xs font-bold text-[#0B2545] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
              Zero-Trust Fortress Rules Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900">1. Employee Tier</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">Standard</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Self-service dashboard access, apply for vacation leave, book vehicle transportation, request salary certificates, and view uploaded Iqama/Passport documents.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900">2. Supervisor Tier</span>
                <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">Operational</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Review & approve departmental leaves, manage site transit vehicle dispatch, allocate project team resources, and add review remarks.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900">3. HR / Admin Tier</span>
                <span className="text-[10px] bg-blue-100 text-[#0B2545] font-bold px-2 py-0.5 rounded">Administrative</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Full employee record creation & maintenance, Qiwa contract management, Muqeem Iqama renewals, company-wide announcements, and official stamping.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900">4. Super Admin Tier</span>
                <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded">Executive</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Root management permissions, role assignment, system-wide overrides, fleet provisioning, and security audit log review.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 7. Vehicle Dispatch Modal */}
      {vehicleApprovalModalReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#FF6B00]" />
                <h3 className="font-bold text-slate-900 text-base">Approve & Assign Transport</h3>
              </div>
              <button
                onClick={() => setVehicleApprovalModalReq(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <p><strong>Applicant:</strong> {vehicleApprovalModalReq.employeeName} ({vehicleApprovalModalReq.department})</p>
                <p><strong>Route:</strong> {vehicleApprovalModalReq.pickupLocation} → {vehicleApprovalModalReq.destination}</p>
                <p><strong>Date & Time:</strong> {vehicleApprovalModalReq.date} at {vehicleApprovalModalReq.requiredTime}</p>
                <p><strong>Passengers:</strong> {vehicleApprovalModalReq.passengersCount} pax</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Assign Vehicle *
                </label>
                <select
                  value={assignedVehicle}
                  onChange={(e) => setAssignedVehicle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B2545] outline-none"
                >
                  <option value="Toyota Hilux 4x4 (Plate: 8492-KSA)">Toyota Hilux Double-Cab 4x4 (Plate: 8492-KSA)</option>
                  <option value="Ford Ranger Heavy Duty (Plate: 3109-KSA)">Ford Ranger Heavy Duty (Plate: 3109-KSA)</option>
                  <option value="Toyota Coaster 30-Seater (Plate: 5542-KSA)">Toyota Coaster 30-Seater Crew Bus (Plate: 5542-KSA)</option>
                  <option value="GMC Sierra Site Patrol (Plate: 9912-KSA)">GMC Sierra Site Patrol (Plate: 9912-KSA)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Assigned Driver Name *
                </label>
                <input
                  type="text"
                  required
                  value={assignedDriver}
                  onChange={(e) => setAssignedDriver(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B2545] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Driver Mobile Contact *
                </label>
                <input
                  type="text"
                  required
                  value={driverPhone}
                  onChange={(e) => setDriverPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B2545] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Logistics Dispatch Instructions
                </label>
                <textarea
                  rows={2}
                  value={dispatchNote}
                  onChange={(e) => setDispatchNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B2545] outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setVehicleApprovalModalReq(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmVehicleApproval}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#FF6B00] hover:bg-[#e05e00] text-white shadow-xs"
                >
                  Confirm & Dispatch
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. Generic Review Note Modal */}
      {reviewNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-sm capitalize">
                {reviewNoteModal.action} {reviewNoteModal.type} Request
              </h3>
              <button
                onClick={() => setReviewNoteModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <p className="text-slate-600">
                Provide reviewer remarks, handover details, or rejection justification:
              </p>

              <textarea
                rows={3}
                placeholder="e.g. Approved. Approved handover coverage arranged."
                value={reviewNoteText}
                onChange={(e) => setReviewNoteText(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B2545] outline-none resize-none"
              />

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setReviewNoteModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReviewNote}
                  className={`px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs capitalize ${
                    reviewNoteModal.action === 'approve'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  Confirm {reviewNoteModal.action}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 9. Add / Edit Employee Modal */}
      {isAddEmployeeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-[#FF6B00]" />
                <h3 className="font-bold text-slate-900 text-base">
                  {editingEmployee ? `Edit Employee (${editingEmployee.employeeId})` : 'Register New DSI Employee'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsAddEmployeeModalOpen(false);
                  setEditingEmployee(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEmployeeSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Employee ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={empForm.employeeId}
                    onChange={(e) => setEmpForm({ ...empForm, employeeId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B2545] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name (as per Iqama / Passport) *
                  </label>
                  <input
                    type="text"
                    required
                    value={empForm.name}
                    onChange={(e) => setEmpForm({ ...empForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B2545] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Company Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={empForm.email}
                    onChange={(e) => setEmpForm({ ...empForm, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B2545] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={empForm.mobile}
                    onChange={(e) => setEmpForm({ ...empForm, mobile: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B2545] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Department *
                  </label>
                  <select
                    value={empForm.department}
                    onChange={(e) => setEmpForm({ ...empForm, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B2545] outline-none"
                  >
                    <option value="Civil & Construction">Civil & Construction</option>
                    <option value="Heavy Fleet & Logistics">Heavy Fleet & Logistics</option>
                    <option value="Operations & Maintenance">Operations & Maintenance</option>
                    <option value="HSE Safety & Quality">HSE Safety & Quality</option>
                    <option value="Human Resources & Admin">Human Resources & Admin</option>
                    <option value="Finance & Accounts">Finance & Accounts</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Designation *
                  </label>
                  <input
                    type="text"
                    required
                    value={empForm.designation}
                    onChange={(e) => setEmpForm({ ...empForm, designation: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B2545] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nationality
                  </label>
                  <input
                    type="text"
                    value={empForm.nationality}
                    onChange={(e) => setEmpForm({ ...empForm, nationality: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B2545] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Reporting Manager
                  </label>
                  <input
                    type="text"
                    value={empForm.reportingManager}
                    onChange={(e) => setEmpForm({ ...empForm, reportingManager: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B2545] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Iqama (Muqeem) Number
                  </label>
                  <input
                    type="text"
                    value={empForm.iqamaNumber}
                    onChange={(e) => setEmpForm({ ...empForm, iqamaNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B2545] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Iqama Expiry Date
                  </label>
                  <input
                    type="date"
                    value={empForm.iqamaExpiry}
                    onChange={(e) => setEmpForm({ ...empForm, iqamaExpiry: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B2545] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Annual Leave Balance
                  </label>
                  <input
                    type="number"
                    value={empForm.annualLeaveBalance}
                    onChange={(e) => setEmpForm({ ...empForm, annualLeaveBalance: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B2545] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Sick Leave Balance
                  </label>
                  <input
                    type="number"
                    value={empForm.sickLeaveBalance}
                    onChange={(e) => setEmpForm({ ...empForm, sickLeaveBalance: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B2545] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={empForm.status}
                    onChange={(e) => setEmpForm({ ...empForm, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0B2545] outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="on_leave">On Leave</option>
                    <option value="resigned">Resigned</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddEmployeeModalOpen(false);
                    setEditingEmployee(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#FF6B00] hover:bg-[#e05e00] text-white shadow-xs"
                >
                  Save Employee Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
