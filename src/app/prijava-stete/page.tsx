import React from 'react';
import { ClaimsIntakeForm } from '../../components/claims/ClaimsIntakeForm';
import { ShieldAlert, Phone, AlertTriangle, Clock } from 'lucide-react';

export default function ClaimsReportingPage() {
  return (
    <div className="w-full bg-[#06080c] text-slate-100 py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header Hero (RankRush Dark Style) */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-rose-400 text-xs font-mono font-bold uppercase tracking-wider">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Digitalni centar za prijavu i obradu šteta &bull; 24/7</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Online Prijava Štete (FNOL)
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Prijavite štetu u nekoliko minuta bez čekanja u poslovnici. Naš tim u suradnji s
            Generali procjeniteljima koordinira postupak i osigurava brzu isplatu na vaš IBAN.
          </p>

          {/* Emergency Assistance Call Strip */}
          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-3 p-3 bg-white/[0.03] border border-white/10 rounded-2xl text-xs text-slate-300">
            <div className="flex items-center space-x-1.5 font-bold text-amber-400 font-mono">
              <Phone className="w-4 h-4" />
              <span>Hitna asistencija na cesti (24/7):</span>
            </div>
            <a href="tel:014800120" className="font-extrabold text-[#fb6504] underline font-mono text-sm">
              01 4800 120
            </a>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400 font-mono">Hitne službe RH: <strong className="text-white">112</strong></span>
          </div>
        </div>

        {/* Claims Intake Form Component */}
        <ClaimsIntakeForm />

        {/* Informative Guidance: Protocol in accident */}
        <div className="bg-[#0a0d16] rounded-3xl p-6 sm:p-10 border border-white/[0.08] shadow-2xl space-y-6">
          <div className="border-b border-white/[0.08] pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Protokol postupanja u slučaju prometne nezgode
            </h3>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Sukladno Zakonu o sigurnosti prometa na cestama i preporukama Hrvatskog ureda za osiguranje (HUO).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300 leading-relaxed">
            <div className="p-5 bg-white/[0.02] rounded-2xl border border-white/[0.06] space-y-2">
              <span className="w-7 h-7 rounded-xl bg-white/[0.05] border border-white/10 text-[#fb6504] font-mono font-black flex items-center justify-center text-xs">
                01
              </span>
              <p className="font-bold text-white text-sm">Osigurajte mjesto nesreće</p>
              <p className="text-slate-400">
                Uključite sva četiri pokazivača smjera, postavite sigurnosni trokut na propisanu udaljenost (najmanje 50 m izvan naselja, 100 m na autocesti) i obucite reflektirajući prsluk.
              </p>
            </div>

            <div className="p-5 bg-white/[0.02] rounded-2xl border border-white/[0.06] space-y-2">
              <span className="w-7 h-7 rounded-xl bg-white/[0.05] border border-white/10 text-emerald-400 font-mono font-black flex items-center justify-center text-xs">
                02
              </span>
              <p className="font-bold text-white text-sm">Fotografirajte i popunite Europsko izvješće</p>
              <p className="text-slate-400">
                Prije pomicanja vozila snimite položaj iz više kutova, tragove kočenja i oštećenja. Ispunite Europsko izvješće o nezgodi te zabilježite registraciju i podatke o polici drugog sudionika.
              </p>
            </div>

            <div className="p-5 bg-white/[0.02] rounded-2xl border border-white/[0.06] space-y-2">
              <span className="w-7 h-7 rounded-xl bg-white/[0.05] border border-white/10 text-rose-400 font-mono font-black flex items-center justify-center text-xs">
                03
              </span>
              <p className="font-bold text-white text-sm">Pozovite policiju ako je potrebno</p>
              <p className="text-slate-400">
                Policiju (192 ili 112) obavezno pozovite ako ima ozlijeđenih ili poginulih osoba, ako je nastala veća materijalna šteta, ako drugi vozač odbija dati podatke ili je pod utjecajem alkohola.
              </p>
            </div>
          </div>

          {/* Statutory Notice */}
          <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/[0.08] text-xs text-slate-300 flex items-start space-x-3">
            <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-white font-mono">Zakonski rok za obradu odštetnog zahtjeva:</strong> Sukladno Zakonu o obveznim osiguranjima u prometu, osiguratelj je dužan u roku od <strong>14 dana</strong> od zaprimanja odštetnog zahtjeva dostaviti obrazloženu ponudu odštete (ako odgovornost nije sporna), a najkasnije u roku od 60 dana u slučaju spornih okolnosti.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
