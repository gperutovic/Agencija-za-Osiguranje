import { AGENCY_BRAND, GEMINI_MODEL } from '../config.js';
import {
  CompetingCarrierOffer,
  computeCompetingOffersForSwitch,
  ExtractedPolicyInput,
  ProductLine,
} from './pricingEngine.js';

export interface AdvisorHistoryTurn {
  sender: 'user' | 'assistant';
  text: string;
}

export interface AdvisorCardPayload {
  type: 'coverage_comparison' | 'quote_cta';
  title: string;
  subtitle: string;
  productLine?: ProductLine;
  bullets?: string[];
  priceHint?: string;
}

export interface StructuredAdvisorOutput {
  reply: string;
  suggestedCard: AdvisorCardPayload;
  recommendedProductLine: ProductLine;
  shouldOfferEscalation: boolean;
  source: 'gemini' | 'fallback';
  degradedNotice?: string;
}

export interface ParsedPolicyServerResult {
  parsedVia: 'gemini_ai' | 'local_analyzer';
  extracted: ExtractedPolicyInput;
  confidenceScore: number;
  lowConfidenceFields: string[];
  warnings: string[];
  competingOffers: CompetingCarrierOffer[];
  estimatedNewAnnualPremium: number;
  estimatedAnnualSavings: number;
  degradedNotice?: string;
}

const VALID_LINES = new Set<ProductLine>([
  'auto',
  'imovina',
  'zdravstveno',
  'zivotno',
  'putno',
  'ljubimci',
  'poslovno',
]);

function coerceProductLine(val: unknown, fallback: ProductLine = 'auto'): ProductLine {
  return typeof val === 'string' && VALID_LINES.has(val as ProductLine)
    ? (val as ProductLine)
    : fallback;
}

function buildAdvisorSystemPrompt(language: 'hr' | 'en'): string {
  if (language === 'en') {
    return `You are the licensed digital insurance advisor for "${AGENCY_BRAND.brandName}" (${AGENCY_BRAND.legalName}, authorized Croatian insurance agency supervised by HANFA, registration ${AGENCY_BRAND.hanfaRegistrationNumber}).
Answer in clear, natural English grounded accurately in Croatian insurance law and market practice:
- Croatian Mandatory Motor Liability (AO), bonus-malus up to 50%, Mini/Full Kasko, deductibles, and European Accident Statement.
- Croatian Home & Property insurance, especially Earthquake (potres) on full reconstruction value (~1,800–2,000 €/m²) without underinsurance, storm/hail/drone or falling object damage on roofs, water pipe leaks, and neighbor liability.
- Croatian Supplemental Health (HZZO €15/mo vs private insurers from €9.50/mo, B-list drugs) and private diagnostics.
- Term life and mortgage policy assignment (vinkulacija), travel, pet, and SME/cyber cover.
- FNOL claims steps, IDD transparency (€0 agency fee; commission paid solely by insurers), and Art. 401 statutory consumer rights.
Be concise (3-5 crisp sentences), direct, and genuinely helpful — even for unusual real-world Croatian scenarios (e.g., drone damaging a roof on an island, hail in Zagreb, ski accident in Austria). Never fabricate binding prices; guide the user to our 90-second calculator or licensed human agent when binding underwriting is needed.`;
  }

  return `Ti si digitalni savjetnik ovlaštene hrvatske agencije za zastupanje u osiguranju "${AGENCY_BRAND.brandName}" (${AGENCY_BRAND.legalName}, pod nadzorom HANFA-e, upisnik ${AGENCY_BRAND.hanfaRegistrationNumber}).
Odgovaraj na prirodnom, jasnom hrvatskom jeziku bez marketinškog žargona i sitnih slova, precizno utemeljeno na hrvatskom pravu i praksi osiguranja:
- Obvezno auto osiguranje (AO), bonus-malus do 50%, Mini i Puni Kasko, franšize, Europsko izvješće o nezgodi.
- Osiguranje stana i kuće u RH, posebno potres na građevinsku novonabavnu vrijednost (~1.800–2.000 €/m²) bez podosiguranja, pad letjelica/dronova ili stabala na krov, izljev vode, odgovornost vlasnika.
- Dopunsko zdravstveno (HZZO 15 €/mj. vs privatni osiguratelji od 9,50 €/mj., B-lista lijekova) i dodatno zdravstveno.
- Životno osiguranje i vinkulacija stambenih kredita, putno, ljubimci i poslovna (SME / cyber) osiguranja.
- Koraci digitalne prijave štete (FNOL), IDD transparentnost (0 € agencijske naknade) i prava potrošača (čl. 401.).
Budi koncizan (3–5 konkretnih rečenica), točan i stvarno koristan — uključujući specifične i neuobičajene situacije iz prakse (npr. dron oštetio krov na Braču, susjedova cijev poplavila stan, tuča). Nikada ne izmišljaj obvezujuće tarife; uputi korisnika na 90-sekundni kalkulator ili licenciranog zastupnika za obvezujuću procjenu.`;
}

interface GeminiRawResponse {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
  }>;
}

export async function runGeminiAdvisor(
  params: {
    question: string;
    history: AdvisorHistoryTurn[];
    language: 'hr' | 'en';
  },
  apiKey: string | undefined,
  fetchImpl: typeof fetch = fetch
): Promise<StructuredAdvisorOutput> {
  const { question, history, language } = params;
  const fallback = buildHonestFallbackAdvisorResponse(question, language);

  if (!apiKey) {
    return fallback;
  }

  const contents = [
    ...history.slice(-8).map((turn) => ({
      role: turn.sender === 'user' ? 'user' : 'model',
      parts: [{ text: turn.text.slice(0, 1500) }],
    })),
    {
      role: 'user',
      parts: [{ text: question.slice(0, 1500) }],
    },
  ];

  const responseSchema = {
    type: 'OBJECT',
    properties: {
      reply: { type: 'STRING' },
      recommendedProductLine: {
        type: 'STRING',
        enum: ['auto', 'imovina', 'zdravstveno', 'zivotno', 'putno', 'ljubimci', 'poslovno'],
      },
      shouldOfferEscalation: { type: 'BOOLEAN' },
      suggestedCard: {
        type: 'OBJECT',
        properties: {
          type: { type: 'STRING', enum: ['coverage_comparison', 'quote_cta'] },
          title: { type: 'STRING' },
          subtitle: { type: 'STRING' },
          priceHint: { type: 'STRING' },
          bullets: {
            type: 'ARRAY',
            items: { type: 'STRING' },
          },
        },
        required: ['type', 'title', 'subtitle'],
      },
    },
    required: ['reply', 'recommendedProductLine', 'shouldOfferEscalation', 'suggestedCard'],
  };

  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(GEMINI_MODEL)}:generateContent?key=${encodeURIComponent(apiKey)}`;
    const res = await fetchImpl(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: buildAdvisorSystemPrompt(language) }] },
        contents,
        generationConfig: {
          temperature: 0.35,
          maxOutputTokens: 700,
          response_mime_type: 'application/json',
          response_schema: responseSchema,
        },
      }),
    });

    if (!res.ok) {
      console.error('[Gemini Advisor HTTP Error]', res.status);
      return fallback;
    }

    const raw = (await res.json()) as GeminiRawResponse;
    const jsonText = raw.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!jsonText) return fallback;

    const parsed = JSON.parse(jsonText) as Partial<{
      reply: string;
      recommendedProductLine: ProductLine;
      shouldOfferEscalation: boolean;
      suggestedCard: AdvisorCardPayload;
    }>;

    if (!parsed.reply || typeof parsed.reply !== 'string') {
      return fallback;
    }

    const productLine = coerceProductLine(parsed.recommendedProductLine, fallback.recommendedProductLine);
    const card = parsed.suggestedCard;

    return {
      reply: parsed.reply.trim(),
      recommendedProductLine: productLine,
      shouldOfferEscalation: Boolean(parsed.shouldOfferEscalation),
      suggestedCard: {
        type: card?.type === 'coverage_comparison' ? 'coverage_comparison' : 'quote_cta',
        title: (card?.title || fallback.suggestedCard.title).slice(0, 140),
        subtitle: (card?.subtitle || fallback.suggestedCard.subtitle).slice(0, 260),
        productLine,
        priceHint: card?.priceHint?.slice(0, 60) || fallback.suggestedCard.priceHint,
        bullets: Array.isArray(card?.bullets)
          ? card.bullets.filter((b): b is string => typeof b === 'string').slice(0, 4)
          : fallback.suggestedCard.bullets,
      },
      source: 'gemini',
    };
  } catch (err) {
    console.error('[Gemini Advisor Exception]', err);
    return fallback;
  }
}

export function buildHonestFallbackAdvisorResponse(
  question: string,
  language: 'hr' | 'en'
): StructuredAdvisorOutput {
  const q = question.toLowerCase();
  const isEn = language === 'en';
  let line: ProductLine = 'auto';

  if (
    q.includes('potres') ||
    q.includes('stan') ||
    q.includes('kuć') ||
    q.includes('krov') ||
    q.includes('dron') ||
    q.includes('imovina') ||
    q.includes('dom') ||
    q.includes('roof') ||
    q.includes('home') ||
    q.includes('earthquake')
  ) {
    line = 'imovina';
  } else if (
    q.includes('zdrav') ||
    q.includes('dopunsk') ||
    q.includes('hzzo') ||
    q.includes('health')
  ) {
    line = 'zdravstveno';
  } else if (
    q.includes('život') ||
    q.includes('zivot') ||
    q.includes('kredit') ||
    q.includes('vinkul') ||
    q.includes('life') ||
    q.includes('mortgage')
  ) {
    line = 'zivotno';
  } else if (
    q.includes('put') ||
    q.includes('skij') ||
    q.includes('travel') ||
    q.includes('ski')
  ) {
    line = 'putno';
  } else if (q.includes('pas') || q.includes('mačk') || q.includes('ljubim') || q.includes('pet')) {
    line = 'ljubimci';
  } else if (
    q.includes('obrt') ||
    q.includes('d.o.o') ||
    q.includes('tvrtk') ||
    q.includes('cyber') ||
    q.includes('business') ||
    q.includes('sme')
  ) {
    line = 'poslovno';
  }

  const reply = isEn
    ? `Live AI model access is temporarily unavailable, so here is a quick orientation for ${line.toUpperCase()} insurance in Croatia: ${AGENCY_BRAND.brandName} compares 7 licensed Croatian insurers at €0 agency fee. For tailored legal/coverage interpretation of your specific case, click "Transfer to a human agent" and a HANFA-licensed advisor will respond directly.`
    : `AI model trenutno nije dostupan za generiranje prilagođenog odgovora uživo, pa vam dajemo kratku smjernicu: ${AGENCY_BRAND.brandName} uspoređuje 7 hrvatskih osiguratelja bez agencijske naknade (0 €). Za precizno tumačenje vaše konkretne situacije kliknite "Prebaci na ljudskog agenta" ili pokrenite 90-sekundni izračun ispod.`;

  return {
    reply,
    recommendedProductLine: line,
    shouldOfferEscalation: true,
    suggestedCard: {
      type: 'quote_cta',
      title: isEn ? 'Compare 7 Croatian Insurers in 90s' : 'Usporedi 7 hrvatskih osiguratelja u 90s',
      subtitle: isEn
        ? 'Live deductible & coverage adjustment with €0 agency fee'
        : 'Prilagodba franšize i pokrića uživo bez agencijske naknade',
      productLine: line,
      priceHint: isEn ? 'Up to 15% bundle discount' : 'Do 15% paketnog popusta',
    },
    source: 'fallback',
    degradedNotice: isEn
      ? 'AI service temporarily unavailable — showing guidance mode. Escalate to a licensed advisor for bespoke advice.'
      : 'AI sustav je privremeno nedostupan — prikazan je informativni način. Prebacite upit licenciranom zastupniku za konkretan savjet.',
  };
}

export async function runGeminiPolicyOcr(
  params: {
    base64Data: string;
    mimeType: string;
    fileName: string;
    language: 'hr' | 'en';
  },
  apiKey: string | undefined,
  fetchImpl: typeof fetch = fetch
): Promise<ParsedPolicyServerResult> {
  const { base64Data, mimeType, fileName, language } = params;
  const fallbackExpiry = new Date(Date.now() + 45 * 86400_000).toISOString().slice(0, 10);

  const buildFallback = (reason: string): ParsedPolicyServerResult => {
    const nameLower = fileName.toLowerCase();
    let productLine: ProductLine = 'auto';
    if (nameLower.includes('dom') || nameLower.includes('stan') || nameLower.includes('imovin')) {
      productLine = 'imovina';
    } else if (nameLower.includes('zdrav') || nameLower.includes('dopunsk')) {
      productLine = 'zdravstveno';
    } else if (nameLower.includes('zivot') || nameLower.includes('life')) {
      productLine = 'zivotno';
    } else if (nameLower.includes('put')) {
      productLine = 'putno';
    } else if (nameLower.includes('poslov') || nameLower.includes('sme')) {
      productLine = 'poslovno';
    }

    let insurer = 'Croatia osiguranje d.d.';
    if (nameLower.includes('allianz')) insurer = 'Allianz Hrvatska d.d.';
    else if (nameLower.includes('generali')) insurer = 'Generali osiguranje d.d.';
    else if (nameLower.includes('wiener')) insurer = 'Wiener osiguranje VIG d.d.';
    else if (nameLower.includes('triglav')) insurer = 'Triglav osiguranje d.d.';
    else if (nameLower.includes('sava')) insurer = 'Sava osiguranje d.d.';
    else if (nameLower.includes('groupama')) insurer = 'Groupama osiguranje d.d.';

    const extracted: ExtractedPolicyInput = {
      insurer,
      productLine,
      policyNumber: '',
      expiryDate: fallbackExpiry,
      currentAnnualPremium: productLine === 'auto' ? 580 : productLine === 'imovina' ? 245 : 300,
      bonusPercent: productLine === 'auto' ? 50 : undefined,
      deductible: productLine === 'auto' || productLine === 'imovina' ? 150 : 0,
    };

    const priced = computeCompetingOffersForSwitch(extracted, language);
    return {
      parsedVia: 'local_analyzer',
      extracted,
      confidenceScore: 0.35,
      lowConfidenceFields: ['policyNumber', 'expiryDate', 'currentAnnualPremium'],
      warnings: [
        language === 'en'
          ? 'Automatic OCR was unavailable; please verify and enter exact policy number, expiry date, and current premium.'
          : 'Automatsko OCR čitanje trenutno nije dostupno; molimo provjerite i unesite točan broj police, datum isteka i premiju.',
      ],
      ...priced,
      degradedNotice: reason,
    };
  };

  if (!apiKey) {
    return buildFallback(
      language === 'en'
        ? 'AI OCR is currently offline — manual verification required.'
        : 'AI OCR trenutno nije povezan — potrebna ručna provjera polja.'
    );
  }

  const ocrSchema = {
    type: 'OBJECT',
    properties: {
      insurer: { type: 'STRING' },
      productLine: {
        type: 'STRING',
        enum: ['auto', 'imovina', 'zdravstveno', 'zivotno', 'putno', 'ljubimci', 'poslovno'],
      },
      policyNumber: { type: 'STRING' },
      expiryDate: { type: 'STRING' },
      currentAnnualPremium: { type: 'NUMBER' },
      bonusPercent: { type: 'NUMBER' },
      deductible: { type: 'NUMBER' },
      vehiclePlate: { type: 'STRING' },
      areaSqm: { type: 'NUMBER' },
      confidenceScore: { type: 'NUMBER' },
      lowConfidenceFields: { type: 'ARRAY', items: { type: 'STRING' } },
      warnings: { type: 'ARRAY', items: { type: 'STRING' } },
    },
    required: ['insurer', 'productLine', 'policyNumber', 'expiryDate', 'currentAnnualPremium', 'confidenceScore'],
  };

  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(GEMINI_MODEL)}:generateContent?key=${encodeURIComponent(apiKey)}`;
    const res = await fetchImpl(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `You are an expert Croatian insurance policy OCR extractor. Carefully read the attached policy document (PDF or image) and extract exact Croatian insurance fields as JSON:
- insurer: exact Croatian insurer name (e.g. Croatia osiguranje d.d., Allianz Hrvatska d.d., Generali osiguranje d.d., Wiener osiguranje VIG d.d., Triglav osiguranje d.d., Sava osiguranje d.d., Groupama osiguranje d.d., or other exact name found)
- productLine: one of auto, imovina, zdravstveno, zivotno, putno, ljubimci, poslovno
- policyNumber: exact policy number string (empty string if unreadable)
- expiryDate: YYYY-MM-DD expiry date (skadenca / istek osiguranja)
- currentAnnualPremium: numeric annual premium in EUR (if shown in HRK convert by dividing by 7.53450 and add a warning)
- bonusPercent: bonus percentage 0..50 if auto policy
- deductible: deductible (franšiza) in EUR if present
- vehiclePlate: Croatian license plate (e.g. ZG-1234-AB) if auto policy
- areaSqm: property area in square meters if property policy
- confidenceScore: 0.0 to 1.0 overall confidence in the extraction
- lowConfidenceFields: array of field names that were missing, blurry, or guessed
- warnings: array of short human-readable warnings in ${language === 'en' ? 'English' : 'Croatian'} for fields the user should double-check.`,
              },
              {
                inline_data: {
                  mime_type: mimeType,
                  data: base64Data,
                },
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.1,
          response_mime_type: 'application/json',
          response_schema: ocrSchema,
        },
      }),
    });

    if (!res.ok) {
      console.error('[Gemini Policy OCR HTTP Error]', res.status);
      return buildFallback('Gemini OCR upstream error');
    }

    const raw = (await res.json()) as GeminiRawResponse;
    const text = raw.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return buildFallback('Empty Gemini OCR response');

    const parsed = JSON.parse(text) as Partial<
      ExtractedPolicyInput & {
        confidenceScore: number;
        lowConfidenceFields: string[];
        warnings: string[];
      }
    >;

    const productLine = coerceProductLine(parsed.productLine, 'auto');
    const validDate =
      typeof parsed.expiryDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(parsed.expiryDate)
        ? parsed.expiryDate
        : fallbackExpiry;
    const validPremium =
      typeof parsed.currentAnnualPremium === 'number' &&
      Number.isFinite(parsed.currentAnnualPremium) &&
      parsed.currentAnnualPremium > 0
        ? Math.round(parsed.currentAnnualPremium * 100) / 100
        : 320;

    const lowFields = new Set<string>(
      Array.isArray(parsed.lowConfidenceFields) ? parsed.lowConfidenceFields : []
    );
    if (!parsed.policyNumber) lowFields.add('policyNumber');
    if (validDate === fallbackExpiry && !parsed.expiryDate) lowFields.add('expiryDate');
    if (!parsed.currentAnnualPremium || parsed.currentAnnualPremium <= 0) {
      lowFields.add('currentAnnualPremium');
    }

    const extracted: ExtractedPolicyInput = {
      insurer: parsed.insurer?.trim() || 'Croatia osiguranje d.d.',
      productLine,
      policyNumber: parsed.policyNumber?.trim() || '',
      expiryDate: validDate,
      currentAnnualPremium: validPremium,
      bonusPercent:
        typeof parsed.bonusPercent === 'number' && parsed.bonusPercent >= 0 && parsed.bonusPercent <= 50
          ? parsed.bonusPercent
          : undefined,
      deductible:
        typeof parsed.deductible === 'number' && parsed.deductible >= 0
          ? parsed.deductible
          : undefined,
      vehiclePlate: parsed.vehiclePlate?.trim() || undefined,
      areaSqm:
        typeof parsed.areaSqm === 'number' && parsed.areaSqm >= 10 ? parsed.areaSqm : undefined,
    };

    const confidence =
      typeof parsed.confidenceScore === 'number'
        ? Math.max(0, Math.min(1, parsed.confidenceScore))
        : 0.78;
    const warnings = Array.isArray(parsed.warnings)
      ? parsed.warnings.filter((w): w is string => typeof w === 'string').slice(0, 6)
      : [];

    const priced = computeCompetingOffersForSwitch(extracted, language);

    return {
      parsedVia: 'gemini_ai',
      extracted,
      confidenceScore: confidence,
      lowConfidenceFields: Array.from(lowFields),
      warnings,
      ...priced,
    };
  } catch (err) {
    console.error('[Gemini Policy OCR Exception]', err);
    return buildFallback('OCR parsing exception');
  }
}
