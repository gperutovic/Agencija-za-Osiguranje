import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  Building,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { AppointmentScheduler } from '../components/portal/AppointmentScheduler';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';

export const ContactPage: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'scheduler' | 'message'>('scheduler');
  const [sentMessage, setSentMessage] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    setSentMessage(true);
    setTimeout(() => {
      setSentMessage(false);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 4000);
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Header */}
      <section className="bg-gradient-to-b from-navy-950 via-slate-900 to-navy-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold uppercase tracking-wider">
            <Building className="w-4 h-4" />
            <span>Središnji Ured Zagreb &bull; Generali Zastupstvo</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight max-w-3xl mx-auto">
            Stojimo vam na raspolaganju za sve upite
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Posjetite nas u Palmotićevoj 76 u Zagrebu, zakažite virtualni sastanak ili nam pošaljite poruku.
          </p>
        </div>
      </section>

      {/* Main Grid: Office Info + Scheduler / Message Form */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Office Coordinates & Information */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="p-6 sm:p-8 bg-white border-slate-200 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Agencija Život d.o.o.</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ovlašteni zastupnik Generali osiguranja d.d.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Adresa sjedišta</span>
                    <span className="text-slate-600">Junija Palmotića 76, 10000 Zagreb, Hrvatska</span>
                    <span className="block text-slate-400 mt-0.5">Ulaz s dvorišne strane, 1. kat</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Telefoni</span>
                    <a href="tel:+38514828000" className="text-slate-600 hover:text-brand-600 block">
                      +385 1 4828 000 (Centrala)
                    </a>
                    <a href="tel:+385914828000" className="text-slate-600 hover:text-brand-600 block">
                      +385 91 482 8000 (Mobilni broker)
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Elektronička pošta</span>
                    <a href="mailto:info@agencija-zivot.hr" className="text-slate-600 hover:text-brand-600 block">
                      info@agencija-zivot.hr
                    </a>
                    <a href="mailto:stete@agencija-zivot.hr" className="text-slate-600 hover:text-brand-600 block">
                      stete@agencija-zivot.hr (Odjel šteta)
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Radno vrijeme</span>
                    <span className="text-slate-600 block">Ponedjeljak &ndash; Petak: 08:00 &ndash; 17:00</span>
                    <span className="text-slate-500">Subotom i nedjeljom: zatvoreno</span>
                  </div>
                </div>
              </div>

              {/* Map Mockup / Card */}
              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 p-4 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-brand-600 text-white flex items-center justify-center mx-auto">
                  <MapPin className="w-5 h-5" />
                </div>
                <h5 className="font-bold text-slate-800 text-xs">Lokacija u središtu Zagreba</h5>
                <p className="text-[11px] text-slate-500">
                  U neposrednoj blizini Glavnog kolodvora i Trga kralja Tomislava. Osiguran parking za klijente.
                </p>
                <a
                  href="https://maps.google.com/?q=Palmoti%C4%87eva+76+Zagreb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-xs font-bold text-brand-600 hover:text-brand-800 underline pt-1"
                >
                  Otvori u Google Kartama &rarr;
                </a>
              </div>
            </Card>
          </div>

          {/* Right Column: Dynamic Scheduler or Message Form */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveMode('scheduler')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeMode === 'scheduler'
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <Calendar className="w-4 h-4" />
                Dogovori termin sastanka (Online)
              </button>

              <button
                onClick={() => setActiveMode('message')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeMode === 'message'
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <Send className="w-4 h-4" />
                Pošalji izravnu poruku
              </button>
            </div>

            {activeMode === 'scheduler' ? (
              <AppointmentScheduler />
            ) : (
              <Card className="p-6 sm:p-8 bg-white border-slate-200">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-slate-900">Pošaljite nam upit</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Naš tim odgovorit će vam putem e-pošte ili telefona u najkraćem mogućem roku.
                  </p>
                </div>

                {sentMessage ? (
                  <div className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 space-y-2">
                    <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                    <h4 className="font-bold text-lg">Poruka je uspješno poslana!</h4>
                    <p className="text-xs text-emerald-700">
                      Zahvaljujemo na javljanju. Odgovorit ćemo vam u roku od nekoliko radnih sati.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSendMessage} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Ime i prezime
                        </label>
                        <Input
                          required
                          placeholder="npr. Ivan Horvat"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Kontakt telefon
                        </label>
                        <Input
                          required
                          placeholder="npr. 091 123 4567"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Email adresa
                      </label>
                      <Input
                        required
                        type="email"
                        placeholder="npr. ivan@primjer.hr"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Predmet upita
                      </label>
                      <Input
                        required
                        placeholder="npr. Upit za osiguranje voznog parka"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Vaša poruka
                      </label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Opišite vaše potrebe, pitanja ili specifične zahtjeve..."
                        className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-sm text-slate-900 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      />
                    </div>

                    <div className="pt-2 flex justify-end">
                      <Button type="submit" variant="primary" className="px-8">
                        Pošalji poruku
                      </Button>
                    </div>
                  </form>
                )}
              </Card>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
