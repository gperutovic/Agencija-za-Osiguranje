import React, { useState, useMemo } from 'react';
import { Home, Building, ArrowRight, Check, FileCheck2 } from 'lucide-react';
import { formatEuro } from '../../lib/calculations';
import { firestoreService } from '../../api/firestoreService';
import { leadService } from '../../services/firebase';

interface PropertyCalculatorProps {
  className?: string;
  onQuoteRequested?: (data: any) => void;
}

export const PropertyCalculator: React.FC<PropertyCalculatorProps> = ({
  className = '',
  onQuoteRequested,
}) => {
  const [propertyType, setPropertyType] = useState<'stan' | 'kuca'>('stan');
  const [squareMeters, setSquareMeters] = useState<number>(75);
  const [includeEarthquake, setIncludeEarthquake] = useState<boolean>(true);
  const [includeWaterLeak, setIncludeWaterLeak] = useState<boolean>(true);
  const [includeTheft, setIncludeTheft] = useState<boolean>(true);
  const [deductibleEuro, setDeductibleEuro] = useState<0 | 150 | 300>(0);

  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const calculation = useMemo(() => {
    const baseRatePerMeter = propertyType === 'stan' ? 0.42 : 0.58;
    let annual = squareMeters * baseRatePerMeter;

    if (includeEarthquake) {
      annual += squareMeters * 0.35;
    }
    if (includeWaterLeak) {
      annual += 22.0;
    }
    if (includeTheft) {
      annual += 18.0;
    }

    if (deductibleEuro === 150) {
      annual *= 0.88;
    } else if (deductibleEuro === 300) {
      annual *= 0.78;
    }

    const annualTotal = parseFloat(Math.max(48.0, annual).toFixed(2));
    const monthlyInstallment = parseFloat((annualTotal / 12).toFixed(2));

    return {
      annualTotal,
      monthlyInstallment,
      buildingCoverage: squareMeters * 1400,
      contentsCoverage: squareMeters * 350,
    };
  }, [propertyType, squareMeters, includeEarthquake, includeWaterLeak, includeTheft, deductibleEuro]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!fullName.trim() || !phone.trim()) {
      setErrorMsg('Molimo unesite ime i prezime te broj telefona.');
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await firestoreService.createQuote({
        customer: {
          fullName: fullName.trim(),
          email: '',
          phone: phone.trim(),
        },
        type: 'property',
        inputs: {
          propertyType,
          squareMeters,
          includeEarthquake,
          includeWaterLeak,
          includeTheft,
          deductibleEuro,
        },
        calculatedEstimate: {
          annualPremium: calculation.annualTotal,
          monthlyPremium: calculation.monthlyInstallment,
          currency: 'EUR',
          deductible: deductibleEuro,
          coverageLimit: calculation.buildingCoverage + calculation.contentsCoverage,
        },
        status: 'new',
      });

      await leadService.saveLead({
        oib: '',
        name: fullName.trim(),
        fullName: fullName.trim(),
        email: '',
        phone: phone.trim(),
        productType: 'property',
        data: { propertyType, squareMeters, includeEarthquake, deductibleEuro },
        annualPremium: calculation.annualTotal,
        status: 'new',
        notes: `Imovina kalkulator (${propertyType}, ${squareMeters} m²)`,
      });

      setSubmittedRef(created.id);
      if (onQuoteRequested) {
        onQuoteRequested({
          propertyType,
          squareMeters,
          includeEarthquake,
          deductibleEuro,
          calculation,
        });
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Pogreška pri spremanju zahtjeva. Pokušajte ponovo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`w-full bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8 lg:p-10 ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#0F2942]/10 text-[#0F2942] flex items-center justify-center shrink-0">
            <Home className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Kalkulator osiguranja doma, potresa i kućanstva</h3>
            <p className="text-xs text-slate-500">
              Pokriće na novu građevinsku vrijednost • Požar, izljev vode, provala i potres
            </p>
          </div>
        </div>
        <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 self-start sm:self-auto shrink-0">
          Bez podosiguranja na ugovorenu sumu
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        {/* Left Inputs */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <span className="text-sm font-bold text-slate-900 block mb-2.5">Vrsta nekretnine:</span>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPropertyType('stan')}
                className={`py-3 px-4 rounded-lg border text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                  propertyType === 'stan'
                    ? 'border-[#0F2942] bg-[#0F2942] text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Building className="w-4 h-4" />
                <span>Stan u zgradi</span>
              </button>
              <button
                type="button"
                onClick={() => setPropertyType('kuca')}
                className={`py-3 px-4 rounded-lg border text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                  propertyType === 'kuca'
                    ? 'border-[#0F2942] bg-[#0F2942] text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Obiteljska kuća</span>
              </button>
            </div>
          </div>

          {/* Square Meters */}
          <div>
            <div className="flex justify-between items-baseline mb-2">
              <label htmlFor="property-sqm-slider" className="text-sm font-bold text-slate-900">
                Stambena površina objekta:
              </label>
              <div className="flex items-baseline gap-1 tabular-nums">
                <span className="text-2xl font-bold text-[#0F2942]">{squareMeters}</span>
                <span className="text-xs font-semibold text-slate-500">m²</span>
              </div>
            </div>
            <input
              id="property-sqm-slider"
              type="range"
              min={25}
              max={300}
              step={5}
              value={squareMeters}
              onChange={(e) => setSquareMeters(parseInt(e.target.value, 10))}
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0F2942]"
              aria-label="Odaberite kvadraturu u metrima kvadratnim"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1.5 tabular-nums">
              <span>Manji stan (40 m²)</span>
              <span>Obiteljski (80 m²)</span>
              <span>Kuća (150+ m²)</span>
            </div>
          </div>

          {/* Coverage Options */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 block">
              Odabir dodatnih rizika
            </span>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={includeEarthquake}
                onChange={(e) => setIncludeEarthquake(e.target.checked)}
                className="mt-1 w-4 h-4 rounded accent-[#0F2942]"
              />
              <div className="flex-1">
                <span className="text-sm font-semibold text-slate-900">
                  Dopunsko pokriće od potresa
                </span>
                <p className="text-xs text-slate-600 mt-0.5">
                  Pokriće građevinskog dijela i stvari kućanstva od posljedica potresa prema ugovorenoj svoti.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={includeWaterLeak}
                onChange={(e) => setIncludeWaterLeak(e.target.checked)}
                className="mt-1 w-4 h-4 rounded accent-[#0F2942]"
              />
              <div className="flex-1">
                <span className="text-sm font-semibold text-slate-900">
                  Izljev vode iz vodovodnih i odvodnih cijevi
                </span>
                <p className="text-xs text-slate-600 mt-0.5">
                  Uključuje troškove pronalaženja kvara i sanacije oštećenih zidova te podnih obloga.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={includeTheft}
                onChange={(e) => setIncludeTheft(e.target.checked)}
                className="mt-1 w-4 h-4 rounded accent-[#0F2942]"
              />
              <div className="flex-1">
                <span className="text-sm font-semibold text-slate-900">
                  Provalna krađa i razbojništvo
                </span>
                <p className="text-xs text-slate-600 mt-0.5">
                  Zaštita kućanskih stvari i oštećenja na stolariji uslijed pokušaja provale.
                </p>
              </div>
            </label>
          </div>

          {/* Deductible Selection */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2">
              Franšiza (učešće u šteti):
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { val: 0, label: '0 € (Bez franšize)' },
                { val: 150, label: '150 € (-12%)' },
                { val: 300, label: '300 € (-22%)' },
              ].map((f) => (
                <button
                  key={f.val}
                  type="button"
                  onClick={() => setDeductibleEuro(f.val as 0 | 150 | 300)}
                  className={`py-2 px-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                    deductibleEuro === f.val
                      ? 'bg-[#0F2942] text-white border-[#0F2942]'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Summary */}
        <div className="lg:col-span-5 bg-slate-50 rounded-xl border border-slate-200 p-6 flex flex-col justify-between space-y-6">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">
              Specifikacija pokrića i premije
            </span>

            <div className="mt-3 p-5 rounded-xl bg-white border border-slate-200 shadow-sm text-left">
              <span className="text-xs text-slate-500 block">Ukupna godišnja premija</span>
              <div className="mt-1.5 flex items-baseline gap-1.5 tabular-nums">
                <span className="text-3xl sm:text-4xl font-bold text-[#0F2942] tracking-tight">
                  {formatEuro(calculation.annualTotal)}
                </span>
                <span className="text-xs font-medium text-slate-500">/ god.</span>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 tabular-nums">
                <span>Obročno na 12 rata:</span>
                <strong className="text-sm font-bold text-slate-900">
                  {formatEuro(calculation.monthlyInstallment)} / mj.
                </strong>
              </div>
            </div>

            <div className="mt-5 space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-200">
                <span className="text-slate-600">Osigurana svota građevinskog dijela:</span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  {formatEuro(calculation.buildingCoverage)}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200">
                <span className="text-slate-600">Osigurana svota stvari kućanstva:</span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  {formatEuro(calculation.contentsCoverage)}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium pt-1">
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>Osnovni paket: požar, udar groma, oluja i tuča uključeni</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            {!submittedRef ? (
              <form onSubmit={handleSubmit} className="space-y-3">
                {errorMsg && (
                  <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800">
                    {errorMsg}
                  </div>
                )}
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ime i prezime"
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-[#0F2942] focus:ring-2 focus:ring-[#0F2942]/10"
                />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Broj mobitela (091 234 5678)"
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-[#0F2942] focus:ring-2 focus:ring-[#0F2942]/10 tabular-nums"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-lg bg-[#0F2942] hover:bg-[#163859] text-white font-semibold text-sm shadow-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <span>{isSubmitting ? 'Slanje zahtjeva...' : 'Zatražite službenu ponudu'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2 text-emerald-900">
                <FileCheck2 className="w-8 h-8 text-emerald-700 mx-auto" />
                <p className="text-sm font-bold">Zahtjev je zaprimljen</p>
                <p className="text-xs">
                  Referenca: <strong className="tabular-nums">{submittedRef}</strong>. Pripremamo usporednu ponudu s IPID dokumentom za vaš objekt.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCalculator;
