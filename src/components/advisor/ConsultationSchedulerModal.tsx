import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  Video,
  Phone,
  Building,
  CheckCircle2,
  Sparkles,
  User,
  Mail,
  ShieldCheck,
  X,
} from 'lucide-react';
import { Advisor } from '../../types/insurance';

interface ConsultationSchedulerModalProps {
  advisor: Advisor;
  isOpen: boolean;
  onClose: () => void;
}

const TIME_SLOTS = [
  '09:00 - 09:15',
  '10:30 - 10:45',
  '11:45 - 12:00',
  '13:30 - 13:45',
  '15:00 - 15:15',
  '16:30 - 16:45',
];

const CONSULTATION_TOPICS = [
  'Auto & Kasko - Optimizacija franšize i prijenos 50% bonusa',
  'Osiguranje nekretnine - Pokriće potresa i građevinska vrijednost',
  'Dopunsko zdravstveno - HZZO poskupljenje 2026 vs Privatno',
  'Životno & Štedno osiguranje - Obiteljska zaštita',
  'Prijava štete i odštetni zahtjev',
];

export const ConsultationSchedulerModal: React.FC<ConsultationSchedulerModalProps> = ({
  advisor,
  isOpen,
  onClose,
}) => {
  const [selectedTopic, setSelectedTopic] = useState(CONSULTATION_TOPICS[0]);
  const [meetingType, setMeetingType] = useState<'phone' | 'video' | 'in_person'>('video');
  const [selectedDate, setSelectedDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [selectedSlot, setSelectedSlot] = useState(TIME_SLOTS[1]);
  const [clientName, setClientName] = useState('Marko Horvatić');
  const [clientPhone, setClientPhone] = useState('+385 91 555 4321');
  const [clientEmail, setClientEmail] = useState('klijent.zagreb@gmail.com');
  const [isBooked, setIsBooked] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBooked(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={advisor.avatarUrl}
              alt={advisor.name}
              className="w-12 h-12 rounded-2xl object-cover border-2 border-emerald-500 shadow-sm"
            />
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Rezervacija 15-minutnih konzultacija
              </h3>
              <p className="text-xs text-slate-500">
                Vaš osobni savjetnik: <strong className="text-slate-800 dark:text-slate-200">{advisor.name}</strong> ({advisor.licenseNumber})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 text-xs font-bold"
          >
            ✕
          </button>
        </div>

        {isBooked ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h4 className="text-xl font-black text-slate-900 dark:text-white">
              Konzultacije su uspješno zakazane!
            </h4>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5 max-w-sm mx-auto text-left">
              <div>Datum i termin: <strong className="text-slate-900 dark:text-white font-mono">{selectedDate} ({selectedSlot})</strong></div>
              <div>Oblik razgovora: <strong className="text-slate-900 dark:text-white">{meetingType === 'video' ? 'Google Meet Video poziv' : meetingType === 'phone' ? 'Telefonski poziv brokera' : 'Ured Zagreb (Radnička 80)'}</strong></div>
              <div>Tema: <strong className="text-slate-900 dark:text-white">{selectedTopic}</strong></div>
            </div>
            <p className="text-xs text-slate-500">
              Pozivnica s poveznicom za video sastanak i podsjetnikom poslana je na {clientEmail}.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
            >
              Zatvori prozor
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
            {/* Topic selector */}
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Tema razgovora:
              </label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
              >
                {CONSULTATION_TOPICS.map((topic, idx) => (
                  <option key={idx} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
            </div>

            {/* Meeting Type Selection */}
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Način održavanja:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'video', label: 'Video poziv', icon: Video },
                  { id: 'phone', label: 'Telefon', icon: Phone },
                  { id: 'in_person', label: 'Ured Zagreb', icon: Building },
                ].map((m) => {
                  const Icon = m.icon;
                  const isSelected = meetingType === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMeetingType(m.id as any)}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/30 text-blue-900 dark:text-blue-200 font-bold'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Datum:
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-mono"
                  required
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Slobodni termin (15 min):
                </label>
                <select
                  value={selectedSlot}
                  onChange={(e) => setSelectedSlot(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-mono"
                >
                  {TIME_SLOTS.map((slot, i) => (
                    <option key={i} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Contact details */}
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div>
                <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Vaše ime i prezime
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    Kontakt telefon
                  </label>
                  <input
                    type="tel"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    E-mail za poveznicu
                  </label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Besplatno & neobvezujuće savjetovanje
              </span>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md transition-all"
              >
                Potvrdi rezervaciju termina
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};
