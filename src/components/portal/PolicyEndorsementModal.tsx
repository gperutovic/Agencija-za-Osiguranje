import React, { useState } from 'react';
import {
  X,
  FileEdit,
  UserPlus,
  MapPin,
  Home,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Clock,
  Send,
  ShieldCheck,
} from 'lucide-react';
import { Policy } from '../../types/database';
import { isValidOIB } from '../../utils/oibValidator';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { OibInput } from '../ui/OibInput';

interface PolicyEndorsementModalProps {
  policy: Policy | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess?: (endorsementId: string) => void;
}

type EndorsementType =
  | 'address_change'
  | 'driver_addition'
  | 'property_renovation'
  | 'iban_update'
  | 'coverage_upgrade';

export const PolicyEndorsementModal: React.FC<PolicyEndorsementModalProps> = ({
  policy,
  isOpen,
  onClose,
  onSubmitSuccess,
}) => {
  const [endorsementType, setEndorsementType] = useState<EndorsementType>('address_change');
  const [effectiveDate, setEffectiveDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  
  // Specific fields
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newPostalCode, setNewPostalCode] = useState('');
  
  const [driverName, setDriverName] = useState('');
  const [driverOib, setDriverOib] = useState('');
  const [driverLicenseYear, setDriverLicenseYear] = useState('2018');
  
  const [renovationDetails, setRenovationDetails] = useState('');
  const [renovationValue, setRenovationValue] = useState('15000');
  
  const [newIban, setNewIban] = useState('');
  
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  if (!isOpen || !policy) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    if (endorsementType === 'driver_addition') {
      if (!driverName.trim()) {
        setFormError('Molimo unesite ime i prezime novog vozača.');
        return;
      }
      if (!isValidOIB(driverOib)) {
        setFormError('Molimo unesite ispravan OIB vozača (11 znamenki po ISO 7064).');
        return;
      }
    } else if (endorsementType === 'address_change') {
      if (!newStreet.trim() || !newCity.trim() || !newPostalCode.trim()) {
        setFormError('Molimo unesite punu novu adresu (ulica, poštanski broj i grad).');
        return;
      }
    } else if (endorsementType === 'iban_update') {
      const cleanIban = newIban.replace(/\s+/g, '').toUpperCase();
      if (!cleanIban.startsWith('HR') || cleanIban.length !== 21) {
        setFormError('Molimo unesite valjani hrvatski IBAN (HR + 19 znamenki).');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Simulate API / Firestore write with short latency
      await new Promise((resolve) => setTimeout(resolve, 800));

      const endorsementCode = `DOD-${new Date().getFullYear()}-${Math.floor(
        1000 + Math.random() * 9000
      )}`;

      setSubmittedCode(endorsementCode);
      if (onSubmitSuccess) onSubmitSuccess(endorsementCode);
    } catch (err) {
      setFormError('Došlo je do pogreške prilikom slanja zahtjeva. Pokušajte ponovno.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmittedCode(null);
    setFormError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-xl bg-[#0a0d16] border border-white/[0.12] rounded-3xl shadow-2xl overflow-hidden text-white">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/[0.08] bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#fb6504]/10 border border-[#fb6504]/30 flex items-center justify-center text-[#ff7b1a]">
              <FileEdit className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Zahtjev za izmjenom police (Aneks)</h3>
              <p className="text-xs text-slate-400 font-mono">
                Polica: <span className="text-[#ff7b1a]">{policy.policyNumber}</span> &bull;{' '}
                {policy.insurer}
              </p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="w-8 h-8 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {submittedCode ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-white">Zahtjev za aneksom je zaprimljen!</h4>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Vaš zahtjev za izmjenom na polici{' '}
                <strong className="text-white">{policy.policyNumber}</strong> je uspješno
                evidentiran. Ovlašteni referent će pregledati podatke i poslati potvrdu aneksa na
                vaš email.
              </p>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] inline-block">
                <span className="text-[11px] font-mono text-slate-400 block uppercase">
                  Broj zahtjeva (Aneks ID)
                </span>
                <span className="text-lg font-mono font-bold text-[#ff7b1a]">
                  {submittedCode}
                </span>
              </div>

              <div className="pt-4">
                <Button variant="primary" onClick={handleResetAndClose} className="font-mono">
                  U redu, zatvori
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {formError && (
                <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Endorsement Type Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Vrsta promjene na polici:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'address_change', label: 'Promjena adrese', icon: MapPin },
                    { id: 'driver_addition', label: 'Dodavanje vozača', icon: UserPlus },
                    { id: 'property_renovation', label: 'Adaptacija doma', icon: Home },
                    { id: 'iban_update', label: 'Promjena IBAN-a', icon: CreditCard },
                    { id: 'coverage_upgrade', label: 'Povećanje pokrića', icon: ShieldCheck },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isSel = endorsementType === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setEndorsementType(tab.id as EndorsementType)}
                        className={`p-2.5 rounded-2xl text-left border text-xs flex items-center gap-2 transition-all ${
                          isSel
                            ? 'border-[#fb6504] bg-[#fb6504]/10 text-white font-semibold shadow-[0_0_12px_rgba(251,101,4,0.2)]'
                            : 'border-white/[0.08] bg-white/[0.02] text-slate-400 hover:text-white hover:border-white/[0.15]'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isSel ? 'text-[#ff7b1a]' : 'text-slate-500'}`} />
                        <span className="truncate">{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Fields Based on Selection */}
              {endorsementType === 'address_change' && (
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
                  <div className="text-xs font-semibold text-[#ff7b1a] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" /> Nova adresa prebivališta / sjedišta
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Ulica i kućni broj</label>
                    <Input
                      placeholder="npr. Ilica 142"
                      value={newStreet}
                      onChange={(e) => setNewStreet(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Poštanski broj</label>
                      <Input
                        placeholder="npr. 10000"
                        value={newPostalCode}
                        onChange={(e) => setNewPostalCode(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Grad / Mjesto</label>
                      <Input
                        placeholder="npr. Zagreb"
                        value={newCity}
                        onChange={(e) => setNewCity(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {endorsementType === 'driver_addition' && (
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
                  <div className="text-xs font-semibold text-[#ff7b1a] flex items-center gap-1.5">
                    <UserPlus className="w-3.5 h-3.5" /> Podaci o dodatnom ovlaštenom vozaču
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Ime i prezime vozača</label>
                    <Input
                      placeholder="npr. Ivan Horvat"
                      value={driverName}
                      onChange={(e) => setDriverName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <OibInput
                      label="OIB vozača (11 znamenki)"
                      value={driverOib}
                      onChange={setDriverOib}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Godina položenog vozačkog ispita</label>
                    <Input
                      type="number"
                      min="1950"
                      max="2026"
                      value={driverLicenseYear}
                      onChange={(e) => setDriverLicenseYear(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {endorsementType === 'property_renovation' && (
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
                  <div className="text-xs font-semibold text-[#ff7b1a] flex items-center gap-1.5">
                    <Home className="w-3.5 h-3.5" /> Prijava adaptacije / ulaganja u nekretninu
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Opis izvedenih radova</label>
                    <textarea
                      rows={2}
                      className="w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/[0.1] rounded-2xl text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#fb6504]"
                      placeholder="npr. Zamjena instalacija vode, nova PVC stolarija, dogradnja terase..."
                      value={renovationDetails}
                      onChange={(e) => setRenovationDetails(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Procijenjena vrijednost radova (€)</label>
                    <Input
                      type="number"
                      value={renovationValue}
                      onChange={(e) => setRenovationValue(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {endorsementType === 'iban_update' && (
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
                  <div className="text-xs font-semibold text-[#ff7b1a] flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5" /> Novi IBAN za povrate i naplatu
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Hrvatski IBAN račun</label>
                    <Input
                      placeholder="HR1234567890123456789"
                      value={newIban}
                      onChange={(e) => setNewIban(e.target.value.toUpperCase())}
                      maxLength={21}
                      required
                    />
                    <p className="text-[10px] text-slate-500 mt-1 font-mono">
                      Mora započinjati s HR i sadržavati točno 21 znak.
                    </p>
                  </div>
                </div>
              )}

              {endorsementType === 'coverage_upgrade' && (
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
                  <div className="text-xs font-semibold text-[#ff7b1a] flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" /> Zahtjev za proširenjem rizika
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Dodatna pokrića koja želite uključiti</label>
                    <textarea
                      rows={2}
                      className="w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/[0.1] rounded-2xl text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#fb6504]"
                      placeholder="npr. Želim dodati pokriće potresa i lom stakla na moju policu imovine..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Effective date */}
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Željeni datum primjene izmjene</label>
                <Input
                  type="date"
                  value={effectiveDate}
                  onChange={(e) => setEffectiveDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <Button variant="ghost" type="button" onClick={handleResetAndClose} size="sm">
                  Odustani
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  size="sm"
                  disabled={isSubmitting}
                  className="font-mono flex items-center gap-1.5 shadow-[0_0_15px_rgba(251,101,4,0.3)]"
                >
                  <Send className="w-3.5 h-3.5" />
                  {isSubmitting ? 'Slanje zahtjeva...' : 'Podnesi zahtjev za aneks'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
