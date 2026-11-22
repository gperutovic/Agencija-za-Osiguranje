import { BRAND_CONFIG } from '../config/brand';
import {
  AdvisorChatCard,
  AiChatMessage,
  ExtractedPolicyFields,
  ProductLine,
} from '../types/domain';
import { addDaysIso } from '../utils/formatters';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

const ADVISOR_SYSTEM_PROMPT = `Ti si digitalni AI savjetnik hrvatske agencije za zastupanje u osiguranju "${BRAND_CONFIG.brandName}" (${BRAND_CONFIG.legalName}, pod nadzorom HANFA-e).
Odgovaraj na prirodnom, jasnom hrvatskom jeziku bez marketinškog žargona i sitnih slova.
Specijaliziran si za:
- Hrvatsko obvezno auto osiguranje (AO), bonus-malus sustav do 50%, mini i puni kasko, franšizu i Europsko izvješće o nezgodi.
- Osiguranje stana i kuće u Hrvatskoj, osobito osiguranje od potresa na novonabavnu građevinsku vrijednost bez podosiguranja.
- Dopunsko zdravstveno osiguranje (HZZO 15 €/mj. vs privatni osiguratelji od 9,50 €/mj., B-lista lijekova) i dodatno zdravstveno.
- Životno osiguranje i vinkulaciju stambenih kredita, putno, ljubimce i poslovna (SME) osiguranja.
Budi koncizan (max 4-5 rečenica), jasan i konkretan. Nikada ne izmišljaj obvezujuće tarife — uvijek naglasi da se precizne ponude dobivaju kroz naš 90-sekundni kalkulator ili uz ovlaštenog zastupnika.`;

interface GeminiResponsePayload {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
}

async function callGeminiText(prompt: string, systemInstruction: string): Promise<string | null> {
  if (!GEMINI_API_KEY) return null;
  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemInstruction }] },
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 450 },
      }),
    });
    if (!response.ok) return null;
    const data = (await response.json()) as GeminiResponsePayload;
    return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? null;
  } catch {
    return null;
  }
}

function inferContextualCard(query: string): AdvisorChatCard {
  const q = query.toLowerCase();
  if (q.includes('potres') || q.includes('stan') || q.includes('kuć') || q.includes('imovina') || q.includes('dom')) {
    return {
      type: 'coverage_comparison',
      title: 'Osiguranje doma + Potres bez podosiguranja',
      subtitle: 'Usporedba 7 hrvatskih osiguratelja na novonabavnu vrijednost',
      productLine: 'imovina',
      priceHint: 'od 11,00 € / mj.',
      bullets: [
        'Požar, izljev vode i odgovornost prema susjedima',
        'Potres obračunat na građevinsku vrijednost (bez amortizacije)',
        'Usklađeno za vinkulaciju stambenog kredita u svim bankama',
      ],
    };
  }
  if (q.includes('auto') || q.includes('kasko') || q.includes('bonus') || q.includes('registrac') || q.includes('ao')) {
    return {
      type: 'coverage_comparison',
      title: 'Auto AO + Kasko usporedba',
      subtitle: 'Prijenos do 50% bonusa i prilagodba franšize uživo',
      productLine: 'auto',
      priceHint: 'od 19,00 € / mj.',
      bullets: [
        'AO + Mini Kasko ili Puni Kasko (franšiza 0 € – 500 €)',
        'Opcije loma stakala, tuče, naleta na divljač i 24/7 asistencije',
        'Digitalna Zelena karta odmah u Moj Profil novčaniku',
      ],
    };
  }
  if (q.includes('zdrav') || q.includes('dopunsk') || q.includes('hzzo') || q.includes('pregled')) {
    return {
      type: 'coverage_comparison',
      title: 'Dopunsko & Dodatno zdravstveno',
      subtitle: 'Pokriće participacija, B-liste lijekova i privatnih poliklinika',
      productLine: 'zdravstveno',
      priceHint: 'od 9,50 € / mj.',
      bullets: [
        'Ušteda u odnosu na HZZO policu (15,00 € / mj.)',
        'Opcija pokrića dopunske B-liste lijekova bez ograničenja',
        'Specijalistički pregledi i MR/CT dijagnostika bez čekanja',
      ],
    };
  }
  if (q.includes('kredit') || q.includes('život') || q.includes('zivot') || q.includes('vinkul')) {
    return {
      type: 'quote_cta',
      title: 'Životno osiguranje i vinkulacija kredita',
      subtitle: 'Izračunajte orientacijsku premiju i zatražite vinkulacijski list',
      productLine: 'zivotno',
      priceHint: 'od 14,00 € / mj.',
      bullets: [
        'Fiksna ili padajuća svota za stambene kredite',
        'Mogućnost pokrića 20+ teških bolesti',
      ],
    };
  }
  if (q.includes('put') || q.includes('skij') || q.includes('inozem')) {
    return {
      type: 'quote_cta',
      title: 'Putno zdravstveno osiguranje',
      subtitle: 'Polica spremna u 60 sekundi za Europu i svijet',
      productLine: 'putno',
      priceHint: 'od 8,00 € / put',
    };
  }
  if (q.includes('obrt') || q.includes('tvrtk') || q.includes('d.o.o') || q.includes('poslov') || q.includes('cyber')) {
    return {
      type: 'quote_cta',
      title: 'Poslovno osiguranje za obrte i SME',
      subtitle: 'Profesionalna odgovornost, uredska oprema i cyber zaštita',
      productLine: 'poslovno',
      priceHint: 'od 29,00 € / mj.',
    };
  }
  return {
    type: 'quote_cta',
    title: 'Izračunaj ponude u 90 sekundi',
    subtitle: 'Usporedi 7 hrvatskih osiguratelja bez sitnih slova i bez naknade',
    productLine: 'auto',
    priceHint: 'Ušteda do 15% u paketu',
  };
}

function generateDeterministicCroatianReply(query: string): string {
  const q = query.toLowerCase();
  if (q.includes('potres')) {
    return 'Osiguranje od potresa u Hrvatskoj ugovara se kao poseban dodatak polici imovine. Ključno je ugovoriti građevinsku novonabavnu vrijednost (oko 1.800–2.000 €/m²) bez podosiguranja kako bi u slučaju štete odšteta pokrila stvarni trošak sanacije. Franšizu za potres (najčešće 2% ili fiksni iznos) možete usporediti izravno u našem kalkulatoru imovine.';
  }
  if (q.includes('kasko') || q.includes('franšiz') || q.includes('fransiz') || q.includes('auto') || q.includes('bonus')) {
    return 'Obvezno auto osiguranje (AO) pokriva isključivo štetu koju nanesete trećim osobama, dok Kasko pokriva štetu na vašem vozilu (sudar, krađa, tuča, vandalizam). Odabirom franšize od 150 € ili 300 € godišnja kasko premija pada za 10% do 20%, a vaš stečeni bonus do 50% slobodno prenosite između svih hrvatskih osiguratelja.';
  }
  if (q.includes('dopunsk') || q.includes('hzzo') || q.includes('zdrav')) {
    return 'Privatno dopunsko zdravstveno osiguranje pokriva sve iste bolničke i ambulantne participacije kao HZZO (koji iznosi 15,00 €/mj.), ali za mlađe i srednje dobne skupine kreće već od 9,50 €/mj. Preporučujemo uključiti i B-listu lijekova kako biste izbjegli doplate u ljekarni.';
  }
  if (q.includes('štet') || q.includes('stet') || q.includes('nezgod') || q.includes('fnol')) {
    return 'Kod prometne nezgode bez ozlijeđenih ispunite Europsko izvješće o nezgodi i fotografirajte štetu iz više kutova (uključujući registracije). Štetu možete prijaviti odmah putem našeg digitalnog FNOL obrasca u manje od 3 minute — naš tim zastupnika preuzima komunikaciju s osigurateljem i prati procjenu do isplate.';
  }
  if (q.includes('kredit') || q.includes('vinkul') || q.includes('život') || q.includes('zivot')) {
    return 'Za vinkulaciju stambenog kredita banke u Hrvatskoj prihvaćaju policu imovine (požar i izljev vode) te riziko policu životnog osiguranja. Kroz našu agenciju možete usporediti tarife svih partnerskih društava, a vinkulacijski list pripremamo bez dodatne naknade.';
  }
  return 'Kao ovlašteni zastupnik u osiguranju uspoređujemo ponude 7 vodećih hrvatskih osiguratelja (Allianz, Croatia, Generali, Wiener, Triglav, Sava, Groupama) bez ikakve agencijske naknade za vas. Recite mi što želite osigurati (vozilo, dom/potres, zdravlje, putovanje ili tvrtku) ili kliknite karticu ispod za 90-sekundni izračun.';
}

export async function askInsuranceAdvisor(
  userQuestion: string,
  history: AiChatMessage[]
): Promise<{ text: string; card: AdvisorChatCard }> {
  const recentContext = history
    .slice(-4)
    .map((m) => `${m.sender === 'user' ? 'Klijent' : 'Savjetnik'}: ${m.text}`)
    .join('\n');

  const fullPrompt = recentContext
    ? `Prethodni kontekst:\n${recentContext}\n\nNovo pitanje klijenta: ${userQuestion}`
    : userQuestion;

  const geminiReply = await callGeminiText(fullPrompt, ADVISOR_SYSTEM_PROMPT);
  return {
    text: geminiReply ?? generateDeterministicCroatianReply(userQuestion),
    card: inferContextualCard(userQuestion),
  };
}

/**
 * Extracts structured policy metadata from an uploaded PDF/image file.
 * Uses Gemini API when `VITE_GEMINI_API_KEY` is configured, and falls back to
 * an intelligent client-side filename/metadata analyzer so users can always verify & edit fields.
 */
export async function analyzeUploadedPolicyFile(file: File): Promise<{
  parsedVia: 'gemini_ai' | 'local_analyzer';
  extracted: ExtractedPolicyFields;
}> {
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

  if (GEMINI_API_KEY && file.size < 4 * 1024 * 1024) {
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = typeof reader.result === 'string' ? reader.result : '';
          resolve(result.split(',')[1] ?? '');
        };
        reader.onerror = () => reject(new Error('File read error'));
        reader.readAsDataURL(file);
      });

      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: 'Extract Croatian insurance policy details as strict JSON with keys: insurer (string), productLine (one of auto,imovina,zdravstveno,zivotno,putno,ljubimci,poslovno), policyNumber (string), expiryDate (YYYY-MM-DD), currentAnnualPremium (number in EUR), bonusPercent (number or 50), deductible (number or 150). Return ONLY raw JSON.',
                },
                {
                  inline_data: {
                    mime_type: file.type || 'application/pdf',
                    data: base64,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            response_mime_type: 'application/json',
            temperature: 0.1,
          },
        }),
      });

      if (response.ok) {
        const data = (await response.json()) as GeminiResponsePayload;
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          const parsed = JSON.parse(rawText) as Partial<ExtractedPolicyFields>;
          return {
            parsedVia: 'gemini_ai',
            extracted: {
              insurer: parsed.insurer || guessedInsurer,
              productLine: parsed.productLine || guessedLine,
              policyNumber: parsed.policyNumber || `POL-${Math.floor(100000 + Math.random() * 900000)}`,
              expiryDate: parsed.expiryDate || fallbackDate,
              currentAnnualPremium:
                typeof parsed.currentAnnualPremium === 'number' && parsed.currentAnnualPremium > 0
                  ? parsed.currentAnnualPremium
                  : guessedPremium,
              bonusPercent: typeof parsed.bonusPercent === 'number' ? parsed.bonusPercent : 50,
              deductible: typeof parsed.deductible === 'number' ? parsed.deductible : 150,
            },
          };
        }
      }
    } catch {
      // Fall through cleanly to local analyzer
    }
  }

  return {
    parsedVia: 'local_analyzer',
    extracted: {
      insurer: guessedInsurer,
      productLine: guessedLine,
      policyNumber: `POL-${Math.floor(100000 + Math.random() * 899999)}`,
      expiryDate: fallbackDate,
      currentAnnualPremium: guessedPremium,
      bonusPercent: guessedLine === 'auto' ? 50 : undefined,
      deductible: guessedLine === 'auto' || guessedLine === 'imovina' ? 150 : 0,
    },
  };
}
