import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Car,
  HeartPulse,
  Home,
  Shield,
  Plane,
  Calculator,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Zap,
  Clock,
  Award,
} from 'lucide-react';

interface BentoServiceShowcaseProps {
  onQuickQuote?: (category: string) => void;
  className?: string;
}

export const BentoServiceShowcase: React.FC<BentoServiceShowcaseProps> = ({
  onQuickQuote,
  className = '',
}) => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <section className={`py-16 lg:py-24 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>BENTO GRID &bull; PROGRAMI OSIGURANJA</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight font-heading text-slate-950 dark:text-white">
            Pametna zaštita za sve što vam je važno
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Bez sitnih slova i osigurateljnog žargona. Jasna pokrića, transparentne cijene i neovisna usporedba tržišta.
          </p>
        </div>

        {/* Bento Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* CARD 1: Large Featured Card - Auto & Kasko (Spans 2 cols on lg) */}
          <div
            onMouseEnter={() => setHoveredCard('auto')}
            onMouseLeave={() => setHoveredCard(null)}
            className="lg:col-span-2 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-bento hover:shadow-bento-hover transition-all duration-300 flex flex-col justify-between relative overflow-hidden group"
          >
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-600/30 group-hover:scale-105 transition-transform">
                  <Car className="w-7 h-7" />
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                  <span>50% bonusa &bull; Toyota VIP Kasko</span>
                </div>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-black font-heading text-slate-950 dark:text-white">
                  Obvezno Auto Osiguranje (AO) &amp; Puni Kasko
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed max-w-xl">
                  Automatski prijenos stečenog bonusa od 50% i ugovaranje bez odlaska u poslovnicu. Uključena opcija 0 € franšize za stakla, 24/7 vučna služba u Hrvatskoj i Europi te zamjensko vozilo.
                </p>
              </div>

              {/* Hover-revealed benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>0 € franšiza na lom stakala</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Pomoć na cesti u cijeloj Europi</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Zelena karta s QR kodom</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
              <div className="text-xs text-slate-500 font-mono">
                Partner: Generali osiguranje d.d. &bull; Ušteda do 72 €
              </div>
              <div className="flex items-center gap-3">
                <Link
                  to="/auto-osiguranje"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-md shadow-teal-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Brza kalkulacija</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* CARD 2: Dopunsko Zdravstveno 2026 */}
          <div
            onMouseEnter={() => setHoveredCard('health')}
            onMouseLeave={() => setHoveredCard(null)}
            className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-bento hover:shadow-bento-hover transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-md shadow-rose-600/30 group-hover:scale-105 transition-transform">
                  <HeartPulse className="w-7 h-7" />
                </div>
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                  HZZO poskupljenje 15 €
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black font-heading text-slate-950 dark:text-white">
                  Dopunsko Zdravstveno 2026
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  Zaštitite se od zakonskog poskupljenja HZZO-a. Privatne police od 9,50 € nude 100% pokriće participacija, pregleda i B-listu lijekova uz uštedu do 102 € godišnje.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 text-xs text-rose-900 dark:text-rose-200 font-medium">
                💡 Besplatno otkazivanje stare HZZO police i prijenos bez karence.
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-rose-600 font-mono">od 9,50 € / mj.</span>
              <Link
                to="/dopunsko-zdravstveno"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white hover:text-rose-600 transition-colors"
              >
                <span>Usporedi police</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* CARD 3: Imovina, Kuća i Potres */}
          <div
            onMouseEnter={() => setHoveredCard('property')}
            onMouseLeave={() => setHoveredCard(null)}
            className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-bento hover:shadow-bento-hover transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-md shadow-amber-500/30 group-hover:scale-105 transition-transform">
                  <Home className="w-7 h-7" />
                </div>
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  Nova građevinska vrijednost
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black font-heading text-slate-950 dark:text-white">
                  Osiguranje Doma, Stana i Potresa
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  Cjelovita zaštita od potresa, požara, oluje i izljeva vode iz instalacija. Isplata štete na novu građevinsku vrijednost bez skrivenih amortizacijskih odbitaka.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 font-medium">
                🛡️ Uključena odgovornost prema trećim osobama (npr. poplava susjeda).
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-amber-600 font-mono">od 14,00 € / mj.</span>
              <Link
                to="/imovina"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white hover:text-amber-600 transition-colors"
              >
                <span>Saznaj više</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* CARD 4: Kalkulator Prijepisa Vozila (NN 92/21) */}
          <div
            onMouseEnter={() => setHoveredCard('transfer')}
            onMouseLeave={() => setHoveredCard(null)}
            className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-bento hover:shadow-bento-hover transition-all duration-300 flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-slate-800 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                  <Calculator className="w-7 h-7" />
                </div>
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  Zakon NN 92/21
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black font-heading text-slate-950 dark:text-white">
                  Kalkulator Prijepisa Vozila
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  Službeni izračun upravne pristojbe na stjecanje rabljenih motornih vozila prema kilovatima (kW) i starosti vozila na stanici za tehnički pregled (STP).
                </p>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-500">100% točan izračun</span>
              <Link
                to="/kalkulator-prijepisa"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white hover:text-teal-600 transition-colors"
              >
                <span>Otvori kalkulator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* CARD 5: 24/7 Centar za Štete & Digitalni FNOL (Spans 2 cols on lg) */}
          <div
            onMouseEnter={() => setHoveredCard('claims')}
            onMouseLeave={() => setHoveredCard(null)}
            className="lg:col-span-2 p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 text-white border border-slate-800 shadow-2xl flex flex-col justify-between relative overflow-hidden group"
          >
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-600/30 group-hover:scale-105 transition-transform">
                  <AlertTriangle className="w-7 h-7" />
                </div>
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Digitalni FNOL &bull; Isplata na IBAN
                </span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-black font-heading text-white">
                  Centar za Štete &bull; Prijava i Praćenje 24/7
                </h3>
                <p className="text-sm text-slate-300 mt-2 leading-relaxed max-w-xl">
                  Doživjeli ste nezgodu ili štetu? Prijavite je kamerom s mobitela u 5 jednostavnih koraka. Sustav automatski povezuje vašu policu, šalje foto-elaborat procjenitelju i prati isplatu na IBAN.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2 font-mono">
                <span className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" /> Dodjela procjenitelja &lt; 24h
                </span>
                <span className="flex items-center gap-1 text-teal-400">
                  <CheckCircle2 className="w-4 h-4" /> Praćenje spisa u realnom vremenu
                </span>
                <span className="flex items-center gap-1 text-amber-400">
                  <CheckCircle2 className="w-4 h-4" /> Pomoć ovlaštenog brokera
                </span>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
              <div className="text-xs text-slate-400 font-mono">
                Dežurna linija za štete: 01 4800 120 (0-24h)
              </div>
              <div className="flex items-center gap-3">
                <Link
                  to="/prijava-stete"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Prijavi štetu odmah</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BentoServiceShowcase;
