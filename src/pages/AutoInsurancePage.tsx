import React from 'react';
import { ShieldCheck, Car, Check, Award, FileText, Sparkles, Phone, HelpCircle } from 'lucide-react';
import { AutoInsuranceCalculator } from '../components/calculators/AutoInsuranceCalculator';
import { JsonLd } from '../components/seo/JsonLd';
import { FAQ_AUTO, AGENCY_DETAILS } from '../lib/content/insurance-data';

export const metadata = {
  title: 'Obvezno Auto Osiguranje (AO) & Kasko | Agencija Život Zagreb',
  description:
    'Izračunajte i usporedite cijene auto osiguranja i kaska u Hrvatskoj. Prijenos 50% bonusa, Toyota VIP Kasko i trenutno preuzimanje police i zelene karte.',
};

export default function AutoOsiguranjePage() {
  const financialProductSchema = {
    '@context': 'https://schema.org' as const,
    '@type': 'FinancialProduct' as const,
    name: 'Obvezno auto osiguranje (AO) i kasko',
    description:
      'Kompletno pokriće automobilske odgovornosti prema trećim osobama uz mogućnost punog kaska, zaštite bonusa i vučne službe u RH i EU.',
    provider: {
      '@type': 'InsuranceAgency' as const,
      name: AGENCY_DETAILS.brandName,
      telephone: AGENCY_DETAILS.phone,
    },
    areaServed: 'Croatia',
    currency: 'EUR',
  };

  const faqSchema = {
    '@context': 'https://schema.org' as const,
    '@type': 'FAQPage' as const,
    mainEntity: FAQ_AUTO.map((item) => ({
      '@type': 'Question' as const,
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer' as const,
        text: item.answer,
      },
    })),
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen py-10 sm:py-16">
      <JsonLd schema={financialProductSchema} />
      <JsonLd schema={faqSchema} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header and GEO Standalone Direct Answer Block */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-mono font-semibold">
            <Car className="w-3.5 h-3.5" />
            <span>AO &bull; KASKO &bull; TOYOTA VIP PROGRAM</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight">
            Izračun i usporedba auto osiguranja i kaska
          </h1>

          {/* Standalone GEO Direct Answer Paragraph for AI Answer Engines */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm text-left text-sm text-slate-700 leading-relaxed">
            <p>
              <strong>Obvezno auto osiguranje (AO) u Hrvatskoj</strong> je zakonski propisano pokriće od odgovornosti za štete nanesene trećim osobama. Premija se računa na temelju snage motora (kW), rizične zone registracije (npr. Zagreb zona 1, Split zona 2) i bonus-malus razreda (od B0 s 0% do B10 s maksimalnih <strong>50% popusta</strong>). Putem Agencije Život možete ugovoriti police Generali, Croatia i Allianz osiguranja, uz <strong>instant prijenos 50% bonusa</strong>, besplatnu dostavu Zelene karte u PDF-u i ekskluzivni <strong>Toyota VIP Kasko program</strong>.
            </p>
          </div>
        </div>

        {/* Live Interactive Engine */}
        <div className="max-w-5xl mx-auto">
          <AutoInsuranceCalculator />
        </div>

        {/* Semantic Comparison Table: AO vs Kasko */}
        <div className="max-w-5xl mx-auto bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="text-left space-y-1">
            <h2 className="text-2xl font-black text-slate-900">Usporedba razina automobilskog pokrića</h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Pregled pokrivenih rizika za Obvezno osiguranje (AO), Djelomični kasko i Puni kasko.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="p-4 font-bold text-slate-900">Vrsta štetnog događaja</th>
                  <th className="p-4 font-bold text-slate-700">Obvezno AO</th>
                  <th className="p-4 font-bold text-blue-700">AO + Dodaci (Staklo, Asistencija)</th>
                  <th className="p-4 font-bold text-emerald-700 bg-emerald-50/40">Puni Kasko &amp; Toyota VIP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-4 font-medium text-slate-900">Šteta na tuđem vozilu i imovini</td>
                  <td className="p-4 text-emerald-600 font-bold">100% pokriveno</td>
                  <td className="p-4 text-emerald-600 font-bold">100% pokriveno</td>
                  <td className="p-4 text-emerald-600 font-bold bg-emerald-50/20">100% pokriveno</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-slate-900">Tjelesne ozljede trećih osoba</td>
                  <td className="p-4 text-emerald-600 font-bold">Do zakonskog limita</td>
                  <td className="p-4 text-emerald-600 font-bold">Do zakonskog limita</td>
                  <td className="p-4 text-emerald-600 font-bold bg-emerald-50/20">Do zakonskog limita</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-slate-900">Lom i oštećenje prednjeg vjetrobrana</td>
                  <td className="p-4 text-rose-500 font-semibold">Nije pokriveno</td>
                  <td className="p-4 text-emerald-600 font-bold">Pokriveno bez gubitka bonusa</td>
                  <td className="p-4 text-emerald-600 font-bold bg-emerald-50/20">Pokriveno bez franšize</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-slate-900">Vlastita krivnja u prometnoj nezgodi</td>
                  <td className="p-4 text-rose-500 font-semibold">Nije pokriveno</td>
                  <td className="p-4 text-rose-500 font-semibold">Nije pokriveno</td>
                  <td className="p-4 text-emerald-600 font-bold bg-emerald-50/20">100% popravak vozila</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-slate-900">Krađa, tuča, poplava i vandalizam</td>
                  <td className="p-4 text-rose-500 font-semibold">Nije pokriveno</td>
                  <td className="p-4 text-rose-500 font-semibold">Nije pokriveno</td>
                  <td className="p-4 text-emerald-600 font-bold bg-emerald-50/20">Potpuna isplata naknade</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-slate-900">Zamjensko vozilo za vrijeme servisa</td>
                  <td className="p-4 text-rose-500 font-semibold">Nije uključeno</td>
                  <td className="p-4 text-slate-500">Ovisno o paketu</td>
                  <td className="p-4 text-emerald-600 font-bold bg-emerald-50/20">Besplatan Toyota hibrid</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-black text-slate-950">Česta pitanja o auto osiguranju</h2>
            <p className="text-xs text-slate-500">Odgovori na najvažnije nedoumice vozača</p>
          </div>

          <div className="space-y-3">
            {FAQ_AUTO.map((faq, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                <h3 className="font-bold text-slate-900 text-base">{faq.question}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

