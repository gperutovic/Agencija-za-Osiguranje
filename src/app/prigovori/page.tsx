import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  FileText,
  Scale,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Clock,
} from 'lucide-react';
import { isValidOIB } from '../../lib/validation';
import { AGENCY_DETAILS } from '../../lib/content/insurance-data';
import { firestoreService } from '../../api/firestoreService';

const complaintSchema = z.object({
  fullName: z.string().min(3, 'Molimo upišite ime i prezime ili naziv tvrtke'),
  oib: z.string().refine((val) => isValidOIB(val), {
    message: 'Uneseni OIB nije ispravan (potrebno je 11 znamenki)',
  }),
  email: z.string().email('Unesite ispravnu e-mail adresu za dostavu pisanog odgovora'),
  phone: z.string().min(6, 'Unesite važeći broj telefona'),
  address: z.string().min(5, 'Upišite adresu za dostavu pisanog odgovora'),
  policyNumber: z.string().optional(),
  subject: z.string().min(5, 'Sažeto opišite predmet prigovora'),
  description: z.string().min(20, 'Detaljno obrazložite razloge i okolnosti prigovora (najmanje 20 znakova)'),
});

type ComplaintFormValues = z.infer<typeof complaintSchema>;

export default function PrigovoriPage() {
  const [submitted, setSubmitted] = useState(false);
  const [protocolId, setProtocolId] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ComplaintFormValues>({
    resolver: zodResolver(complaintSchema),
  });

  const onSubmit = async (data: ComplaintFormValues) => {
    setSubmitError(null);
    try {
      const saved = await firestoreService.submitComplaint({
        fullName: data.fullName.trim(),
        oib: data.oib.trim(),
        email: data.email.trim(),
        phone: data.phone.trim(),
        address: data.address.trim(),
        policyNumber: data.policyNumber?.trim() || undefined,
        subject: data.subject.trim(),
        description: data.description.trim(),
      });
      setProtocolId(saved.protocolId);
      setSubmitted(true);
      reset();
    } catch (err) {
      console.error(err);
      setSubmitError('Pogreška pri evidentiranju prigovora u registar. Molimo pokušajte ponovo.');
    }
  };

  return (
    <div className="w-full py-12 sm:py-16 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-100 border border-slate-200 text-[#0F2942] text-xs font-semibold uppercase tracking-wider">
            <Scale className="w-3.5 h-3.5" />
            <span>Čl. 401. Zakona o osiguranju (NN 30/15, 112/18)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Postupak podnošenja prigovora potrošača
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Sukladno propisima o distribuciji osiguranja, svaki osiguranik i ugovaratelj osiguranja ima pravo podnijeti pisani prigovor na rad Agencije Život ({AGENCY_DETAILS.legalName}).
          </p>
        </div>

        {/* Statutory Info Strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-5 border border-slate-200 flex items-start gap-3">
            <Clock className="w-5 h-5 text-[#0F2942] shrink-0 mt-0.5" />
            <div className="text-xs text-slate-600 space-y-1">
              <strong className="text-slate-900 block text-sm">Zakonski rok za odgovor (15 dana)</strong>
              <p>
                Odgovor u pisanom obliku dostavljamo najkasnije u roku od <strong>15 kalendarskih dana</strong> od dana zaprimanja urednog prigovora.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200 flex items-start gap-3">
            <FileText className="w-5 h-5 text-[#0F2942] shrink-0 mt-0.5" />
            <div className="text-xs text-slate-600 space-y-1">
              <strong className="text-slate-900 block text-sm">Dostava poštom ili e-mailom</strong>
              <p>
                {AGENCY_DETAILS.address}, {AGENCY_DETAILS.postalCode} {AGENCY_DETAILS.city} • E-mail:{' '}
                <a href={`mailto:${AGENCY_DETAILS.complaintsEmail}`} className="text-[#0F2942] font-semibold underline">
                  {AGENCY_DETAILS.complaintsEmail}
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Form or Success Card */}
        {submitted ? (
          <div className="bg-white rounded-xl border border-emerald-200 p-8 sm:p-10 text-center space-y-4 shadow-sm">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Prigovor je evidentiran u Knjigu prigovora</h2>
            <div className="inline-block px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm">
              Urudžbeni protokol broj:{' '}
              <strong className="text-[#0F2942] tabular-nums">{protocolId}</strong>
            </div>
            <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
              Potvrda zaprimanja evidentirana je u sustavu. Pisani odgovor bit će dostavljen na vašu e-mail adresu unutar zakonskog roka od 15 dana.
            </p>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="px-6 py-2.5 rounded-lg bg-[#0F2942] hover:bg-[#163859] text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              Podnesi novi prigovor
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-5"
          >
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-3">
              Obrazac za podnošenje pisanog prigovora
            </h2>

            {submitError && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ime i prezime (ili naziv tvrtke) *
                </label>
                <input
                  {...register('fullName')}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-[#0F2942] focus:ring-2 focus:ring-[#0F2942]/10"
                  placeholder="Ivan Horvat"
                />
                {errors.fullName && (
                  <p className="text-xs text-red-600 mt-1">{errors.fullName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  OIB (11 znamenki) *
                </label>
                <input
                  {...register('oib')}
                  maxLength={11}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm tabular-nums focus:outline-none focus:border-[#0F2942] focus:ring-2 focus:ring-[#0F2942]/10"
                  placeholder="26182105153"
                />
                {errors.oib && <p className="text-xs text-red-600 mt-1">{errors.oib.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  E-mail adresa za odgovor *
                </label>
                <input
                  {...register('email')}
                  type="email"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-[#0F2942] focus:ring-2 focus:ring-[#0F2942]/10"
                  placeholder="ivan.horvat@email.hr"
                />
                {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kontakt telefon *
                </label>
                <input
                  {...register('phone')}
                  type="tel"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm tabular-nums focus:outline-none focus:border-[#0F2942] focus:ring-2 focus:ring-[#0F2942]/10"
                  placeholder="091 234 5678"
                />
                {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Adresa stanovanja / sjedišta *
                </label>
                <input
                  {...register('address')}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-[#0F2942] focus:ring-2 focus:ring-[#0F2942]/10"
                  placeholder="Ilica 10, 10000 Zagreb"
                />
                {errors.address && <p className="text-xs text-red-600 mt-1">{errors.address.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Broj police ili predmeta (ako je primjenjivo)
                </label>
                <input
                  {...register('policyNumber')}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-[#0F2942] focus:ring-2 focus:ring-[#0F2942]/10"
                  placeholder="npr. GEN-AO-2025-912"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Predmet prigovora *
              </label>
              <input
                {...register('subject')}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-[#0F2942] focus:ring-2 focus:ring-[#0F2942]/10"
                placeholder="Sažeti opis predmeta prigovora"
              />
              {errors.subject && <p className="text-xs text-red-600 mt-1">{errors.subject.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Obrazloženje i zahtjev *
              </label>
              <textarea
                {...register('description')}
                rows={4}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-[#0F2942] focus:ring-2 focus:ring-[#0F2942]/10"
                placeholder="Navedite kronologiju događaja i razloge zbog kojih podnosite prigovor..."
              />
              {errors.description && (
                <p className="text-xs text-red-600 mt-1">{errors.description.message}</p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-lg bg-[#0F2942] hover:bg-[#163859] text-white font-semibold text-sm transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? 'Evidentiranje prigovora...' : 'Podnesi službeni prigovor'}
              </button>
            </div>
          </form>
        )}

        {/* Alternative Dispute Resolution Notice */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3 text-xs text-slate-600 leading-relaxed">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#0F2942]" />
            <span>Izvansudsko rješavanje sporova i nadzorna tijela</span>
          </h3>
          <p>
            Ako odgovor Agencije Život nije zadovoljavajući ili ne bude dostavljen u roku od 15 dana, potrošač može pokrenuti postupak izvansudskog rješavanja spora pri Centru za mirenje Hrvatskog ureda za osiguranje (HUO), pri Sudu časti Hrvatske gospodarske komore ili se obratiti nadzornom tijelu (HANFA).
          </p>
          <div className="flex flex-wrap gap-4 pt-1">
            <a
              href="https://www.hanfa.hr/potrosaci/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0F2942] font-semibold inline-flex items-center gap-1 hover:underline"
            >
              HANFA – Zaštita potrošača
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://www.huo.hr/hr/centar-za-mirenje"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0F2942] font-semibold inline-flex items-center gap-1 hover:underline"
            >
              Centar za mirenje pri HUO-u
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
