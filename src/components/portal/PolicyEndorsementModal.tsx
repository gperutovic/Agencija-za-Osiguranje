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
  Send,
  ShieldCheck,
} from 'lucide-react';
import { Policy, EndorsementType as DbEndorsementType } from '../../types/database';
import { firestoreService } from '../../api/firestoreService';
import { isValidOIB } from '../../utils/oibValidator';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
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
      const dbTypeMap: Record<EndorsementType, DbEndorsementType> = {
        address_change: 'add_location',
        driver_addition: 'add_vehicle',
        property_renovation: 'equipment_schedule',
        iban_update: 'change_entity',
        coverage_upgrade: 'change_limits',
      };

      const detailsSummary =
        endorsementType === 'address_change'
          ? `Nova adresa: ${newStreet}, ${newPostalCode} ${newCity}`
          : endorsementType === 'driver_addition'
          ? `Novi vozač: ${driverName}, OIB: ${driverOib}, vozačka od: ${driverLicenseYear}`
          : endorsementType === 'property_renovation'
          ? `Adaptacija (${renovationValue} €): ${renovationDetails}`
          : endorsementType === 'iban_update'
          ? `Novi IBAN: ${newIban}`
          : `Proširenje pokrića: ${notes}`;

      const created = await firestoreService.createEndorsement({
        policyId: policy.id,
        requestType: dbTypeMap[endorsementType],
        details: detailsSummary,
        effectiveDate,
      });

      const endorsementCode = created.id.toUpperCase();

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden text-slate-900 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0F2942]/5 border border-[#0F2942]/15 flex items-center justify-center text-[#0F2942] shrink-0">
              <FileEdit className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Zahtjev za izmjenom police (Aneks)</h3>
              <p className="text-xs text-slate-500">
                Polica: <span className="font-mono font-semibold text-[#0F2942]">{policy.policyNumber}</span> &bull;{' '}
                {policy.insurer}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleResetAndClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors"
            aria-label="Zatvori"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {submittedCode ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">Zahtjev za aneksom je zaprimljen</h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Vaš zahtjev za izmjenom na polici{' '}
                <strong className="text-slate-900">{policy.policyNumber}</strong> je evidentiran. Ovlašteni referent pregledat će podatke i poslati potvrdu aneksa na vaš e-mail.
              </p>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 inline-block">
                <span className="text-[11px] font-semibold text-slate-500 block uppercase">
                  Referenca zahtjeva (Aneks ID)
                </span>
                <span className="text-lg font-mono font-bold text-[#0F2942]">
                  {submittedCode}
                </span>
              </div>

              <div className="pt-4">
                <Button variant="primary" onClick={handleResetAndClose}>
                  U redu, zatvori
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {formError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Endorsement Type Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
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
                        className={`p-2.5 rounded-xl text-left border text-xs flex items-center gap-2 transition-all ${
                          isSel
                            ? 'border-[#0F2942] bg-[#0F2942]/5 text-[#0F2942] font-semibold ring-1 ring-[#0F2942]'
                            : 'border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:border-slate-300'
                        }`}
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${isSel ? 'text-[#0F2942]' : 'text-slate-400'}`} />
                        <span className="truncate">{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Fields Based on Selection */}
              {endorsementType === 'address_change' && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="text-xs font-semibold text-[#0F2942] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" /> Nova adresa prebivališta / sjedišta
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Ulica i kućni broj</label>
                    <Input
                      placeholder="npr. Ilica 142"
                      value={newStreet}
                      onChange={(e) => setNewStreet(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">Poštanski broj</label>
                      <Input
                        placeholder="npr. 10000"
                        value={newPostalCode}
                        onChange={(e) => setNewPostalCode(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">Grad / Mjesto</label>
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
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="text-xs font-semibold text-[#0F2942] flex items-center gap-1.5">
                    <UserPlus className="w-3.5 h-3.5" /> Podaci o dodatnom ovlaštenom vozaču
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Ime i prezime vozača</label>
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
                    <label className="block text-xs text-slate-600 mb-1">Godina položenog vozačkog ispita</label>
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
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="text-xs font-semibold text-[#0F2942] flex items-center gap-1.5">
                    <Home className="w-3.5 h-3.5" /> Prijava adaptacije / ulaganja u nekretninu
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Opis izvedenih radova</label>
                    <textarea
                      rows={2}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:border-[#0F2942]"
                      placeholder="npr. Zamjena instalacija vode, nova PVC stolarija, dogradnja terase..."
                      value={renovationDetails}
                      onChange={(e) => setRenovationDetails(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Procijenjena vrijednost radova (€)</label>
                    <Input
                      type="number"
                      value={renovationValue}
                      onChange={(e) => setRenovationValue(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {endorsementType === 'iban_update' && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="text-xs font-semibold text-[#0F2942] flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5" /> Novi IBAN za povrate i naplatu
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Hrvatski IBAN račun</label>
                    <Input
                      placeholder="HR1234567890123456789"
                      value={newIban}
                      onChange={(e) => setNewIban(e.target.value.toUpperCase())}
                      maxLength={21}
                      required
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      Mora započinjati s HR i sadržavati točno 21 znak.
                    </p>
                  </div>
                </div>
              )}

              {endorsementType === 'coverage_upgrade' && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="text-xs font-semibold text-[#0F2942] flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" /> Zahtjev za proširenjem rizika
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Dodatna pokrića koja želite uključiti</label>
                    <textarea
                      rows={2}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:border-[#0F2942]"
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">Željeni datum primjene izmjene</label>
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
                  className="flex items-center gap-1.5"
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
