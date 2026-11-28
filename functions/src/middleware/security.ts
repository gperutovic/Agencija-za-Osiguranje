import type { Request, Response } from 'express';
import { getAppCheck } from 'firebase-admin/app-check';
import { getAuth, type DecodedIdToken } from 'firebase-admin/auth';
import { ALLOWED_ORIGINS } from '../config.js';

interface RateBucket {
  count: number;
  resetAt: number;
}

const rateBuckets = new Map<string, RateBucket>();

export function applyCors(req: Request, res: Response): boolean {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Firebase-AppCheck'
  );
  res.setHeader('Access-Control-Max-Age', '3600');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return true;
  }
  return false;
}

export function getClientKey(req: Request, uid?: string): string {
  if (uid) return `uid:${uid}`;
  const fwd = req.headers['x-forwarded-for'];
  const ip = Array.isArray(fwd)
    ? fwd[0]
    : typeof fwd === 'string'
      ? fwd.split(',')[0]?.trim()
      : req.ip || 'unknown';
  return `ip:${ip}`;
}

export function checkRateLimit(
  bucketName: string,
  clientKey: string,
  maxRequests: number,
  windowMs: number
): { allowed: boolean; retryAfterSec: number } {
  const now = Date.now();
  const key = `${bucketName}:${clientKey}`;
  const existing = rateBuckets.get(key);
  if (!existing || existing.resetAt <= now) {
    rateBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSec: 0 };
  }
  if (existing.count >= maxRequests) {
    return {
      allowed: false,
      retryAfterSec: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }
  existing.count += 1;
  return { allowed: true, retryAfterSec: 0 };
}

export function resetRateLimitsForTest(): void {
  rateBuckets.clear();
}

export async function verifyOptionalAuth(req: Request): Promise<DecodedIdToken | null> {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return null;
  const token = header.slice(7).trim();
  if (!token) return null;
  try {
    return await getAuth().verifyIdToken(token);
  } catch {
    return null;
  }
}

export async function verifyAppCheckIfEnforced(req: Request): Promise<boolean> {
  const enforce = process.env.ENFORCE_APP_CHECK === 'true';
  const token = req.headers['x-firebase-appcheck'];
  if (!token || typeof token !== 'string') {
    return !enforce;
  }
  try {
    await getAppCheck().verifyToken(token);
    return true;
  } catch {
    return !enforce;
  }
}
