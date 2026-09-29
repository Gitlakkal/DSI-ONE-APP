import React, { useState } from 'react';
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Shield,
  UserCheck,
  User as UserIcon,
  X,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { DsiLogo } from '../common/DsiLogo';

interface NavbarProps {
  onOpenNotifications: () => void;
  unreadNotificationsCount: number;
  onOpenAuthModal: () => void;
  isMobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  activeTab: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenNotifications,
  unreadNotificationsCount,
  onOpenAuthModal,
  isMobileMenuOpen,
  onToggleMobileMenu,
  activeTab,
}) => {
  const {
    currentUser,
    userProfile,
    currentEmployee,
    effectiveRole,
    switchSimulatedRole,
    signOut,
  } = useAuth();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'super_admin':
        return { label: 'Super Admin', color: 'bg-purple-100 text-purple-800 border-purple-200' };
      case 'hr_admin':
        return { label: 'HR / Admin', color: 'bg-blue-100 text-blue-800 border-blue-200' };
      case 'supervisor':
        return { label: 'Supervisor', color: 'bg-amber-100 text-amber-800 border-amber-200' };
      default:
        return { label: 'Employee', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
    }
  };

  const roleBadge = getRoleBadge(effectiveRole);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Mobile hamburger & Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle Navigation"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <DsiLogo size="md" />

            {/* DSI Official Link */}
            <a
              href="https://desertsides.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1 ml-3 px-2 py-1 text-[11px] font-medium text-slate-500 hover:text-[#0B2545] bg-slate-100/70 hover:bg-slate-200/70 rounded-md transition-colors"
              title="Visit Desert Sides International website"
            >
              desertsides.com
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
          </div>

          {/* Right: Role Switcher Demo Bar, Notifications & User Menu */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Interactive Role Switcher for Testing All 4 Roles */}
            <div className="relative">
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all text-slate-700 shadow-2xs"
                title="Switch role view to test Employee, Supervisor, HR/Admin, and Super Admin privileges"
              >
                <Shield className="w-3.5 h-3.5 text-[#FF6B00]" />
                <span className="hidden sm:inline text-slate-500">View as:</span>
                <span className={`px-2 py-0.5 rounded text-[11px] border font-bold ${roleBadge.color}`}>
                  {roleBadge.label}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isRoleDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setIsRoleDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-30 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-2.5 py-1.5 border-b border-slate-100 mb-1">
                      <p className="text-xs font-bold text-slate-800">Role-Based Access (RBAC)</p>
                      <p className="text-[11px] text-slate-500">Test different permission tiers</p>
                    </div>

                    <div className="space-y-1">
                      {[
                        { role: 'employee' as UserRole, title: '1. Employee', desc: 'Self-service dashboard, apply leave, request vehicle' },
                        { role: 'supervisor' as UserRole, title: '2. Supervisor', desc: 'Approve department requests, dispatch review' },
                        { role: 'hr_admin' as UserRole, title: '3. HR / Admin', desc: 'Manage employees, documents, broadcasts' },
                        { role: 'super_admin' as UserRole, title: '4. Super Admin', desc: 'Complete access to all company tools' },
                      ].map((item) => (
                        <button
                          key={item.role}
                          onClick={() => {
                            switchSimulatedRole(item.role);
                            setIsRoleDropdownOpen(false);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex flex-col ${
                            effectiveRole === item.role
                              ? 'bg-blue-50 text-[#0B2545] font-semibold'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <span className="flex items-center justify-between">
                            <span>{item.title}</span>
                            {effectiveRole === item.role && (
                              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]" />
                            )}
                          </span>
                          <span className="text-[10px] text-slate-400 font-normal leading-tight mt-0.5">
                            {item.desc}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Notifications Button */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF6B00] ring-2 ring-white animate-pulse" />
              )}
            </button>

            {/* User Profile / Auth Button & Direct Logout Button */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 p-1 pl-2 rounded-lg hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 border border-slate-300 flex-shrink-0">
                    {currentEmployee?.photoURL ? (
                      <img
                        src={currentEmployee.photoURL}
                        alt={currentEmployee.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-600 font-bold text-xs bg-slate-100">
                        {currentEmployee?.name?.charAt(0) || 'U'}
                      </div>
                    )}
                  </div>
                  <div className="hidden md:flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-800 leading-tight">
                      {currentEmployee?.name || userProfile?.displayName || 'Staff Member'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {currentEmployee?.employeeId || 'DSI-1002'}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {isUserDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-20"
                      onClick={() => setIsUserDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-30 animate-in fade-in zoom-in-95 duration-100">
                      <div className="p-3 bg-slate-50 rounded-lg mb-2">
                        <p className="text-xs font-bold text-slate-900 leading-tight">
                          {currentEmployee?.name || userProfile?.displayName}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                          {currentEmployee?.email || userProfile?.email}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[10px] font-semibold text-slate-600 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                            {currentEmployee?.employeeId}
                          </span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${roleBadge.color}`}>
                            {roleBadge.label}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <button
                          onClick={() => {
                            setIsUserDropdownOpen(false);
                            signOut();
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-bold"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Direct One-Click Logout Button */}
              {currentUser && (
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors shadow-2xs"
                  title="Sign out and return to the auth screen"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
