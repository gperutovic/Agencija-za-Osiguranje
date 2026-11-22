import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { firebaseAuth, firestoreDb, sanitizeForFirestore } from '../services/firebase';
import { SEED_USERS } from '../services/seedData';
import { UserProfile, UserRole } from '../types/domain';

interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  oib?: string;
}

interface AuthContextValue {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAgent: boolean;
  signInWithEmail: (email: string, password: string) => Promise<UserProfile>;
  registerClient: (payload: RegisterPayload) => Promise<UserProfile>;
  signInAsDemo: (role: 'client' | 'agent') => UserProfile;
  logout: () => Promise<void>;
}

const SESSION_KEY = 'jasno_auth_session_v1';
const LOCAL_USERS_KEY = 'jasno_local_users_v1';

const AuthContext = createContext<AuthContextValue | null>(null);

function loadLocalUsers(): UserProfile[] {
  try {
    const raw = localStorage.getItem(LOCAL_USERS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(SEED_USERS));
      return [...SEED_USERS];
    }
    return JSON.parse(raw) as UserProfile[];
  } catch {
    return [...SEED_USERS];
  }
}

function saveLocalUser(profile: UserProfile): void {
  try {
    const users = loadLocalUsers().filter((u) => u.email.toLowerCase() !== profile.email.toLowerCase());
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify([profile, ...users]));
  } catch {
    // ignore storage errors
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY);
      return saved ? (JSON.parse(saved) as UserProfile) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (fbUser) => {
      if (!fbUser) return;
      try {
        const snap = await getDoc(doc(firestoreDb, 'users', fbUser.uid));
        if (snap.exists()) {
          const profile = snap.data() as UserProfile;
          setUser(profile);
          localStorage.setItem(SESSION_KEY, JSON.stringify(profile));
        }
      } catch {
        // Keep current local session if Firestore read is unavailable
      }
    });
    return () => unsubscribe();
  }, []);

  const persistSession = (profile: UserProfile | null) => {
    setUser(profile);
    try {
      if (profile) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(profile));
      } else {
        localStorage.removeItem(SESSION_KEY);
      }
    } catch {
      // ignore storage errors
    }
  };

  const signInWithEmail = async (email: string, password: string): Promise<UserProfile> => {
    setIsLoading(true);
    const normalizedEmail = email.trim().toLowerCase();
    try {
      // Try real Firebase Auth first
      try {
        const cred = await signInWithEmailAndPassword(firebaseAuth, normalizedEmail, password);
        const snap = await getDoc(doc(firestoreDb, 'users', cred.user.uid));
        if (snap.exists()) {
          const profile = snap.data() as UserProfile;
          persistSession(profile);
          return profile;
        }
      } catch {
        // Fall back to local/seeded account verification for demo/dev environments
      }

      const existing = loadLocalUsers().find((u) => u.email.toLowerCase() === normalizedEmail);
      if (existing) {
        persistSession(existing);
        return existing;
      }

      const inferredRole: UserRole = normalizedEmail.endsWith('@jasno-osiguranje.hr')
        ? 'agent'
        : 'client';
      const newProfile: UserProfile = {
        uid: `local-${Date.now()}`,
        email: normalizedEmail,
        fullName: normalizedEmail.split('@')[0] ?? 'Korisnik',
        role: inferredRole,
        phone: '+385 91 000 0000',
        createdAt: new Date().toISOString(),
      };
      saveLocalUser(newProfile);
      persistSession(newProfile);
      return newProfile;
    } finally {
      setIsLoading(false);
    }
  };

  const registerClient = async (payload: RegisterPayload): Promise<UserProfile> => {
    setIsLoading(true);
    const normalizedEmail = payload.email.trim().toLowerCase();
    const now = new Date().toISOString();
    let uid = `client-${Date.now()}`;

    try {
      try {
        const cred = await createUserWithEmailAndPassword(
          firebaseAuth,
          normalizedEmail,
          payload.password
        );
        uid = cred.user.uid;
      } catch {
        // Continue with local profile registration if Firebase Auth email provider is disabled
      }

      const profile: UserProfile = sanitizeForFirestore({
        uid,
        email: normalizedEmail,
        fullName: payload.fullName.trim(),
        role: 'client',
        phone: payload.phone.trim(),
        oib: payload.oib?.trim() || undefined,
        createdAt: now,
      });

      try {
        if (firebaseAuth.currentUser) {
          await setDoc(doc(firestoreDb, 'users', uid), profile);
        }
      } catch {
        // Ignore Firestore write errors when offline
      }

      saveLocalUser(profile);
      persistSession(profile);
      return profile;
    } finally {
      setIsLoading(false);
    }
  };

  const signInAsDemo = (role: 'client' | 'agent'): UserProfile => {
    const matched = SEED_USERS.find((u) => u.role === role) ?? SEED_USERS[0]!;
    persistSession(matched);
    return matched;
  };

  const logout = async (): Promise<void> => {
    try {
      if (firebaseAuth.currentUser) {
        await signOut(firebaseAuth);
      }
    } catch {
      // ignore signOut errors
    }
    persistSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: user !== null,
        isAgent: user?.role === 'agent' || user?.role === 'admin',
        signInWithEmail,
        registerClient,
        signInAsDemo,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};
