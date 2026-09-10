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
    <div className="space-y-16 pb-24 text-slate-100">
      {/* Header */}
      <section className="relative overflow-hidden pt-12 pb-14 text-center space-y-4">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#fb6504]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono font-bold tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#fb6504] animate-pulse" />
            <span className="text-white">Središnji Ured Zagreb</span>
            <span className="text-slate-500">&bull;</span>
            <span className="text-[#ff7b1a]">Generali Zastupstvo</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight max-w-3xl mx-auto text-white">
            Stojimo vam na raspolaganju za sve upite
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed font-light">
            Posjetite nas u Palmotićevoj 76 u Zagrebu, zakažite virtualni sastanak ili nam pošaljite poruku.
          </p>
        </div>
      </section>

      {/* Main Grid: Office Info + Scheduler / Message Form */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Office Coordinates & Information */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-8 bg-[#0a0d16]/90 border border-white/[0.08] backdrop-blur-xl rounded-3xl space-y-6 shadow-2xl">
              <div>
                <h3 className="text-xl font-bold text-white">Agencija Život d.o.o.</h3>
                <p className="text-xs text-slate-400 mt-0.5 font-mono">
                  Ovlašteni zastupnik Generali osiguranja d.d.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[#ff7b1a] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white block">Adresa sjedišta</span>
                    <span className="text-slate-300">Junija Palmotića 76, 10000 Zagreb, Hrvatska</span>
                    <span className="block text-slate-500 mt-0.5 font-mono">Ulaz s dvorišne strane, 1. kat</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[#ff7b1a] flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white block">Telefoni</span>
                    <a href="tel:+38514828000" className="text-slate-300 hover:text-[#ff7b1a] block font-mono">
                      +385 1 4828 000 (Centrala)
                    </a>
                    <a href="tel:+385914828000" className="text-slate-300 hover:text-[#ff7b1a] block font-mono">
                      +385 91 482 8000 (Mobilni broker)
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[#ff7b1a] flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white block">Elektronička pošta</span>
                    <a href="mailto:info@agencija-zivot.hr" className="text-slate-300 hover:text-[#ff7b1a] block font-mono">
                      info@agencija-zivot.hr
                    </a>
                    <a href="mailto:stete@agencija-zivot.hr" className="text-slate-300 hover:text-[#ff7b1a] block font-mono">
                      stete@agencija-zivot.hr (Odjel šteta)
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[#ff7b1a] flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white block">Radno vrijeme</span>
                    <span className="text-slate-300 block font-mono">Ponedjeljak &ndash; Petak: 08:00 &ndash; 17:00</span>
                    <span className="text-slate-500 font-mono">Subotom i nedjeljom: zatvoreno</span>
                  </div>
                </div>
              </div>

              {/* Map Card */}
              <div className="rounded-2xl overflow-hidden border border-white/[0.08] bg-white/[0.02] p-4 text-center space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-[#fb6504]/10 border border-[#fb6504]/20 text-[#ff7b1a] flex items-center justify-center mx-auto">
                  <MapPin className="w-5 h-5" />
                </div>
                <h5 className="font-bold text-white text-xs">Lokacija u središtu Zagreba</h5>
                <p className="text-[11px] text-slate-400 font-light">
                  U neposrednoj blizini Glavnog kolodvora i Trga kralja Tomislava. Osiguran parking za klijente.
                </p>
                <a
                  href="https://maps.google.com/?q=Palmoti%C4%87eva+76+Zagreb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-xs font-mono font-bold text-[#ff7b1a] hover:underline pt-1"
                >
                  Otvori u Google Kartama &rarr;
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Scheduler or Message Form */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveMode('scheduler')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-mono font-bold transition-all ${
                  activeMode === 'scheduler'
                    ? 'bg-gradient-to-r from-[#fb6504] to-[#ff7b1a] text-white shadow-[0_0_16px_rgba(251,101,4,0.35)]'
                    : 'bg-[#0a0d16]/90 text-slate-400 hover:text-white border border-white/[0.08] hover:border-white/[0.16]'
                }`}
              >
                <Calendar className="w-4 h-4" />
                Dogovori termin sastanka (Online)
              </button>

              <button
                onClick={() => setActiveMode('message')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-mono font-bold transition-all ${
                  activeMode === 'message'
                    ? 'bg-gradient-to-r from-[#fb6504] to-[#ff7b1a] text-white shadow-[0_0_16px_rgba(251,101,4,0.35)]'
                    : 'bg-[#0a0d16]/90 text-slate-400 hover:text-white border border-white/[0.08] hover:border-white/[0.16]'
                }`}
              >
                <Send className="w-4 h-4" />
                Pošalji izravnu poruku
              </button>
            </div>

            {activeMode === 'scheduler' ? (
              <AppointmentScheduler />
            ) : (
              <div className="p-6 sm:p-8 bg-[#0a0d16]/90 border border-white/[0.08] backdrop-blur-xl rounded-3xl shadow-2xl">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white">Pošaljite nam upit</h3>
                  <p className="text-xs text-slate-400 mt-1 font-light">
                    Naš tim odgovorit će vam putem e-pošte ili telefona u najkraćem mogućem roku.
                  </p>
                </div>

                {sentMessage ? (
                  <div className="p-8 text-center bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-300 space-y-2">
                    <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                    <h4 className="font-bold text-lg text-white">Poruka je uspješno poslana!</h4>
                    <p className="text-xs text-emerald-300 font-mono">
                      Zahvaljujemo na javljanju. Odgovorit ćemo vam u roku od nekoliko radnih sati.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSendMessage} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono font-semibold text-slate-300 mb-1">
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
                        <label className="block text-xs font-mono font-semibold text-slate-300 mb-1">
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
                      <label className="block text-xs font-mono font-semibold text-slate-300 mb-1">
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
                      <label className="block text-xs font-mono font-semibold text-slate-300 mb-1">
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
                      <label className="block text-xs font-mono font-semibold text-slate-300 mb-1">
                        Vaša poruka
                      </label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Opišite vaše potrebe, pitanja ili specifične zahtjeve..."
                        className="w-full px-4 py-3 rounded-2xl border border-white/[0.1] text-sm text-white bg-[#06080c] placeholder:text-slate-600 shadow-inner focus:outline-none focus:border-[#fb6504] focus:ring-1 focus:ring-[#fb6504]"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      />
                    </div>

                    <div className="pt-2 flex justify-end">
                      <Button type="submit" variant="primary" className="px-8 font-mono font-bold">
                        Pošalji poruku
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
