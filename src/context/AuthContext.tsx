import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updatePassword,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { storageKey } from '../config/brand';
import { agencyRepository } from '../services/agencyRepository';
import {
  firebaseAuth,
  firestoreDb,
  IS_DEMO_MODE,
  sanitizeForFirestore,
  USE_FIREBASE_EMULATORS,
} from '../services/firebase';
import { SEED_USERS } from '../services/seedData';
import { Language, UserProfile, UserRole } from '../types/domain';

export const IS_DEMO_MODE_ENABLED = IS_DEMO_MODE;

interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  oib?: string;
}

interface ProfileUpdatePayload {
  fullName: string;
  phone: string;
  oib?: string;
  address?: string;
  city?: string;
  postalCode?: string;
}

interface AuthContextValue {
  user: UserProfile | null;
  emailVerified: boolean;
  authReady: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAgent: boolean;
  isAdmin: boolean;
  signInWithEmail: (email: string, password: string, lang?: Language) => Promise<UserProfile>;
  signInWithGoogle: (lang?: Language) => Promise<UserProfile>;
  registerClient: (payload: RegisterPayload, lang?: Language) => Promise<UserProfile>;
  sendPasswordReset: (email: string, lang?: Language) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  updateProfileData: (payload: ProfileUpdatePayload) => Promise<UserProfile>;
  changePassword: (currentPassword: string, newPassword: string, lang?: Language) => Promise<void>;
  signInAsDemo: (role: 'client' | 'agent') => Promise<UserProfile>;
  logout: () => Promise<void>;
}

const DEMO_SESSION_KEY = storageKey('demo_auth_session_v2');

const AuthContext = createContext<AuthContextValue | null>(null);

export function mapFirebaseAuthError(err: unknown, lang: Language = 'hr'): string {
  const code =
    typeof err === 'object' && err !== null && 'code' in err
      ? String((err as { code?: unknown }).code)
      : '';
  const isEn = lang === 'en';

  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
      return isEn
        ? 'Incorrect password or e-mail address.'
        : 'Pogrešna lozinka ili e-mail adresa.';
    case 'auth/user-not-found':
      return isEn
        ? 'No user account found with that e-mail address.'
        : 'Korisnički račun s tom e-mail adresom ne postoji.';
    case 'auth/email-already-in-use':
      return isEn
        ? 'An account with this e-mail address already exists.'
        : 'Korisnički račun s ovom e-mail adresom već postoji.';
    case 'auth/invalid-email':
      return isEn ? 'Please enter a valid e-mail address.' : 'Unesite ispravnu e-mail adresu.';
    case 'auth/weak-password':
      return isEn
        ? 'Password is too weak (use at least 6 characters).'
        : 'Lozinka je preslaba (koristite najmanje 6 znakova).';
    case 'auth/too-many-requests':
      return isEn
        ? 'Too many failed attempts. Please wait a few minutes and try again.'
        : 'Previše neuspješnih pokušaja. Pričekajte nekoliko minuta i pokušajte ponovno.';
    case 'auth/user-disabled':
      return isEn
        ? 'This account has been disabled. Contact agency support.'
        : 'Ovaj korisnički račun je onemogućen. Kontaktirajte podršku agencije.';
    case 'auth/popup-closed-by-user':
      return isEn
        ? 'Google sign-in window was closed before completing.'
        : 'Prozor za Google prijavu je zatvoren prije dovršetka.';
    case 'auth/popup-blocked':
      return isEn
        ? 'Browser blocked the sign-in popup. Please allow popups for this site.'
        : 'Preglednik je blokirao skočni prozor. Omogućite skočne prozore i pokušajte ponovno.';
    case 'auth/requires-recent-login':
      return isEn
        ? 'Please sign out and sign in again before changing your password.'
        : 'Radi sigurnosti ponovno se prijavite prije promjene lozinke.';
    case 'auth/network-request-failed':
      return isEn
        ? 'Network error — check your connection and try again.'
        : 'Mrežna pogreška — provjerite internetsku vezu i pokušajte ponovno.';
    case 'auth/operation-not-allowed':
    case 'auth/configuration-not-found':
      return isEn
        ? 'This authentication provider is not yet enabled in Firebase Auth Console.'
        : 'Ovaj način prijave još nije omogućen u Firebase Auth postavkama projekta.';
    default:
      return isEn
        ? 'Authentication failed. Please check your credentials and try again.'
        : 'Prijava nije uspjela. Provjerite unesene podatke i pokušajte ponovno.';
  }
}

/**
 * Extracts authoritative RBAC role EXCLUSIVELY from Firebase Auth Custom Claims (`request.auth.token.role`).
 * Never trusts client-writable Firestore fields or email domain suffixes.
 */
async function resolveAuthoritativeProfile(fbUser: FirebaseUser): Promise<UserProfile> {
  const tokenResult = await fbUser.getIdTokenResult();
  const rawClaimRole = tokenResult.claims.role;
  const authoritativeRole: UserRole =
    rawClaimRole === 'admin' ? 'admin' : rawClaimRole === 'agent' ? 'agent' : 'client';

  const now = new Date().toISOString();
  const userDocRef = doc(firestoreDb, 'users', fbUser.uid);

  let stored: Partial<UserProfile> | null = null;
  try {
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      stored = snap.data() as Partial<UserProfile>;
    }
  } catch {
    stored = null;
  }

  if (!stored) {
    const initialProfile: UserProfile = sanitizeForFirestore({
      uid: fbUser.uid,
      email: (fbUser.email || '').toLowerCase(),
      fullName: fbUser.displayName || (fbUser.email?.split('@')[0] ?? 'Korisnik'),
      role: 'client',
      phone: fbUser.phoneNumber || '',
      createdAt: now,
      updatedAt: now,
    });
    try {
      await setDoc(userDocRef, initialProfile);
    } catch {
      // If rules reject or offline, still return clean profile with authoritative claim role
    }
    return { ...initialProfile, role: authoritativeRole };
  }

  return {
    uid: fbUser.uid,
    email: stored.email || (fbUser.email || '').toLowerCase(),
    fullName: stored.fullName || fbUser.displayName || 'Korisnik',
    role: authoritativeRole,
    phone: stored.phone || '',
    oib: stored.oib,
    address: stored.address,
    city: stored.city,
    postalCode: stored.postalCode,
    assignedAgent: stored.assignedAgent,
    assignedAgentLicense: stored.assignedAgentLicense,
    createdAt: stored.createdAt || now,
    updatedAt: stored.updatedAt,
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [emailVerified, setEmailVerified] = useState<boolean>(false);
  const [authReady, setAuthReady] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (fbUser) => {
      if (!fbUser) {
        // Strictly clear session state when signed out or token expires.
        // Only allow persisted demo session in explicit DEV demo mode without emulators.
        if (IS_DEMO_MODE_ENABLED && !USE_FIREBASE_EMULATORS) {
          try {
            const rawDemo = sessionStorage.getItem(DEMO_SESSION_KEY);
            if (rawDemo) {
              setUser(JSON.parse(rawDemo) as UserProfile);
              setEmailVerified(true);
              setAuthReady(true);
              return;
            }
          } catch {
            // ignore
          }
        }
        setUser(null);
        setEmailVerified(false);
        setAuthReady(true);
        return;
      }

      try {
        const profile = await resolveAuthoritativeProfile(fbUser);
        setUser(profile);
        setEmailVerified(fbUser.emailVerified);
      } catch {
        setUser(null);
        setEmailVerified(false);
      } finally {
        setAuthReady(true);
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithEmail = async (
    email: string,
    password: string,
    lang: Language = 'hr'
  ): Promise<UserProfile> => {
    setIsLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(
        firebaseAuth,
        email.trim().toLowerCase(),
        password
      );
      const profile = await resolveAuthoritativeProfile(cred.user);
      setUser(profile);
      setEmailVerified(cred.user.emailVerified);
      return profile;
    } catch (err) {
      throw new Error(mapFirebaseAuthError(err, lang));
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async (lang: Language = 'hr'): Promise<UserProfile> => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const cred = await signInWithPopup(firebaseAuth, provider);
      const profile = await resolveAuthoritativeProfile(cred.user);
      setUser(profile);
      setEmailVerified(cred.user.emailVerified);
      return profile;
    } catch (err) {
      throw new Error(mapFirebaseAuthError(err, lang));
    } finally {
      setIsLoading(false);
    }
  };

  const registerClient = async (
    payload: RegisterPayload,
    lang: Language = 'hr'
  ): Promise<UserProfile> => {
    setIsLoading(true);
    const normalizedEmail = payload.email.trim().toLowerCase();
    const now = new Date().toISOString();

    try {
      const cred = await createUserWithEmailAndPassword(
        firebaseAuth,
        normalizedEmail,
        payload.password
      );

      await updateProfile(cred.user, { displayName: payload.fullName.trim() });

      const profile: UserProfile = sanitizeForFirestore({
        uid: cred.user.uid,
        email: normalizedEmail,
        fullName: payload.fullName.trim(),
        role: 'client',
        phone: payload.phone.trim(),
        oib: payload.oib?.trim() || undefined,
        createdAt: now,
        updatedAt: now,
      });

      await setDoc(doc(firestoreDb, 'users', cred.user.uid), profile);

      // Trigger verification email (non-blocking if SMTP/emulator throttles)
      void sendEmailVerification(cred.user).catch(() => {});

      setUser(profile);
      setEmailVerified(cred.user.emailVerified);
      return profile;
    } catch (err) {
      throw new Error(mapFirebaseAuthError(err, lang));
    } finally {
      setIsLoading(false);
    }
  };

  const sendPasswordReset = async (email: string, lang: Language = 'hr'): Promise<void> => {
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(firebaseAuth, email.trim().toLowerCase());
    } catch (err) {
      throw new Error(mapFirebaseAuthError(err, lang));
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerificationEmail = async (): Promise<void> => {
    const current = firebaseAuth.currentUser;
    if (!current) {
      throw new Error('Niste prijavljeni.');
    }
    await sendEmailVerification(current);
  };

  const updateProfileData = async (payload: ProfileUpdatePayload): Promise<UserProfile> => {
    if (!user) throw new Error('Niste prijavljeni.');
    const cleaned = sanitizeForFirestore({
      fullName: payload.fullName.trim(),
      phone: payload.phone.trim(),
      oib: payload.oib?.trim() || undefined,
      address: payload.address?.trim() || undefined,
      city: payload.city?.trim() || undefined,
      postalCode: payload.postalCode?.trim() || undefined,
    });
    await agencyRepository.updateUserProfile(user.uid, cleaned);
    if (firebaseAuth.currentUser) {
      await updateProfile(firebaseAuth.currentUser, { displayName: cleaned.fullName }).catch(() => {});
    }
    const nextUser: UserProfile = {
      ...user,
      ...cleaned,
      updatedAt: new Date().toISOString(),
    };
    setUser(nextUser);
    return nextUser;
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string,
    lang: Language = 'hr'
  ): Promise<void> => {
    const fbUser = firebaseAuth.currentUser;
    if (!fbUser || !fbUser.email) {
      throw new Error(
        lang === 'en'
          ? 'Password change is only available for signed-in e-mail accounts.'
          : 'Promjena lozinke dostupna je samo za prijavljene korisnike s e-mail lozinkom.'
      );
    }
    try {
      const cred = EmailAuthProvider.credential(fbUser.email, currentPassword);
      await reauthenticateWithCredential(fbUser, cred);
      await updatePassword(fbUser, newPassword);
    } catch (err) {
      throw new Error(mapFirebaseAuthError(err, lang));
    }
  };

  const signInAsDemo = async (role: 'client' | 'agent'): Promise<UserProfile> => {
    if (!IS_DEMO_MODE_ENABLED) {
      throw new Error('Demo access is strictly disabled in production builds.');
    }

    const matched = SEED_USERS.find((u) => u.role === role) ?? SEED_USERS[0]!;

    // When Firebase Emulators are running in dev, sign in via real Emulator Auth account
    if (USE_FIREBASE_EMULATORS) {
      const demoPassword = 'VedroDemoPassword2026!';
      try {
        return await signInWithEmail(matched.email, demoPassword);
      } catch {
        const cred = await createUserWithEmailAndPassword(
          firebaseAuth,
          matched.email,
          demoPassword
        );
        const profile: UserProfile = { ...matched, uid: cred.user.uid, role: 'client' };
        await setDoc(doc(firestoreDb, 'users', cred.user.uid), sanitizeForFirestore(profile));
        setUser(profile);
        setEmailVerified(true);
        return profile;
      }
    }

    // Offline dev-only demo mode
    sessionStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(matched));
    setUser(matched);
    setEmailVerified(true);
    return matched;
  };

  const logout = async (): Promise<void> => {
    try {
      sessionStorage.removeItem(DEMO_SESSION_KEY);
    } catch {
      // ignore
    }
    try {
      if (firebaseAuth.currentUser) {
        await signOut(firebaseAuth);
      }
    } finally {
      setUser(null);
      setEmailVerified(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        emailVerified,
        authReady,
        isLoading,
        isAuthenticated: user !== null,
        isAgent: user?.role === 'agent' || user?.role === 'admin',
        isAdmin: user?.role === 'admin',
        signInWithEmail,
        signInWithGoogle,
        registerClient,
        sendPasswordReset,
        resendVerificationEmail,
        updateProfileData,
        changePassword,
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
