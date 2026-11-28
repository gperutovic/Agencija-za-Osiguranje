import {
  AdvisorChatCard,
  AiChatMessage,
  ExtractedPolicyFields,
  Language,
  PolicyParseResult,
  ProductLine,
} from '../types/domain';
import { addDaysIso } from '../utils/formatters';
import { buildCompetingOffersFromExtracted } from '../utils/pricingEngine';
import { firebaseAuth, getOptionalAppCheckToken } from './firebase';

const API_BASE = ((import.meta.env.VITE_API_BASE_URL as string | undefined) || '').replace(/\/$/, '');

async function buildApiHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  try {
    const idToken = await firebaseAuth.currentUser?.getIdToken();
    if (idToken) headers.Authorization = `Bearer ${idToken}`;
  } catch {
    // Proceed unauthenticated if token unavailable
  }
  const appCheckToken = await getOptionalAppCheckToken();
  if (appCheckToken) {
    headers['X-Firebase-AppCheck'] = appCheckToken;
  }
  return headers;
}

export interface AdvisorReplyResult {
  text: string;
  card: AdvisorChatCard;
  recommendedProductLine: ProductLine;
  shouldOfferEscalation: boolean;
  source: 'gemini' | 'fallback';
  degradedNotice?: string;
}

function buildLocalFallbackReply(question: string, language: Language): AdvisorReplyResult {
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
    q.includes('home') ||
    q.includes('roof') ||
    q.includes('earthquake')
  ) {
    line = 'imovina';
  } else if (q.includes('zdrav') || q.includes('dopunsk') || q.includes('hzzo') || q.includes('health')) {
    line = 'zdravstveno';
  } else if (q.includes('kredit') || q.includes('život') || q.includes('zivot') || q.includes('vinkul') || q.includes('life')) {
    line = 'zivotno';
  } else if (q.includes('put') || q.includes('skij') || q.includes('travel') || q.includes('ski')) {
    line = 'putno';
  } else if (q.includes('pas') || q.includes('mačk') || q.includes('ljubim') || q.includes('pet')) {
    line = 'ljubimci';
  } else if (q.includes('obrt') || q.includes('tvrtk') || q.includes('d.o.o') || q.includes('cyber') || q.includes('business')) {
    line = 'poslovno';
  }

  return {
    text: isEn
      ? 'Live AI advisor API is currently unreachable. You can immediately run our 90-second comparison across 7 Croatian insurers or click "Transfer to a human agent" so a HANFA-licensed advisor answers your exact question directly.'
      : 'AI savjetnik API trenutno nije dostupan za generiranje odgovora uživo. Možete odmah pokrenuti naš 90-sekundni izračun kod 7 hrvatskih osiguratelja ili jednim klikom prebaciti upit našem licenciranom zastupniku za precizan odgovor.',
    recommendedProductLine: line,
    shouldOfferEscalation: true,
    card: {
      type: 'quote_cta',
      title: isEn ? 'Compare 7 Croatian Insurers in 90s' : 'Usporedi 7 hrvatskih osiguratelja u 90s',
      subtitle: isEn
        ? 'Real-time deductible & coverage sliders at €0 agency fee'
        : 'Prilagodba franšize i pokrića uživo bez agencijske naknade',
      productLine: line,
      priceHint: isEn ? 'Up to 15% bundle savings' : 'Ušteda do 15% u paketu',
    },
    source: 'fallback',
    degradedNotice: isEn
      ? 'Live Gemini AI backend is currently offline — showing honest fallback mode.'
      : 'Gemini AI servis trenutno nije dostupan — prikazan je pričuvni način bez AI generiranja.',
  };
}

/**
 * Calls server-side Cloud Function `POST /api/ai/advisor` where `GEMINI_API_KEY`
 * is securely managed in Firebase Secret Manager (never exposed in the client bundle).
 */
export async function askInsuranceAdvisor(
  userQuestion: string,
  history: AiChatMessage[],
  language: Language = 'hr'
): Promise<AdvisorReplyResult> {
  try {
    const headers = await buildApiHeaders();
    const res = await fetch(`${API_BASE}/api/ai/advisor`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        question: userQuestion,
        language,
        history: history.slice(-8).map((m) => ({
          sender: m.sender,
          text: m.text,
        })),
      }),
    });

    if (!res.ok) {
      return buildLocalFallbackReply(userQuestion, language);
    }

    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return buildLocalFallbackReply(userQuestion, language);
    }

    const data = (await res.json()) as {
      reply: string;
      suggestedCard: AdvisorChatCard;
      recommendedProductLine: ProductLine;
      shouldOfferEscalation: boolean;
      source: 'gemini' | 'fallback';
      degradedNotice?: string;
    };

    if (!data.reply) {
      return buildLocalFallbackReply(userQuestion, language);
    }

    return {
      text: data.reply,
      card: data.suggestedCard,
      recommendedProductLine: data.recommendedProductLine,
      shouldOfferEscalation: data.shouldOfferEscalation,
      source: data.source,
      degradedNotice: data.degradedNotice,
    };
  } catch {
    return buildLocalFallbackReply(userQuestion, language);
  }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      resolve(result.split(',')[1] ?? '');
    };
    reader.onerror = () => reject(new Error('File read error'));
    reader.readAsDataURL(file);
  });
}

function buildLocalFallbackPolicyParse(
  file: File,
  language: Language,
  reason: string
): PolicyParseResult {
  const fallbackDate = addDaysIso(new Date().toISOString().slice(0, 10), 42);
  const nameLower = file.name.toLowerCase();

  let guessedLine: ProductLine = 'auto';
  if (nameLower.includes('dom') || nameLower.includes('stan') || nameLower.includes('imovin') || nameLower.includes('kuca')) {
    guessedLine = 'imovina';
  } else if (nameLower.includes('zdrav') || nameLower.includes('dopunsk')) {
    guessedLine = 'zdravstveno';
  } else if (nameLower.includes('zivot') || nameLower.includes('life')) {
    guessedLine = 'zivotno';
  } else if (nameLower.includes('put')) {
    guessedLine = 'putno';
  } else if (nameLower.includes('ljubim') || nameLower.includes('pet')) {
    guessedLine = 'ljubimci';
  } else if (nameLower.includes('poslov') || nameLower.includes('tvrtk') || nameLower.includes('sme')) {
    guessedLine = 'poslovno';
  }

  let guessedInsurer = 'Croatia osiguranje d.d.';
  if (nameLower.includes('allianz')) guessedInsurer = 'Allianz Hrvatska d.d.';
  else if (nameLower.includes('generali')) guessedInsurer = 'Generali osiguranje d.d.';
  else if (nameLower.includes('wiener')) guessedInsurer = 'Wiener osiguranje VIG d.d.';
  else if (nameLower.includes('triglav')) guessedInsurer = 'Triglav osiguranje d.d.';
  else if (nameLower.includes('sava')) guessedInsurer = 'Sava osiguranje d.d.';
  else if (nameLower.includes('groupama')) guessedInsurer = 'Groupama osiguranje d.d.';

  const guessedPremium =
    guessedLine === 'auto'
      ? 595
      : guessedLine === 'imovina'
        ? 248
        : guessedLine === 'zdravstveno'
          ? 180
          : guessedLine === 'poslovno'
            ? 680
            : 290;

  const extracted: ExtractedPolicyFields = {
    insurer: guessedInsurer,
    productLine: guessedLine,
    policyNumber: '',
    expiryDate: fallbackDate,
    currentAnnualPremium: guessedPremium,
    bonusPercent: guessedLine === 'auto' ? 50 : undefined,
    deductible: guessedLine === 'auto' || guessedLine === 'imovina' ? 150 : 0,
  };

  const priced = buildCompetingOffersFromExtracted(extracted, language);

  return {
    parsedVia: 'local_analyzer',
    extracted,
    confidenceScore: 0.35,
    lowConfidenceFields: ['policyNumber', 'expiryDate', 'currentAnnualPremium'],
    warnings: [
      language === 'en'
        ? 'OCR backend was unreachable — please verify policy number, expiry date, and current annual premium manually.'
        : 'AI OCR servis trenutno nije dostupan — molimo provjerite i ručno upišite točan broj police, datum isteka i godišnju premiju.',
    ],
    competingOffers: priced.competingOffers,
    estimatedNewAnnualPremium: priced.estimatedNewAnnualPremium,
    estimatedAnnualSavings: priced.estimatedAnnualSavings,
    degradedNotice: reason,
  };
}

/**
 * Sends uploaded policy document to server-side `POST /api/ai/parse-policy`
 * which persists privately to Firebase Storage, runs Gemini multimodal structured OCR,
 * and computes genuine competing offers via the Pricing Engine.
 */
export async function analyzeUploadedPolicyFile(
  file: File,
  language: Language = 'hr'
): Promise<PolicyParseResult> {
  try {
    const base64Data = await fileToBase64(file);
    const headers = await buildApiHeaders();

    const res = await fetch(`${API_BASE}/api/ai/parse-policy`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        fileName: file.name,
        mimeType: file.type || 'application/pdf',
        base64Data,
        language,
      }),
    });

    if (!res.ok) {
      return buildLocalFallbackPolicyParse(
        file,
        language,
        language === 'en'
          ? 'OCR server returned an error — switched to manual verification.'
          : 'OCR servis je vratio pogrešku — omogućena je ručna provjera.'
      );
    }

    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return buildLocalFallbackPolicyParse(
        file,
        language,
        language === 'en'
          ? 'OCR API endpoint is not deployed yet — manual verification enabled.'
          : 'AI OCR backend trenutno nije aktivan — omogućena je ručna provjera.'
      );
    }

    const data = (await res.json()) as PolicyParseResult;
    if (!data.extracted) {
      return buildLocalFallbackPolicyParse(file, language, 'Invalid OCR payload');
    }

    return data;
  } catch {
    return buildLocalFallbackPolicyParse(
      file,
      language,
      language === 'en'
        ? 'Unable to reach OCR API — manual verification enabled.'
        : 'Nije moguće kontaktirati OCR API — omogućena je ručna provjera.'
    );
  }
}
