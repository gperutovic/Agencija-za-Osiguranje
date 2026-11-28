import type { Request, Response } from 'express';
import { randomUUID } from 'node:crypto';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { z } from 'zod';
import {
  applyCors,
  checkRateLimit,
  getClientKey,
  verifyAppCheckIfEnforced,
  verifyOptionalAuth,
} from '../middleware/security.js';
import {
  runGeminiAdvisor,
  runGeminiPolicyOcr,
  type ParsedPolicyServerResult,
  type StructuredAdvisorOutput,
} from '../services/geminiService.js';

export interface ClaimLookupRecord {
  referenceNumber: string;
  policyNumber: string;
  productLine: string;
  carrierName: string;
  claimantOib: string;
  claimantEmail: string;
  stage: string;
  stageHistory: Array<{ stage: string; note: string; timestamp: string; actor?: string }>;
  updatedAt: string;
}

export interface ApiDependencies {
  getGeminiKey: () => string | undefined;
  fetchImpl?: typeof fetch;
  verifyAuth?: (req: Request) => Promise<{ uid: string; role?: string; email?: string } | null>;
  verifyAppCheck?: (req: Request) => Promise<boolean>;
  findClaimByReference?: (referenceNumber: string) => Promise<ClaimLookupRecord | null>;
  downloadStorageFile?: (storagePath: string) => Promise<{ base64: string; mimeType: string } | null>;
  savePrivateSwitchFile?: (params: {
    analysisId: string;
    fileName: string;
    mimeType: string;
    base64Data: string;
    ownerUid?: string;
  }) => Promise<{ storagePath: string; storageUrl?: string } | null>;
  createSignedUploadUrl?: (params: {
    folder: 'claims' | 'switch-policies';
    entityId: string;
    fileName: string;
    mimeType: string;
    ownerUid?: string;
  }) => Promise<{ storagePath: string; uploadUrl: string } | null>;
  resolveOrInviteClientUser?: (params: {
    email: string;
    fullName: string;
    oib: string;
    phone?: string;
  }) => Promise<{ uid: string; invitedNewAccount: boolean }>;
}

const ALLOWED_UPLOAD_MIMES = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
]);

const advisorBodySchema = z.object({
  question: z.string().trim().min(2).max(1500),
  language: z.enum(['hr', 'en']).optional().default('hr'),
  history: z
    .array(
      z.object({
        sender: z.enum(['user', 'assistant']),
        text: z.string().max(2000),
      })
    )
    .max(20)
    .optional()
    .default([]),
});

const parsePolicyBodySchema = z.object({
  fileName: z.string().trim().min(1).max(255),
  mimeType: z.string().refine((m) => ALLOWED_UPLOAD_MIMES.has(m), {
    message: 'Unsupported MIME type. Allowed: PDF, JPEG, PNG, WEBP.',
  }),
  base64Data: z.string().max(14_000_000).optional(),
  storagePath: z.string().max(512).optional(),
  language: z.enum(['hr', 'en']).optional().default('hr'),
});

const trackClaimBodySchema = z.object({
  referenceNumber: z.string().trim().min(4).max(64),
  verificationFactor: z.string().trim().min(4).max(254),
});

const signedUploadSchema = z.object({
  folder: z.enum(['claims', 'switch-policies']),
  entityId: z.string().trim().min(3).max(80).regex(/^[a-zA-Z0-9_-]+$/),
  fileName: z.string().trim().min(1).max(180),
  mimeType: z.string().refine((m) => ALLOWED_UPLOAD_MIMES.has(m)),
  sizeBytes: z.number().int().positive().max(10 * 1024 * 1024),
});

const issuePolicyUserSchema = z.object({
  email: z.string().trim().email(),
  fullName: z.string().trim().min(2).max(120),
  oib: z.string().trim().regex(/^\d{11}$/),
  phone: z.string().trim().max(30).optional(),
});

function sanitizeFileName(raw: string): string {
  return raw.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 120);
}

function maskPolicyNumber(policyNumber: string): string {
  if (policyNumber.length <= 6) return '***';
  return `${policyNumber.slice(0, 4)}••••${policyNumber.slice(-3)}`;
}

async function defaultFindClaimByReference(
  referenceNumber: string
): Promise<ClaimLookupRecord | null> {
  const db = getFirestore();
  const normalized = referenceNumber.trim().toUpperCase();
  const snap = await db
    .collection('claims')
    .where('referenceNumber', '==', normalized)
    .limit(1)
    .get();
  if (snap.empty) return null;
  const data = snap.docs[0]!.data();
  return {
    referenceNumber: String(data.referenceNumber || normalized),
    policyNumber: String(data.policyNumber || ''),
    productLine: String(data.productLine || 'auto'),
    carrierName: String(data.carrierName || ''),
    claimantOib: String(data.claimantOib || ''),
    claimantEmail: String(data.claimantEmail || ''),
    stage: String(data.stage || 'received'),
    stageHistory: Array.isArray(data.stageHistory) ? data.stageHistory : [],
    updatedAt: String(data.updatedAt || data.createdAt || new Date().toISOString()),
  };
}

async function defaultDownloadStorageFile(
  storagePath: string
): Promise<{ base64: string; mimeType: string } | null> {
  if (storagePath.includes('..') || !/^(switch-policies|users\/[^/]+\/switch)\//.test(storagePath)) {
    return null;
  }
  const bucket = getStorage().bucket();
  const file = bucket.file(storagePath);
  const [exists] = await file.exists();
  if (!exists) return null;
  const [metadata] = await file.getMetadata();
  const [buffer] = await file.download();
  return {
    base64: buffer.toString('base64'),
    mimeType: String(metadata.contentType || 'application/pdf'),
  };
}

async function defaultSavePrivateSwitchFile(params: {
  analysisId: string;
  fileName: string;
  mimeType: string;
  base64Data: string;
  ownerUid?: string;
}): Promise<{ storagePath: string; storageUrl?: string } | null> {
  try {
    const bucket = getStorage().bucket();
    const safeName = sanitizeFileName(params.fileName);
    const storagePath = `switch-policies/${params.analysisId}/${Date.now()}-${safeName}`;
    const buffer = Buffer.from(params.base64Data, 'base64');
    if (buffer.byteLength > 10 * 1024 * 1024) return null;
    const downloadToken = randomUUID();
    const file = bucket.file(storagePath);
    await file.save(buffer, {
      contentType: params.mimeType,
      metadata: {
        metadata: {
          ownerUid: params.ownerUid || '',
          firebaseStorageDownloadTokens: downloadToken,
        },
      },
    });
    return { storagePath };
  } catch (err) {
    console.warn('[Storage Save Switch File Skipped]', err);
    return null;
  }
}

async function defaultCreateSignedUploadUrl(params: {
  folder: 'claims' | 'switch-policies';
  entityId: string;
  fileName: string;
  mimeType: string;
  ownerUid?: string;
}): Promise<{ storagePath: string; uploadUrl: string } | null> {
  try {
    const bucket = getStorage().bucket();
    const safeName = sanitizeFileName(params.fileName);
    const storagePath = `${params.folder}/${params.entityId}/${Date.now()}-${safeName}`;
    const file = bucket.file(storagePath);
    const [uploadUrl] = await file.getSignedUrl({
      version: 'v4',
      action: 'write',
      expires: Date.now() + 10 * 60 * 1000,
      contentType: params.mimeType,
      extensionHeaders: params.ownerUid
        ? { 'x-goog-meta-ownerUid': params.ownerUid }
        : undefined,
    });
    return { storagePath, uploadUrl };
  } catch (err) {
    console.warn('[Signed Upload URL Error]', err);
    return null;
  }
}

async function defaultResolveOrInviteClientUser(params: {
  email: string;
  fullName: string;
  oib: string;
  phone?: string;
}): Promise<{ uid: string; invitedNewAccount: boolean }> {
  const auth = getAuth();
  const db = getFirestore();
  const normalizedEmail = params.email.trim().toLowerCase();

  try {
    const existing = await auth.getUserByEmail(normalizedEmail);
    return { uid: existing.uid, invitedNewAccount: false };
  } catch {
    // Create a client auth account & profile so the issued policy immediately binds to their wallet
    const created = await auth.createUser({
      email: normalizedEmail,
      displayName: params.fullName,
      emailVerified: false,
    });
    await auth.setCustomUserClaims(created.uid, { role: 'client' });
    const now = new Date().toISOString();
    await db.collection('users').doc(created.uid).set({
      uid: created.uid,
      email: normalizedEmail,
      fullName: params.fullName,
      role: 'client',
      phone: params.phone || '',
      oib: params.oib,
      createdAt: now,
      updatedAt: now,
    });
    return { uid: created.uid, invitedNewAccount: true };
  }
}

export function createApiHandler(deps: ApiDependencies) {
  const verifyAuthImpl =
    deps.verifyAuth ??
    (async (req: Request) => {
      const decoded = await verifyOptionalAuth(req);
      if (!decoded) return null;
      return {
        uid: decoded.uid,
        role: typeof decoded.role === 'string' ? decoded.role : undefined,
        email: decoded.email,
      };
    });
  const verifyAppCheckImpl = deps.verifyAppCheck ?? verifyAppCheckIfEnforced;
  const findClaimImpl = deps.findClaimByReference ?? defaultFindClaimByReference;
  const downloadStorageImpl = deps.downloadStorageFile ?? defaultDownloadStorageFile;
  const saveSwitchFileImpl = deps.savePrivateSwitchFile ?? defaultSavePrivateSwitchFile;
  const signedUploadImpl = deps.createSignedUploadUrl ?? defaultCreateSignedUploadUrl;
  const resolveClientImpl = deps.resolveOrInviteClientUser ?? defaultResolveOrInviteClientUser;

  return async (req: Request, res: Response): Promise<void> => {
    if (applyCors(req, res)) return;

    const rawPath = (req.path || req.url || '/').split('?')[0] || '/';
    const normalizedPath = rawPath.startsWith('/api') ? rawPath : `/api${rawPath}`;

    if (req.method === 'GET' && normalizedPath === '/api/health') {
      res.status(200).json({ status: 'ok', service: 'vedro-api', timestamp: new Date().toISOString() });
      return;
    }

    const appCheckOk = await verifyAppCheckImpl(req);
    if (!appCheckOk) {
      res.status(401).json({ error: 'Invalid or missing Firebase App Check token.' });
      return;
    }

    const authUser = await verifyAuthImpl(req);
    const clientKey = getClientKey(req, authUser?.uid);

    // 1. POST /api/ai/advisor
    if (req.method === 'POST' && normalizedPath === '/api/ai/advisor') {
      const rl = checkRateLimit('ai-advisor', clientKey, 20, 60_000);
      if (!rl.allowed) {
        res.setHeader('Retry-After', String(rl.retryAfterSec));
        res.status(429).json({
          error: 'Previše upita u kratkom vremenu. Pokušajte ponovno za nekoliko sekundi.',
        });
        return;
      }

      const parsed = advisorBodySchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: 'Neispravan format upita.', details: parsed.error.flatten() });
        return;
      }

      const result: StructuredAdvisorOutput = await runGeminiAdvisor(
        parsed.data,
        deps.getGeminiKey(),
        deps.fetchImpl
      );
      res.status(200).json(result);
      return;
    }

    // 2. POST /api/ai/parse-policy
    if (req.method === 'POST' && normalizedPath === '/api/ai/parse-policy') {
      const rl = checkRateLimit('ai-ocr', clientKey, 10, 60_000);
      if (!rl.allowed) {
        res.setHeader('Retry-After', String(rl.retryAfterSec));
        res.status(429).json({
          error: 'Previše analiza dokumenata u minuti. Pričekajte trenutak.',
        });
        return;
      }

      const parsed = parsePolicyBodySchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: 'Podržani formati su PDF, JPG, PNG i WEBP (do 10 MB).',
          details: parsed.error.flatten(),
        });
        return;
      }

      let base64Data = parsed.data.base64Data;
      let mimeType = parsed.data.mimeType;
      let storedPath = parsed.data.storagePath;
      let storedUrl: string | undefined;

      if (!base64Data && storedPath) {
        const downloaded = await downloadStorageImpl(storedPath);
        if (!downloaded) {
          res.status(404).json({ error: 'Dokument nije pronađen u sigurnoj pohrani.' });
          return;
        }
        base64Data = downloaded.base64;
        mimeType = downloaded.mimeType;
      }

      if (!base64Data) {
        res.status(400).json({ error: 'Nedostaje sadržaj dokumenta ili storagePath.' });
        return;
      }

      const byteEstimate = Math.ceil((base64Data.length * 3) / 4);
      if (byteEstimate > 10 * 1024 * 1024) {
        res.status(413).json({ error: 'Datoteka prelazi dopuštenu veličinu od 10 MB.' });
        return;
      }

      if (!storedPath) {
        const analysisId = `sw-${Date.now()}`;
        const saved = await saveSwitchFileImpl({
          analysisId,
          fileName: parsed.data.fileName,
          mimeType,
          base64Data,
          ownerUid: authUser?.uid,
        });
        if (saved) {
          storedPath = saved.storagePath;
          storedUrl = saved.storageUrl;
        }
      }

      const ocrResult: ParsedPolicyServerResult = await runGeminiPolicyOcr(
        {
          base64Data,
          mimeType,
          fileName: parsed.data.fileName,
          language: parsed.data.language,
        },
        deps.getGeminiKey(),
        deps.fetchImpl
      );

      res.status(200).json({
        ...ocrResult,
        storagePath: storedPath,
        storageUrl: storedUrl,
      });
      return;
    }

    // 3. POST /api/claims/track — Secure Public FNOL Status Tracker (2nd factor required, zero PII returned)
    if (req.method === 'POST' && normalizedPath === '/api/claims/track') {
      const rl = checkRateLimit('claims-track', clientKey, 15, 60_000);
      if (!rl.allowed) {
        res.setHeader('Retry-After', String(rl.retryAfterSec));
        res.status(429).json({ error: 'Previše pokušaja provjere. Pokušajte kasnije.' });
        return;
      }

      const parsed = trackClaimBodySchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: 'Unesite referentni broj štete i zadnje 4 znamenke OIB-a ili e-mail prijavitelja.',
        });
        return;
      }

      const claim = await findClaimImpl(parsed.data.referenceNumber);
      if (!claim) {
        res.status(404).json({ error: 'Prijava nije pronađena ili verifikacijski podatak ne odgovara.' });
        return;
      }

      const factor = parsed.data.verificationFactor.trim().toLowerCase();
      const last4Oib = claim.claimantOib.slice(-4);
      const emailMatch = claim.claimantEmail.trim().toLowerCase() === factor;
      const oibMatch = /^\d{4}$/.test(factor) && last4Oib === factor;

      if (!emailMatch && !oibMatch) {
        res.status(404).json({ error: 'Prijava nije pronađena ili verifikacijski podatak ne odgovara.' });
        return;
      }

      // Return ONLY safe non-PII status fields
      res.status(200).json({
        referenceNumber: claim.referenceNumber,
        policyNumberMasked: maskPolicyNumber(claim.policyNumber),
        productLine: claim.productLine,
        carrierName: claim.carrierName,
        stage: claim.stage,
        stageHistory: claim.stageHistory,
        updatedAt: claim.updatedAt,
      });
      return;
    }

    // 4. POST /api/storage/signed-upload — Short-lived signed upload URL for guest/client FNOL & Switch uploads
    if (req.method === 'POST' && normalizedPath === '/api/storage/signed-upload') {
      const rl = checkRateLimit('signed-upload', clientKey, 20, 60_000);
      if (!rl.allowed) {
        res.status(429).json({ error: 'Previše zahtjeva za prijenos datoteka.' });
        return;
      }
      const parsed = signedUploadSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: 'Neispravan format datoteke ili veličina (> 10 MB).' });
        return;
      }
      const signed = await signedUploadImpl({
        folder: parsed.data.folder,
        entityId: parsed.data.entityId,
        fileName: parsed.data.fileName,
        mimeType: parsed.data.mimeType,
        ownerUid: authUser?.uid,
      });
      if (!signed) {
        res.status(503).json({ error: 'Pohrana datoteka trenutno nije dostupna.' });
        return;
      }
      res.status(200).json(signed);
      return;
    }

    // 5. POST /api/admin/resolve-client — Agent-only helper to resolve/create client UID when issuing policy from guest quote
    if (req.method === 'POST' && normalizedPath === '/api/admin/resolve-client') {
      if (!authUser || (authUser.role !== 'agent' && authUser.role !== 'admin')) {
        res.status(403).json({ error: 'Pristup dopušten isključivo ovlaštenim zastupnicima.' });
        return;
      }
      const parsed = issuePolicyUserSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: 'Neispravni podaci klijenta.' });
        return;
      }
      const resolved = await resolveClientImpl(parsed.data);
      res.status(200).json(resolved);
      return;
    }

    res.status(404).json({ error: `Nepoznata API ruta: ${normalizedPath}` });
  };
}
