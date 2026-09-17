import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, FileText, Send, Building, Scale, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { consumerComplaintSchema, ConsumerComplaintFormData } from '../../lib/schemas/quote-schemas';
import { AGENCY_DETAILS } from '../../lib/content/insurance-data';

export const metadata = {
  title: 'Postupak Rješavanja Prigovora Potrošača | Agencija Život',
  description:
    'Službene upute o podnošenju prigovora potrošača i izvansudskom rješavanju sporova pri Centru za mirenje HUO i HGK sukladno čl. 401. Zakona o osiguranju.',
};

export default function PrigovoriPage() {
  const [submitted, setSubmitted] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ConsumerComplaintFormData>({
    resolver: zodResolver(consumerComplaintSchema),
    defaultValues: {
      consentFormal: true,
    },
  });

  const onSubmit = async (data: ConsumerComplaintFormData) => {
    // Simulacija pohrane prigovora u bazu i evidenciju prigovora
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSubmitted(true);
    reset();
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen py-10 sm:py-16 text-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Title */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-mono font-semibold">
            <Scale className="w-3.5 h-3.5 text-amber-600" />
            <span>ZAKON O OSIGURANJU &bull; ČL. 401. &bull; ZAŠTITA POTROŠAČA</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Postupak podnošenja prigovora i izvansudsko rješavanje sporova
          </h1>

          {/* Standalone GEO Direct Answer Block */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm text-left text-sm text-slate-700 leading-relaxed">
            <p>
              Sukladno članku 401. Zakona o osiguranju (Narodne novine br. 30/15, 112/18, 63/20, 133/20 i 151/22), svaki ugovaratelj osiguranja, osiguranik ili oštećena osoba ima pravo podnijeti <strong>pisani prigovor</strong> društvu ŽIVOT d.o.o. na rad zastupnika ili pruženu uslugu. Agencija Život dužna je odgovoriti u pisanom obliku u roku od <strong>najkasnije 15 dana</strong> od dana zaprimanja prigovora. U slučaju nezadovoljstva odgovorom, spor se može uputiti <strong>Centru za mirenje pri Hrvatskom uredu za osiguranje (HUO)</strong> ili <strong>Centru za mirenje pri HGK</strong>.
            </p>
          </div>
        </div>

        {/* Complaints Form */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Obrazac za podnošenje prigovora online</h2>
              <p className="text-xs text-slate-500">
                Vaš prigovor bit će automatski zaveden u službenu Knjigu prigovora ŽIVOT d.o.o.
              </p>
            </div>
          </div>

          {submitted ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-lg font-bold text-emerald-950">Prigovor je uspješno zaprimljen</h3>
              <p className="text-sm text-emerald-800 max-w-md mx-auto">
                Vaš prigovor zaveden je pod službenim urudžbenim brojem. Pismeni odgovor uprave primit ćete na navedenu e-mail adresu i poštom u zakonskom roku od najkasnije 15 dana.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-2 px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
              >
                Podnesi novi prigovor
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ime i prezime / Naziv tvrtke *
                  </label>
                  <input
                    {...register('fullName')}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-rose-500"
                    placeholder="Ivan Horvat"
                  />
                  {errors.fullName && (
                    <p className="text-rose-500 text-[11px] mt-1">{errors.fullName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">OIB podnositelja *</label>
                  <input
                    {...register('oib')}
                    maxLength={11}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:ring-2 focus:ring-rose-500"
                    placeholder="12345678901"
                  />
                  {errors.oib && (
                    <p className="text-rose-500 text-[11px] mt-1">{errors.oib.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">E-mail adresa *</label>
                  <input
                    {...register('email')}
                    type="email"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-rose-500"
                    placeholder="ivan@email.hr"
                  />
                  {errors.email && (
                    <p className="text-rose-500 text-[11px] mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kontakt telefon *</label>
                  <input
                    {...register('phone')}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-rose-500"
                    placeholder="091 234 5678"
                  />
                  {errors.phone && (
                    <p className="text-rose-500 text-[11px] mt-1">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Broj police (opcionalno)</label>
                  <input
                    {...register('policyNumber')}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:ring-2 focus:ring-rose-500"
                    placeholder="npr. 88912-ZG-2026"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Adresa prebivališta i grad *</label>
                <input
                  {...register('address')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-rose-500"
                  placeholder="Ilica 100, 10000 Zagreb"
                />
                {errors.address && (
                  <p className="text-rose-500 text-[11px] mt-1">{errors.address.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Predmet prigovora *</label>
                <input
                  {...register('subject')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-rose-500"
                  placeholder="Kratki sažetak razloga prigovora"
                />
                {errors.subject && (
                  <p className="text-rose-500 text-[11px] mt-1">{errors.subject.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Detaljan opis prigovora i činjenica *
                </label>
                <textarea
                  {...register('description')}
                  rows={4}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-rose-500"
                  placeholder="Molimo navedite sve relevantne okolnosti, datume i imena uključenih djelatnika..."
                />
                {errors.description && (
                  <p className="text-rose-500 text-[11px] mt-1">{errors.description.message}</p>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#FF0055] hover:bg-[#d90048] text-white font-bold text-sm shadow flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Slanje prigovora...' : 'Podnesi službeni prigovor'}</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Alternative Dispute Resolution Institutions */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Izvansudsko rješavanje potrošačkih sporova</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Ako podnositelj prigovora nije zadovoljan odlukom Agencije Život ili odluka nije donesena u propisanom roku od 15 dana, potrošač ima pravo pokrenuti postupak izvansudskog rješavanja spora pred nadležnim tijelima:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <strong className="block text-slate-900 font-bold">Centar za mirenje pri HUO</strong>
              <p className="text-slate-600">Hrvatski ured za osiguranje, Martićeva 71, 10000 Zagreb</p>
              <p className="text-slate-600">Web: www.huo.hr &bull; E-mail: mirenje@huo.hr</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <strong className="block text-slate-900 font-bold">Centar za mirenje pri HGK</strong>
              <p className="text-slate-600">Hrvatska gospodarska komora, Rooseveltov trg 2, 10000 Zagreb</p>
              <p className="text-slate-600">Web: www.hgk.hr &bull; E-mail: mirenje@hgk.hr</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
