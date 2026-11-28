/**
 * Secure Admin SDK CLI script to promote or demote licensed agency staff
 * using authoritative Firebase Auth Custom Claims (`request.auth.token.role`)
 * synchronized with `/users/{uid}` in Cloud Firestore.
 *
 * Usage:
 *   GOOGLE_APPLICATION_CREDENTIALS=./service-account.json \
 *     npm run set-role -- --email marko.kovac@vedro-osiguranje.hr --role agent
 */
import { getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

type AllowedRole = 'client' | 'agent' | 'admin';

function parseArgs(): { email?: string; uid?: string; role: AllowedRole } {
  const args = process.argv.slice(2);
  let email: string | undefined;
  let uid: string | undefined;
  let role: string | undefined;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--email') email = args[i + 1];
    if (args[i] === '--uid') uid = args[i + 1];
    if (args[i] === '--role') role = args[i + 1];
  }

  if ((!email && !uid) || !role || !['client', 'agent', 'admin'].includes(role)) {
    console.error(
      'Usage: npm run set-role -- --email <user@domain.hr> --role <client|agent|admin>'
    );
    console.error('   or: npm run set-role -- --uid <firebaseUid> --role <client|agent|admin>');
    process.exit(1);
  }

  return { email, uid, role: role as AllowedRole };
}

async function main() {
  const { email, uid, role } = parseArgs();
  if (getApps().length === 0) {
    initializeApp();
  }

  const auth = getAuth();
  const db = getFirestore();

  const userRecord = uid
    ? await auth.getUser(uid)
    : await auth.getUserByEmail(email!.trim().toLowerCase());

  const existingClaims = userRecord.customClaims ?? {};
  await auth.setCustomUserClaims(userRecord.uid, {
    ...existingClaims,
    role,
  });

  const now = new Date().toISOString();
  const userRef = db.collection('users').doc(userRecord.uid);
  const snap = await userRef.get();

  if (snap.exists) {
    await userRef.update({ role, updatedAt: now });
  } else {
    await userRef.set({
      uid: userRecord.uid,
      email: userRecord.email ?? email ?? '',
      fullName: userRecord.displayName || (userRecord.email?.split('@')[0] ?? 'Zastupnik'),
      role,
      phone: userRecord.phoneNumber ?? '',
      createdAt: now,
      updatedAt: now,
    });
  }

  console.info(
    `[OK] Custom claim { role: "${role}" } set for UID=${userRecord.uid} (${userRecord.email}) and synced to Firestore /users/${userRecord.uid}.`
  );
  console.info('Note: User must sign out and sign back in (or refresh ID token) for new claims to take effect.');
}

main().catch((err) => {
  console.error('[ERROR] Failed to set user role:', err);
  process.exit(1);
});
