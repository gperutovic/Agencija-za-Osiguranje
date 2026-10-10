import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  QrCode,
  Download,
  Copy,
  Check,
  Printer,
  ShieldCheck,
  X,
  CreditCard,
  Building,
} from 'lucide-react';
import {
  Hub3aPaymentData,
  renderHub3aBarcodeToCanvas,
  generateHub3aPaymentSlipPdf,
  DEFAULT_AGENCY_PAYMENT,
} from '../../lib/services/hub3aService';

interface Hub3aPaymentSlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: Hub3aPaymentData;
}

export const Hub3aPaymentSlipModal: React.FC<Hub3aPaymentSlipModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copiedIban, setCopiedIban] = useState<boolean>(false);
  const [copiedCallNumber, setCopiedCallNumber] = useState<boolean>(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);

  const recipientIban = data.recipientIban || DEFAULT_AGENCY_PAYMENT.recipientIban;
  const callNumber = data.callNumber || `2026-${Math.floor(100000 + Math.random() * 900000)}`;
  const model = data.model || DEFAULT_AGENCY_PAYMENT.model;
  const recipientName = data.recipientName || DEFAULT_AGENCY_PAYMENT.recipientName;
  const recipientAddress = data.recipientAddress || DEFAULT_AGENCY_PAYMENT.recipientAddress;
  const recipientCity = data.recipientCity || DEFAULT_AGENCY_PAYMENT.recipientCity;

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      renderHub3aBarcodeToCanvas(canvasRef.current, {
        ...data,
        recipientIban,
        callNumber,
        model,
        recipientName,
        recipientAddress,
        recipientCity,
      }).catch((err) => console.error(err));
    }
  }, [isOpen, data, recipientIban, callNumber, model, recipientName, recipientAddress, recipientCity]);

  if (!isOpen) return null;

  const handleCopyIban = () => {
    navigator.clipboard.writeText(recipientIban);
    setCopiedIban(true);
    setTimeout(() => setCopiedIban(false), 2000);
  };

  const handleCopyCallNumber = () => {
    navigator.clipboard.writeText(`${model} ${callNumber}`);
    setCopiedCallNumber(true);
    setTimeout(() => setCopiedCallNumber(false), 2000);
  };

  const handleDownloadPdf = async () => {
    try {
      setIsGeneratingPdf(true);
      await generateHub3aPaymentSlipPdf({
        ...data,
        recipientIban,
        callNumber,
        model,
        recipientName,
        recipientAddress,
        recipientCity,
      });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col my-auto"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                Službena HUB 3A Uplatnica (2D Barkod)
              </h3>
              <p className="text-xs text-slate-300 font-mono">
                Platni nalog u EUR • m-Zaba, PBZ, Erste George, Keks Pay
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body - Visual Payment Slip Container */}
        <div className="p-5 sm:p-6 space-y-6">
          {/* Slip card with Croatian HUB 3A look */}
          <div className="rounded-2xl border-2 border-rose-600/30 bg-rose-50/20 p-5 space-y-4 relative overflow-hidden shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                <span className="text-xs font-mono font-black text-rose-950 tracking-wider">
                  HUB 3A - NALOG ZA PLAĆANJE (SEPA)
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-slate-600">
                VALUTA: <strong className="text-slate-900">EUR</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              {/* Left Column: Payer & Recipient Details */}
              <div className="md:col-span-7 space-y-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Platitelj:</span>
                  <p className="font-bold text-slate-900 text-sm">{data.payerName || 'Ugovaratelj osiguranja'}</p>
                  <p className="text-slate-600">{data.payerAddress || 'Adresa prebivališta'}</p>
                  <p className="text-slate-600">{data.payerCity || '10000 Zagreb'}</p>
                </div>

                <div className="pt-2 border-t border-slate-200/80">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Primatelj:</span>
                  <p className="font-bold text-slate-900">{recipientName}</p>
                  <p className="text-slate-600">{recipientAddress}, {recipientCity}</p>
                </div>

                <div className="pt-2 border-t border-slate-200/80 space-y-1.5">
                  <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-[10px] font-mono text-slate-500 block">IBAN PRIMATELJA:</span>
                      <span className="font-mono font-bold text-slate-900 text-xs">{recipientIban}</span>
                    </div>
                    <button
                      onClick={handleCopyIban}
                      className="px-2 py-1 text-[11px] font-bold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1 transition-colors"
                    >
                      {copiedIban ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedIban ? 'Kopirano' : 'Kopiraj'}</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-[10px] font-mono text-slate-500 block">MODEL I POZIV NA BROJ:</span>
                      <span className="font-mono font-bold text-slate-900 text-xs">{model} {callNumber}</span>
                    </div>
                    <button
                      onClick={handleCopyCallNumber}
                      className="px-2 py-1 text-[11px] font-bold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1 transition-colors"
                    >
                      {copiedCallNumber ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedCallNumber ? 'Kopirano' : 'Kopiraj'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Amount & PDF417 Barcode Canvas */}
              <div className="md:col-span-5 flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-slate-200 space-y-3">
                <div className="text-center w-full">
                  <span className="text-[11px] font-mono uppercase text-slate-500 font-bold block">
                    IZNOS ZA UPLATU
                  </span>
                  <div className="text-3xl font-black text-slate-950 font-mono tracking-tight mt-0.5">
                    {data.amountEur.toFixed(2)} €
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    {data.paymentDescription}
                  </span>
                </div>

                {/* Real 2D PDF417 Barcode */}
                <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-inner flex flex-col items-center">
                  <canvas ref={canvasRef} className="max-w-full h-auto" />
                  <span className="text-[9px] font-mono font-bold text-slate-500 mt-1 uppercase tracking-wide">
                    PDF417 2D BARKOD • SKENIRAJ ZA PLAĆANJE
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Trust strip */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
            <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
            <span>
              Skeniranjem ovog barkoda u mobilnoj aplikaciji vaše banke automatski se popunjavaju svi platni podaci bez mogućnosti pogreške.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="flex-1 py-3 px-5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>{isGeneratingPdf ? 'Generiranje PDF-a...' : 'Preuzmi Uplatnicu (PDF)'}</span>
            </button>

            <button
              onClick={() => window.print()}
              className="py-3 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm border border-slate-200 flex items-center justify-center gap-2 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Ispiši nalog</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
