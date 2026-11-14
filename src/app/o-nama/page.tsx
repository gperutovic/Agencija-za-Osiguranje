import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Award,
  Building2,
  MapPin,
  Phone,
  Mail,
  Scale,
  ArrowRight,
} from 'lucide-react';
import { AGENCY_DETAILS } from '../../lib/content/insurance-data';

export default function ONamaPage() {
  return (
    <div className="w-full py-12 sm:py-16 bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-100 border border-slate-200 text-[#0F2942] text-xs font-semibold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" />
            <span>O Agenciji Život</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Stručno zastupanje u osiguranju utemeljeno na povjerenju
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {AGENCY_DETAILS.legalName} posluje kao ovlašteni zastupnik u osiguranju sa sjedištem u Zagrebu, pružajući građanima i poduzetnicima transparentnu usporedbu ponuda te osobnu podršku tijekom cijelog trajanja police.
          </p>
        </div>

        {/* Agency Credentials & Legal Role */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 sm:p-7 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-lg bg-slate-100 text-[#0F2942] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Naša uloga u procesu osiguranja</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Kao ovlašteni zastupnik, klijentima omogućujemo jasnu usporedbu uvjeta i cijena polica bez ikakvih skrivenih agencijskih naknada. Uz izradu ponuda i pripremu IPID dokumentacije, ostajemo vaša izravna kontakt točka pri obnovi polica ili prijavi štete.
            </p>
            <Link
              to="/o-nama-pravno"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F2942] hover:underline pt-1"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Pregled pravnih podataka i IDD objave</span>
            </Link>
          </div>

          <div className="p-6 sm:p-7 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-lg bg-slate-100 text-[#0F2942] flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Generali &amp; Toyota Centar Zagreb partnerstvo</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Kao strateški partner Generali osiguranja d.d. i ovlaštenog partnera Toyota Centar Zagreb, osiguravamo specijalizirane programe obveznog i punog kasko osiguranja s popravcima u ovlaštenom servisu i originalnim dijelovima.
            </p>
            <Link
              to="/auto-osiguranje"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F2942] hover:underline pt-1"
            >
              <span>Provjerite kalkulator auto i kasko osiguranja</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Office Contact Card */}
        <div className="p-6 sm:p-8 rounded-xl bg-white border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Sjedište ureda i kontakt</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <MapPin className="w-4 h-4 text-[#0F2942]" />
                <span>Adresa ureda</span>
              </div>
              <p className="text-slate-600">{AGENCY_DETAILS.address}</p>
              <p className="text-slate-500 text-xs">{AGENCY_DETAILS.postalCode} {AGENCY_DETAILS.city}</p>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <Phone className="w-4 h-4 text-[#0F2942]" />
                <span>Telefoni i radno vrijeme</span>
              </div>
              <p className="text-slate-600 font-semibold tabular-nums">{AGENCY_DETAILS.phone}</p>
              <p className="text-slate-500 text-xs">{AGENCY_DETAILS.workingHours}</p>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <Mail className="w-4 h-4 text-[#0F2942]" />
                <span>Elektronička pošta</span>
              </div>
              <p className="text-slate-600">{AGENCY_DETAILS.email}</p>
              <p className="text-slate-500 text-xs">Štete: {AGENCY_DETAILS.claimsEmail}</p>
            </div>
          </div>
        </div>

        {/* Statutory Distribution Notice */}
        <div className="p-6 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 leading-relaxed space-y-2">
          <h3 className="font-bold text-slate-900 uppercase tracking-wider">
            Regulatorni podaci i obavijest o distribuciji
          </h3>
          <p>
            {AGENCY_DETAILS.legalName} upisano je u registar Hrvatske agencije za nadzor financijskih usluga ({AGENCY_DETAILS.hanfaRegisterNumber}, {AGENCY_DETAILS.hanfaLicense}), OIB: {AGENCY_DETAILS.oib}, MBS: {AGENCY_DETAILS.mbs}.
          </p>
          <p>
            Društvo nema izravan niti neizravan udio veći od 10% prava glasa ili kapitala u bilo kojem osiguravajućem društvu, niti ijedno društvo za osiguranje posjeduje udio u društvu ŽIVOT d.o.o.
          </p>
        </div>
      </div>
    </div>
  );
}
