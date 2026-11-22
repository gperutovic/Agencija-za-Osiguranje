import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBM2g2zVhRbEkxTsFnKL-NpgT4XBDsDBks',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'agencija-za-osiguranje.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'agencija-za-osiguranje',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'agencija-za-osiguranje.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '175340495427',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:175340495427:web:dcaeb89300970b547b2af6',
};

export const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const firebaseAuth = getAuth(firebaseApp);
export const firestoreDb = getFirestore(firebaseApp);
export const firebaseStorage = getStorage(firebaseApp);

/**
 * Recursively removes `undefined` fields so Firestore `setDoc`/`updateDoc` never throw.
 */
export function sanitizeForFirestore<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeForFirestore(item)) as unknown as T;
  }
  if (value !== null && typeof value === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      if (val !== undefined) {
        result[key] = sanitizeForFirestore(val);
      }
    }
    return result as T;
  }
  return value;
}
