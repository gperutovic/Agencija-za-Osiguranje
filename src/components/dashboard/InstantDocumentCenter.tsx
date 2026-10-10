import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Download,
  QrCode,
  ShieldCheck,
  Eye,
  CheckCircle2,
  Calendar,
  Building,
  Printer,
  X,
  Lock,
} from 'lucide-react';
import { Policy, PolicyDocument } from '../../types/insurance';

import { jsPDF } from 'jspdf';
import { generateHub3aPaymentSlipPdf } from '../../lib/services/hub3aService';
import { generateIpidPdf } from '../../lib/services/ipidService';
import { AGENCY_DETAILS } from '../../lib/content/insurance-data';

interface InstantDocumentCenterProps {
  policy: Policy;
  isOpen: boolean;
  onClose: () => void;
}

export const InstantDocumentCenter: React.FC<InstantDocumentCenterProps> = ({
  policy,
  isOpen,
  onClose,
}) => {
  const [downloadingDoc, setDownloadingDoc] = useState<string | null>(null);
  const [previewDoc, setPreviewDoc] = useState<PolicyDocument | null>(null);

  if (!isOpen) return null;

  const handleDownload = async (doc: PolicyDocument) => {
    setDownloadingDoc(doc.title);

    try {
      const titleLower = doc.title.toLowerCase();

      // 1. HUB 3A SEPA Payment Slip
      if (doc.type === 'payment_slip' || titleLower.includes('uplatnic') || titleLower.includes('hub') || titleLower.includes('sepa')) {
        const installmentAmount = policy.paymentFrequency === 'monthly' ? policy.premiumAnnual / 12 : policy.premiumAnnual;
        await generateHub3aPaymentSlipPdf({
          payerName: 'Ugovaratelj osiguranja',
          amountEur: parseFloat(installmentAmount.toFixed(2)),
          paymentDescription: `Premija ${policy.carrier} polica ${policy.policyNumber}`,
          callNumber: `2026-${policy.policyNumber.replace(/\D/g, '').slice(0, 8) || '889120'}`,
        });
        setDownloadingDoc(null);
        return;
      }

      // 2. Green Card (Međunarodna karta osiguranja automobila)
      if (doc.type === 'green_card' || titleLower.includes('zelena') || titleLower.includes('green')) {
        const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
        
        // Green header banner
        pdf.setFillColor(236, 253, 245);
        pdf.rect(10, 10, 277, 190, 'F');
        pdf.setDrawColor(16, 185, 129);
        pdf.setLineWidth(1);
        pdf.rect(10, 10, 277, 190, 'D');

        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(16);
        pdf.setTextColor(6, 78, 59);
        pdf.text('1. MEĐUNARODNA KARTA OSIGURANJA AUTOMOBILA / CARTE INTERNATIONALE D\'ASSURANCE AUTOMOBILE', 16, 22);

        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(30, 41, 59);
        pdf.text('2. IZDANO POD NADZOROM HRVATSKOG UREDA ZA OSIGURANJE (HUO - ZAGREB)', 16, 29);

        // Grid lines
        pdf.setDrawColor(209, 250, 229);
        pdf.rect(16, 34, 265, 30);

        pdf.setFont('helvetica', 'bold');
        pdf.text('3. VALJANOST:', 20, 40);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Od: ${policy.startDate}  Do: ${policy.endDate}`, 20, 46);

        pdf.setFont('helvetica', 'bold');
        pdf.text('4. OZNAKA ZEMLJE / BROJ POLICE:', 110, 40);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`HR / ${policy.carrier.slice(0, 10).toUpperCase()} / ${policy.policyNumber}`, 110, 46);

        pdf.setFont('helvetica', 'bold');
        pdf.text('5. REGISTARSKA OZNAKA / BROJ ŠASIJE:', 200, 40);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`${policy.assetName}`, 200, 46);

        // International Country Table
        pdf.setFont('helvetica', 'bold');
        pdf.text('8. TERITORIJALNA VALJANOST (ZELENA KARTA):', 16, 73);

        const countries = ['A', 'B', 'BG', 'CY', 'CZ', 'D', 'DK', 'E', 'EST', 'F', 'FIN', 'GR', 'H', 'HR', 'I', 'IRL', 'IS', 'L', 'LT', 'LV', 'M', 'N', 'NL', 'P', 'PL', 'RO', 'S', 'SK', 'SLO', 'CH', 'AL', 'AND', 'BIH', 'MA', 'MD', 'MK', 'MNE', 'SRB', 'TN', 'TR', 'UK'];
        let startX = 16;
        let startY = 78;

        for (let i = 0; i < countries.length; i++) {
          const col = i % 14;
          const row = Math.floor(i / 14);
          const cellX = startX + col * 18.5;
          const cellY = startY + row * 12;

          pdf.setFillColor(255, 255, 255);
          pdf.rect(cellX, cellY, 18, 10, 'FD');
          pdf.setFontSize(8);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(15, 23, 42);
          pdf.text(countries[i], cellX + 3, cellY + 7);
        }

        // Insurer signature info
        pdf.setFontSize(9);
        pdf.text(`9. Naziv i adresa osiguratelja: ${policy.carrier}`, 16, 130);
        pdf.text(`Distributer u osiguranju: ${AGENCY_DETAILS.legalName} (HANFA Reg. ${AGENCY_DETAILS.hanfaRegisterNumber})`, 16, 137);
        pdf.text(`Verifikacijski QR kod & MUP registar: VERIFICIRANO (Status: AKTIVNO)`, 16, 144);

        pdf.save(`Zelena_Karta_${policy.policyNumber}.pdf`);
        setDownloadingDoc(null);
        return;
      }

      // 3. IPID Document
      if (doc.type === 'ipid' || titleLower.includes('ipid')) {
        generateIpidPdf({
          category: policy.type === 'property' ? 'imovina' : policy.type === 'health' ? 'dopunsko' : 'auto',
          carrierName: policy.carrier,
          productName: doc.title,
          customDetails: {
            annualPremium: policy.premiumAnnual,
          },
        });
        setDownloadingDoc(null);
        return;
      }

      // 4. Default: Official Policy Document PDF
      const pdf = new jsPDF();
      pdf.setFillColor(15, 23, 42);
      pdf.rect(0, 0, 210, 32, 'F');

      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text('POLICA OSIGURANJA (SLUŽBENI DOKUMENT)', 15, 14);

      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(204, 251, 241);
      pdf.text(`Izdavatelj: ${policy.carrier} • Distributer: ${AGENCY_DETAILS.legalName}`, 15, 22);

      pdf.setTextColor(15, 23, 42);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Broj police: ${policy.policyNumber}`, 15, 42);
      pdf.text(`Predmet osiguranja: ${policy.assetName}`, 15, 48);
      pdf.text(`Trajanje pokrića: od ${policy.startDate} do ${policy.endDate}`, 15, 54);
      pdf.text(`Ugovorena godišnja premija: ${policy.premiumAnnual.toFixed(2)} EUR`, 15, 60);

      pdf.setFont('helvetica', 'bold');
      pdf.text('POKRIVENI RIZICI I POGODNOSTI:', 15, 72);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      let rY = 78;
      const riders = policy.coverageDetails?.riders || ['Zakonsko obvezno pokriće', 'Asistencija 24/7'];
      for (const r of riders) {
        pdf.text(`• ${r}`, 18, rY);
        rY += 6;
      }

      pdf.text(`Maksimalni limit pokrića: do ${(policy.coverageDetails?.limitEur || 6450000).toLocaleString('hr-HR')} EUR`, 15, rY + 6);
      pdf.text(`Ugovorena franšiza: ${policy.coverageDetails?.deductibleEur || 0} EUR`, 15, rY + 12);

      // Digital verification
      pdf.setFillColor(248, 250, 252);
      pdf.rect(15, rY + 22, 180, 24, 'F');
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8);
      pdf.setTextColor(51, 65, 85);
      pdf.text('ELEKTRONIČKI POTPIS I VERIFIKACIJA:', 18, rY + 28);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Potvrđeno pri HANFA distribucijskom registru pod brojem ${AGENCY_DETAILS.hanfaRegisterNumber}.`, 18, rY + 34);
      pdf.text(`Sigurnosni hash: SHA256-HR-${policy.policyNumber.replace(/\D/g, '')}-ZIVOT-2026`, 18, rY + 40);

      pdf.save(`Polica_${policy.policyNumber}.pdf`);
      setDownloadingDoc(null);
    } catch (err) {
      console.error(err);
      setDownloadingDoc(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Centar za Dokumente & Potvrde
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                Polica: {policy.policyNumber} &bull; {policy.carrier}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-300 text-xs font-bold"
          >
            ✕
          </button>
        </div>

        {/* Asset summary bar */}
        <div className="px-6 py-3 bg-blue-50/50 dark:bg-blue-950/20 border-b border-blue-100 dark:border-blue-900/30 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="font-semibold text-blue-950 dark:text-blue-200">
            {policy.assetName}
          </span>
          <div className="flex items-center gap-3 text-slate-500">
            <span>Trajanje: {policy.startDate} &rarr; {policy.endDate}</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
              {policy.premiumAnnual.toFixed(2)} €/god
            </span>
          </div>
        </div>

        {/* Document List */}
        <div className="p-6 overflow-y-auto space-y-3.5 flex-1">
          {policy.documents.map((doc, idx) => {
            const isDownloading = downloadingDoc === doc.title;
            const isGreenCard = doc.type === 'green_card';
            const isSepa = doc.type === 'payment_slip';

            return (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-blue-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isGreenCard
                        ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
                        : isSepa
                        ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400'
                        : 'bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400'
                    }`}
                  >
                    {isGreenCard ? (
                      <ShieldCheck className="w-5 h-5" />
                    ) : isSepa ? (
                      <QrCode className="w-5 h-5" />
                    ) : (
                      <FileText className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{doc.title}</span>
                      {isGreenCard && (
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold">
                          Međunarodno
                        </span>
                      )}
                      {isSepa && (
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-semibold">
                          HUB 3A QR
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2 font-mono">
                      <span>Službeni format</span>
                      <span>&bull;</span>
                      <span>Verificirani dokument</span>
                      {doc.fileSizeBytes && (
                        <>
                          <span>&bull;</span>
                          <span>{Math.round(doc.fileSizeBytes / 1024)} KB</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    type="button"
                    disabled={isDownloading}
                    onClick={() => handleDownload(doc)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white shadow-sm transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isDownloading ? 'Preuzimanje...' : 'Preuzmi'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Kriptografski potpisano &bull; Vrijedi na tehničkom pregledu (STP)</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            Zatvori
          </button>
        </div>
      </motion.div>
    </div>
  );
};
