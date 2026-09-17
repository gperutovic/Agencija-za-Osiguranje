import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UploadCloud,
  FileCheck,
  CheckCircle2,
  Scan,
  AlertCircle,
  Sparkles,
  Zap,
  Car,
  Home,
  RefreshCw,
} from 'lucide-react';
import { OcrPrometnaResult } from '../../types/insurance';

interface DocumentOcrDropzoneProps {
  documentType?: 'vehicle' | 'property';
  onOcrExtracted: (result: OcrPrometnaResult) => void;
  className?: string;
}

const SAMPLE_VEHICLES: OcrPrometnaResult[] = [
  {
    registrationPlate: 'ZG-4821-HP',
    firstRegistrationDate: '15.05.2022',
    vehicleMake: 'TOYOTA',
    vehicleModel: 'RAV4 2.5 Hybrid AWD',
    vin: 'JTMD4RFV00D129384',
    powerKw: 160,
    displacementCc: 2487,
    fuelType: 'Hibrid (Benzin/Elektro)',
    ownerName: 'Marko Horvatić',
    ownerAddress: 'Ilica 142, 10000 Zagreb',
    confidence: 0.98,
    rawExtractedLines: [
      '(A) ZG-4821-HP',
      '(B) 15.05.2022',
      '(D.1) TOYOTA',
      '(D.3) RAV4 HYBRID',
      '(E) JTMD4RFV00D129384',
      '(P.1) 2487 (P.2) 160.0 kW',
    ],
  },
  {
    registrationPlate: 'ZG-9102-KM',
    firstRegistrationDate: '03.09.2023',
    vehicleMake: 'VOLKSWAGEN',
    vehicleModel: 'Golf VIII 2.0 TDI Life',
    vin: 'WVWZZZCDZNW048219',
    powerKw: 110,
    displacementCc: 1968,
    fuelType: 'Dizel',
    ownerName: 'Ivana Kovačević',
    ownerAddress: 'Vukovarska 72, 10000 Zagreb',
    confidence: 0.96,
    rawExtractedLines: [
      '(A) ZG-9102-KM',
      '(B) 03.09.2023',
      '(D.1) VOLKSWAGEN',
      '(D.3) GOLF 2.0 TDI',
      '(E) WVWZZZCDZNW048219',
      '(P.1) 1968 (P.2) 110.0 kW',
    ],
  },
  {
    registrationPlate: 'ZG-5519-DA',
    firstRegistrationDate: '22.11.2021',
    vehicleMake: 'ŠKODA',
    vehicleModel: 'Octavia Combi 1.5 TSI',
    vin: 'TMBJJ7NX0MY102941',
    powerKw: 110,
    displacementCc: 1498,
    fuelType: 'Benzin',
    ownerName: 'Luka Novak',
    ownerAddress: 'Horvaćanska 45, 10000 Zagreb',
    confidence: 0.95,
    rawExtractedLines: [
      '(A) ZG-5519-DA',
      '(B) 22.11.2021',
      '(D.1) SKODA',
      '(D.3) OCTAVIA COMBI 1.5 TSI',
      '(E) TMBJJ7NX0MY102941',
      '(P.1) 1498 (P.2) 110.0 kW',
    ],
  },
];

export const DocumentOcrDropzone: React.FC<DocumentOcrDropzoneProps> = ({
  documentType = 'vehicle',
  onOcrExtracted,
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [extractedData, setExtractedData] = useState<OcrPrometnaResult | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const simulateOcrScanning = (sample?: OcrPrometnaResult, customName?: string) => {
    setIsProcessing(true);
    setScanProgress(10);
    setExtractedData(null);
    setFileName(customName || 'prometna_dozvola_sken.jpg');

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          setTimeout(() => {
            const result = sample || SAMPLE_VEHICLES[0];
            setExtractedData(result);
            setIsProcessing(false);
            onOcrExtracted(result);
          }, 400);
          return 100;
        }
        return prev + 18;
      });
    }, 120);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      simulateOcrScanning(SAMPLE_VEHICLES[0], file.name);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      simulateOcrScanning(SAMPLE_VEHICLES[0], file.name);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center transition-all cursor-pointer overflow-hidden ${
          isDragging
            ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-lg'
            : isProcessing
            ? 'border-blue-500 bg-blue-50/30 dark:bg-blue-950/20'
            : extractedData
            ? 'border-emerald-500/50 bg-white dark:bg-slate-900 shadow-sm'
            : 'border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/60 hover:border-slate-400 hover:bg-slate-50/70'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*,.pdf"
          className="hidden"
        />

        {/* Laser Scan Line Animation while processing */}
        {isProcessing && (
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: [0, 180, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_12px_#3b82f6] pointer-events-none z-20"
          />
        )}

        <div className="relative z-10 flex flex-col items-center justify-center space-y-3">
          {isProcessing ? (
            <div className="space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-blue-600/10 dark:bg-blue-500/20 flex items-center justify-center mx-auto text-blue-600 dark:text-blue-400 animate-pulse">
                <Scan className="w-7 h-7 animate-spin" />
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300">
                  <Sparkles className="w-3.5 h-3.5" />
                  Optičko prepoznavanje (OCR) u tijeku... {scanProgress}%
                </div>
                <p className="text-xs text-slate-500">
                  Čitanje polja prometne dozvole: VIN broj, snaga (kW), marka i registracija
                </p>
              </div>
            </div>
          ) : extractedData ? (
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 dark:bg-emerald-500/20 flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Dokument uspješno očitan i potvrđen
              </h4>
              <p className="text-xs text-slate-500">
                {fileName || 'prometna_dozvola.jpg'} &bull; Pouzdanost očitanja:{' '}
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {Math.round(extractedData.confidence * 100)}%
                </span>
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-600 dark:text-slate-300">
                <UploadCloud className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Fotografirajte ili priložite prometnu dozvolu
                </h4>
                <p className="text-xs text-slate-500 max-w-sm">
                  Automatski izvlačimo broj šasije (VIN), snagu u kW i podatke vozila bez potrebe za ručnim tipkanjem.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                <span>Podržani formati: JPG, PNG, PDF</span>
                <span>&bull;</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Instant OCR</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Test Demo Presets */}
      <div className="bg-slate-100/70 dark:bg-slate-800/50 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/60">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Isprobajte brzi uzorak (Kliknite za simulaciju očitanja):</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">1-klik test</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {SAMPLE_VEHICLES.map((vehicle, idx) => (
            <button
              key={vehicle.vin}
              type="button"
              disabled={isProcessing}
              onClick={(e) => {
                e.stopPropagation();
                simulateOcrScanning(vehicle, `${vehicle.vehicleMake?.toLowerCase()}_prometna.jpg`);
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-left bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all text-xs group"
            >
              <Car className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
              <div className="truncate">
                <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {vehicle.vehicleMake} {vehicle.vehicleModel}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  {vehicle.registrationPlate} &bull; {vehicle.powerKw} kW
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Extracted Data Visual Breakdown */}
      <AnimatePresence>
        {extractedData && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wide flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                Očitani podaci iz prometne dozvole
              </span>
              <button
                type="button"
                onClick={() => {
                  setExtractedData(null);
                  setFileName(null);
                }}
                className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Ponovno skeniraj
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 block">(A) Registracija</span>
                <span className="font-bold font-mono text-slate-900 dark:text-white text-sm">
                  {extractedData.registrationPlate}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 block">(D.1 & D.3) Marka i Model</span>
                <span className="font-bold text-slate-900 dark:text-white truncate block">
                  {extractedData.vehicleMake} {extractedData.vehicleModel}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 block">(P.2) Snaga motora</span>
                <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400 text-sm">
                  {extractedData.powerKw} kW ({Math.round(extractedData.powerKw * 1.35962)} KS)
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-slate-800 col-span-2 sm:col-span-1">
                <span className="text-[10px] font-mono text-slate-400 block">(E) Broj šasije (VIN)</span>
                <span className="font-mono text-slate-800 dark:text-slate-200 text-xs tracking-wider">
                  {extractedData.vin}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 block">(B) 1. Registracija</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {extractedData.firstRegistrationDate}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 block">(C.1) Vlasnik</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                  {extractedData.ownerName}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
