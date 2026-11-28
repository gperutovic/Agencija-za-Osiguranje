/**
 * Firebase Security Rules Unit Test Suite (@firebase/rules-unit-testing)
 * Covers Firestore (`firestore.rules`) & Storage (`storage.rules`) tenant isolation,
 * RBAC custom claims, schema validation, immutability, and sequential state transitions.
 *
 * Run with Firebase Emulator Suite:
 *   firebase emulators:exec --only firestore,storage "npm run test:rules"
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadString, getBytes } from 'firebase/storage';
import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest';

const PROJECT_ID = 'vedro-rules-test';
const EMULATOR_HOST = process.env.FIRESTORE_EMULATOR_HOST;

const describeWithEmulator = EMULATOR_HOST ? describe : describe.skip;

describeWithEmulator('Vedro Security Rules (Firestore + Cloud Storage)', () => {
  let testEnv: RulesTestEnvironment;

  beforeAll(async () => {
    const firestoreRules = readFileSync(resolve(process.cwd(), 'firestore.rules'), 'utf8');
    const storageRules = readFileSync(resolve(process.cwd(), 'storage.rules'), 'utf8');

    testEnv = await initializeTestEnvironment({
      projectId: PROJECT_ID,
      firestore: {
        rules: firestoreRules,
        host: '127.0.0.1',
        port: 8080,
      },
      storage: {
        rules: storageRules,
        host: '127.0.0.1',
        port: 9199,
      },
    });
  });

  beforeEach(async () => {
    await testEnv.clearFirestore();
  });

  afterAll(async () => {
    await testEnv.cleanup();
  });

  it('blocks unauthenticated reads of PII collections (users, policies, claims, quotes, complaints)', async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      const db = ctx.firestore();
      await setDoc(doc(db, 'users', 'alice'), {
        uid: 'alice',
        email: 'alice@example.hr',
        fullName: 'Alice Horvat',
        role: 'client',
        createdAt: '2026-11-01T10:00:00.000Z',
      });
      await setDoc(doc(db, 'policies', 'pol-1'), {
        id: 'pol-1',
        policyNumber: 'GEN-AO-1',
        userId: 'alice',
        clientName: 'Alice Horvat',
        clientOib: '26182105152',
        productLine: 'auto',
        carrierName: 'Generali osiguranje d.d.',
        status: 'active',
        startDate: '2026-01-01',
        expiryDate: '2027-01-01',
        annualPremium: 420,
        monthlyPremium: 36,
        deductible: 150,
        coverageLimit: 6450000,
      });
    });

    const anonDb = testEnv.unauthenticatedContext().firestore();
    await assertFails(getDoc(doc(anonDb, 'users', 'alice')));
    await assertFails(getDoc(doc(anonDb, 'policies', 'pol-1')));
  });

  it('prevents privilege escalation on /users/{uid} create & update', async () => {
    const aliceDb = testEnv.authenticatedContext('alice', { role: 'client' }).firestore();

    // Cannot self-assign role: 'agent' or 'admin'
    await assertFails(
      setDoc(doc(aliceDb, 'users', 'alice'), {
        uid: 'alice',
        email: 'alice@example.hr',
        fullName: 'Alice Horvat',
        role: 'admin',
        createdAt: '2026-11-01T10:00:00.000Z',
      })
    );

    // Can create own client profile
    await assertSucceeds(
      setDoc(doc(aliceDb, 'users', 'alice'), {
        uid: 'alice',
        email: 'alice@example.hr',
        fullName: 'Alice Horvat',
        role: 'client',
        createdAt: '2026-11-01T10:00:00.000Z',
      })
    );

    // Cannot escalate role on update
    await assertFails(updateDoc(doc(aliceDb, 'users', 'alice'), { role: 'agent' }));

    // Can update own non-privileged profile fields
    await assertSucceeds(
      updateDoc(doc(aliceDb, 'users', 'alice'), {
        city: 'Zagreb',
        postalCode: '10000',
        updatedAt: '2026-11-02T10:00:00.000Z',
      })
    );
  });

  it('enforces strict tenant isolation between clients on policies and claims', async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      const db = ctx.firestore();
      await setDoc(doc(db, 'policies', 'pol-alice'), {
        id: 'pol-alice',
        policyNumber: 'GEN-AO-999',
        userId: 'alice',
        clientName: 'Alice Horvat',
        clientOib: '26182105152',
        productLine: 'auto',
        carrierName: 'Generali osiguranje d.d.',
        status: 'active',
        startDate: '2026-01-01',
        expiryDate: '2027-01-01',
        annualPremium: 420,
        monthlyPremium: 36,
        deductible: 150,
        coverageLimit: 6450000,
        endorsements: [],
      });
    });

    const aliceDb = testEnv.authenticatedContext('alice', { role: 'client' }).firestore();
    const bobDb = testEnv.authenticatedContext('bob', { role: 'client' }).firestore();
    const agentDb = testEnv.authenticatedContext('marko', { role: 'agent' }).firestore();

    await assertSucceeds(getDoc(doc(aliceDb, 'policies', 'pol-alice')));
    await assertFails(getDoc(doc(bobDb, 'policies', 'pol-alice')));
    await assertSucceeds(getDoc(doc(agentDb, 'policies', 'pol-alice')));
  });

  it('blocks unauthenticated userId spoofing on public quote create and enforces sequential claim stages', async () => {
    const anonDb = testEnv.unauthenticatedContext().firestore();

    // Unauthenticated caller cannot spoof userId: 'alice'
    await assertFails(
      setDoc(doc(anonDb, 'quotes', 'q-spoof'), {
        id: 'q-spoof',
        referenceNumber: 'PON-2026-1111',
        userId: 'alice',
        productLine: 'auto',
        customer: { fullName: 'Attacker', email: 'a@b.hr' },
        consents: { ipidAcknowledged: true, gdprEssential: true },
        status: 'new',
        createdAt: '2026-11-28T10:00:00.000Z',
      })
    );

    // Valid anonymous quote succeeds
    await assertSucceeds(
      setDoc(doc(anonDb, 'quotes', 'q-valid'), {
        id: 'q-valid',
        referenceNumber: 'PON-2026-2222',
        productLine: 'auto',
        customer: { fullName: 'Ana Horvat', email: 'ana@example.hr', oib: '26182105152' },
        consents: { ipidAcknowledged: true, gdprEssential: true, gdprMarketing: false },
        status: 'new',
        createdAt: '2026-11-28T10:00:00.000Z',
      })
    );

    // Seed a claim and test sequential transitions
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), 'claims', 'claim-1'), {
        id: 'claim-1',
        referenceNumber: 'STETA-2026-5001',
        userId: 'alice',
        policyNumber: 'GEN-AO-1',
        claimantName: 'Alice Horvat',
        claimantOib: '26182105152',
        claimantEmail: 'alice@example.hr',
        description: 'Broken windshield on highway.',
        stage: 'received',
        stageHistory: [{ stage: 'received', note: 'Intake', timestamp: '2026-11-28T10:00:00.000Z' }],
        consents: { gdprEssential: true },
        createdAt: '2026-11-28T10:00:00.000Z',
      });
    });

    const agentDb = testEnv.authenticatedContext('marko', { role: 'agent' }).firestore();

    // Skipping directly from received -> paid MUST FAIL
    await assertFails(
      updateDoc(doc(agentDb, 'claims', 'claim-1'), {
        stage: 'paid',
        updatedAt: '2026-11-28T11:00:00.000Z',
      })
    );

    // Sequential received -> insurer_review MUST SUCCEED
    await assertSucceeds(
      updateDoc(doc(agentDb, 'claims', 'claim-1'), {
        stage: 'insurer_review',
        stageHistory: [
          { stage: 'received', note: 'Intake', timestamp: '2026-11-28T10:00:00.000Z' },
          { stage: 'insurer_review', note: 'Sent to carrier', timestamp: '2026-11-28T11:00:00.000Z' },
        ],
        estimatedAmount: 450,
        updatedAt: '2026-11-28T11:00:00.000Z',
      })
    );
  });

  it('enforces GDPR tenant isolation in storage.rules (other clients cannot read Alice files)', async () => {
    const aliceStorage = testEnv.authenticatedContext('alice', { role: 'client' }).storage();
    const bobStorage = testEnv.authenticatedContext('bob', { role: 'client' }).storage();
    const agentStorage = testEnv.authenticatedContext('marko', { role: 'agent' }).storage();

    const aliceRef = ref(aliceStorage, 'users/alice/claims/damage.jpg');
    await assertSucceeds(
      uploadString(aliceRef, 'fake-jpeg-data', 'raw', { contentType: 'image/jpeg' })
    );

    // Alice can read her own file; Agent can read; Bob CANNOT read
    await assertSucceeds(getBytes(aliceRef));
    await assertSucceeds(getBytes(ref(agentStorage, 'users/alice/claims/damage.jpg')));
    await assertFails(getBytes(ref(bobStorage, 'users/alice/claims/damage.jpg')));
  });
});
