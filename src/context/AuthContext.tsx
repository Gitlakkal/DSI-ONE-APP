import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { Employee, UserProfile, UserRole } from '../types';
import { INITIAL_EMPLOYEES } from '../services/firestoreService';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  currentEmployee: Employee | null;
  role: UserRole;
  effectiveRole: UserRole;
  isLoading: boolean;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  createAccount: (email: string, pass: string) => Promise<void>;
  signOut: () => Promise<void>;
  switchSimulatedRole: (newRole: UserRole) => void;
  switchSimulatedEmployee: (empId: string) => void;
  availableEmployees: Employee[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(INITIAL_EMPLOYEES[1]);
  const [simulatedRole, setSimulatedRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Listen to Firebase Authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        setCurrentUser(fbUser);
        // Link matching demo employee if email matches, otherwise default
        const matched = INITIAL_EMPLOYEES.find(
          (e) => e.email.toLowerCase() === fbUser.email?.toLowerCase()
        );
        if (matched) {
          setCurrentEmployee(matched);
        } else {
          // Provide basic employee context for display
          setCurrentEmployee({
            employeeId: 'DSI-' + fbUser.uid.slice(0, 4).toUpperCase(),
            name: fbUser.email?.split('@')[0] || 'DSI Staff',
            email: fbUser.email || '',
            mobile: '+966 50 000 0000',
            nationality: 'Saudi Arabian',
            department: 'Operations & Maintenance',
            designation: 'Staff Specialist',
            joiningDate: '2024-01-01',
            reportingManager: 'Operations Director',
            iqamaNumber: '1000000000',
            iqamaExpiry: '2028-12-31',
            passportNumber: 'N/A',
            passportExpiry: '2029-12-31',
            status: 'active',
            annualLeaveBalance: 30,
            sickLeaveBalance: 15,
            emergencyLeaveBalance: 5,
            unpaidLeaveBalance: 30,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      } else {
        setCurrentUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sign in using email and password
  const signInWithEmail = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), pass);
    } catch (error: any) {
      console.error('Firebase Auth sign in error code:', error?.code);
      // Specific requirement: "If credentials are incorrect, show: Email or password is incorrect"
      throw new Error('Email or password is incorrect');
    } finally {
      setIsLoading(false);
    }
  };

  // Sign up using email and password (Authenticate users only - Do NOT save user profile data)
  const createAccount = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), pass);
      // Do NOT save user profile data per requirement
    } catch (error: any) {
      console.error('Firebase Auth sign up error code:', error?.code);
      // Specific requirement: "If the email already exists, show: User already exists. Please sign in"
      if (
        error?.code === 'auth/email-already-in-use' ||
        error?.message?.toLowerCase().includes('already in use')
      ) {
        throw new Error('User already exists. Please sign in');
      }
      if (error?.code === 'auth/weak-password') {
        throw new Error('Password should be at least 6 characters');
      }
      if (error?.code === 'auth/invalid-email') {
        throw new Error('Please enter a valid email address');
      }
      throw new Error(error?.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  // Logout signs the user out and returns to the auth screen
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setSimulatedRole(null);
    } catch (error) {
      console.error('Sign Out error:', error);
    }
  };

  const switchSimulatedRole = (newRole: UserRole) => {
    setSimulatedRole(newRole);
  };

  const switchSimulatedEmployee = (empId: string) => {
    const emp = INITIAL_EMPLOYEES.find((e) => e.employeeId === empId);
    if (emp) {
      setCurrentEmployee(emp);
      if (emp.employeeId === 'DSI-1002') setSimulatedRole('super_admin');
      else if (emp.employeeId === 'DSI-1003') setSimulatedRole('supervisor');
      else if (emp.employeeId === 'DSI-1004') setSimulatedRole('hr_admin');
      else setSimulatedRole('employee');
    }
  };

  const userProfile: UserProfile | null = currentUser
    ? {
        uid: currentUser.uid,
        email: currentUser.email || '',
        displayName: currentEmployee?.name || currentUser.email?.split('@')[0] || 'Staff Member',
        role: (currentUser.email?.toLowerCase() === 'mohdiqballakkal@gmail.com' ? 'super_admin' : 'employee'),
        employeeId: currentEmployee?.employeeId || 'DSI-1002',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    : null;

  const baseRole: UserRole = userProfile?.role || 'super_admin';
  const effectiveRole: UserRole = simulatedRole || baseRole;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        currentEmployee,
        role: baseRole,
        effectiveRole,
        isLoading,
        signInWithEmail,
        createAccount,
        signOut,
        switchSimulatedRole,
        switchSimulatedEmployee,
        availableEmployees: INITIAL_EMPLOYEES,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
