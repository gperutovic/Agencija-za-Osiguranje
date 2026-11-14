import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Scale, Building2, FileText, CheckCircle2, Lock, ExternalLink } from 'lucide-react';
import { AGENCY_DETAILS } from '../../lib/content/insurance-data';

export const ONamaPravnoPage: React.FC = () => {
  return (
    <div className="w-full py-12 sm:py-16 bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Page Header */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-100 border border-slate-200 text-[#0F2942] text-xs font-semibold uppercase tracking-wider">
            <Scale className="w-3.5 h-3.5" />
            <span>Regulatorne obavijesti i sukladnost</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Pravne informacije i IDD objave
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Pregled podataka o registraciji, nadzornim tijelima i pravilima zastupanja u osiguranju sukladno Zakonu o osiguranju i Direktivi o distribuciji osiguranja (IDD).
          </p>
        </div>

        {/* Corporate Identity Card */}
        <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-start gap-4 border-b border-slate-200 pb-5">
            <div className="p-2.5 bg-slate-100 rounded-lg text-[#0F2942]">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Podaci o društvu za zastupanje</h2>
              <p className="text-xs text-slate-500 mt-0.5">{AGENCY_DETAILS.legalName}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2.5 px-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-600">Skraćeni naziv:</span>
                <span className="font-semibold text-slate-900">ŽIVOT d.o.o. / {AGENCY_DETAILS.brandName}</span>
              </div>
              <div className="flex justify-between items-center py-2.5 px-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-600">Sjedište i adresa:</span>
                <span className="font-semibold text-slate-900">
                  {AGENCY_DETAILS.address}, {AGENCY_DETAILS.postalCode} {AGENCY_DETAILS.city}
                </span>
              </div>
              <div className="flex justify-between items-center py-2.5 px-3.5 bg-slate-50 rounded-lg border border-slate-200 tabular-nums">
                <span className="text-slate-600">OIB:</span>
                <span className="font-semibold text-slate-900">{AGENCY_DETAILS.oib}</span>
              </div>
              <div className="flex justify-between items-center py-2.5 px-3.5 bg-slate-50 rounded-lg border border-slate-200 tabular-nums">
                <span className="text-slate-600">Matični broj (MBS):</span>
                <span className="font-semibold text-slate-900">{AGENCY_DETAILS.mbs}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-2.5 px-3.5 bg-slate-50 rounded-lg border border-slate-200 tabular-nums">
                <span className="text-slate-600">Registar HANFA:</span>
                <span className="font-semibold text-emerald-700">{AGENCY_DETAILS.hanfaRegisterNumber}</span>
              </div>
              <div className="flex justify-between items-center py-2.5 px-3.5 bg-slate-50 rounded-lg border border-slate-200 tabular-nums">
                <span className="text-slate-600">Klasa odobrenja:</span>
                <span className="font-semibold text-slate-900">{AGENCY_DETAILS.hanfaLicense}</span>
              </div>
              <div className="flex justify-between items-center py-2.5 px-3.5 bg-slate-50 rounded-lg border border-slate-200 tabular-nums">
                <span className="text-slate-600">Telefon:</span>
                <span className="font-semibold text-slate-900">{AGENCY_DETAILS.phone}</span>
              </div>
              <div className="flex justify-between items-center py-2.5 px-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-600">Službeni e-mail:</span>
                <span className="font-semibold text-slate-900">{AGENCY_DETAILS.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* IDD Disclosure */}
        <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-start gap-4 border-b border-slate-200 pb-4">
            <div className="p-2.5 bg-slate-100 rounded-lg text-[#0F2942]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Obavijest o distribuciji osiguranja (Direktiva IDD i Zakon o osiguranju)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Obvezne predugovorne informacije potrošaču</p>
            </div>
          </div>

          <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-1" />
              <p>
                <strong>Status zastupnika:</strong> {AGENCY_DETAILS.legalName} posluje kao ovlašteni zastupnik u osiguranju upisan u registar Hrvatske agencije za nadzor financijskih usluga (HANFA), zastupajući ugovorne partnere (Generali osiguranje d.d. te druga osiguravajuća društva s kojima ima sklopljen ugovor o zastupanju).
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-1" />
              <p>
                <strong>Naknada i izostanak dodatnih troškova za klijenta:</strong> Za usluge izrade informativnog izračuna, savjetovanja i posredovanja pri ugovaranju police osiguranja, Agencija Život ne naplaćuje nikakvu naknadu od osiguranika niti ugovaratelja. Agencijska provizija sastavni je dio bruto premije koju isplaćuje društvo za osiguranje.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-1" />
              <p>
                <strong>Neovisnost vlasničke strukture:</strong> Društvo ŽIVOT d.o.o. nema izravan niti neizravan udio koji predstavlja 10% ili više glasačkih prava ili kapitala u ijednom društvu za osiguranje, niti društvo za osiguranje posjeduje udjele u društvu ŽIVOT d.o.o.
              </p>
            </div>
          </div>
        </div>

        {/* Consumer Complaints & GDPR */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 text-[#0F2942] font-bold text-base">
              <FileText className="w-5 h-5" />
              <h3>Postupak rješavanja prigovora</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Potrošači mogu podnijeti prigovor putem elektroničkog obrasca na stranici Knjige prigovora, e-mailom na {AGENCY_DETAILS.complaintsEmail} ili poštom na sjedište Agencije. Pisani odgovor dostavljamo u roku od 15 dana.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                to="/prigovori"
                className="text-xs font-semibold text-[#0F2942] underline hover:text-slate-700"
              >
                Otvori obrazac prigovora →
              </Link>
              <a
                href="https://www.hanfa.hr"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-[#0F2942]"
              >
                <span>Registar HANFA</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 text-[#0F2942] font-bold text-base">
              <Lock className="w-5 h-5" />
              <h3>Zaštita osobnih podataka (GDPR / AZOP)</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Osobni podaci (ime, OIB, kontakt i podaci o predmetu osiguranja) prikupljaju se isključivo u svrhu izrade traženih informativnih ponuda, procjene rizika, sklapanja polica te podrške pri prijavi štete, u skladu s Uredbom (EU) 2016/679 i smjernicama AZOP-a.
            </p>
            <div className="text-xs text-slate-500">
              Prava ispitanika (uvid, ispravak, brisanje): {AGENCY_DETAILS.email}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ONamaPravnoPage;
