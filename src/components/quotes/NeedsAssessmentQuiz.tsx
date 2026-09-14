import React, { useState } from 'react';
import { 
  CheckCircle2, 
  HelpCircle, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  Car, 
  Home, 
  Briefcase, 
  Users, 
  HeartHandshake,
  FileText
} from 'lucide-react';
import { OibInput } from '../ui/OibInput';
import { Tooltip } from '../ui/Tooltip';
import { needsAssessmentService } from '../../services/firebase';

interface PersonaProfile {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
  recommended: Array<{ name: string; why: string }>;
}

const PERSONAS: PersonaProfile[] = [
  {
    id: 'family_credit',
    title: 'Mlada obitelj sa stambenim kreditom',
    icon: Users,
    description: 'Zaštita otplate kredita u korist banke, osiguranje stana od potresa i dopunsko za djecu.',
    recommended: [
      { name: 'Riziko životno osiguranje za kredit', why: 'Zadovoljava uvjete banke i štiti obitelj od nasljeđivanja duga.' },
      { name: 'Osiguranje stana i potres', why: 'Zaštita nekretnine i stvari uz vinkulaciju u korist banke.' },
      { name: 'Dopunsko i obiteljsko zdravstveno', why: 'Ušteda na participacijama i pedijatrijskim pregledima.' },
    ],
  },
  {
    id: 'car_owner',
    title: 'Vlasnik osobnog ili obiteljskog vozila',
    icon: Car,
    description: 'Maksimalna zaštita na cesti, ušteda na registraciji i prenošenje bonusa.',
    recommended: [
      { name: 'Obvezno AO s 50% bonusa', why: 'Povoljna registracija uz jamstvo nepromijenjene cijene.' },
      { name: 'Pomoć na cesti 24/7 (RH i Europa)', why: 'Besplatna vuča i zamjensko vozilo u slučaju kvara na putu.' },
      { name: 'Zaštita stakala bez franšize', why: 'Zamjena vjetrobranskog stakla bez gubitka bonusa.' },
    ],
  },
  {
    id: 'it_freelance',
    title: 'IT paušalist / Poduzetnik / Obrtnik',
    icon: Briefcase,
    description: 'Profesionalna odgovornost prema klijentima, cyber rizik i privatno zdravstvo.',
    recommended: [
      { name: 'Osiguranje od profesionalne odgovornosti', why: 'Uvjet za suradnju sa stranim klijentima (EU i SAD).' },
      { name: 'Dodatno zdravstveno & MR/CT dijagnostika', why: 'Pregledi bez čekanja u privatnim poliklinikama.' },
      { name: 'Osiguranje informatičke opreme i ureda', why: 'Zaštita prijenosnih računala i uredskih prostora.' },
    ],
  },
  {
    id: 'landlord',
    title: 'Iznajmljivač nekretnina (Turizam / Najam)',
    icon: Home,
    description: 'Odgovornost prema gostima i najmoprimcima, osiguranje od izljeva vode i nepogoda.',
    recommended: [
      { name: 'Odgovornost iznajmljivača prema gostima', why: 'Zaštita od ozljeda gostiju u apartmanu ili kući za odmor.' },
      { name: 'Izljev vode i provalna krađa', why: 'Najčešće štete u turističkom i dugoročnom najmu.' },
      { name: 'Osiguranje od potresa i požara', why: 'Sigurnost kapitalne investicije.' },
    ],
  },
];

export const NeedsAssessmentQuiz: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedPersonaId, setSelectedPersonaId] = useState('family_credit');

  // Question 2: Primary Financial Concern
  const [primaryConcern, setPrimaryConcern] = useState('Zaštita obitelji i otplate kredita');

  // Question 3: Budget & Timeline
  const [budgetTier, setBudgetTier] = useState('20 - 50 € mjesečno');

  // Contact for IDD Report
  const [clientEmail, setClientEmail] = useState('ivan.horvat@email.hr');
  const [clientOib, setClientOib] = useState('26182105153');
  const [isOibValid, setIsOibValid] = useState(true);

  const [isSaved, setIsSaved] = useState(false);
  const selectedPersona = PERSONAS.find((p) => p.id === selectedPersonaId) || PERSONAS[0];

  const handleFinishQuiz = async () => {
    try {
      await needsAssessmentService.saveAssessment({
        clientOib,
        clientEmail,
        riskProfile: selectedPersonaId === 'it_freelance' ? 'comprehensive' : 'balanced',
        answers: {
          persona: selectedPersona.title,
          primaryConcern,
          budgetTier,
        },
        recommendedProducts: selectedPersona.recommended.map((r) => r.name),
      });
      setIsSaved(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl text-slate-100">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-5 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-blue-400 font-bold">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>IDD Analiza potreba i zahtjeva (45 sekundi)</span>
          </div>
          <span className="text-xs text-slate-400">Korak {step} od 3</span>
        </div>
        <h3 className="text-2xl font-black text-white mt-1">
          Pronađite idealno osiguranje za vašu životnu situaciju
        </h3>
        <p className="text-xs text-slate-400">
          U skladu sa Zakonom o osiguranju RH i HANFA direktivom o distribuciji osiguranja (IDD).
        </p>
      </div>

      {/* Step 1: Persona Selection */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h4 className="text-base font-bold text-white">Koja opcija najbolje opisuje vaš trenutni status?</h4>
            <p className="text-xs text-slate-400">Odaberite profil za personalizirani izračun.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PERSONAS.map((p) => {
              const Icon = p.icon;
              const isSelected = selectedPersonaId === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPersonaId(p.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
                    isSelected
                      ? 'bg-blue-600/15 border-blue-500 ring-2 ring-blue-500/20 shadow-xl'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-blue-400" />}
                  </div>
                  <h5 className="font-bold text-sm text-white">{p.title}</h5>
                  <p className="text-xs text-slate-400 leading-relaxed">{p.description}</p>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition-all cursor-pointer"
            >
              <span>Nastavi na analizu prioriteta</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Prioriteti i Proračun */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Što vam je u ovom trenutku najvažnije osigurati?</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  'Sigurnost obitelji i redovita otplata kredita',
                  'Zaštita nekretnine od potresa, požara i puknuća cijevi',
                  'Vozilo od prometne nezgode i krađe (Kasko)',
                  'Zdravlje bez čekanja i besplatna participacija',
                ].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setPrimaryConcern(c)}
                    className={`p-3 rounded-xl text-left text-xs font-semibold border transition-all ${
                      primaryConcern === c
                        ? 'bg-blue-600/20 border-blue-500 text-blue-200'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Okvirni mjesečni proračun za policu:</label>
              <div className="grid grid-cols-3 gap-2">
                {['Do 20 € mjesečno', '20 - 50 € mjesečno', '50+ € mjesečno'].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBudgetTier(b)}
                    className={`p-3 rounded-xl text-center text-xs font-semibold border transition-all ${
                      budgetTier === b
                        ? 'bg-blue-600/20 border-blue-500 text-blue-200'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Natrag</span>
            </button>

            <button
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition-all cursor-pointer"
            >
              <span>Pregled preporučenog paketa</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Rezultat i Preporuka */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[11px] font-mono uppercase text-emerald-400 font-bold">
                  Personalizirani plan pokrića
                </span>
                <h4 className="text-lg font-black text-white mt-0.5">{selectedPersona.title}</h4>
              </div>
              <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono font-bold">
                Proračun: {budgetTier}
              </span>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Stručne preporuke Agencije Život:
              </span>
              <div className="grid grid-cols-1 gap-2.5">
                {selectedPersona.recommended.map((r, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-xs text-white">{r.name}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{r.why}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Save & Contact Form */}
          {isSaved ? (
            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <h4 className="text-sm font-bold text-white">Vaša IDD Analiza je uspješno spremljena!</h4>
              <p className="text-xs text-slate-300">
                Puni izvještaj s ponudama poslan je na vašu email adresu <span className="text-white font-medium">{clientEmail}</span>.
              </p>
            </div>
          ) : (
            <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Pošaljite mi ovaj IDD izvještaj i ponude na email:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400">Vaš email</label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>

                <OibInput
                  value={clientOib}
                  onChange={(val, valid) => {
                    setClientOib(val);
                    setIsOibValid(valid);
                  }}
                  label="OIB za provjeru popusta"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleFinishQuiz}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-all cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Spremi analizu i zatraži ponude</span>
                </button>
              </div>
            </div>
          )}

          <div className="flex justify-start">
            <button
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Natrag na pitanja</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

