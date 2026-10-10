import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  Clock,
  Car,
  Home,
  HeartPulse,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Sparkles,
  Phone,
  ArrowRight,
  TrendingDown,
  Lock,
} from 'lucide-react';
import { expiryReminderService } from '../api/firestoreService';
import { JsonLd } from '../components/seo/JsonLd';
import { AGENCY_DETAILS } from '../lib/content/insurance-data';

export const metadata = {
  title: 'Podsjetnik na Istek Police Osiguranja | Uštedite do 35% | Agencija Život',
  description:
    'Besplatni SMS i WhatsApp podsjetnik 30 dana prije isteka police auto osiguranja, dopunskog ili imovine. Usporedite 3 najpovoljnije ponude na tržištu RH.',
};

export default function PolicyExpiryReminderPage() {
  const [identifier, setIdentifier] = useState('');
  const [category, setCategory] = useState<'auto' | 'dopunsko' | 'imovina' | 'kasko' | 'ostalo'>('auto');
  const [expiryDate, setExpiryDate] = useState('');
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [reminderId, setReminderId] = useState<string>('');

  const todayStr = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !expiryDate || !phone) return;

    setIsSubmitting(true);
    try {
      const record = await expiryReminderService.saveReminder({
        identifier: identifier.trim().toUpperCase(),
        category,
        expiryDate,
        phone: phone.trim(),
        fullName: fullName.trim(),
        email: email.trim(),
        estimatedSavingsEur: category === 'auto' ? 120 : category === 'dopunsko' ? 66 : 85,
      });
      setReminderId(record.id);
      setSubmitted(true);
    } catch (err) {
      console.error('Failed to save reminder:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const schema = {
    '@context': 'https://schema.org' as const,
    '@type': 'Service' as const,
    name: 'Podsjetnik na istek police osiguranja',
    provider: {
      '@type': 'InsuranceAgency' as const,
      name: AGENCY_DETAILS.brandName,
      telephone: AGENCY_DETAILS.phone,
    },
    description:
      'Automatski podsjetnik 30 dana prije isteka police osiguranja uz izračun i usporedbu ponuda vodećih društava.',
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen py-10 sm:py-16 text-slate-900">
      <JsonLd schema={schema} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-mono font-bold tracking-wide">
            <Bell className="w-3.5 h-3.5 text-teal-600 animate-bounce" />
            <span>BEZ BRIGE O KAZNAMA I ISTEKU POLICE &bull; 100% BESPLATNO</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
            Podsjetnik na istek police osiguranja
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Ne dopustite da vam polica istekne nenajavljeno. Prijavite datum isteka i osigurajte miran san:
            <strong className="text-teal-700 font-bold block mt-1">
              "Podsjetit ćemo vas 30 dana prije isteka uz 3 najjeftinije ponude i uštedu do 35%."
            </strong>
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xl space-y-8">
          {submitted ? (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4"
            >
              <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto" />
              <h2 className="text-2xl font-black text-emerald-950">Podsjetnik je uspješno postavljen!</h2>
              <p className="text-sm text-emerald-800 max-w-lg mx-auto">
                Vaš zahtjev je zabilježen pod evidencijskim brojem{' '}
                <span className="font-mono font-bold text-emerald-950">{reminderId}</span>.
                Točno 30 dana prije <span className="font-bold">{expiryDate}</span> poslat ćemo vam pregled 3 najpovoljnije ponude na broj <span className="font-mono font-bold">{phone}</span>.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setIdentifier('');
                    setExpiryDate('');
                    setPhone('');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow"
                >
                  Postavi podsjetnik za drugu policu
                </button>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category Picker */}
              <div>
                <label className="block text-xs font-mono uppercase font-bold text-slate-600 mb-2">
                  1. Odaberite kategoriju osiguranja
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'auto', label: 'Auto osiguranje (AO)', icon: Car },
                    { id: 'kasko', label: 'Puni Kasko', icon: ShieldCheck },
                    { id: 'dopunsko', label: 'Dopunsko (2026)', icon: HeartPulse },
                    { id: 'imovina', label: 'Imovina & Dom', icon: Home },
                  ].map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id as any)}
                        className={`p-3.5 rounded-2xl border-2 text-left flex flex-col gap-2 transition-all ${
                          isSelected
                            ? 'border-teal-600 bg-teal-50/50 text-teal-900 font-bold shadow-sm'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${isSelected ? 'text-teal-600' : 'text-slate-400'}`} />
                        <span className="text-xs">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Registarska oznaka ili OIB *
                  </label>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="npr. ZG-1234-AB ili 12345678901"
                    className="w-full px-3.5 py-3 rounded-xl border border-slate-300 text-sm font-mono uppercase focus:ring-2 focus:ring-teal-500"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Za provjeru stečenog bonusa i povijesti vozila u sustavu HUO.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Datum isteka trenutne police *
                  </label>
                  <input
                    type="date"
                    required
                    min={todayStr}
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-3.5 py-3 rounded-xl border border-slate-300 text-sm font-mono focus:ring-2 focus:ring-teal-500"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Datum naveden na vašoj prometnoj dozvoli ili trenutnoj polici.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Broj mobitela (za SMS / WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="091 234 5678"
                    className="w-full px-3.5 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ime i prezime (opcionalno)
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ivan Horvat"
                    className="w-full px-3.5 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    E-mail adresa (opcionalno)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ivan@email.hr"
                    className="w-full px-3.5 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Value Proposition Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-500/10 via-emerald-500/10 to-transparent border border-teal-500/20 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-700 leading-relaxed">
                  <strong className="text-slate-900 block font-bold">Što se događa kada postavite podsjetnik?</strong>
                  Točno 30 dana prije isteka, naš sustav automatski analizira tarife 6 osiguravajućih društava (Generali, Croatia, Allianz, Wiener, Triglav, LAQO) i priprema vam 3 najpovoljnije ponude s prenesenim 50% bonusom, bez obveze ugovaranja.
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-base shadow-lg shadow-teal-600/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  <Bell className="w-5 h-5" />
                  <span>{isSubmitting ? 'Spremanje podsjetnika...' : 'Aktiviraj besplatni podsjetnik'}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>

              <p className="text-center text-[11px] text-slate-500 font-mono flex items-center justify-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Bez spama • Odjava u 1 kliku • Podaci zaštićeni sukladno GDPR-u</span>
              </p>
            </form>
          )}
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
              <TrendingDown className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Ušteda do 35% na premiji</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Pravovremena usporedba omogućuje iskorištavanje sezonskih komercijalnih popusta i obiteljskih paketa.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Bez stresa pred tehnički pregled</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Nova polica je spremna i vidljiva u bazi MUP-a prije nego što stignete na stanicu za tehnički pregled.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Prijenos 50% bonusa zajamčen</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Automatski povlačimo i prenosimo vaš stečeni premijski stupanj bez gubitka popusta.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
