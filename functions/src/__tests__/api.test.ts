import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Request, Response } from 'express';
import { resetRateLimitsForTest } from '../middleware/security.js';
import { createApiHandler, type ClaimLookupRecord } from '../routes/apiHandler.js';

function createMockReqRes(params: {
  method: string;
  path: string;
  body?: unknown;
  headers?: Record<string, string>;
}): {
  req: Request;
  res: Response;
  getStatus: () => number;
  getBody: () => unknown;
  getHeaders: () => Record<string, string>;
} {
  let statusCode = 200;
  let responseBody: unknown = null;
  const responseHeaders: Record<string, string> = {};

  const req = {
    method: params.method,
    path: params.path,
    url: params.path,
    body: params.body ?? {},
    headers: params.headers ?? { origin: 'https://agencija-za-osiguranje.web.app' },
    ip: '127.0.0.1',
  } as unknown as Request;

  const res = {
    setHeader(name: string, val: string) {
      responseHeaders[name.toLowerCase()] = val;
      return res;
    },
    status(code: number) {
      statusCode = code;
      return res;
    },
    json(data: unknown) {
      responseBody = data;
      return res;
    },
    send(data: unknown) {
      responseBody = data;
      return res;
    },
  } as unknown as Response;

  return {
    req,
    res,
    getStatus: () => statusCode,
    getBody: () => responseBody,
    getHeaders: () => responseHeaders,
  };
}

describe('Vedro Cloud Functions v2 API', () => {
  beforeEach(() => {
    resetRateLimitsForTest();
  });

  it('POST /api/ai/advisor returns structured Gemini JSON response when GEMINI_API_KEY is configured', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        candidates: [
          {
            content: {
              parts: [
                {
                  text: JSON.stringify({
                    reply:
                      'Šteta na krovu kuće na Braču uzrokovana padom drona u pravilu je pokrivena policom osiguranja imovine (pad letjelice) ili policom odgovornosti operatera drona.',
                    recommendedProductLine: 'imovina',
                    shouldOfferEscalation: true,
                    suggestedCard: {
                      type: 'coverage_comparison',
                      title: 'Osiguranje kuće i krovišta u Dalmaciji',
                      subtitle: 'Pokriva oluju, požar, pad letjelica i opciju potresa',
                      priceHint: 'od 11 € / mj.',
                      bullets: ['Novonabavna građevinska vrijednost', 'Potres bez podosiguranja'],
                    },
                  }),
                },
              ],
            },
          },
        ],
      }),
    }) as unknown as typeof fetch;

    const handler = createApiHandler({
      getGeminiKey: () => 'test-gemini-secret-key',
      fetchImpl: mockFetch,
      verifyAuth: async () => null,
      verifyAppCheck: async () => true,
    });

    const { req, res, getStatus, getBody } = createMockReqRes({
      method: 'POST',
      path: '/api/ai/advisor',
      body: {
        question: 'Dron susjeda mi je pao na krov kuće na Braču i razbio crijep. Pokriva li to polica?',
        language: 'hr',
        history: [],
      },
    });

    await handler(req, res);

    expect(getStatus()).toBe(200);
    const body = getBody() as Record<string, unknown>;
    expect(body.source).toBe('gemini');
    expect(body.recommendedProductLine).toBe('imovina');
    expect(body.shouldOfferEscalation).toBe(true);
    expect(String(body.reply)).toContain('Braču');
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('POST /api/ai/advisor returns honest degraded fallback when GEMINI_API_KEY is missing', async () => {
    const handler = createApiHandler({
      getGeminiKey: () => undefined,
      verifyAuth: async () => null,
      verifyAppCheck: async () => true,
    });

    const { req, res, getStatus, getBody } = createMockReqRes({
      method: 'POST',
      path: '/api/ai/advisor',
      body: { question: 'Što pokriva potres za stan u Zagrebu?', language: 'hr' },
    });

    await handler(req, res);

    expect(getStatus()).toBe(200);
    const body = getBody() as Record<string, unknown>;
    expect(body.source).toBe('fallback');
    expect(body.recommendedProductLine).toBe('imovina');
    expect(typeof body.degradedNotice).toBe('string');
  });

  it('POST /api/ai/parse-policy extracts fields via Gemini multimodal and computes real Pricing Engine offers & savings', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        candidates: [
          {
            content: {
              parts: [
                {
                  text: JSON.stringify({
                    insurer: 'Croatia osiguranje d.d.',
                    productLine: 'auto',
                    policyNumber: 'CRO-AO-2025-771234',
                    expiryDate: '2026-12-30',
                    currentAnnualPremium: 720,
                    bonusPercent: 50,
                    deductible: 150,
                    vehiclePlate: 'ZG-4821-MK',
                    confidenceScore: 0.91,
                    lowConfidenceFields: [],
                    warnings: [],
                  }),
                },
              ],
            },
          },
        ],
      }),
    }) as unknown as typeof fetch;

    const savePrivateSwitchFile = vi.fn().mockResolvedValue({
      storagePath: 'switch-policies/sw-1/policy.pdf',
    });

    const handler = createApiHandler({
      getGeminiKey: () => 'test-gemini-secret-key',
      fetchImpl: mockFetch,
      verifyAuth: async () => ({ uid: 'client-123', role: 'client' }),
      verifyAppCheck: async () => true,
      savePrivateSwitchFile,
    });

    const { req, res, getStatus, getBody } = createMockReqRes({
      method: 'POST',
      path: '/api/ai/parse-policy',
      body: {
        fileName: 'moja-polica.pdf',
        mimeType: 'application/pdf',
        base64Data: Buffer.from('%PDF-1.4 sample policy').toString('base64'),
        language: 'hr',
      },
    });

    await handler(req, res);

    expect(getStatus()).toBe(200);
    const body = getBody() as Record<string, unknown>;
    expect(body.parsedVia).toBe('gemini_ai');
    expect(body.confidenceScore).toBe(0.91);
    expect(body.storagePath).toBe('switch-policies/sw-1/policy.pdf');
    expect(Array.isArray(body.competingOffers)).toBe(true);
    const offers = body.competingOffers as Array<{ carrierName: string; annualPrice: number }>;
    expect(offers.length).toBeGreaterThan(0);
    // Competing offers should exclude current insurer (Croatia osiguranje d.d.)
    expect(offers.every((o) => !o.carrierName.includes('Croatia'))).toBe(true);
    expect(typeof body.estimatedNewAnnualPremium).toBe('number');
    expect(body.estimatedNewAnnualPremium).toBe(offers[0]!.annualPrice);
    // Must NOT be hardcoded 0.84 * 720 = 604.8
    expect(body.estimatedNewAnnualPremium).not.toBe(604.8);
    expect(savePrivateSwitchFile).toHaveBeenCalledTimes(1);
  });

  it('POST /api/ai/parse-policy rejects disallowed MIME types with 400', async () => {
    const handler = createApiHandler({
      getGeminiKey: () => 'test-key',
      verifyAuth: async () => null,
      verifyAppCheck: async () => true,
    });

    const { req, res, getStatus } = createMockReqRes({
      method: 'POST',
      path: '/api/ai/parse-policy',
      body: {
        fileName: 'malware.exe',
        mimeType: 'application/x-msdownload',
        base64Data: 'AAAA',
      },
    });

    await handler(req, res);
    expect(getStatus()).toBe(400);
  });

  it('POST /api/claims/track verifies second factor (last 4 OIB or email) and strips all PII', async () => {
    const sampleClaim: ClaimLookupRecord = {
      referenceNumber: 'STETA-2026-1042',
      policyNumber: 'GEN-AO-2026-441082',
      productLine: 'auto',
      carrierName: 'Generali osiguranje d.d.',
      claimantOib: '26182105152',
      claimantEmail: 'ana.horvat@example.hr',
      stage: 'assessment',
      stageHistory: [
        { stage: 'received', note: 'Zaprimljeno', timestamp: '2026-11-20T10:00:00.000Z' },
        { stage: 'assessment', note: 'Procjenitelj odobrio zamjenu.', timestamp: '2026-11-22T12:00:00.000Z' },
      ],
      updatedAt: '2026-11-22T12:00:00.000Z',
    };

    const handler = createApiHandler({
      getGeminiKey: () => undefined,
      verifyAuth: async () => null,
      verifyAppCheck: async () => true,
      findClaimByReference: async (ref) =>
        ref.toUpperCase() === 'STETA-2026-1042' ? sampleClaim : null,
    });

    // 1. Valid last 4 OIB digits -> 200 with zero PII
    const okOib = createMockReqRes({
      method: 'POST',
      path: '/api/claims/track',
      body: { referenceNumber: 'STETA-2026-1042', verificationFactor: '5152' },
    });
    await handler(okOib.req, okOib.res);
    expect(okOib.getStatus()).toBe(200);
    const data = okOib.getBody() as Record<string, unknown>;
    expect(data.referenceNumber).toBe('STETA-2026-1042');
    expect(data.stage).toBe('assessment');
    expect(data.policyNumberMasked).toBe('GEN-••••082');
    expect(data.claimantOib).toBeUndefined();
    expect(data.claimantEmail).toBeUndefined();
    expect(data.claimantName).toBeUndefined();

    // 2. Valid email (case-insensitive) -> 200
    const okEmail = createMockReqRes({
      method: 'POST',
      path: '/api/claims/track',
      body: { referenceNumber: 'steta-2026-1042', verificationFactor: 'ANA.HORVAT@EXAMPLE.HR' },
    });
    await handler(okEmail.req, okEmail.res);
    expect(okEmail.getStatus()).toBe(200);

    // 3. Wrong verification factor -> 404 (no enumeration leak)
    const badFactor = createMockReqRes({
      method: 'POST',
      path: '/api/claims/track',
      body: { referenceNumber: 'STETA-2026-1042', verificationFactor: '9999' },
    });
    await handler(badFactor.req, badFactor.res);
    expect(badFactor.getStatus()).toBe(404);
  });

  it('POST /api/admin/resolve-client rejects non-agent callers with 403', async () => {
    const handler = createApiHandler({
      getGeminiKey: () => undefined,
      verifyAuth: async () => ({ uid: 'client-1', role: 'client' }),
      verifyAppCheck: async () => true,
    });

    const { req, res, getStatus } = createMockReqRes({
      method: 'POST',
      path: '/api/admin/resolve-client',
      body: { email: 'test@example.hr', fullName: 'Test User', oib: '26182105152' },
    });

    await handler(req, res);
    expect(getStatus()).toBe(403);
  });
});
