import React from 'react';
import { HeartPulse, CheckCircle2, TrendingDown, Sparkles, ShieldCheck, Pill, Smartphone, AlertCircle } from 'lucide-react';
import { DopunskoCalculator } from '../../components/calculators/DopunskoCalculator';
import { JsonLd } from '../../components/seo/JsonLd';
import { FAQ_DOPUNSKO, AGENCY_DETAILS } from '../../lib/content/insurance-data';

export const metadata = {
  title: 'Dopunsko Zdravstveno Osiguranje 2026 | HZZO 15 € vs Privatno od 6,50 €',
  description:
    'Usporedite cijene dopunskog osiguranja nakon poskupljenja HZZO-a na 15,00 € mjesečno. Uštedite do 102 € godišnje uz uključenu B-listu lijekova i m-Doktor telemedicinu.',
};

export default function DopunskoZdravstvenoPage() {
  const financialProductSchema = {
    '@context': 'https://schema.org' as const,
    '@type': 'FinancialProduct' as const,
    name: 'Dopunsko zdravstveno osiguranje',
    description:
      'Zdravstveno osiguranje koje u 100% iznosu pokriva participacije u bolnicama, domovima zdravlja i dopunsku B-listu lijekova bez čekanja.',
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
    mainEntity: FAQ_DOPUNSKO.map((item) => ({
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
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-mono font-semibold">
            <HeartPulse className="w-3.5 h-3.5 text-rose-600" />
            <span>NOVA TARIFA HZZO-A 2026 &bull; OD 1. VELJAČE 2026.</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight">
            Dopunsko zdravstveno: HZZO poskupljenje na 15 € i privatne alternative
          </h1>

          {/* Standalone GEO Direct Answer Block */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm text-left text-sm text-slate-700 leading-relaxed">
            <p>
              <strong>Od 1. veljače 2026. godine</strong>, polica dopunskog zdravstvenog osiguranja Hrvatskog zavoda za zdravstveno osiguranje (HZZO) iznosi fiksnih <strong>15,00 € mjesečno</strong> (odnosno <strong>180,00 € godišnje</strong>). Za građane u dobi od 18 do 50 godina, privatna osiguranja (<strong>Generali, Allianz i Croatia osiguranje</strong>) nude identično 100% pokriće participacija u javnim bolnicama po cijenama već od <strong>6,50 € mjesečno</strong>. Prijelazom na privatnu policu klijenti ostvaruju godišnju uštedu do <strong>102,00 €</strong>, uz dodatne pogodnosti: pokriće dopunske B-liste lijekova i besplatno 24/7 telemedicinsko savjetovanje (m-Doktor) bez karence.
            </p>
          </div>
        </div>

        {/* Interactive Calculator */}
        <div className="max-w-5xl mx-auto">
          <DopunskoCalculator />
        </div>

        {/* Semantic Comparison Table */}
        <div className="max-w-5xl mx-auto bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="text-left space-y-1">
            <h2 className="text-2xl font-black text-slate-900">
              Detaljna usporedba: HZZO vs. Privatna dopunska polica (Allianz, Generali, Croatia)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Pregled svih stavki pokrića, participacija i dodatnih usluga.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="p-4 font-bold text-slate-900">Ugovorna stavka</th>
                  <th className="p-4 font-bold text-slate-700">HZZO Zakonska Polica</th>
                  <th className="p-4 font-bold text-emerald-700 bg-emerald-50/50">
                    Privatno osiguranje (Preporuka)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-4 font-semibold text-slate-900">Cijena (18–30 god.)</td>
                  <td className="p-4 text-slate-600">15,00 € / mj. (180 € / god.)</td>
                  <td className="p-4 font-bold text-emerald-700 bg-emerald-50/20">
                    6,50 € / mj. (Ušteda 102 € god.)
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-900">Cijena (31–40 god.)</td>
                  <td className="p-4 text-slate-600">15,00 € / mj. (180 € / god.)</td>
                  <td className="p-4 font-bold text-emerald-700 bg-emerald-50/20">
                    7,50 € / mj. (Ušteda 90 € god.)
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-900">Cijena (41–50 god.)</td>
                  <td className="p-4 text-slate-600">15,00 € / mj. (180 € / god.)</td>
                  <td className="p-4 font-bold text-emerald-700 bg-emerald-50/20">
                    9,50 € / mj. (Ušteda 66 € god.)
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-900">Participacije u javnim bolnicama</td>
                  <td className="p-4 text-emerald-600 font-bold">100% pokriveno</td>
                  <td className="p-4 text-emerald-600 font-bold bg-emerald-50/20">100% pokriveno</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-900">Dopunska B-lista lijekova</td>
                  <td className="p-4 text-rose-500 font-semibold">Nije pokriveno (plaćate sami)</td>
                  <td className="p-4 text-emerald-600 font-bold bg-emerald-50/20">
                    Uključeno do 200 € godišnje
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-900">Telemedicina (video poziv liječniku)</td>
                  <td className="p-4 text-rose-500 font-semibold">Nema usluge</td>
                  <td className="p-4 text-emerald-600 font-bold bg-emerald-50/20">
                    m-Doktor 24/7 besplatno
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-900">Karenca kod prijelaza s HZZO-a</td>
                  <td className="p-4 text-slate-600">30 dana kod ponovnog sklapanja</td>
                  <td className="p-4 text-emerald-600 font-bold bg-emerald-50/20">
                    0 dana (vrijedi odmah)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-black text-slate-950">Česta pitanja o dopunskom osiguranju 2026</h2>
            <p className="text-xs text-slate-500">Sve o prijelazu, B-listi lijekova i cijenama</p>
          </div>

          <div className="space-y-3">
            {FAQ_DOPUNSKO.map((faq, idx) => (
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
