import React from 'react';
import { ClaimsIntakeForm } from '../../components/claims/ClaimsIntakeForm';
import { ShieldAlert, Phone, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

export default function ClaimsReportingPage() {
  return (
    <div className="w-full bg-slate-50 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header Hero */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-4">
            <ShieldAlert className="w-3.5 h-3.5 text-emerald-600" />
            <span>Digitalni centar za prijavu i obradu šteta</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Online Prijava Štete (FNOL)
          </h1>
          <p className="mt-3 text-base text-slate-600">
            Prijavite štetu u nekoliko minuta bez čekanja u poslovnici. Naš tim koordinira
            postupak likvidacije s vašim osigurateljem i osigurava brzu isplatu odštete na vaš IBAN.
          </p>

          {/* Emergency Assistance Call Strip */}
          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
            <div className="flex items-center space-x-1.5 font-bold">
              <Phone className="w-4 h-4 text-amber-700" />
              <span>Hitna asistencija na cesti (24/7):</span>
            </div>
            <a href="tel:015550666" className="font-extrabold text-blue-700 underline text-sm">
              01 555 0666
            </a>
            <span className="text-slate-400">|</span>
            <span>Za teže prometne nesreće nazovite hitne službe na <strong>112</strong></span>
          </div>
        </div>

        {/* Claims Intake Form Component */}
        <ClaimsIntakeForm />

        {/* Informative Guidance: What to do at the scene of the accident */}
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Protokol postupanja u slučaju prometne nezgode
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Sukladno Zakonu o sigurnosti prometa na cestama i preporukama Hrvatskog ureda za osiguranje (HUO).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600 leading-relaxed">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
              <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-800 font-extrabold flex items-center justify-center text-xs">
                1
              </span>
              <p className="font-bold text-slate-900 text-sm">Osigurajte mjesto nesreće</p>
              <p>
                Odmah uključite sva četiri pokazivača smjera, postavite sigurnosni trokut na propisanu udaljenost (najmanje 50 m izvan naselja, 100 m na autocesti) i obucite reflektirajući prsluk.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
              <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-800 font-extrabold flex items-center justify-center text-xs">
                2
              </span>
              <p className="font-bold text-slate-900 text-sm">Fotografirajte i razmijenite podatke</p>
              <p>
                Prije pomicanja vozila snimite položaj vozila iz više kutova, tragove kočenja i oštećenja. Ispunite Europsko izvješće o nezgodi te zabilježite registraciju i podatke o polici drugog sudionika.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
              <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-800 font-extrabold flex items-center justify-center text-xs">
                3
              </span>
              <p className="font-bold text-slate-900 text-sm">Pozovite policiju ako je potrebno</p>
              <p>
                Policiju (192 ili 112) obavezno pozovite ako ima ozlijeđenih ili poginulih osoba, ako je nastala veća materijalna šteta, ako drugi vozač odbija dati podatke ili je pod utjecajem alkohola.
              </p>
            </div>
          </div>

          {/* Statutory Notice */}
          <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-blue-900 flex items-start space-x-3">
            <Clock className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
            <p>
              <strong>Zakonski rok za obradu odštetnog zahtjeva:</strong> Sukladno Zakonu o obveznim osiguranjima u prometu, osiguratelj je dužan u roku od <strong>14 dana</strong> od zaprimanja odštetnog zahtjeva dostaviti obrazloženu ponudu odštete (ako odgovornost nije sporna), a najkasnije u roku od 60 dana u slučaju spornih okolnosti.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
