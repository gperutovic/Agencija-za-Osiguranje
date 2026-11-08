import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Award,
  CheckCircle2,
  Car,
  Home,
  HeartPulse,
  Shield,
  Users,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { formatEUR } from '../utils/validators';
import { useInsurtechStore } from '../store/useInsurtechStore';

export const LoyaltyProgramPage: React.FC = () => {
  const navigate = useNavigate();
  const { setPrefilledQuoteTransfer } = useInsurtechStore();

  const [hasAo, setHasAo] = useState<boolean>(true);
  const [hasKasko, setHasKasko] = useState<boolean>(true);
  const [hasImovina, setHasImovina] = useState<boolean>(true);
  const [hasZivotZdravlje, setHasZivotZdravlje] = useState<boolean>(false);
  const [claimsFreeYears, setClaimsFreeYears] = useState<number>(3);
  const [familyMembersCount, setFamilyMembersCount] = useState<number>(2);

  const selectedCount = [hasAo, hasKasko, hasImovina, hasZivotZdravlje].filter(Boolean).length;

  const tierInfo =
    selectedCount >= 4 || (selectedCount >= 3 && claimsFreeYears >= 4)
      ? {
          id: 'platinum',
          name: 'PLATINUM RAZINA',
          discountPct: 22,
          color: 'bg-[#0F172A] text-white border-[#0F172A]',
          perks: [
            '22% paketni popust na Kasko, Imovinu i Zdravstveno osiguranje',
            'Prioritetna likvidacija šteta unutar 24h s osobnim zastupnikom',
            '0,00 € franšiza na prvu kasko ili imovinsku štetu u godini',
            'Obiteljski prijenos 50% bonusa za sve članove kućanstva',
          ],
        }
      : selectedCount >= 2
      ? {
          id: 'gold',
          name: 'GOLD RAZINA',
          discountPct: 15,
          color: 'bg-[#C21817] text-white border-[#C21817]',
          perks: [
            '15% višeproizvodni popust (npr. AO + Kasko + Dom)',
            'Besplatna proširena asistencija na cesti (Hrvatska + EU)',
            'Dodatnih 5% bonusa za obnovu bez prijavljenih šteta',
            'Besplatni godišnji pregled police i Štit pokrića',
          ],
        }
      : {
          id: 'silver',
          name: 'SILVER RAZINA',
          discountPct: 8,
          color: 'bg-white text-[#0F172A] border-[#E2E8F0]',
          perks: [
            '8% ulazni popust vjernosti u Agenciji Život',
            'Digitalni novčanik polica i 24/7 FNOL podrška',
            'Podsjetnik 30 dana prije isteka police',
          ],
        };

  const baseGrossEur =
    (hasAo ? 195 : 0) +
    (hasKasko ? 520 : 0) +
    (hasImovina ? 240 : 0) +
    (hasZivotZdravlje ? 360 : 0);

  const claimsFreeBonusPct = Math.min(claimsFreeYears * 1.5, 6);
  const familyBonusPct = familyMembersCount >= 2 ? 3 : 0;
  const totalDiscountPct = Math.min(tierInfo.discountPct + claimsFreeBonusPct + familyBonusPct, 30);
  const annualSavingsEur = Math.round(baseGrossEur * (totalDiscountPct / 100) * 100) / 100;
  const netAnnualEur = Math.round((baseGrossEur - annualSavingsEur) * 100) / 100;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-left">
        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FEF2F2] text-[#C21817] border border-[#FECACA] text-xs font-mono font-bold">
            <Award className="w-3.5 h-3.5" />
            <span>PROGRAM VJERNOSTI AGENCIJE ŽIVOT &bull; SILVER / GOLD / PLATINUM</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            Više polica na jednom mjestu — veća ušteda za obitelj i tvrtku
          </h1>
          <p className="text-sm text-slate-600 max-w-3xl">
            Povežite obvezno auto osiguranje, Toyota/Generali Kasko, osiguranje doma i životno/zdravstveno osiguranje te ostvarite do <strong>30% kumulativnog popusta</strong> uz obiteljske pogodnosti.
          </p>
        </div>

        {/* 3 Loyalty Tiers Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              tier: 'SILVER',
              subtitle: '1 aktivna polica',
              discount: 'do 8% popusta',
              desc: 'Idealan početak uz 50% AO bonusa, Zelenu kartu i besplatnu pravnu podršku kod šteta.',
              active: tierInfo.id === 'silver',
            },
            {
              tier: 'GOLD',
              subtitle: '2 do 3 povezane police (AO + Kasko / Dom)',
              discount: 'do 18% popusta',
              desc: 'Paketni popust za kombinaciju vozila i imovine uz EU asistenciju i zaštitu bonusa.',
              active: tierInfo.id === 'gold',
            },
            {
              tier: 'PLATINUM',
              subtitle: '3+ police + godine bez štete',
              discount: 'do 30% popusta',
              desc: 'Maksimalni rabat za obiteljske i poslovne portfelje uz VIP prioritetnu obradu šteta i 0 € franšizu.',
              active: tierInfo.id === 'platinum',
            },
          ].map((card) => (
            <div
              key={card.tier}
              className={`p-6 rounded-3xl border transition-all ${
                card.active
                  ? 'bg-white border-2 border-[#C21817] shadow-elevated'
                  : 'bg-white border-[#E2E8F0] shadow-card'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 rounded-full bg-[#FEF2F2] text-[#C21817] font-mono text-xs font-bold">
                  {card.tier}
                </span>
                <span className="font-mono text-sm font-black text-[#0F172A]">{card.discount}</span>
              </div>
              <div className="text-xs font-bold text-slate-500 mb-2">{card.subtitle}</div>
              <p className="text-xs text-slate-600 leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>

        {/* Interactive Bundle Calculator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E2E8F0] shadow-card p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-extrabold text-[#0F172A] border-b border-slate-100 pb-3">
              Interaktivni kalkulator paketnih popusta i obiteljskih nagrada
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <label className="flex items-center justify-between p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] cursor-pointer">
                <div className="flex items-center gap-3">
                  <Car className="w-5 h-5 text-[#C21817]" />
                  <div>
                    <div className="text-xs font-extrabold text-[#0F172A]">Obvezno AO osiguranje</div>
                    <div className="text-[11px] text-slate-500">Osnovica ~195,00 € / god.</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={hasAo}
                  onChange={(e) => setHasAo(e.target.checked)}
                  className="w-5 h-5 accent-[#C21817]"
                />
              </label>

              <label className="flex items-center justify-between p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] cursor-pointer">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-[#0F172A]" />
                  <div>
                    <div className="text-xs font-extrabold text-[#0F172A]">Puni Kasko (Generali / Toyota)</div>
                    <div className="text-[11px] text-slate-500">Osnovica ~520,00 € / god.</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={hasKasko}
                  onChange={(e) => setHasKasko(e.target.checked)}
                  className="w-5 h-5 accent-[#C21817]"
                />
              </label>

              <label className="flex items-center justify-between p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] cursor-pointer">
                <div className="flex items-center gap-3">
                  <Home className="w-5 h-5 text-amber-600" />
                  <div>
                    <div className="text-xs font-extrabold text-[#0F172A]">Osiguranje imovine + Potres</div>
                    <div className="text-[11px] text-slate-500">Osnovica ~240,00 € / god.</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={hasImovina}
                  onChange={(e) => setHasImovina(e.target.checked)}
                  className="w-5 h-5 accent-[#C21817]"
                />
              </label>

              <label className="flex items-center justify-between p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] cursor-pointer">
                <div className="flex items-center gap-3">
                  <HeartPulse className="w-5 h-5 text-emerald-600" />
                  <div>
                    <div className="text-xs font-extrabold text-[#0F172A]">Životno / Zdravstveno</div>
                    <div className="text-[11px] text-slate-500">Osnovica ~360,00 € / god.</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={hasZivotZdravlje}
                  onChange={(e) => setHasZivotZdravlje(e.target.checked)}
                  className="w-5 h-5 accent-[#C21817]"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span>Godine bez prijavljene štete (Renewal bonus):</span>
                  <span className="font-mono text-[#C21817] tabular-nums">{claimsFreeYears} god. (+{claimsFreeBonusPct}%)</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={5}
                  step={1}
                  value={claimsFreeYears}
                  onChange={(e) => setClaimsFreeYears(Number(e.target.value))}
                  className="w-full accent-[#C21817] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span>Članovi obitelji u portfelju:</span>
                  <span className="font-mono text-[#0F172A] tabular-nums">{familyMembersCount} člana (+{familyBonusPct}%)</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  step={1}
                  value={familyMembersCount}
                  onChange={(e) => setFamilyMembersCount(Number(e.target.value))}
                  className="w-full accent-[#C21817] cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Right Result Card */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl border-2 border-[#0F172A] shadow-elevated p-6 sm:p-7 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#C21817] font-bold">
                    VAŠ STATUS VJERNOSTI
                  </span>
                  <h3 className="text-xl font-black text-[#0F172A]">{tierInfo.name}</h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-xs font-bold tabular-nums">
                  -{totalDiscountPct}% RABAT
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                <div className="flex justify-between text-xs text-slate-500 font-mono tabular-nums">
                  <span>Redovna cijena paketa:</span>
                  <span className="line-through">{formatEUR(baseGrossEur)}</span>
                </div>
                <div className="flex justify-between text-xs text-emerald-700 font-mono font-bold tabular-nums">
                  <span>Godišnja ušteda vjernosti:</span>
                  <span>-{formatEUR(annualSavingsEur)}</span>
                </div>
                <div className="flex items-baseline justify-between pt-2 border-t border-slate-200">
                  <span className="text-xs font-bold text-[#0F172A]">Nova cijena paketa:</span>
                  <span className="text-3xl font-black font-mono text-[#C21817] tabular-nums">
                    {formatEUR(netAnnualEur)}
                  </span>
                </div>
              </div>

              <ul className="space-y-2 text-xs text-slate-700">
                {tierInfo.perks.map((perk, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C21817] shrink-0 mt-0.5" />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => {
                  setPrefilledQuoteTransfer({
                    productType: 'kasko',
                    tierName: `Paket vjernosti ${tierInfo.name} (-${totalDiscountPct}%)`,
                    estimatedAnnualEur: netAnnualEur,
                    deductibleEur: 0,
                    coverageLimitEur: 50000,
                    riders: tierInfo.perks,
                  });
                  navigate('/zatrazi-ponudu');
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-[#C21817] hover:bg-[#991B1B] text-white font-bold text-xs sm:text-sm shadow-crimson-glow flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Zatraži paketnu ponudu s -{totalDiscountPct}% popusta</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoyaltyProgramPage;
