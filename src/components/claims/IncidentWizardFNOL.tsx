import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  Calendar,
  MapPin,
  Car,
  Home,
  Camera,
  CreditCard,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  UploadCloud,
  FileText,
  ShieldAlert,
  Sparkles,
  Send,
} from 'lucide-react';
import { useInsurtechStore } from '../../store/useInsurtechStore';
import { Claim } from '../../types/insurance';

interface IncidentWizardFNOLProps {
  onClaimSubmitted?: (claim: Claim) => void;
  className?: string;
}

const DAMAGE_CATEGORIES = [
  {
    id: 'collision',
    title: 'Sudar / Prometna nezgoda',
    description: 'Nalet na drugo vozilo, udarac u prepreku ili slijetanje s ceste',
    icon: Car,
  },
  {
    id: 'glass_breakage',
    title: 'Lom stakala (Vjetrobransko / bočno)',
    description: 'Udarac kamenčića, pukotina bez oštećenja limarije',
    icon: Sparkles,
  },
  {
    id: 'water_damage',
    title: 'Izljev vode / Poplava',
    description: 'Puknuće vodovodne cijevi, prodor oborinskih voda ili poplava susjeda',
    icon: Home,
  },
  {
    id: 'storm_hail',
    title: 'Tuča, oluja i prirodne nepogode',
    description: 'Udubljenja od tuče, pad grane ili oštećenje krovišta olujnim vjetrom',
    icon: AlertTriangle,
  },
  {
    id: 'theft_burglary',
    title: 'Krađa, provala ili vandalizam',
    description: 'Otuđenje vozila/dijelova, razbijena brava ili namjerno grebanje',
    icon: ShieldAlert,
  },
];

export const IncidentWizardFNOL: React.FC<IncidentWizardFNOLProps> = ({
  onClaimSubmitted,
  className = '',
}) => {
  const { policies, submitNewClaim } = useInsurtechStore();
  const [step, setStep] = useState<number>(1);

  // Form State
  const [incidentDate, setIncidentDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [incidentTime, setIncidentTime] = useState<string>('14:30');
  const [location, setLocation] = useState<string>('Zagreb, Slavonska avenija kod raskrižja s Vukovarskom');
  const [selectedPolicyId, setSelectedPolicyId] = useState<string>(
    policies[0]?.id || ''
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('collision');
  const [description, setDescription] = useState<string>('');
  const [estimatedDamage, setEstimatedDamage] = useState<string>('750');
  const [iban, setIban] = useState<string>('HR1224020061234567890');
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=600&q=80',
  ]);
  const [submittedClaim, setSubmittedClaim] = useState<Claim | null>(null);

  // IBAN validator for Croatian format: HR + 19 digits
  const isIbanValid = iban.trim().replace(/\s/g, '').length === 21;

  const handleUseCurrentLocation = () => {
    setLocation('GPS Koordinate: 45.8150° N, 15.9819° E (Zagreb, Centar)');
  };

  const handleAddSamplePhoto = () => {
    setUploadedPhotos((prev) => [
      ...prev,
      'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=600&q=80',
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created = submitNewClaim({
      policyId: selectedPolicyId,
      incidentDate: `${incidentDate}T${incidentTime}:00Z`,
      location,
      category: selectedCategory,
      description: description || 'Prijavljena šteta u prometu prema priloženim fotografijama i iskazu osiguranika.',
      mediaUrls: uploadedPhotos,
      iban: iban.trim().replace(/\s/g, ''),
      claimAmountRequested: Number(estimatedDamage) || 500,
    });

    setSubmittedClaim(created);
    onClaimSubmitted?.(created);
  };

  return (
    <div className={`max-w-3xl mx-auto ${className}`}>
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>Digitalni FNOL Centar &bull; Prijava Štete 24/7</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Brza elektronička prijava štete
            </h2>
            <p className="text-xs text-slate-500">
              5 jednostavnih koraka za instantno otvaranje spisa i dodjelu procjenitelja
            </p>
          </div>

          {/* Step Pill */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl text-xs font-mono">
            {[1, 2, 3, 4, 5].map((s) => (
              <span
                key={s}
                className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                  step === s
                    ? 'bg-rose-600 text-white shadow-sm'
                    : step > s
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                    : 'text-slate-400'
                }`}
              >
                {step > s ? '✓' : s}
              </span>
            ))}
          </div>
        </div>

        {/* Step Content */}
        {submittedClaim ? (
          <div className="text-center py-10 space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div className="space-y-1.5">
              <span className="text-xs font-mono font-bold text-emerald-600 uppercase">
                Prijava uspješno zaprimljena u sustav
              </span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                Broj spisa: {submittedClaim.claimNumber}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Vaša prijava štete proslijeđena je dežurnom likvidatoru. Procjenitelj će vas kontaktirati unutar radnog dana na broj iz korisničkog profila.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 max-w-sm mx-auto text-xs space-y-1 font-mono text-left">
              <div>Polica: <strong className="text-slate-900 dark:text-white">{submittedClaim.policyId}</strong></div>
              <div>IBAN isplate: <strong className="text-slate-900 dark:text-white">{submittedClaim.iban}</strong></div>
              <div>Datum: <strong className="text-slate-900 dark:text-white">{submittedClaim.incidentDate.split('T')[0]}</strong></div>
            </div>

            <button
              type="button"
              onClick={() => {
                setSubmittedClaim(null);
                setStep(1);
              }}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all"
            >
              Prijavi drugu štetu
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {/* STEP 1: Date, Time & Location */}
              {step === 1 && (
                <motion.div
                  key="fnol-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                      Korak 1 &bull; Vrijeme i mjesto nezgode
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Kada i gdje se dogodio štetni događaj?
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                        Datum nezgode
                      </label>
                      <input
                        type="date"
                        value={incidentDate}
                        onChange={(e) => setIncidentDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                        Približno vrijeme
                      </label>
                      <input
                        type="time"
                        value={incidentTime}
                        onChange={(e) => setIncidentTime(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                        Mjesto / Adresa nezgode
                      </label>
                      <button
                        type="button"
                        onClick={handleUseCurrentLocation}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                      >
                        <MapPin className="w-3.5 h-3.5" /> Učitaj GPS lokaciju
                      </button>
                    </div>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="npr. Zagreb, Avenija Dubrovnik kod broja 15"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
                      required
                    />
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Policy & Asset Selection */}
              {step === 2 && (
                <motion.div
                  key="fnol-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                      Korak 2 &bull; Odabir police osiguranja
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Na koju policu i imovinu prijavljujete štetu?
                    </h3>
                  </div>

                  <div className="space-y-2.5">
                    {policies.map((p) => {
                      const isSelected = selectedPolicyId === p.id;
                      return (
                        <div
                          key={p.id}
                          onClick={() => setSelectedPolicyId(p.id)}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                            isSelected
                              ? 'border-rose-500 bg-rose-50/40 dark:bg-rose-950/20 ring-2 ring-rose-500/20'
                              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                          }`}
                        >
                          <div className="space-y-0.5">
                            <div className="font-bold text-sm text-slate-900 dark:text-white">
                              {p.assetName}
                            </div>
                            <div className="text-xs text-slate-500 font-mono">
                              Polica: {p.policyNumber} &bull; {p.carrier}
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full">
                              Pokriće aktivno
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Damage Categorization */}
              {step === 3 && (
                <motion.div
                  key="fnol-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                      Korak 3 &bull; Kategorija i opis oštećenja
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Odaberite prirodu i vrstu nastale štete
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {DAMAGE_CATEGORIES.map((cat) => {
                      const Icon = cat.icon;
                      const isSelected = selectedCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setSelectedCategory(cat.id)}
                          className={`p-4 rounded-2xl text-left border transition-all flex items-start gap-3 ${
                            isSelected
                              ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/30 ring-2 ring-rose-500/20'
                              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                          }`}
                        >
                          <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/50 text-rose-600 flex items-center justify-center shrink-0">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                              {cat.title}
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              {cat.description}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Kratki opis događaja i oštećenih dijelova
                    </label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Opišite kako je došlo do nezgode (npr. oštećen prednji branik i blatobran s desne strane prilikom izlaska s parkirališta)..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                    />
                  </div>
                </motion.div>
              )}

              {/* STEP 4: Photos & Documents Dropzone */}
              {step === 4 && (
                <motion.div
                  key="fnol-4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                      Korak 4 &bull; Foto-dokumentacija i zapisnik
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Priložite fotografije oštećenja s lica mjesta
                    </h3>
                    <p className="text-xs text-slate-500">
                      Preporučujemo: sliku cijelog vozila, krupni plan oštećenja, registarske pločice i Europsko izvješće ako je ispunjeno.
                    </p>
                  </div>

                  <div
                    onClick={handleAddSamplePhoto}
                    className="border-2 border-dashed border-slate-300 dark:border-slate-700 p-6 rounded-3xl text-center cursor-pointer hover:border-rose-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all space-y-2"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center mx-auto">
                      <Camera className="w-6 h-6" />
                    </div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      Kliknite za dodavanje fotografija ili policijskog zapisnika
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Podržani formati: JPG, PNG, PDF (Maksimalno 25 MB)
                    </div>
                  </div>

                  {/* Thumbnail gallery */}
                  <div className="grid grid-cols-3 gap-2.5">
                    {uploadedPhotos.map((url, i) => (
                      <div key={i} className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 aspect-video">
                        <img src={url} alt={`Dokaz ${i + 1}`} className="w-full h-full object-cover" />
                        <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/60 text-white text-[9px] font-mono">
                          Foto {i + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STEP 5: IBAN & Settlement Entry */}
              {step === 5 && (
                <motion.div
                  key="fnol-5"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                      Korak 5 &bull; Isplata odštete na bankovni račun
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Unesite IBAN račun za izravnu isplatu odštete
                    </h3>
                    <p className="text-xs text-slate-500">
                      Nakon procjene i odobrenja likvidatora, novčana naknada isplaćuje se izravno na vaš tekući ili žiro račun.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        IBAN primatelja (Hrvatski format HR + 19 znamenki)
                      </label>
                      <input
                        type="text"
                        value={iban}
                        onChange={(e) => setIban(e.target.value.toUpperCase())}
                        placeholder="HR1224020061234567890"
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-mono tracking-wider ${
                          isIbanValid
                            ? 'border-emerald-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white'
                            : 'border-rose-400 bg-rose-50/50 text-rose-900'
                        }`}
                        required
                      />
                      <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                        {isIbanValid ? (
                          <span className="text-emerald-600 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> IBAN format je valjan (Hrvatska)
                          </span>
                        ) : (
                          <span className="text-rose-600 font-semibold">
                            Format mora sadržavati točno 21 znak (HR + 19 znamenki)
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Okvirna procjena traženog iznosa (EUR)
                      </label>
                      <input
                        type="number"
                        value={estimatedDamage}
                        onChange={(e) => setEstimatedDamage(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-sm"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" /> Prethodni korak
                </button>
              ) : (
                <div />
              )}

              {step < 5 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md transition-all"
                >
                  <span>Sljedeći korak</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!isIbanValid}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold shadow-md transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Pošalji digitalnu prijavu štete</span>
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
