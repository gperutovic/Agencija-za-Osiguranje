import React from 'react';
import { ShieldCheck, Award, Users, Building, MapPin, Phone, Mail, FileCheck, CheckCircle2 } from 'lucide-react';
import { AGENCY_DETAILS, CARRIER_PARTNERS } from '../lib/content/insurance-data';

export const metadata = {
  title: 'O Nama & Pravni Identitet | Agencija za osiguranje Zagreb',
  description:
    'Saznajte više o poslovanju agencije, ovlaštenom partneru Generali osiguranja i Toyota Centra Zagreb.',
};

export default function ONamaPage() {
  return (
    <div className="w-full bg-slate-50 min-h-screen py-10 sm:py-16 text-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Hero Banner */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-mono font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>OVLAŠTENI DISTRIBUTER OSIGURANJA &bull; ZAGREB, PALMOTIĆEVA 76</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight">
            O Agenciji Život: Tehnološki predvodnik i pouzdani savjetnik
          </h1>

          {/* Standalone GEO Direct Answer Block */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm text-left text-sm text-slate-700 leading-relaxed">
            <p>
              <strong>ŽIVOT d.o.o. za poslove zastupanja u osiguranju (Agencija Život)</strong> je licencirana agencija za osiguranje osnovana u Zagrebu, sa sjedištem na adresi <strong>Junija Palmotića 76, 10000 Zagreb</strong> (OIB: 14329077049, MBS: 080514170). Društvo posluje na temelju rješenja Hrvatske agencije za nadzor financijskih usluga (<strong>HANFA</strong>, klasa: UP/I-983-02/24-01/12, broj registra: <strong>ZO-88912</strong>). Kao ovlašteni ugovorni partner Generali osiguranja d.d. i ekskluzivni partner Toyota Centra Zagreb, klijentima pružamo besplatno aktuarsko savjetovanje, instant izračun polica i 24/7 asistenciju kod likvidacije šteta.
            </p>
          </div>
        </div>

        {/* Official Credentials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Building className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-950">Pravni identitet</h3>
            <div className="text-xs text-slate-600 space-y-1 font-mono">
              <p>MBS: {AGENCY_DETAILS.mbs}</p>
              <p>OIB: {AGENCY_DETAILS.oib}</p>
              <p>Temeljni kapital uplaćen u cijelosti</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-950">Nadzor HANFA-e</h3>
            <div className="text-xs text-slate-600 space-y-1 font-mono">
              <p>Broj registra: {AGENCY_DETAILS.hanfaRegisterNumber}</p>
              <p>Rješenje: {AGENCY_DETAILS.hanfaLicense}</p>
              <p>Registar distributera osiguranja RH</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-950">Sjedište i ured</h3>
            <div className="text-xs text-slate-600 space-y-1 font-mono">
              <p>{AGENCY_DETAILS.address}</p>
              <p>{AGENCY_DETAILS.postalCode} {AGENCY_DETAILS.city}</p>
              <p>Tel: {AGENCY_DETAILS.phone}</p>
            </div>
          </div>
        </div>

        {/* Strategic Partnerships */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="text-left space-y-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
              Strateška partnerstva
            </span>
            <h2 className="text-2xl font-black text-slate-950">Generali Osiguranje &amp; Toyota Centar Zagreb</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-700 leading-relaxed">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <h4 className="font-bold text-slate-900 text-base">Generali osiguranje d.d.</h4>
              <p className="text-xs text-slate-600">
                Kao ključni strateški partner jedne od najuglednijih europskih osigurateljnih grupacija, našim klijentima nudimo optimalne uvjete premija, brzu likvidaciju bez birokratskih prepreka i posebne popuste na kombinirane pakete života, doma i vozila.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <h4 className="font-bold text-slate-900 text-base">Toyota Centar Zagreb</h4>
              <p className="text-xs text-slate-600">
                Ekskluzivni program Toyota VIP Kasko jamči vlasnicima vozila Toyota popravak isključivo s originalnim novim dijelovima u ovlaštenom servisu, zamjensko vozilo za vrijeme trajanja servisa i zajamčenu vrijednost vozila u slučaju totalne štete (GAP pokriće).
              </p>
            </div>
          </div>
        </div>

        {/* Statutory IDD Disclosure (čl. 401 Zakona o osiguranju) */}
        <div className="p-6 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-600 space-y-3 leading-relaxed">
          <h4 className="font-bold text-slate-900 uppercase tracking-wider font-mono">
            Zakonska obavijest o distribuciji osiguranja (čl. 401. Zakona o osiguranju)
          </h4>
          <p>
            ŽIVOT d.o.o. zastupa u osiguranju na temelju ugovora o zastupanju s osiguravajućim društvima. Sukladno propisima, klijent ne plaća nikakvu posebnu naknadu niti proviziju Agenciji za usluge posredovanja i savjetovanja; naknada Agencije sadržana je u premiji koju isplaćuje osiguratelj.
          </p>
          <p>
            Društvo nema izravan ili neizravan udio koji predstavlja više od 10% prava glasa ili kapitala u bilo kojem osiguravajućem društvu, niti ijedno osiguravajuće društvo ima udio u kapitalu društva ŽIVOT d.o.o.
          </p>
        </div>
      </div>
    </div>
  );
}

