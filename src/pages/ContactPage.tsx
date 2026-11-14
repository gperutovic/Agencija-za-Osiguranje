import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Calendar, Send, CheckCircle2 } from 'lucide-react';
import { AppointmentScheduler } from '../components/portal/AppointmentScheduler';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { firestoreService } from '../api/firestoreService';
import { AGENCY_DETAILS } from '../lib/content/insurance-data';

export const ContactPage: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'scheduler' | 'message'>('scheduler');
  const [sentMessage, setSentMessage] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    try {
      await firestoreService.submitInquiry(formData);
      setSentMessage(true);
      setTimeout(() => {
        setSentMessage(false);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      }, 4500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-slate-50 text-slate-900 pb-20">
      {/* Editorial Header */}
      <section className="bg-white border-b border-slate-200 pt-12 pb-12 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-100 border border-slate-200 text-xs font-semibold text-[#0F2942] uppercase tracking-wider">
            <span>Poslovnica Zagreb</span>
            <span>•</span>
            <span>{AGENCY_DETAILS.address}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Kontakt i zakazivanje savjetovanja
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Obratite nam se telefonom, zakažite osobni ili video termin sa zastupnikom te nas posjetite u središnjem uredu u Zagrebu.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Office Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-8 bg-white border border-slate-200 rounded-xl shadow-sm space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-lg font-bold text-slate-900">{AGENCY_DETAILS.brandName}</h2>
                <p className="text-xs text-slate-500 mt-0.5">{AGENCY_DETAILS.legalName}</p>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 text-[#0F2942] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900 block">Adresa ureda</span>
                    <span className="text-slate-600 block">
                      {AGENCY_DETAILS.address}, {AGENCY_DETAILS.postalCode} {AGENCY_DETAILS.city}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 text-[#0F2942] flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="tabular-nums">
                    <span className="font-semibold text-slate-900 block">Telefon i podrška</span>
                    <a href="tel:+38514800120" className="text-slate-700 hover:text-[#0F2942] block font-medium">
                      {AGENCY_DETAILS.phone} (Ured i ponude)
                    </a>
                    <a href="tel:+38515550666" className="text-slate-600 hover:text-[#0F2942] block">
                      {AGENCY_DETAILS.secondaryPhone} (Prijave šteta i asistencija)
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 text-[#0F2942] flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900 block">Elektronička pošta</span>
                    <a href={`mailto:${AGENCY_DETAILS.email}`} className="text-slate-700 hover:text-[#0F2942] block">
                      {AGENCY_DETAILS.email}
                    </a>
                    <a href={`mailto:${AGENCY_DETAILS.claimsEmail}`} className="text-slate-600 hover:text-[#0F2942] block">
                      {AGENCY_DETAILS.claimsEmail} (Odjel šteta)
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 text-[#0F2942] flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900 block">Radno vrijeme</span>
                    <span className="text-slate-700 block">{AGENCY_DETAILS.workingHours}</span>
                    <span className="text-slate-500 text-xs">Vikendom i blagdanima: zatvoreno</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
                <h3 className="font-bold text-slate-900 text-xs">Lokacija u središtu Zagreba</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Smješteni smo u Palmotićevoj 76, u neposrednoj blizini Glavnog kolodvora i javnih garaža.
                </p>
                <a
                  href="https://maps.google.com/?q=Palmoti%C4%87eva+76+Zagreb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-xs font-semibold text-[#0F2942] hover:underline pt-1"
                >
                  Otvori u Google Kartama →
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Scheduler or Message Form */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex p-1 bg-white rounded-xl border border-slate-200 shadow-sm">
              <button
                type="button"
                onClick={() => setActiveMode('scheduler')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                  activeMode === 'scheduler'
                    ? 'bg-[#0F2942] text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Rezervacija termina</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveMode('message')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                  activeMode === 'message'
                    ? 'bg-[#0F2942] text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Send className="w-4 h-4" />
                <span>Pošaljite upit</span>
              </button>
            </div>

            {activeMode === 'scheduler' ? (
              <AppointmentScheduler />
            ) : (
              <div className="p-6 sm:p-8 bg-white border border-slate-200 rounded-xl shadow-sm">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-slate-900">Pošaljite nam izravan upit</h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Naš stručni tim odgovorit će vam putem e-pošte ili telefona unutar jednog radnog dana.
                  </p>
                </div>

                {sentMessage ? (
                  <div className="p-8 text-center bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 space-y-2">
                    <CheckCircle2 className="w-10 h-10 text-emerald-700 mx-auto" />
                    <h4 className="font-bold text-base">Poruka je uspješno poslana</h4>
                    <p className="text-xs text-emerald-800">
                      Zahvaljujemo na upitu. Odgovorit ćemo vam u najkraćem mogućem roku.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSendMessage} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Ime i prezime *"
                        required
                        placeholder="npr. Ivan Horvat"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                      <Input
                        label="Kontakt telefon *"
                        required
                        placeholder="npr. 091 123 4567"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>

                    <Input
                      label="E-mail adresa *"
                      required
                      type="email"
                      placeholder="npr. ivan@primjer.hr"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />

                    <Input
                      label="Predmet upita *"
                      required
                      placeholder="npr. Upit za osiguranje vozila ili stana"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    />

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Vaša poruka *
                      </label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Opišite vrstu osiguranja ili pitanje..."
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:border-[#0F2942] focus:ring-2 focus:ring-[#0F2942]/10"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      />
                    </div>

                    <div className="pt-2 flex justify-end">
                      <Button type="submit" variant="primary" disabled={isSending}>
                        {isSending ? 'Slanje poruke...' : 'Pošalji upit'}
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
