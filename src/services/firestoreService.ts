import {
  Announcement,
  Employee,
  EmployeeDocument,
  LeaveRequest,
  NotificationItem,
  OtherRequest,
  UserProfile,
  VehicleRequest,
} from '../types';

// Default initial DSI company seed records
export const INITIAL_EMPLOYEES: Employee[] = [
  {
    employeeId: 'DSI-1001',
    name: 'Ahmed Al-Zahrani',
    email: 'ahmed.zahrani@desertsides.com',
    mobile: '+966 50 123 4567',
    nationality: 'Saudi Arabian',
    department: 'Civil & Construction',
    designation: 'Senior Project Engineer',
    joiningDate: '2021-03-15',
    reportingManager: 'Eng. Khalid Al-Otaibi',
    photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&auto=format&fit=crop&q=80',
    iqamaNumber: '1084920194',
    iqamaExpiry: '2027-11-20',
    passportNumber: 'K1948201',
    passportExpiry: '2028-06-15',
    status: 'active',
    annualLeaveBalance: 24,
    sickLeaveBalance: 15,
    emergencyLeaveBalance: 5,
    unpaidLeaveBalance: 30,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    employeeId: 'DSI-1002',
    name: 'Mohd Iqbal Lakkal',
    email: 'mohdiqballakkal@gmail.com',
    mobile: '+966 54 889 9120',
    nationality: 'Indian',
    department: 'Operations & Maintenance',
    designation: 'Operations Superintendent',
    joiningDate: '2019-08-01',
    reportingManager: 'Tariq Mansour',
    photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&auto=format&fit=crop&q=80',
    iqamaNumber: '2491029381',
    iqamaExpiry: '2027-05-14',
    passportNumber: 'Z5819024',
    passportExpiry: '2029-01-10',
    status: 'active',
    annualLeaveBalance: 28,
    sickLeaveBalance: 12,
    emergencyLeaveBalance: 4,
    unpaidLeaveBalance: 30,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    employeeId: 'DSI-1003',
    name: 'Tariq Mansour',
    email: 'tariq.mansour@desertsides.com',
    mobile: '+966 55 992 3144',
    nationality: 'Jordanian',
    department: 'Heavy Fleet & Logistics',
    designation: 'Fleet & Logistics Supervisor',
    joiningDate: '2018-02-10',
    reportingManager: 'Abdulaziz Al-Dosari',
    photoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=240&auto=format&fit=crop&q=80',
    iqamaNumber: '2301948291',
    iqamaExpiry: '2027-08-30',
    passportNumber: 'J8829104',
    passportExpiry: '2028-09-22',
    status: 'active',
    annualLeaveBalance: 18,
    sickLeaveBalance: 14,
    emergencyLeaveBalance: 5,
    unpaidLeaveBalance: 30,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    employeeId: 'DSI-1004',
    name: 'Fatima Al-Harbi',
    email: 'fatima.harbi@desertsides.com',
    mobile: '+966 56 443 8192',
    nationality: 'Saudi Arabian',
    department: 'Human Resources & Admin',
    designation: 'HR & Government Relations Specialist',
    joiningDate: '2022-01-10',
    reportingManager: 'HR Director',
    photoURL: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=240&auto=format&fit=crop&q=80',
    iqamaNumber: '1092837461',
    iqamaExpiry: '2029-04-12',
    passportNumber: 'S3910294',
    passportExpiry: '2030-02-18',
    status: 'active',
    annualLeaveBalance: 21,
    sickLeaveBalance: 15,
    emergencyLeaveBalance: 5,
    unpaidLeaveBalance: 30,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    employeeId: 'DSI-1005',
    name: 'Salem Al-Dossary',
    email: 'salem.dossary@desertsides.com',
    mobile: '+966 50 771 9021',
    nationality: 'Saudi Arabian',
    department: 'HSE Safety & Quality',
    designation: 'Lead HSE Safety Officer',
    joiningDate: '2020-05-18',
    reportingManager: 'Safety Director',
    photoURL: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=240&auto=format&fit=crop&q=80',
    iqamaNumber: '1074920192',
    iqamaExpiry: '2028-10-15',
    passportNumber: 'P2019481',
    passportExpiry: '2029-08-04',
    status: 'active',
    annualLeaveBalance: 19,
    sickLeaveBalance: 15,
    emergencyLeaveBalance: 5,
    unpaidLeaveBalance: 30,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    employeeId: 'DSI-1006',
    name: 'Ramesh Kumar',
    email: 'ramesh.kumar@desertsides.com',
    mobile: '+966 53 118 7654',
    nationality: 'Indian',
    department: 'Heavy Fleet & Logistics',
    designation: 'Heavy Equipment Operator',
    joiningDate: '2021-11-04',
    reportingManager: 'Tariq Mansour',
    photoURL: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=240&auto=format&fit=crop&q=80',
    iqamaNumber: '2418294012',
    iqamaExpiry: '2027-04-18',
    passportNumber: 'M9102948',
    passportExpiry: '2028-12-01',
    status: 'active',
    annualLeaveBalance: 14,
    sickLeaveBalance: 15,
    emergencyLeaveBalance: 3,
    unpaidLeaveBalance: 30,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Aramco Site Safety Compliance & Summer Working Hours',
    content: 'All DSI site personnel in Eastern Province (Ras Tanura, Berri, and Jubail industrial sites) must follow mid-day work regulations and wear required high-visibility DSI PPE. Hydration breaks are mandatory.',
    category: 'Safety',
    priority: 'urgent',
    authorName: 'Salem Al-Dossary (Lead HSE)',
    authorUid: 'admin-seed-hse',
    targetDepartment: 'All Sites & Logistics',
    pinned: true,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'ann-2',
    title: 'Annual Iqama & Medical Insurance Renewal Notice 2026/2027',
    content: 'HR Department has initiated the electronic Muqeem Iqama and CCHI health insurance renewals. Employees with expiring Iqamas in the next 60 days please verify current family and dependent records in the portal.',
    category: 'HR',
    priority: 'important',
    authorName: 'Fatima Al-Harbi (HR)',
    authorUid: 'admin-seed-hr',
    targetDepartment: 'All Departments',
    pinned: true,
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 'ann-3',
    title: 'Fleet Dispatch New Booking Policy - Dammam Head Office',
    content: 'All project site transit vehicle requests must be submitted at least 24 hours prior to travel. Immediate emergency site dispatch remains accessible via direct supervisor approval.',
    category: 'Operations',
    priority: 'normal',
    authorName: 'Tariq Mansour (Fleet Supervisor)',
    authorUid: 'admin-seed-ops',
    targetDepartment: 'Heavy Fleet & Logistics',
    pinned: false,
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
];

export const INITIAL_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 'leave-101',
    requestNumber: 'LR-2026-0041',
    userId: 'seed-usr-1002',
    employeeId: 'DSI-1002',
    employeeName: 'Mohd Iqbal Lakkal',
    department: 'Operations & Maintenance',
    leaveType: 'Annual',
    startDate: '2026-10-15',
    endDate: '2026-10-30',
    days: 15,
    reason: 'Annual home leave travel with flight booking confirmation.',
    status: 'approved',
    supervisorNote: 'Approved. Eng. Ahmed will cover key maintenance responsibilities during this period.',
    reviewedBy: 'Tariq Mansour',
    reviewedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'leave-102',
    requestNumber: 'LR-2026-0052',
    userId: 'seed-usr-1006',
    employeeId: 'DSI-1006',
    employeeName: 'Ramesh Kumar',
    department: 'Heavy Fleet & Logistics',
    leaveType: 'Emergency',
    startDate: '2026-10-02',
    endDate: '2026-10-06',
    days: 4,
    reason: 'Family emergency requiring urgent leave.',
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000 * 14).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 14).toISOString(),
  },
];

export const INITIAL_VEHICLE_REQUESTS: VehicleRequest[] = [
  {
    id: 'veh-201',
    requestNumber: 'VR-2026-0089',
    userId: 'seed-usr-1002',
    employeeId: 'DSI-1002',
    employeeName: 'Mohd Iqbal Lakkal',
    department: 'Operations & Maintenance',
    date: '2026-10-05',
    requiredTime: '07:30 AM',
    pickupLocation: 'DSI Dammam Central Camp, Al-Khobar Hwy',
    destination: 'Jubail Industrial City - Phase 3 Site',
    purpose: 'Site inspection and heavy generator servicing handover',
    passengersCount: 3,
    remarks: 'Carrying diagnostic instrumentation and toolboxes',
    status: 'approved',
    assignedVehicle: 'Toyota Hilux 4x4 (Plate: 8492-KSA)',
    assignedDriver: 'Mubarak Al-Hajri',
    driverPhone: '+966 54 991 2288',
    supervisorNote: 'Vehicle confirmed. Driver instructed to report at 07:15 AM.',
    reviewedBy: 'Tariq Mansour',
    reviewedAt: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'veh-202',
    requestNumber: 'VR-2026-0094',
    userId: 'seed-usr-1001',
    employeeId: 'DSI-1001',
    employeeName: 'Ahmed Al-Zahrani',
    department: 'Civil & Construction',
    date: '2026-10-08',
    requiredTime: '08:00 AM',
    pickupLocation: 'DSI Head Office, Dammam',
    destination: 'Ras Tanura Project Terminal Gate 4',
    purpose: 'Client technical coordination meeting with project consultant',
    passengersCount: 2,
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
];

export const INITIAL_OTHER_REQUESTS: OtherRequest[] = [
  {
    id: 'oth-301',
    requestNumber: 'REQ-2026-0120',
    userId: 'seed-usr-1002',
    employeeId: 'DSI-1002',
    employeeName: 'Mohd Iqbal Lakkal',
    department: 'Operations & Maintenance',
    requestType: 'salary_letter',
    title: 'Salary Certificate for Bank Loan / Finance',
    details: 'Official stamped salary certificate addressed to Al Rajhi Bank for vehicle financing.',
    status: 'approved',
    adminNote: 'Prepared and stamped with DSI Chamber of Commerce seal. Available for collection at HR desk.',
    reviewedBy: 'Fatima Al-Harbi',
    reviewedAt: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const INITIAL_DOCUMENTS: EmployeeDocument[] = [
  {
    id: 'doc-1',
    employeeId: 'DSI-1002',
    title: 'Muqeem Electronic Iqama Card',
    type: 'iqama',
    documentNumber: '2491029381',
    expiryDate: '2027-05-14',
    fileName: 'Iqama_Mohd_Iqbal.pdf',
    fileSize: '420 KB',
    uploadedAt: '2025-06-10',
    verified: true,
  },
  {
    id: 'doc-2',
    employeeId: 'DSI-1002',
    title: 'International Travel Passport',
    type: 'passport',
    documentNumber: 'Z5819024',
    expiryDate: '2029-01-10',
    fileName: 'Passport_Scan.pdf',
    fileSize: '1.2 MB',
    uploadedAt: '2025-06-10',
    verified: true,
  },
  {
    id: 'doc-3',
    employeeId: 'DSI-1002',
    title: 'DSI Employee Identification Badge',
    type: 'employee_id',
    documentNumber: 'DSI-1002-ID',
    expiryDate: '2027-12-31',
    fileName: 'DSI_Smart_ID_Card.png',
    fileSize: '310 KB',
    uploadedAt: '2025-01-05',
    verified: true,
  },
  {
    id: 'doc-4',
    employeeId: 'DSI-1002',
    title: 'DSI Unlimited Employment Contract (GOSI / Qiwa)',
    type: 'contract',
    documentNumber: 'QIWA-2019-91823',
    expiryDate: '2027-08-01',
    fileName: 'Qiwa_Employment_Contract_DSI.pdf',
    fileSize: '890 KB',
    uploadedAt: '2024-08-01',
    verified: true,
  },
];

// In-memory application state stores (no Firestore or Storage used per instructions)
let memoryEmployees: Employee[] = [...INITIAL_EMPLOYEES];
let memoryLeaveRequests: LeaveRequest[] = [...INITIAL_LEAVE_REQUESTS];
let memoryVehicleRequests: VehicleRequest[] = [...INITIAL_VEHICLE_REQUESTS];
let memoryOtherRequests: OtherRequest[] = [...INITIAL_OTHER_REQUESTS];
let memoryAnnouncements: Announcement[] = [...INITIAL_ANNOUNCEMENTS];
let memoryDocuments: EmployeeDocument[] = [...INITIAL_DOCUMENTS];

export async function getEmployees(): Promise<Employee[]> {
  return [...memoryEmployees];
}

export async function saveEmployee(employee: Employee): Promise<void> {
  const index = memoryEmployees.findIndex(e => e.employeeId === employee.employeeId);
  if (index >= 0) {
    memoryEmployees[index] = { ...employee, updatedAt: new Date().toISOString() };
  } else {
    memoryEmployees.unshift({ ...employee, updatedAt: new Date().toISOString() });
  }
}

export async function getLeaveRequests(userId?: string): Promise<LeaveRequest[]> {
  if (userId) {
    return memoryLeaveRequests.filter(r => r.userId === userId);
  }
  return [...memoryLeaveRequests];
}

export async function createLeaveRequest(request: Omit<LeaveRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const newId = `leave-${Date.now()}`;
  const fullRequest: LeaveRequest = {
    ...request,
    id: newId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  memoryLeaveRequests.unshift(fullRequest);
  return newId;
}

export async function updateLeaveRequestStatus(
  id: string,
  status: 'approved' | 'rejected',
  supervisorNote: string,
  reviewedBy: string
): Promise<void> {
  const idx = memoryLeaveRequests.findIndex(r => r.id === id);
  if (idx >= 0) {
    memoryLeaveRequests[idx] = {
      ...memoryLeaveRequests[idx],
      status,
      supervisorNote,
      reviewedBy,
      reviewedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
}

export async function getVehicleRequests(userId?: string): Promise<VehicleRequest[]> {
  if (userId) {
    return memoryVehicleRequests.filter(r => r.userId === userId);
  }
  return [...memoryVehicleRequests];
}

export async function createVehicleRequest(request: Omit<VehicleRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const newId = `veh-${Date.now()}`;
  const fullRequest: VehicleRequest = {
    ...request,
    id: newId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  memoryVehicleRequests.unshift(fullRequest);
  return newId;
}

export async function updateVehicleRequestStatus(
  id: string,
  status: 'approved' | 'rejected',
  assignedVehicle?: string,
  assignedDriver?: string,
  driverPhone?: string,
  supervisorNote?: string,
  reviewedBy?: string
): Promise<void> {
  const idx = memoryVehicleRequests.findIndex(r => r.id === id);
  if (idx >= 0) {
    memoryVehicleRequests[idx] = {
      ...memoryVehicleRequests[idx],
      status,
      ...(assignedVehicle && { assignedVehicle }),
      ...(assignedDriver && { assignedDriver }),
      ...(driverPhone && { driverPhone }),
      ...(supervisorNote && { supervisorNote }),
      ...(reviewedBy && { reviewedBy }),
      reviewedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
}

export async function getOtherRequests(userId?: string): Promise<OtherRequest[]> {
  if (userId) {
    return memoryOtherRequests.filter(r => r.userId === userId);
  }
  return [...memoryOtherRequests];
}

export async function createOtherRequest(request: Omit<OtherRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const newId = `oth-${Date.now()}`;
  const fullRequest: OtherRequest = {
    ...request,
    id: newId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  memoryOtherRequests.unshift(fullRequest);
  return newId;
}

export async function updateOtherRequestStatus(
  id: string,
  status: 'approved' | 'rejected',
  adminNote: string,
  reviewedBy: string
): Promise<void> {
  const idx = memoryOtherRequests.findIndex(r => r.id === id);
  if (idx >= 0) {
    memoryOtherRequests[idx] = {
      ...memoryOtherRequests[idx],
      status,
      adminNote,
      reviewedBy,
      reviewedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
}

export async function getAnnouncements(): Promise<Announcement[]> {
  return [...memoryAnnouncements];
}

export async function createAnnouncement(announcement: Omit<Announcement, 'id' | 'createdAt'>): Promise<string> {
  const newId = `ann-${Date.now()}`;
  const fullAnn: Announcement = {
    ...announcement,
    id: newId,
    createdAt: new Date().toISOString(),
  };
  memoryAnnouncements.unshift(fullAnn);
  return newId;
}

export async function deleteAnnouncement(id: string): Promise<void> {
  memoryAnnouncements = memoryAnnouncements.filter(a => a.id !== id);
}

export async function getNotifications(userId: string): Promise<NotificationItem[]> {
  return [
    {
      id: 'notif-1',
      userId,
      title: 'Leave Request Approved',
      message: 'Your annual leave request (LR-2026-0041) for 15 days has been approved.',
      type: 'leave_update',
      read: false,
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: 'notif-2',
      userId,
      title: 'Vehicle Dispatch Assigned',
      message: 'Driver Mubarak Al-Hajri (Plate: 8492-KSA) has been allocated for Jubail site trip.',
      type: 'vehicle_update',
      read: false,
      createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    },
    {
      id: 'notif-3',
      userId,
      title: 'Company Circular Published',
      message: 'Aramco site summer safety precautions and mid-day rest advisory posted.',
      type: 'announcement',
      read: true,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ];
}

export async function markNotificationAsRead(id: string): Promise<void> {
  // In-memory handled
}

export async function createNotification(notif: Omit<NotificationItem, 'id'>): Promise<string> {
  return `notif-${Date.now()}`;
}

export async function getEmployeeDocuments(employeeId: string): Promise<EmployeeDocument[]> {
  return memoryDocuments.filter(d => d.employeeId === employeeId);
}

export async function addEmployeeDocument(docData: Omit<EmployeeDocument, 'id'>): Promise<string> {
  const newId = `doc-${Date.now()}`;
  memoryDocuments.unshift({
    ...docData,
    id: newId,
  });
  return newId;
}
