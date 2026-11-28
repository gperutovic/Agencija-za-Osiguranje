import { getApp, getApps, initializeApp } from 'firebase/app';
import { initializeAppCheck, ReCaptchaV3Provider, getToken as getAppCheckToken, type AppCheck } from 'firebase/app-check';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import {
  connectFirestoreEmulator,
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  type Firestore,
} from 'firebase/firestore';
import { connectStorageEmulator, getStorage } from 'firebase/storage';

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

function createFirestore(): Firestore {
  // Enable multi-tab IndexedDB offline persistence in browser environments
  if (typeof window !== 'undefined' && typeof indexedDB !== 'undefined') {
    try {
      return initializeFirestore(firebaseApp, {
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager(),
        }),
      });
    } catch {
      return getFirestore(firebaseApp);
    }
  }
  return getFirestore(firebaseApp);
}

export const firestoreDb = createFirestore();
export const firebaseStorage = getStorage(firebaseApp);

// Optional Firebase App Check (activates automatically when VITE_RECAPTCHA_SITE_KEY is configured)
let appCheckInstance: AppCheck | null = null;
const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string | undefined;
if (typeof window !== 'undefined' && recaptchaSiteKey) {
  try {
    appCheckInstance = initializeAppCheck(firebaseApp, {
      provider: new ReCaptchaV3Provider(recaptchaSiteKey),
      isTokenAutoRefreshEnabled: true,
    });
  } catch {
    appCheckInstance = null;
  }
}

export async function getOptionalAppCheckToken(): Promise<string | null> {
  if (!appCheckInstance) return null;
  try {
    const result = await getAppCheckToken(appCheckInstance, false);
    return result.token || null;
  } catch {
    return null;
  }
}

// Optional Firebase Emulator Suite wiring for local development
export const USE_FIREBASE_EMULATORS =
  Boolean(import.meta.env.DEV) && import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true';

let emulatorsConnected = false;
if (USE_FIREBASE_EMULATORS && !emulatorsConnected && typeof window !== 'undefined') {
  emulatorsConnected = true;
  try {
    connectAuthEmulator(firebaseAuth, 'http://127.0.0.1:9099', { disableWarnings: true });
    connectFirestoreEmulator(firestoreDb, '127.0.0.1', 8080);
    connectStorageEmulator(firebaseStorage, '127.0.0.1', 9199);
  } catch {
    // Already connected during HMR
  }
}

export const IS_DEMO_MODE =
  Boolean(import.meta.env.DEV) && import.meta.env.VITE_ENABLE_DEMO_MODE === 'true';

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
