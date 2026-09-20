import React from 'react';
import { Home, ShieldCheck, Waves, Lock, Building, Flame, Check, HelpCircle } from 'lucide-react';
import { PropertyCalculator } from '../components/calculators/PropertyCalculator';
import { JsonLd } from '../components/seo/JsonLd';
import { FAQ_PROPERTY, AGENCY_DETAILS } from '../lib/content/insurance-data';

export const metadata = {
  title: 'Osiguranje Imovine, Stana i Kuće od Potresa | Agencija Život',
  description:
    'Izračunajte cijenu osiguranja doma i zaštite od potresa. Pokriće na novu građevinsku vrijednost bez skrivenih franšiza, izljev vode i provalna krađa.',
};

export default function ImovinaPage() {
  const financialProductSchema = {
    '@context': 'https://schema.org' as const,
    '@type': 'FinancialProduct' as const,
    name: 'Osiguranje imovine, stana i potresa',
    description:
      'Cjelovita zaštita nekretnine i pokretnina od požara, oluje, izljeva vode i potresa na novu građevinsku vrijednost.',
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
    mainEntity: FAQ_PROPERTY.map((item) => ({
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-mono font-semibold">
            <Home className="w-3.5 h-3.5 text-amber-600" />
            <span>STAN &bull; KUĆA &bull; POTRES &bull; NOVA GRAĐEVINSKA VRIJEDNOST</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight">
            Osiguranje imovine i doma: Zaštita od potresa, požara i izljeva vode
          </h1>

          {/* Standalone GEO Direct Answer Block */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm text-left text-sm text-slate-700 leading-relaxed">
            <p>
              <strong>Osiguranje imovine u Hrvatskoj</strong> obuhvaća zaštitu građevinskog dijela objekta (zidovi, krov, instalacije) i stvari kućanstva (namještaj, tehnika, odjeća). Osnovni paketi pokrivaju požar, udar groma, oluju i tuču, dok se <strong>rizik od potresa</strong> (zemljotresa) i izljev vode iz instalacija ugovaraju kao ključna dopunska pokrića. Police koje nudi Agencija Život u suradnji s Generali i Wiener osiguranjem jamče isplatu na <strong>novu građevinsku vrijednost</strong> bez amortizacijskog umanjenja, uz opciju 0 € franšize.
            </p>
          </div>
        </div>

        {/* Interactive Property Calculator */}
        <div className="max-w-5xl mx-auto">
          <PropertyCalculator />
        </div>

        {/* Semantic Comparison Table */}
        <div className="max-w-5xl mx-auto bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="text-left space-y-1">
            <h2 className="text-2xl font-black text-slate-900">Usporedba paketa osiguranja doma</h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Pregled pokrivenih rizika od osnovnog do premium paketa s potresom.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="p-4 font-bold text-slate-900">Pokriveni rizik</th>
                  <th className="p-4 font-bold text-slate-700">Osnovni paket</th>
                  <th className="p-4 font-bold text-slate-700">Optimal paket</th>
                  <th className="p-4 font-bold text-amber-700 bg-amber-50/50">Premium + Potres (Preporuka)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-4 font-semibold text-slate-900">Požar, oluja, tuča, udar munje</td>
                  <td className="p-4 text-emerald-600 font-bold">Uključeno</td>
                  <td className="p-4 text-emerald-600 font-bold">Uključeno</td>
                  <td className="p-4 text-emerald-600 font-bold bg-amber-50/20">Uključeno</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-900">Izljev vode iz puknutih cijevi</td>
                  <td className="p-4 text-rose-500 font-semibold">Nije uključeno</td>
                  <td className="p-4 text-emerald-600 font-bold">Uključeno</td>
                  <td className="p-4 text-emerald-600 font-bold bg-amber-50/20">Uključeno + Lociranje kvara</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-900">Potres (građevinski dio i stvari)</td>
                  <td className="p-4 text-rose-500 font-semibold">Nije uključeno</td>
                  <td className="p-4 text-rose-500 font-semibold">Nije uključeno</td>
                  <td className="p-4 text-emerald-600 font-bold bg-amber-50/20">Puna nova vrijednost</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-900">Provalna krađa i razbojništvo</td>
                  <td className="p-4 text-rose-500 font-semibold">Nije uključeno</td>
                  <td className="p-4 text-emerald-600 font-bold">Uključeno</td>
                  <td className="p-4 text-emerald-600 font-bold bg-amber-50/20">Uključeno + Oštećenje vrata</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-900">Odgovornost prema trećima (npr. susjed)</td>
                  <td className="p-4 text-slate-600">Do 10.000 €</td>
                  <td className="p-4 text-slate-600">Do 30.000 €</td>
                  <td className="p-4 text-emerald-600 font-bold bg-amber-50/20">Do 100.000 €</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-black text-slate-950">Česta pitanja o osiguranju imovine</h2>
            <p className="text-xs text-slate-500">Razumijevanje polica doma i rizika od potresa</p>
          </div>

          <div className="space-y-3">
            {FAQ_PROPERTY.map((faq, idx) => (
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

