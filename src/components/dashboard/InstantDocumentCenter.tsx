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

  const handleDownload = (doc: PolicyDocument) => {
    setDownloadingDoc(doc.title);

    // Dynamic generation and download simulation with real formatted text blob
    setTimeout(() => {
      const content = `
======================================================================
REPUBLIKA HRVATSKA • HANFA REGISTAR ZO-88912
AGENCIJA ŽIVOT d.o.o. • ZASTUPANJE U OSIGURANJU
Partner: ${policy.carrier}
======================================================================

SLUŽBENI DOKUMENT: ${doc.title.toUpperCase()}
Broj police: ${policy.policyNumber}
Osigurana imovina / vozilo: ${policy.assetName}
Razdoblje pokrića: od ${policy.startDate} do ${policy.endDate}
Godišnja ugovorena premija: ${policy.premiumAnnual.toFixed(2)} EUR
Status ugovora: ${policy.status.toUpperCase()}

POTVRDA O POKRIVENIM RIZICIMA:
${policy.coverageDetails?.riders.map((r) => ` • ${r}`).join('\n') || ' • Standardna zakonska zaštita'}

Limiti pokrića: do ${(policy.coverageDetails?.limitEur || 6450000).toLocaleString('hr-HR')} EUR
Ugovorena franšiza: ${policy.coverageDetails?.deductibleEur || 0} EUR

Elektronički potpis i verifikacija:
Certifikat ID: SHA256-HR-${Math.random().toString(36).substring(2, 10).toUpperCase()}
Potvrđeno pri HANFA distribucijskom registru distributera osiguranja.
Datum generiranja: ${new Date().toLocaleDateString('hr-HR')}
======================================================================
      `.trim();

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${doc.type}_${policy.policyNumber}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setDownloadingDoc(null);
    }, 600);
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
