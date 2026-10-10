import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, FileText, Send, Building, Scale, AlertCircle, Copy, Check, Download, ExternalLink } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { consumerComplaintSchema, ConsumerComplaintFormData } from '../lib/validation';
import { AGENCY_DETAILS } from '../lib/content/insurance-data';
import { complaintService } from '../api/firestoreService';
import { jsPDF } from 'jspdf';

export const metadata = {
  title: 'Postupak Rješavanja Prigovora Potrošača | Agencija Život',
  description:
    'Službene upute o podnošenju prigovora potrošača i izvansudskom rješavanju sporova pri Centru za mirenje HUO i HGK sukladno čl. 401. Zakona o osiguranju.',
};

export default function PrigovoriPage() {
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [protocolId, setProtocolId] = useState<string>('');
  const [submittedEmail, setSubmittedEmail] = useState<string>('');
  const [submittedData, setSubmittedData] = useState<ConsumerComplaintFormData | null>(null);
  const [copiedProtocol, setCopiedProtocol] = useState<boolean>(false);

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
    try {
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const generatedProtocol = `PRIG-2026-${randomSuffix}`;

      await complaintService.submitComplaint({
        protocolNumber: generatedProtocol,
        fullName: data.fullName,
        oib: data.oib,
        email: data.email,
        phone: data.phone,
        address: data.address,
        policyNumber: data.policyNumber,
        claimNumber: data.claimNumber,
        subject: data.subject,
        description: data.description,
        desiredResolution: data.desiredResolution,
      });

      setProtocolId(generatedProtocol);
      setSubmittedEmail(data.email);
      setSubmittedData(data);
      setSubmitted(true);
      reset();
    } catch (err) {
      console.error('Failed to submit complaint:', err);
    }
  };

  const handleCopyProtocol = () => {
    if (protocolId) {
      navigator.clipboard.writeText(protocolId);
      setCopiedProtocol(true);
      setTimeout(() => setCopiedProtocol(false), 2000);
    }
  };

  const handleDownloadReceiptPdf = () => {
    if (!submittedData || !protocolId) return;
    const doc = new jsPDF();

    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 30, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('POTVRDA O ZAPRIMANJU PRIGOVORA POTROŠAČA', 15, 14);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(204, 251, 241);
    doc.text('Sukladno članku 401. Zakona o osiguranju (Narodne novine br. 30/15, 151/22)', 15, 22);

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`Službeni urudžbeni broj: ${protocolId}`, 15, 42);
    doc.text(`Datum zaprimanja: ${new Date().toLocaleDateString('hr-HR')}`, 15, 48);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`Podnositelj prigovora: ${submittedData.fullName} (OIB: ${submittedData.oib})`, 15, 56);
    doc.text(`Kontakt podaci: ${submittedData.email} • ${submittedData.phone}`, 15, 62);
    doc.text(`Adresa: ${submittedData.address}`, 15, 68);
    if (submittedData.policyNumber) doc.text(`Broj police: ${submittedData.policyNumber}`, 15, 74);

    doc.setFont('helvetica', 'bold');
    doc.text(`Predmet prigovora: ${submittedData.subject}`, 15, 84);

    doc.setFont('helvetica', 'normal');
    const descLines = doc.splitTextToSize(`Opis: ${submittedData.description}`, 180);
    doc.text(descLines, 15, 90);

    const deadlineY = 160;
    doc.setFillColor(241, 245, 249);
    doc.rect(15, deadlineY, 180, 24, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text('ZAKONSKI ROK ZA PISANI ODGOVOR UPRAVE:', 20, deadlineY + 8);
    doc.setFont('helvetica', 'normal');
    doc.text('Najkasnije 15 dana od dana zaprimanja ovog prigovora.', 20, deadlineY + 15);
    doc.text('Odgovor se dostavlja u pisanom obliku na navedenu e-mail adresu i poštom.', 20, deadlineY + 20);

    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(`${AGENCY_DETAILS.legalName} • Registar HANFA: ${AGENCY_DETAILS.hanfaRegisterNumber}`, 15, 280);

    doc.save(`Potvrda_Prigovora_${protocolId}.pdf`);
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
            <div className="p-8 rounded-3xl bg-emerald-50 border-2 border-emerald-300 text-center space-y-6">
              <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-emerald-950">Prigovor je službeno zaprimljen i zaveden</h3>
                <p className="text-sm text-emerald-800 max-w-lg mx-auto">
                  Sukladno članku 401. Zakona o osiguranju, vaš prigovor je automatski urudžbiran u službenoj evidenciji društva ŽIVOT d.o.o.
                </p>
              </div>

              {/* Protocol Badge */}
              <div className="max-w-md mx-auto p-4 rounded-2xl bg-white border border-emerald-200 shadow-sm flex items-center justify-between">
                <div className="text-left">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold block">
                    SLUŽBENI PROTOKOL ID (URUDŽBENI BROJ):
                  </span>
                  <span className="text-lg font-black font-mono text-slate-900 tracking-wide">
                    {protocolId}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyProtocol}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  {copiedProtocol ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedProtocol ? 'Kopirano' : 'Kopiraj'}</span>
                </button>
              </div>

              {/* Statutory 15-day deadline info banner */}
              <div className="max-w-md mx-auto p-4 rounded-2xl bg-emerald-100/70 border border-emerald-300/80 text-left space-y-2 text-xs text-emerald-900">
                <div className="flex items-center gap-2 font-bold text-emerald-950 font-mono">
                  <Scale className="w-4 h-4 text-emerald-700" />
                  <span>ZAKONSKI ROK ZA PISANI ODGOVOR: 15 DANA</span>
                </div>
                <p className="leading-relaxed">
                  Uprava društva ŽIVOT d.o.o. dužna je odgovoriti u pisanom obliku najkasnije u roku od 15 dana. Službena potvrda o zaprimanju i urudžbirani spis poslani su na vaš e-mail: <strong className="font-mono text-emerald-950">{submittedEmail}</strong>.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleDownloadReceiptPdf}
                  className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Preuzmi službenu potvrdu (PDF)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold text-xs"
                >
                  Podnesi novi prigovor
                </button>
              </div>
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
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold text-sm shadow flex items-center justify-center gap-2"
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <strong className="block text-slate-900 font-bold">HANFA</strong>
              <p className="text-slate-600">Hrvatska agencija za nadzor financijskih usluga, Franje Račkoga 6, 10000 Zagreb</p>
              <a href="https://www.hanfa.hr" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline font-bold inline-flex items-center gap-1">
                Web: www.hanfa.hr <ExternalLink className="w-3 h-3" />
              </a>
              <p className="text-slate-500 text-[11px]">Nadzorno tijelo nad poslovanjem distributera</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <strong className="block text-slate-900 font-bold">Centar za mirenje pri HUO</strong>
              <p className="text-slate-600">Hrvatski ured za osiguranje, Martićeva 71, 10000 Zagreb</p>
              <a href="https://www.huo.hr" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline font-bold inline-flex items-center gap-1">
                Web: www.huo.hr <ExternalLink className="w-3 h-3" />
              </a>
              <p className="text-slate-600">E-mail: mirenje@huo.hr</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <strong className="block text-slate-900 font-bold">Centar za mirenje pri HGK</strong>
              <p className="text-slate-600">Hrvatska gospodarska komora, Rooseveltov trg 2, 10000 Zagreb</p>
              <a href="https://www.hgk.hr" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline font-bold inline-flex items-center gap-1">
                Web: www.hgk.hr <ExternalLink className="w-3 h-3" />
              </a>
              <p className="text-slate-600">E-mail: mirenje@hgk.hr</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

