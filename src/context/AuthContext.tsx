import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types/database';
import { INITIAL_USERS, dualStore } from '../api/firebase';

interface AuthContextType {
  user: UserProfile | null;
  role: UserProfile['role'] | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, desiredRole?: UserProfile['role']) => Promise<void>;
  register: (profileData: Omit<UserProfile, 'uid' | 'createdAt'>) => Promise<void>;
  logout: () => void;
  switchDemoRole: (role: UserProfile['role']) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const AUTH_KEY = 'agencija_zivot_auth_user_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        setUser(INITIAL_USERS[0]);
      }
    } else {
      // Default to policyholder persona (Ana Horvat)
      setUser(INITIAL_USERS[0]);
      localStorage.setItem(AUTH_KEY, JSON.stringify(INITIAL_USERS[0]));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, desiredRole: UserProfile['role'] = 'policyholder') => {
    setIsLoading(true);
    const existing = dualStore.getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
    let loggedUser: UserProfile;

    if (existing) {
      loggedUser = existing;
    } else {
      loggedUser = {
        uid: `user-${Date.now()}`,
        email,
        displayName: email.split('@')[0],
        role: desiredRole,
        phone: '+385 91 000 0000',
        createdAt: new Date().toISOString(),
      };
      dualStore.saveUser(loggedUser);
    }

    setUser(loggedUser);
    localStorage.setItem(AUTH_KEY, JSON.stringify(loggedUser));
    setIsLoading(false);
  };

  const register = async (profileData: Omit<UserProfile, 'uid' | 'createdAt'>) => {
    setIsLoading(true);
    const uid = `user-${Date.now()}`;
    const newUser: UserProfile = {
      ...profileData,
      uid,
      createdAt: new Date().toISOString(),
    };
    dualStore.saveUser(newUser);
    setUser(newUser);
    localStorage.setItem(AUTH_KEY, JSON.stringify(newUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_KEY);
  };

  const switchDemoRole = (newRole: UserProfile['role']) => {
    const target = INITIAL_USERS.find((u) => u.role === newRole) || {
      uid: `demo-${newRole}`,
      email: `${newRole}@agencija-zivot.hr`,
      displayName: `Demo ${newRole.toUpperCase()}`,
      role: newRole,
      phone: '+385 1 4800 120',
      createdAt: new Date().toISOString(),
    };
    setUser(target);
    localStorage.setItem(AUTH_KEY, JSON.stringify(target));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        switchDemoRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
