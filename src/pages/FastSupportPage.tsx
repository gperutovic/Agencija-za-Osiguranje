import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Headphones,
  Phone,
  Mail,
  Download,
  FileText,
  ChevronDown,
  AlertTriangle,
  Car,
  ShieldCheck,
  Clock,
  MapPin,
} from 'lucide-react';
import { LICENSED_AGENTS, FAQ_AUTO, FAQ_DOPUNSKO, FAQ_PROPERTY } from '../lib/content/insurance-data';
import { generateSupportDocumentPdf } from '../utils/formatters';

export const FastSupportPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const allFaqs = [...FAQ_AUTO, ...FAQ_PROPERTY, ...FAQ_DOPUNSKO.slice(0, 2)];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-left">
        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FEF2F2] text-[#C21817] border border-[#FECACA] text-xs font-mono font-bold">
            <Headphones className="w-3.5 h-3.5" />
            <span>BRZA PODRŠKA 24/7 &bull; POMOĆ NA CESTI HR &amp; EU &bull; SLA &lt; 15 MIN</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            Hitna asistencija, PDF obrasci i izravan kontakt sa zastupnicima
          </h1>
          <p className="text-sm text-slate-600 max-w-3xl">
            U slučaju prometne nezgode, kvara vozila u Hrvatskoj ili inozemstvu ili štete u stanu, odmah nazovite dežurne brojeve asistencije ili preuzmite službene obrasce.
          </p>
        </div>

        {/* 1. Emergency 24/7 Roadside Assistance Cards (Pomoć na cesti HR i EU) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#C21817] text-white rounded-3xl p-6 shadow-crimson-glow space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full bg-white/15 font-mono text-[10px] font-bold uppercase">
                0-24 DEŽURNA LINIJA AGENCIJE
              </span>
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold">Pomoć kod nezgode i FNOL podrška</h2>
              <p className="text-xs text-red-100 mt-1">
                Pravni i tehnički savjet na mjestu nezgode prije potpisivanja zapisnika.
              </p>
            </div>
            <a
              href="tel:+385914501458"
              className="block w-full py-3 px-4 rounded-xl bg-white text-[#C21817] font-mono font-black text-center text-sm"
            >
              +385 91 450 1458
            </a>
          </div>

          <div className="bg-[#0F172A] text-white rounded-3xl p-6 shadow-elevated space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full bg-white/10 font-mono text-[10px] font-bold uppercase text-[#F87171]">
                POMOĆ NA CESTI (HR i EU)
              </span>
              <Car className="w-5 h-5 text-[#F87171]" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold">Vučna služba i zamjensko vozilo</h2>
              <p className="text-xs text-slate-300 mt-1">
                Generali &amp; Toyota Eurocare asistencija u Hrvatskoj i svim državama EU (0-24h).
              </p>
            </div>
            <a
              href="tel:08002211"
              className="block w-full py-3 px-4 rounded-xl bg-[#1E293B] border border-slate-700 text-white font-mono font-black text-center text-sm"
            >
              0800 22 11 / +385 1 4800 120
            </a>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full bg-[#FEF2F2] text-[#C21817] border border-[#FECACA] font-mono text-[10px] font-bold uppercase">
                SLUŽBENI SJEDIŠNI URED
              </span>
              <MapPin className="w-5 h-5 text-[#C21817]" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-[#0F172A]">Palmotićeva ulica 76, Zagreb</h2>
              <p className="text-xs text-slate-500 mt-1">
                ŽIVOT d.o.o. za zastupanje u osiguranju (OIB: 14329077049, MBS: 01918940).
              </p>
            </div>
            <Link
              to="/prijava-stete"
              className="block w-full py-3 px-4 rounded-xl bg-[#FEF2F2] hover:bg-red-100 text-[#C21817] border border-[#FECACA] font-bold text-center text-xs"
            >
              Otvori digitalni FNOL obrazac &rarr;
            </Link>
          </div>
        </div>

        {/* 2. Downloadable PDF Forms (Europsko izvješće, Uvjeti osiguranja, Toyota Uvjeti) */}
        <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-card p-6 sm:p-8 space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <span className="text-xs font-mono font-bold uppercase text-[#C21817]">
              DOKUMENTI ZA PREUZIMANJE (PDF)
            </span>
            <h2 className="text-xl font-extrabold text-[#0F172A]">
              Službeni obrasci, Europsko izvješće i Uvjeti osiguranja
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-extrabold text-[#0F172A]">
                  <FileText className="w-4 h-4 text-[#C21817]" />
                  <span>Europsko izvješće o prometnoj nesreći</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Službeni predložak i upute za pravilno popunjavanje i skiciranje prometne nezgode bez gubitka prava.
                </p>
              </div>
              <button
                type="button"
                onClick={() => generateSupportDocumentPdf('euro_report')}
                className="py-2.5 px-3.5 rounded-xl bg-[#C21817] text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Preuzmi Europsko izvješće (PDF)</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-extrabold text-[#0F172A]">
                  <ShieldCheck className="w-4 h-4 text-[#0F172A]" />
                  <span>Opći uvjeti osiguranja &amp; HANFA IDD (Čl. 417.)</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Predugovorne informacije, IPID sažetak pokrića, transparentnost provizije i postupak prigovora (15 dana).
                </p>
              </div>
              <button
                type="button"
                onClick={() => generateSupportDocumentPdf('general_terms')}
                className="py-2.5 px-3.5 rounded-xl bg-[#0F172A] text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Preuzmi Uvjete osiguranja (PDF)</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-extrabold text-[#0F172A]">
                  <Car className="w-4 h-4 text-[#C21817]" />
                  <span>Uvjeti programa Toyota Osiguranje (TCZ)</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Specifikacija OEM jamstva u Toyota Centru Zagreb, zaštite Hybrid/EV baterije i zamjenskog vozila.
                </p>
              </div>
              <button
                type="button"
                onClick={() => generateSupportDocumentPdf('toyota_terms')}
                className="py-2.5 px-3.5 rounded-xl bg-[#0F172A] text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Preuzmi Toyota uvjete (PDF)</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3. Direct Routing to Licensed Agents (Diana, Hrvoje, Laura) */}
        <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-card p-6 sm:p-8 space-y-5">
          <div>
            <span className="text-xs font-mono font-bold uppercase text-[#C21817]">
              IZRAVNO USMJERAVANJE LICENCIRANIM ZASTUPNICIMA
            </span>
            <h2 className="text-xl font-extrabold text-[#0F172A]">
              Kontaktirajte svog dodijeljenog zastupnika bez čekanja
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {LICENSED_AGENTS.map((agent) => (
              <div
                key={agent.id}
                className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl text-white font-mono font-bold text-sm flex items-center justify-center"
                      style={{ backgroundColor: agent.badgeColor }}
                    >
                      {agent.avatarInitials}
                    </div>
                    <div>
                      <div className="text-sm font-extrabold text-[#0F172A]">{agent.fullName}</div>
                      <div className="text-[11px] text-slate-500">{agent.role}</div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600">{agent.specialization}</p>
                </div>

                <div className="pt-3 border-t border-slate-200/70 space-y-1.5 font-mono text-xs">
                  <a
                    href={`mailto:${agent.email}`}
                    className="flex items-center gap-2 text-[#C21817] font-bold hover:underline"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{agent.email}</span>
                  </a>
                  <a
                    href={`tel:${agent.phone.replace(/\s+/g, '')}`}
                    className="flex items-center gap-2 text-[#0F172A] font-semibold hover:underline"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{agent.phone}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. FAQ Accordion */}
        <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-card p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-extrabold text-[#0F172A]">
            Česta pitanja o prijavi šteta, asistenciji i ugovaranju
          </h2>
          <div className="space-y-2.5">
            {allFaqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="rounded-2xl border border-[#E2E8F0] overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left font-bold text-xs sm:text-sm text-[#0F172A] flex items-center justify-between gap-4 hover:bg-slate-50 cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${
                        isOpen ? 'rotate-180 text-[#C21817]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-2 text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FastSupportPage;
