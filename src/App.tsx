/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { EmployeeDashboard } from './components/dashboard/EmployeeDashboard';
import { MyProfile } from './components/profile/MyProfile';
import { LeaveSection } from './components/leave/LeaveSection';
import { VehicleRequestSection } from './components/vehicle/VehicleRequestSection';
import { RequestCenter } from './components/requests/RequestCenter';
import { AnnouncementsSection } from './components/announcements/AnnouncementsSection';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { NotificationDrawer } from './components/notifications/NotificationDrawer';
import { AuthModal } from './components/auth/AuthModal';
import { AuthScreen } from './components/auth/AuthScreen';
import { ModularFutureModal } from './components/common/ModularFutureModal';
import {
  Announcement,
  Employee,
  EmployeeDocument,
  LeaveRequest,
  NotificationItem,
  OtherRequest,
  VehicleRequest,
} from './types';
import {
  addEmployeeDocument,
  createAnnouncement,
  createLeaveRequest,
  createNotification,
  createOtherRequest,
  createVehicleRequest,
  deleteAnnouncement,
  getAnnouncements,
  getEmployeeDocuments,
  getEmployees,
  getLeaveRequests,
  getNotifications,
  getOtherRequests,
  getVehicleRequests,
  markNotificationAsRead,
  saveEmployee,
  updateLeaveRequestStatus,
  updateOtherRequestStatus,
  updateVehicleRequestStatus,
} from './services/firestoreService';

function MainApp() {
  const { currentUser, currentEmployee, effectiveRole, isLoading } = useAuth();

  // Navigation State
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modals State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [isOtherModalOpen, setIsOtherModalOpen] = useState(false);
  const [futureModuleInfo, setFutureModuleInfo] = useState<{ isOpen: boolean; title: string; desc: string }>({
    isOpen: false,
    title: '',
    desc: '',
  });

  // Data Collections State
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [vehicleRequests, setVehicleRequests] = useState<VehicleRequest[]>([]);
  const [otherRequests, setOtherRequests] = useState<OtherRequest[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [documents, setDocuments] = useState<EmployeeDocument[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingData(true);
      try {
        const [emps, leaves, vehs, others, anns] = await Promise.all([
          getEmployees(),
          getLeaveRequests(),
          getVehicleRequests(),
          getOtherRequests(),
          getAnnouncements(),
        ]);
        setEmployees(emps);
        setLeaveRequests(leaves);
        setVehicleRequests(vehs);
        setOtherRequests(others);
        setAnnouncements(anns);

        if (currentEmployee) {
          const [notifs, docs] = await Promise.all([
            getNotifications(currentEmployee.userId || 'seed-usr-1002'),
            getEmployeeDocuments(currentEmployee.employeeId),
          ]);
          setNotifications(notifs);
          setDocuments(docs);
        }
      } catch (err) {
        console.error('Error fetching portal data:', err);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, [currentEmployee?.employeeId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <div className="w-8 h-8 border-3 border-[#0B2545] border-t-[#FF6B00] rounded-full animate-spin" />
          <span className="text-xs font-semibold">Connecting to DSI Portal...</span>
        </div>
      </div>
    );
  }

  // If not authenticated, show AuthScreen (Sign In / Sign Up)
  if (!currentUser) {
    return <AuthScreen />;
  }

  // Calculate pending counts
  const userLeaves = leaveRequests.filter(
    (l) => effectiveRole === 'super_admin' || effectiveRole === 'hr_admin' || effectiveRole === 'supervisor' || l.employeeId === currentEmployee?.employeeId
  );
  const userVehicles = vehicleRequests.filter(
    (v) => effectiveRole === 'super_admin' || effectiveRole === 'hr_admin' || effectiveRole === 'supervisor' || v.employeeId === currentEmployee?.employeeId
  );
  const userOthers = otherRequests.filter(
    (o) => effectiveRole === 'super_admin' || effectiveRole === 'hr_admin' || effectiveRole === 'supervisor' || o.employeeId === currentEmployee?.employeeId
  );

  const pendingCount =
    leaveRequests.filter((l) => l.status === 'pending').length +
    vehicleRequests.filter((v) => v.status === 'pending').length +
    otherRequests.filter((o) => o.status === 'pending').length;

  const unreadNotifications = notifications.filter((n) => !n.read).length;

  // Handlers: Leave Application
  const handleLeaveSubmit = async (reqData: Omit<LeaveRequest, 'id' | 'requestNumber' | 'createdAt' | 'updatedAt'>) => {
    const reqNumber = `LR-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newId = await createLeaveRequest({
      ...reqData,
      requestNumber: reqNumber,
    });

    const newReq: LeaveRequest = {
      ...reqData,
      id: newId,
      requestNumber: reqNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setLeaveRequests((prev) => [newReq, ...prev]);

    // Add notification
    const notifItem: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: reqData.userId,
      title: 'Leave Application Submitted',
      message: `Your ${reqData.leaveType} leave request (${reqNumber}) for ${reqData.days} days has been submitted to your supervisor.`,
      type: 'leave_update',
      read: false,
      link: 'leave',
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [notifItem, ...prev]);
  };

  // Handlers: Vehicle Request
  const handleVehicleSubmit = async (reqData: Omit<VehicleRequest, 'id' | 'requestNumber' | 'createdAt' | 'updatedAt'>) => {
    const reqNumber = `VR-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newId = await createVehicleRequest({
      ...reqData,
      requestNumber: reqNumber,
    });

    const newReq: VehicleRequest = {
      ...reqData,
      id: newId,
      requestNumber: reqNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setVehicleRequests((prev) => [newReq, ...prev]);

    // Add notification
    const notifItem: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: reqData.userId,
      title: 'Vehicle Dispatch Requested',
      message: `Transit request (${reqNumber}) to ${reqData.destination} booked for ${reqData.date}.`,
      type: 'vehicle_update',
      read: false,
      link: 'vehicle',
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [notifItem, ...prev]);
  };

  // Handlers: Other Request
  const handleOtherSubmit = async (reqData: Omit<OtherRequest, 'id' | 'requestNumber' | 'createdAt' | 'updatedAt'>) => {
    const reqNumber = `REQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newId = await createOtherRequest({
      ...reqData,
      requestNumber: reqNumber,
    });

    const newReq: OtherRequest = {
      ...reqData,
      id: newId,
      requestNumber: reqNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setOtherRequests((prev) => [newReq, ...prev]);
  };

  // Handlers: Upload Document
  const handleUploadDocument = async (docData: Omit<EmployeeDocument, 'id'>) => {
    const newId = await addEmployeeDocument(docData);
    setDocuments((prev) => [{ ...docData, id: newId }, ...prev]);
  };

  // Handlers: Announcements
  const handleCreateAnnouncement = async (annData: Omit<Announcement, 'id' | 'createdAt'>) => {
    const newId = await createAnnouncement(annData);
    setAnnouncements((prev) => [{ ...annData, id: newId, createdAt: new Date().toISOString() }, ...prev]);
  };

  const handleDeleteAnnouncement = async (id: string) => {
    await deleteAnnouncement(id);
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  // Handlers: Approvals
  const handleApproveLeave = async (id: string, note: string) => {
    await updateLeaveRequestStatus(id, 'approved', note, currentEmployee?.name || 'Supervisor');
    setLeaveRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'approved', supervisorNote: note, reviewedBy: currentEmployee?.name } : r))
    );
  };

  const handleRejectLeave = async (id: string, note: string) => {
    await updateLeaveRequestStatus(id, 'rejected', note, currentEmployee?.name || 'Supervisor');
    setLeaveRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'rejected', supervisorNote: note, reviewedBy: currentEmployee?.name } : r))
    );
  };

  const handleApproveVehicle = async (
    id: string,
    vehicle: string,
    driver: string,
    driverPhone: string,
    note: string
  ) => {
    await updateVehicleRequestStatus(id, 'approved', vehicle, driver, driverPhone, note, currentEmployee?.name);
    setVehicleRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'approved',
              assignedVehicle: vehicle,
              assignedDriver: driver,
              driverPhone,
              supervisorNote: note,
              reviewedBy: currentEmployee?.name,
            }
          : r
      )
    );
  };

  const handleRejectVehicle = async (id: string, note: string) => {
    await updateVehicleRequestStatus(id, 'rejected', undefined, undefined, undefined, note, currentEmployee?.name);
    setVehicleRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'rejected', supervisorNote: note } : r))
    );
  };

  const handleApproveOther = async (id: string, note: string) => {
    await updateOtherRequestStatus(id, 'approved', note, currentEmployee?.name || 'HR Admin');
    setOtherRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'approved', adminNote: note } : r))
    );
  };

  const handleRejectOther = async (id: string, note: string) => {
    await updateOtherRequestStatus(id, 'rejected', note, currentEmployee?.name || 'HR Admin');
    setOtherRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'rejected', adminNote: note } : r))
    );
  };

  const handleSaveEmployee = async (employee: Employee) => {
    await saveEmployee(employee);
    setEmployees((prev) => {
      const idx = prev.findIndex((e) => e.employeeId === employee.employeeId);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = employee;
        return next;
      }
      return [employee, ...prev];
    });
  };

  const handleMarkNotifRead = async (id: string) => {
    await markNotificationAsRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased">
      {/* 1. Global Navigation Bar */}
      <Navbar
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        unreadNotificationsCount={unreadNotifications}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        activeTab={activeTab}
      />

      {/* 2. Main Content Frame */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col lg:flex-row">
        {/* Sidebar Navigation */}
        <div className={`lg:block ${isMobileMenuOpen ? 'block' : 'hidden'} lg:relative fixed inset-0 z-30 lg:z-auto bg-white/95 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none`}>
          <Sidebar
            activeTab={activeTab}
            onSelectTab={(tab) => {
              setActiveTab(tab);
              setIsMobileMenuOpen(false);
            }}
            pendingRequestsCount={pendingCount}
            onOpenFutureModule={(title, desc) => {
              setFutureModuleInfo({ isOpen: true, title, desc });
              setIsMobileMenuOpen(false);
            }}
          />
        </div>

        {/* Dynamic Route Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {activeTab === 'dashboard' && (
            <EmployeeDashboard
              employee={currentEmployee}
              leaveRequests={userLeaves}
              vehicleRequests={userVehicles}
              otherRequests={userOthers}
              announcements={announcements}
              onNavigate={(tab) => setActiveTab(tab)}
              onOpenLeaveModal={() => setIsLeaveModalOpen(true)}
              onOpenVehicleModal={() => setIsVehicleModalOpen(true)}
              onOpenOtherRequestModal={() => setIsOtherModalOpen(true)}
            />
          )}

          {activeTab === 'profile' && (
            <MyProfile
              employee={currentEmployee}
              documents={documents}
              onUploadDocument={handleUploadDocument}
            />
          )}

          {activeTab === 'leave' && (
            <LeaveSection
              employee={currentEmployee}
              leaveRequests={userLeaves}
              onSubmitLeaveRequest={handleLeaveSubmit}
              isModalOpen={isLeaveModalOpen}
              onCloseModal={() => setIsLeaveModalOpen(false)}
            />
          )}

          {activeTab === 'vehicle' && (
            <VehicleRequestSection
              employee={currentEmployee}
              vehicleRequests={userVehicles}
              onSubmitVehicleRequest={handleVehicleSubmit}
              isModalOpen={isVehicleModalOpen}
              onCloseModal={() => setIsVehicleModalOpen(false)}
            />
          )}

          {activeTab === 'requests' && (
            <RequestCenter
              employee={currentEmployee}
              leaveRequests={userLeaves}
              vehicleRequests={userVehicles}
              otherRequests={userOthers}
              onSubmitOtherRequest={handleOtherSubmit}
              onOpenLeaveModal={() => setIsLeaveModalOpen(true)}
              onOpenVehicleModal={() => setIsVehicleModalOpen(true)}
              isOtherModalOpen={isOtherModalOpen}
              onCloseOtherModal={() => setIsOtherModalOpen(false)}
            />
          )}

          {activeTab === 'announcements' && (
            <AnnouncementsSection
              announcements={announcements}
              onCreateAnnouncement={handleCreateAnnouncement}
              onDeleteAnnouncement={handleDeleteAnnouncement}
            />
          )}

          {activeTab === 'admin' && (
            <AdminDashboard
              employees={employees}
              leaveRequests={leaveRequests}
              vehicleRequests={vehicleRequests}
              otherRequests={otherRequests}
              announcements={announcements}
              onApproveLeave={handleApproveLeave}
              onRejectLeave={handleRejectLeave}
              onApproveVehicle={handleApproveVehicle}
              onRejectVehicle={handleRejectVehicle}
              onApproveOther={handleApproveOther}
              onRejectOther={handleRejectOther}
              onSaveEmployee={handleSaveEmployee}
              onCreateAnnouncement={handleCreateAnnouncement}
            />
          )}
        </main>
      </div>

      {/* 3. Global Overlays & Drawers */}
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkNotifRead}
        onNavigate={(tab) => setActiveTab(tab)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <ModularFutureModal
        isOpen={futureModuleInfo.isOpen}
        onClose={() => setFutureModuleInfo({ isOpen: false, title: '', desc: '' })}
        title={futureModuleInfo.title}
        description={futureModuleInfo.desc}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
