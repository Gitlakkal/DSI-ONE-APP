export type UserRole = 'employee' | 'supervisor' | 'hr_admin' | 'super_admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  employeeId?: string;
  photoURL?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  id?: string;
  employeeId: string;
  userId?: string;
  name: string;
  email: string;
  mobile: string;
  nationality: string;
  department: string;
  designation: string;
  joiningDate: string;
  reportingManager: string;
  photoURL?: string;
  iqamaNumber: string;
  iqamaExpiry: string;
  passportNumber: string;
  passportExpiry: string;
  status: 'active' | 'on_leave' | 'resigned' | 'terminated';
  annualLeaveBalance: number;
  sickLeaveBalance: number;
  emergencyLeaveBalance: number;
  unpaidLeaveBalance: number;
  createdAt: string;
  updatedAt: string;
}

export type LeaveType = 'Annual' | 'Sick' | 'Emergency' | 'Unpaid' | 'Paternity' | 'Hajj';

export interface LeaveRequest {
  id: string;
  requestNumber: string;
  userId: string;
  employeeId: string;
  employeeName: string;
  department: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  attachmentUrl?: string;
  attachmentName?: string;
  status: 'pending' | 'approved' | 'rejected';
  supervisorNote?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleRequest {
  id: string;
  requestNumber: string;
  userId: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: string;
  requiredTime: string;
  pickupLocation: string;
  destination: string;
  purpose: string;
  passengersCount: number;
  remarks?: string;
  status: 'pending' | 'approved' | 'rejected';
  assignedVehicle?: string;
  assignedDriver?: string;
  driverPhone?: string;
  supervisorNote?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type OtherRequestType = 'certificate' | 'overtime' | 'salary_letter' | 'experience_letter' | 'other';

export interface OtherRequest {
  id: string;
  requestNumber: string;
  userId: string;
  employeeId: string;
  employeeName: string;
  department: string;
  requestType: OtherRequestType;
  title: string;
  details: string;
  overtimeHours?: number;
  status: 'pending' | 'approved' | 'rejected';
  adminNote?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'General' | 'HR' | 'Safety' | 'Operations' | 'Holiday';
  priority: 'normal' | 'important' | 'urgent';
  authorName: string;
  authorUid: string;
  targetDepartment?: string;
  pinned?: boolean;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  employeeId?: string;
  title: string;
  message: string;
  type: 'leave_update' | 'vehicle_update' | 'request_update' | 'announcement' | 'reminder';
  read: boolean;
  link?: string;
  createdAt: string;
}

export type DocumentType = 'iqama' | 'passport' | 'employee_id' | 'contract' | 'certificate' | 'other';

export interface EmployeeDocument {
  id: string;
  employeeId: string;
  userId?: string;
  title: string;
  type: DocumentType;
  documentNumber?: string;
  expiryDate?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  uploadedAt: string;
  verified: boolean;
}
