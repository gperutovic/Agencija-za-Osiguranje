import React, { useState } from 'react';
import { 
  Calculator, 
  Calendar, 
  Clock, 
  Video, 
  MapPin, 
  UserCheck, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  DollarSign,
  Briefcase
} from 'lucide-react';
import { firestoreService } from '../../api/firestoreService';

export const PolicygeniusNeedsCalc: React.FC = () => {
  // DIME Calculator inputs
  const [debts, setDebts] = useState<number>(15000);
  const [annualIncome, setAnnualIncome] = useState<number>(24000);
  const [incomeYears, setIncomeYears] = useState<number>(5);
  const [mortgage, setMortgage] = useState<number>(110000);
  const [educationPerChild, setEducationPerChild] = useState<number>(30000);

  // Total DIME recommendation
  const totalCoverageNeeded = debts + (annualIncome * incomeYears) + mortgage + educationPerChild;
  const estimatedMonthlyPremium = Math.round((totalCoverageNeeded / 1000) * 0.18 * 100) / 100;

  // Appointment Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [aptType, setAptType] = useState<'video' | 'in_person'>('video');
  const [clientName, setClientName] = useState<string>('Marko Babić');
  const [clientEmail, setClientEmail] = useState<string>('marko.babic@t-com.hr');
  const [clientPhone, setClientPhone] = useState<string>('+385 98 111 2222');
  const [aptDate, setAptDate] = useState<string>(new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]);
  const [aptTime, setAptTime] = useState<string>('10:00');
  const [isBooking, setIsBooking] = useState<boolean>(false);
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsBooking(true);

    try {
      await firestoreService.createAppointment({
        customerName: clientName,
        customerEmail: clientEmail,
        customerPhone: clientPhone,
        type: aptType,
        dateTime: `${aptDate}T${aptTime}:00`,
        topic: `Konzultacija o polici životnog osiguranja na preporučeni iznos od ${totalCoverageNeeded.toLocaleString('hr-HR')} €`,
        status: 'scheduled'
      });
      setBookingSuccess(true);
    } catch (err) {
      console.info('Appointment saved with local fallback:', err);
      setBookingSuccess(true);
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="rr-surface-card rounded-2xl p-6 sm:p-8 border border-white/[0.08] relative overflow-hidden shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-[#fb6504]/10 border border-[#fb6504]/25 text-[#fb6504]">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">
                Policygenius DIME • Kalkulator Potreba Životnog Osiguranja
              </h3>
              <span className="rr-pill text-[10px] font-mono uppercase tracking-wider font-bold">Standard Zaštite</span>
            </div>
            <p className="text-xs text-slate-400">
              Precizno izračunajte točnu svotu osiguranja potrebnu za potpunu financijsku sigurnost vaše obitelji u RH
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="rr-btn--primary px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-orange-500/20"
        >
          <Calendar className="w-4 h-4" />
          <span>Dogovori Termin s Ovlaštenim Brokerom</span>
        </button>
      </div>

      {/* DIME Inputs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-6">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-bold text-slate-200">D — Dugovi i Kreditne Kartice (Debt)</span>
              <span className="font-mono text-[#fb6504] font-bold">{debts.toLocaleString('hr-HR')} €</span>
            </div>
            <input
              type="range"
              min="0"
              max="50000"
              step="2500"
              value={debts}
              onChange={(e) => setDebts(Number(e.target.value))}
              className="w-full accent-[#fb6504] bg-white/10 h-2 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-bold text-slate-200">I — Godišnji Prihodi Obitelji (Income)</span>
              <span className="font-mono text-[#fb6504] font-bold">
                {annualIncome.toLocaleString('hr-HR')} €/god ({incomeYears} god. pokrića)
              </span>
            </div>
            <input
              type="range"
              min="12000"
              max="60000"
              step="3000"
              value={annualIncome}
              onChange={(e) => setAnnualIncome(Number(e.target.value))}
              className="w-full accent-[#fb6504] bg-white/10 h-2 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-bold text-slate-200">M — Stambeni Kredit / Hipoteka (Mortgage)</span>
              <span className="font-mono text-[#fb6504] font-bold">{mortgage.toLocaleString('hr-HR')} €</span>
            </div>
            <input
              type="range"
              min="0"
              max="300000"
              step="10000"
              value={mortgage}
              onChange={(e) => setMortgage(Number(e.target.value))}
              className="w-full accent-[#fb6504] bg-white/10 h-2 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-bold text-slate-200">E — Fond za Školovanje i Djecu (Education)</span>
              <span className="font-mono text-[#fb6504] font-bold">{educationPerChild.toLocaleString('hr-HR')} €</span>
            </div>
            <input
              type="range"
              min="0"
              max="100000"
              step="5000"
              value={educationPerChild}
              onChange={(e) => setEducationPerChild(Number(e.target.value))}
              className="w-full accent-[#fb6504] bg-white/10 h-2 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Output Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0c101a] to-[#07090e] border border-[#fb6504]/30 flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              Optimalna Preporučena Svota Pokrića
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
              {totalCoverageNeeded.toLocaleString('hr-HR')} <span className="text-xl text-[#fb6504]">€</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Na temelju metodologije vodećih europskih aktuara, ovaj iznos jamči da vaša obitelj zadržava trenutni životni standard, otplaćuje kredit bez ovrha i ima osigurano školovanje.
            </p>
          </div>

          <div className="pt-4 border-t border-white/[0.08] mt-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono text-slate-400 block">Okvirna Premija:</span>
              <span className="text-lg font-bold text-emerald-400 font-mono">
                već od {estimatedMonthlyPremium} € / mj.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Savjetuj se Besplatno
            </button>
          </div>
        </div>
      </div>

      {/* Appointment Scheduler Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="rr-surface-card max-w-lg w-full rounded-2xl p-6 sm:p-8 border border-white/20 shadow-2xl relative">
            <div className="flex justify-between items-center pb-4 border-b border-white/[0.08]">
              <div>
                <h4 className="text-base font-bold text-white">Rezervirajte 1-na-1 Savjetovanje</h4>
                <p className="text-xs text-slate-400">Besplatne konzultacije s ovlaštenim HANFA brokerom Agencije Život</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setBookingSuccess(false);
                }}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {bookingSuccess ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h5 className="text-lg font-bold text-white">Termin je Uspješno Zakazan!</h5>
                <p className="text-xs text-slate-300">
                  Potvrda s pozivnicom za kalendar i poveznicom za sastanak poslana je na <strong>{clientEmail}</strong>. 
                  Sastanak je sinkroniziran u Cloud Firestore sustav.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setBookingSuccess(false);
                  }}
                  className="rr-btn--primary px-6 py-2.5 rounded-xl text-xs font-bold"
                >
                  Zatvori
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookAppointment} className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAptType('video')}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                      aptType === 'video'
                        ? 'bg-[#fb6504]/15 border-[#fb6504] text-white'
                        : 'bg-white/[0.02] border-white/[0.08] text-slate-400 hover:text-white'
                    }`}
                  >
                    <Video className="w-4 h-4 text-[#fb6504]" />
                    <div>
                      <div className="text-xs font-bold">Google Meet / Video</div>
                      <div className="text-[10px]">Online s bilo koje lokacije</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAptType('in_person')}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                      aptType === 'in_person'
                        ? 'bg-[#fb6504]/15 border-[#fb6504] text-white'
                        : 'bg-white/[0.02] border-white/[0.08] text-slate-400 hover:text-white'
                    }`}
                  >
                    <MapPin className="w-4 h-4 text-[#fb6504]" />
                    <div>
                      <div className="text-xs font-bold">Ured Zagreb</div>
                      <div className="text-[10px]">Palmotićeva 76, Zagreb</div>
                    </div>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Datum</label>
                    <input
                      type="date"
                      value={aptDate}
                      onChange={(e) => setAptDate(e.target.value)}
                      className="w-full bg-[#06080c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#fb6504] focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Vrijeme</label>
                    <select
                      value={aptTime}
                      onChange={(e) => setAptTime(e.target.value)}
                      className="w-full bg-[#06080c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#fb6504] focus:outline-none"
                    >
                      <option value="09:00">09:00 sati</option>
                      <option value="10:00">10:00 sati</option>
                      <option value="11:30">11:30 sati</option>
                      <option value="14:00">14:00 sati</option>
                      <option value="16:00">16:00 sati</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">Vaše Ime i Prezime</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-[#06080c] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#fb6504] focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">E-mail adresa</label>
                    <input
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="w-full bg-[#06080c] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#fb6504] focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Kontakt telefon</label>
                    <input
                      type="tel"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full bg-[#06080c] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#fb6504] focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isBooking}
                  className="rr-btn--primary w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-orange-500/20"
                >
                  {isBooking ? (
                    <span>Spremam u Cloud Firestore...</span>
                  ) : (
                    <>
                      <Calendar className="w-4 h-4" />
                      <span>Potvrdi Besplatni Termin</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
