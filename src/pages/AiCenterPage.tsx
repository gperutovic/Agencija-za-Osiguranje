import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Bot,
  Shield,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Scale,
  Copy,
  Check,
  FileText,
  Sliders,
} from 'lucide-react';
import { useInsurtechStore } from '../store/useInsurtechStore';
import { formatEUR } from '../utils/validators';

interface ShieldDimension {
  id: string;
  label: string;
  shortLabel: string;
  score: number; // 0 to 100
  recommendedRider: string;
  gapWarning: string;
}

export const AiCenterPage: React.FC = () => {
  const navigate = useNavigate();
  const { setPrefilledQuoteTransfer } = useInsurtechStore();

  // 1. Interactive Coverage Shield (Štit pokrića) — 6 Dimensions
  const [dimensions, setDimensions] = useState<ShieldDimension[]>([
    {
      id: 'auto',
      label: '1. Vozila (AO, Kasko & Hybrid)',
      shortLabel: 'Vozila',
      score: 90,
      recommendedRider: 'Toyota Osiguranje — Zaštita visokonaponske baterije + Lom stakla bez franšize',
      gapWarning: 'Preporučujemo dodati zaštitu bonusa 50% i zamjensko vozilo.',
    },
    {
      id: 'property',
      label: '2. Imovina (Dom & Potres)',
      shortLabel: 'Imovina',
      score: 55,
      recommendedRider: 'Rizik potresa i poplave na novu građevinsku vrijednost (Zagreb / RH)',
      gapWarning: 'Kritičan jaz: Osnovna polica imovine ne pokriva potres bez dopunskog paketa!',
    },
    {
      id: 'life',
      label: '3. Životno & Životni kasko',
      shortLabel: 'Život',
      score: 65,
      recommendedRider: 'Generali Životni Kasko + Pokriće za 25 teških bolesti (50.000 €)',
      gapWarning: 'Preporučena osigurana svota u visini 3 godišnja prihoda kućanstva.',
    },
    {
      id: 'health',
      label: '4. Dobrovoljno & Dopunsko Zdravlje',
      shortLabel: 'Zdravlje',
      score: 45,
      recommendedRider: 'Specijalistički pregledi bez čekanja (do 3.000 €) + B-lista lijekova',
      gapWarning: 'Nedostaje pokriće privatnih poliklinika i dijagnostike (MR/CT/UZV) bez uputnice.',
    },
    {
      id: 'travel',
      label: '5. Putna & EU Asistencija',
      shortLabel: 'Putovanja',
      score: 80,
      recommendedRider: 'Godišnje Multitrip putno zdravstveno + Otkaz putovanja',
      gapWarning: 'Europska kartica (EKZO) ne pokriva privatne klinike niti medicinski prijevoz u RH.',
    },
    {
      id: 'liability',
      label: '6. Odgovornost & Pravna zaštita',
      shortLabel: 'Odgovornost',
      score: 60,
      recommendedRider: 'Privatna i poslovna odgovornost prema trećima (do 50.000 €)',
      gapWarning: 'Preporučujemo uključiti odgovornost vlasnika nekretnine za izljeve vode prema susjedima.',
    },
  ]);

  // 2. AI Quote Franchise & Limit Assistant State
  const [annualKm, setAnnualKm] = useState<string>('15.000 - 25.000 km');
  const [parkingType, setParkingType] = useState<string>('Javni ulični parking u gradu');
  const [assetValEur, setAssetValEur] = useState<number>(34000);

  // 3. AI FNOL Accident Description Drafter State
  const [fnolIncidentType, setFnolIncidentType] = useState<string>('Oštećenje vjetrobranskog stakla na autocesti');
  const [fnolWeather, setFnolWeather] = useState<string>('Suho i pregledno, dnevna svjetlost');
  const [fnolSpeed, setFnolSpeed] = useState<string>('oko 110 km/h u desnoj voznoj traci');
  const [fnolRepairPref, setFnolRepairPref] = useState<string>('Ovlašteni servis Toyota Centar Zagreb (OEM dijelovi)');
  const [copiedFnol, setCopiedFnol] = useState<boolean>(false);

  const handleScoreChange = (id: string, newScore: number) => {
    setDimensions((prev) =>
      prev.map((d) => (d.id === id ? { ...d, score: newScore } : d))
    );
  };

  const overallShieldScore = Math.round(
    dimensions.reduce((acc, d) => acc + d.score, 0) / dimensions.length
  );

  // Compute SVG Radar Polygon points (center 150,150, radius 105)
  const radarCenter = 150;
  const maxRadius = 105;
  const getPoint = (index: number, pct: number) => {
    const angle = (Math.PI * 2 * index) / 6 - Math.PI / 2;
    const r = (pct / 100) * maxRadius;
    const x = radarCenter + r * Math.cos(angle);
    const y = radarCenter + r * Math.sin(angle);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  };

  const userPolygonPoints = dimensions.map((d, i) => getPoint(i, d.score)).join(' ');

  // AI Franchise Recommendation Logic
  const getAiFranchiseRecommendation = () => {
    if (parkingType.includes('Javni') || assetValEur >= 30000) {
      return {
        franchiseEur: 0,
        title: 'AI Preporuka: Puni Kasko s 0,00 € franšize + Lom stakla',
        rationale:
          'Zbog parkiranja na javnim gradskim površinama i vrijednosti vozila od ' +
          formatEUR(assetValEur) +
          ', statistička vjerojatnost manjih parking oštećenja iznosi 28% godišnje. Paket bez franšize (0 €) isplaćuje štetu u cijelosti od prvog eura u Toyota Centru Zagreb.',
        estimatedAnnualEur: Math.round((assetValEur * 0.019 + 140) * 100) / 100,
      };
    }
    return {
      franchiseEur: 150,
      title: 'AI Preporuka: Paket Komfort s 150,00 € franšize (-12% premije)',
      rationale:
        'Uz osigurano garažno mjesto i umjerenu kilometražu (' +
        annualKm +
        '), franšiza od 150 € donosi optimalnu uštedu od 12% na godišnjoj premiji uz punu zaštitu od velikih šteta i tuče.',
      estimatedAnnualEur: Math.round((assetValEur * 0.0155 + 115) * 100) / 100,
    };
  };

  const aiQuoteRec = getAiFranchiseRecommendation();

  // Generated Structured FNOL Description
  const generatedFnolText = `Dana ${new Date().toLocaleDateString('hr-HR')} tijekom vožnje (${fnolSpeed}, uvjeti na cesti: ${fnolWeather}) dogodio se štetni događaj: ${fnolIncidentType}. Na vozilu su nastala vidljiva mehanička oštećenja koja zahtijevaju stručni izvid procjenitelja i zamjenu oštećenih dijelova. Vozilo je fotografirano odmah po nastanku događaja. Sukladno ugovorenoj polici osiguranja, tražim izvid štete i izdavanje naloga za popravak u: ${fnolRepairPref}.`;

  const handleCopyFnol = () => {
    navigator.clipboard.writeText(generatedFnolText);
    setCopiedFnol(true);
    setTimeout(() => setCopiedFnol(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* 1. AI Dashboard Header & HANFA Guardrails */}
        <div className="bg-[#0F172A] text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-elevated space-y-6 text-left">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C21817] text-white font-mono text-xs font-bold">
                <Bot className="w-3.5 h-3.5" />
                <span>AI CENTAR &bull; AI AGENTI &amp; ŠTIT POKRIĆA</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Pametni AI alati za klijente i licencirane zastupnike
              </h1>
              <p className="text-sm text-slate-300 max-w-3xl">
                Iskoristite interaktivni <strong>Štit pokrića</strong> za analizu nepokrivenih rizika, AI savjetnik za izbor optimalne franšize te strukturirani generator opisa nezgode (FNOL).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#1E293B] border border-slate-700 max-w-xs space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5 text-[#F87171] font-mono font-bold">
                <Scale className="w-4 h-4" />
                <span>HANFA &amp; EU AI ACT ZAŠTITA</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                AI alati služe isključivo kao analitička potpora. Konačnu ponudu i obradu štete uvijek verificira licencirani zastupnik (Diana, Hrvoje, Laura).
              </p>
            </div>
          </div>
        </div>

        {/* 2. INTERACTIVE COVERAGE SHIELD (Štit pokrića) */}
        <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-card p-6 sm:p-8 space-y-6 text-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-mono font-bold uppercase text-[#C21817]">
                INTERAKTIVNI DIJAGRAM ZAŠTITE U 6 DIMENZIJA
              </span>
              <h2 className="text-2xl font-extrabold text-[#0F172A]">
                Štit pokrića (Coverage Shield) — Indeks sigurnosti: {overallShieldScore}/100
              </h2>
            </div>
            <span
              className={`px-3.5 py-1.5 rounded-full font-mono text-xs font-bold ${
                overallShieldScore >= 75
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-[#FEF2F2] text-[#C21817] border border-[#FECACA]'
              }`}
            >
              {overallShieldScore >= 75 ? 'VISOKA RAZINE ZAŠTITE' : 'DETEKTIRANI JAZOVI U POKRIĆU'}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Radar / Shield Diagram */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center bg-[#F8FAFC] rounded-3xl border border-[#E2E8F0] p-6">
              <svg viewBox="0 0 300 300" className="w-full max-w-[300px] h-auto">
                {/* Concentric hexagonal rings */}
                {[25, 50, 75, 100].map((level) => (
                  <polygon
                    key={level}
                    points={[0, 1, 2, 3, 4, 5].map((i) => getPoint(i, level)).join(' ')}
                    fill="none"
                    stroke="#CBD5E1"
                    strokeWidth="1"
                    strokeDasharray={level === 100 ? 'none' : '3 3'}
                  />
                ))}

                {/* Axes */}
                {[0, 1, 2, 3, 4, 5].map((i) => {
                  const end = getPoint(i, 100).split(',');
                  const labelPt = getPoint(i, 122).split(',');
                  return (
                    <g key={i}>
                      <line
                        x1={radarCenter}
                        y1={radarCenter}
                        x2={end[0]}
                        y2={end[1]}
                        stroke="#E2E8F0"
                        strokeWidth="1.5"
                      />
                      <text
                        x={labelPt[0]}
                        y={labelPt[1]}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="fill-[#0F172A] font-mono text-[10px] font-bold"
                      >
                        {dimensions[i].shortLabel} ({dimensions[i].score}%)
                      </text>
                    </g>
                  );
                })}

                {/* Active Coverage Polygon */}
                <polygon
                  points={userPolygonPoints}
                  fill="rgba(194, 24, 23, 0.22)"
                  stroke="#C21817"
                  strokeWidth="2.5"
                />
              </svg>

              <div className="text-center mt-2">
                <div className="text-xs font-mono text-slate-500">Ukupni rezultat Štita pokrića:</div>
                <div className="text-2xl font-black font-mono text-[#C21817] tabular-nums">
                  {overallShieldScore} / 100 bodova
                </div>
              </div>
            </div>

            {/* Sliders & Gap Recommendations */}
            <div className="lg:col-span-7 space-y-4">
              {dimensions.map((dim) => {
                const isGap = dim.score < 65;
                return (
                  <div
                    key={dim.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isGap ? 'bg-[#FEF2F2] border-[#FECACA]' : 'bg-[#F8FAFC] border-[#E2E8F0]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-xs font-extrabold text-[#0F172A]">{dim.label}</span>
                      <span
                        className={`font-mono text-xs font-bold tabular-nums ${
                          isGap ? 'text-[#C21817]' : 'text-emerald-700'
                        }`}
                      >
                        {dim.score}% pokriveno
                      </span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={100}
                      step={5}
                      value={dim.score}
                      onChange={(e) => handleScoreChange(dim.id, Number(e.target.value))}
                      className="w-full accent-[#C21817] cursor-pointer"
                    />
                    <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                      <span className={isGap ? 'text-[#C21817] font-semibold' : 'text-slate-600'}>
                        {isGap ? `⚠ ${dim.gapWarning}` : `✓ Preporučeni dodatak: ${dim.recommendedRider}`}
                      </span>
                      {isGap && (
                        <button
                          type="button"
                          onClick={() => {
                            setPrefilledQuoteTransfer({
                              productType: (dim.id === 'liability' ? 'business' : dim.id) as any,
                              tierName: dim.recommendedRider,
                              estimatedAnnualEur: 265,
                              deductibleEur: 0,
                              coverageLimitEur: 50000,
                              riders: [dim.recommendedRider],
                            });
                            navigate('/zatrazi-ponudu');
                          }}
                          className="shrink-0 px-3 py-1 rounded-lg bg-[#C21817] text-white font-bold text-[11px] cursor-pointer"
                        >
                          Popuni jaz u ponudi &rarr;
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3. AI QUOTE & FNOL ASSISTANTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
          {/* AI Quote & Franchise Assistant */}
          <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-card p-6 sm:p-8 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[#C21817] font-mono text-xs font-bold uppercase">
                <Sliders className="w-4 h-4" />
                <span>AI Savjetnik za franšizu i limite</span>
              </div>
              <h3 className="text-xl font-extrabold text-[#0F172A]">
                Odredite optimalnu franšizu prema profilu vožnje i parkiranja
              </h3>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Godišnja kilometraža vozila</label>
                  <select
                    value={annualKm}
                    onChange={(e) => setAnnualKm(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-xs font-semibold bg-white"
                  >
                    <option value="Do 10.000 km">Do 10.000 km (Gradska vožnja)</option>
                    <option value="15.000 - 25.000 km">15.000 - 25.000 km (Kombinirana vožnja)</option>
                    <option value="Preko 30.000 km">Preko 30.000 km (Intenzivna autocesta / Flota)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Način parkiranja preko noći</label>
                  <select
                    value={parkingType}
                    onChange={(e) => setParkingType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-xs font-semibold bg-white"
                  >
                    <option value="Javni ulični parking u gradu">Javni ulični parking u gradu</option>
                    <option value="Privatna garaža ili ograđeno dvorište">Privatna garaža ili ograđeno dvorište</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>Vrijednost vozila:</span>
                    <span className="font-mono text-[#C21817] tabular-nums">{formatEUR(assetValEur)}</span>
                  </div>
                  <input
                    type="range"
                    min={10000}
                    max={80000}
                    step={2000}
                    value={assetValEur}
                    onChange={(e) => setAssetValEur(Number(e.target.value))}
                    className="w-full accent-[#C21817] cursor-pointer"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FEF2F2] border border-[#FECACA] space-y-2">
                <div className="text-xs font-extrabold text-[#C21817]">{aiQuoteRec.title}</div>
                <p className="text-xs text-slate-700 leading-relaxed">{aiQuoteRec.rationale}</p>
                <div className="text-xs font-mono font-bold text-[#0F172A] pt-1 tabular-nums">
                  Okvirna godišnja premija: {formatEUR(aiQuoteRec.estimatedAnnualEur)}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setPrefilledQuoteTransfer({
                  productType: 'kasko',
                  tierName: aiQuoteRec.title,
                  estimatedAnnualEur: aiQuoteRec.estimatedAnnualEur,
                  deductibleEur: aiQuoteRec.franchiseEur,
                  coverageLimitEur: assetValEur,
                  riders: ['AI Preporučeni Kasko paket', 'Zaštita bonusa 50%', 'Lom stakla'],
                });
                navigate('/zatrazi-ponudu');
              }}
              className="w-full mt-4 py-3.5 px-4 rounded-xl bg-[#C21817] hover:bg-[#991B1B] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Primijeni AI preporuku u Zatraži ponudu</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* AI FNOL Accident Description Drafter */}
          <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-card p-6 sm:p-8 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[#0F172A] font-mono text-xs font-bold uppercase">
                <FileText className="w-4 h-4 text-[#C21817]" />
                <span>AI Asistent za sastavljanje FNOL prijave štete</span>
              </div>
              <h3 className="text-xl font-extrabold text-[#0F172A]">
                Strukturirani generator opisa nezgode za brzu likvidaciju
              </h3>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Vrsta štetnog događaja</label>
                  <select
                    value={fnolIncidentType}
                    onChange={(e) => setFnolIncidentType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-xs font-semibold bg-white"
                  >
                    <option value="Oštećenje vjetrobranskog stakla na autocesti">
                      Oštećenje vjetrobranskog stakla udarom kamena
                    </option>
                    <option value="Oštećenje parkiranog vozila od strane nepoznatog vozila">
                      Oštećenje na parkingu (nepoznati počinitelj)
                    </option>
                    <option value="Sudar pri prestrojavanju s potpisanim Europskim izvješćem">
                      Sudar u prometu (potpisano Europsko izvješće)
                    </option>
                    <option value="Izljev vode iz cijevi u kupaonici i oštećenje parketa">
                      Izljev vode u stanu i oštećenje podova
                    </option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Vremenski uvjeti</label>
                    <input
                      type="text"
                      value={fnolWeather}
                      onChange={(e) => setFnolWeather(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Preferirani servis / isplata</label>
                    <input
                      type="text"
                      value={fnolRepairPref}
                      onChange={(e) => setFnolRepairPref(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase font-bold text-slate-500">
                    Generirani pravno-tehnički opis za FNOL obrazac:
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyFnol}
                    className="inline-flex items-center gap-1 text-xs font-mono font-bold text-[#C21817] cursor-pointer"
                  >
                    {copiedFnol ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedFnol ? 'Kopirano!' : 'Kopiraj tekst'}</span>
                  </button>
                </div>
                <p className="text-xs text-[#0F172A] leading-relaxed font-medium">{generatedFnolText}</p>
              </div>
            </div>

            <Link
              to="/prijava-stete"
              state={{
                prefilledFnolDescription: generatedFnolText,
                fnolIncidentType,
              }}
              className="w-full mt-4 py-3.5 px-4 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2"
            >
              <span>Nastavi u Prijava šteta (FNOL centar)</span>
              <ArrowRight className="w-4 h-4 text-[#F87171]" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiCenterPage;
