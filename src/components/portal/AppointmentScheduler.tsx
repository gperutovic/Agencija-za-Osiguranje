import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Calendar as CalendarIcon,
  Clock,
  Phone,
  Video,
  MapPin,
  CheckCircle2,
  Download,
  User,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import { appointmentSchema, AppointmentFormData } from '../../utils/validators';
import { useAppointments } from '../../hooks/useAppointments';
import { useAuth } from '../../hooks/useAuth';
import { downloadAppointmentIcs, formatDateTime } from '../../utils/formatters';
import { Appointment } from '../../types/database';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';

interface AppointmentSchedulerProps {
  onScheduled?: (appointment: Appointment) => void;
}

export const AppointmentScheduler: React.FC<AppointmentSchedulerProps> = ({ onScheduled }) => {
  const { user } = useAuth();
  const { bookAppointment, isBooking } = useAppointments();
  const [confirmedAppt, setConfirmedAppt] = useState<Appointment | null>(null);

  // Available slots for Mon-Fri 08:30 - 17:00
  const timeSlots = [
    '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00',
    '15:30', '16:00', '16:30',
  ];

  // Generate next 10 business days
  const getNextBusinessDays = () => {
    const days: Array<{ value: string; label: string }> = [];
    const date = new Date();
    let count = 0;

    while (count < 10) {
      date.setDate(date.getDate() + 1);
      const dayOfWeek = date.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // skip Sat & Sun
        const iso = date.toISOString().split('T')[0];
        const label = new Intl.DateTimeFormat('hr-HR', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
        }).format(date);
        days.push({ value: iso, label });
        count++;
      }
    }
    return days;
  };

  const businessDays = getNextBusinessDays();
  const [selectedDay, setSelectedDay] = useState(businessDays[0]?.value || '');
  const [selectedTime, setSelectedTime] = useState(timeSlots[2]); // default 09:30

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      customerName: user?.displayName || '',
      customerEmail: user?.email || '',
      customerPhone: user?.phone || '',
      type: 'phone',
      dateTime: `${selectedDay}T${selectedTime}:00`,
      topic: 'Konzultacije o polici osiguranja',
    },
  });

  const selectedType = watch('type');

  const updateDateTime = (day: string, time: string) => {
    setSelectedDay(day);
    setSelectedTime(time);
    setValue('dateTime', `${day}T${time}:00`);
  };

  const onSubmit = async (data: AppointmentFormData) => {
    try {
      const created = await bookAppointment({
        ...data,
        status: 'scheduled',
      });
      setConfirmedAppt(created);
      if (onScheduled) onScheduled(created);
    } catch (err) {
      console.error('Failed to book appointment:', err);
    }
  };

  if (confirmedAppt) {
    return (
      <Card className="p-8 sm:p-10 text-center bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-bento max-w-xl mx-auto text-slate-900 dark:text-white rounded-3xl">
        <div className="w-16 h-16 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-teal-600 dark:text-teal-400 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-sm">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Termin je potvrđen!</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
          Vaš sastanak s ovlaštenim brokerom Agencije Život uspješno je zabilježen. Poslali smo detalje na{' '}
          <strong className="text-teal-700 dark:text-teal-400">{confirmedAppt.customerEmail}</strong>.
        </p>

        <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-5 text-left mb-6 space-y-2 text-xs text-slate-700 dark:text-slate-300 font-mono">
          <div className="flex justify-between">
            <span className="text-slate-500">Klijent:</span>
            <span className="font-semibold text-slate-900 dark:text-white">{confirmedAppt.customerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Datum i vrijeme:</span>
            <span className="font-bold text-teal-700 dark:text-teal-400">{formatDateTime(confirmedAppt.dateTime)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Vrsta sastanka:</span>
            <span className="font-semibold text-teal-700 dark:text-teal-400 capitalize">
              {confirmedAppt.type === 'phone'
                ? 'Telefonski poziv'
                : confirmedAppt.type === 'video'
                ? 'Generali Video sastanak'
                : 'Ured Zagreb (Palmotićeva 76)'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Tema:</span>
            <span className="font-semibold text-slate-900 dark:text-white">{confirmedAppt.topic}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="primary"
            onClick={() => downloadAppointmentIcs(confirmedAppt)}
            className="flex items-center justify-center gap-2 shadow-md shadow-teal-600/20"
          >
            <Download className="w-4 h-4" />
            Dodaj u kalendar (.ics)
          </Button>
          <Button
            variant="outline"
            onClick={() => setConfirmedAppt(null)}
            className=""
          >
            Rezerviraj novi termin
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 sm:p-8 bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white shadow-bento rounded-3xl">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Dogovorite termin savjetovanja s brokerom
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Izaberite način komunikacije, željeni datum i vrijeme. Naš ovlašteni stručni savjetnik pripremit će optimalnu ponudu za vas.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Channel Selection */}
        <div>
          <label className="block text-xs font-mono font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider mb-2">
            1. Odaberite način sastanka
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'phone', label: 'Telefonski poziv', icon: Phone, sub: 'Agent zove vas' },
              { id: 'video', label: 'Generali Video', icon: Video, sub: 'Google Meet / Teams' },
              { id: 'in_person', label: 'Ured Zagreb', icon: MapPin, sub: 'Palmotićeva 76' },
            ].map((ch) => {
              const Icon = ch.icon;
              const isSelected = selectedType === ch.id;
              return (
                <button
                  type="button"
                  key={ch.id}
                  onClick={() => setValue('type', ch.id as any)}
                  className={`p-4 rounded-2xl border text-left transition-all flex flex-col items-start gap-2 ${
                    isSelected
                      ? 'border-teal-600 bg-teal-50/80 dark:bg-teal-950/40 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      isSelected ? 'bg-teal-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{ch.label}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{ch.sub}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Date Selector */}
        <div>
          <label className="block text-xs font-mono font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider mb-2">
            2. Odaberite datum (Radni dani)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {businessDays.map((d) => (
              <button
                type="button"
                key={d.value}
                onClick={() => updateDateTime(d.value, selectedTime)}
                className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                  selectedDay === d.value
                    ? 'bg-teal-600 text-white border-transparent font-semibold shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Time Selector */}
        <div>
          <label className="block text-xs font-mono font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider mb-2">
            3. Odaberite vrijeme (Trajanje 30 min)
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {timeSlots.map((time) => (
              <button
                type="button"
                key={time}
                onClick={() => updateDateTime(selectedDay, time)}
                className={`py-2 px-2 rounded-xl text-xs font-mono border text-center transition-all ${
                  selectedTime === time
                    ? 'bg-teal-600 text-white border-transparent font-bold shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        {/* Customer Information & Topic */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Vaše ime i prezime
            </label>
            <Input
              placeholder="npr. Ana Horvat"
              {...register('customerName')}
              error={errors.customerName?.message}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Broj telefona
            </label>
            <Input
              placeholder="npr. +385 91 234 5678"
              {...register('customerPhone')}
              error={errors.customerPhone?.message}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Email adresa
            </label>
            <Input
              placeholder="npr. ana.horvat@email.hr"
              type="email"
              {...register('customerEmail')}
              error={errors.customerEmail?.message}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Područje interesa / Tema
            </label>
            <Select
              value={watch('topic')}
              onChange={(e) => setValue('topic', e.target.value)}
              options={[
                { value: 'Kasko i obvezno auto osiguranje', label: 'Auto (AO + Kasko)' },
                { value: 'Osiguranje kuće ili stana od potresa', label: 'Imovina i dom' },
                { value: 'Mješovito životno osiguranje i štednja', label: 'Životno osiguranje' },
                { value: 'Dodatno i dopunsko zdravstveno', label: 'Zdravstveno osiguranje' },
                { value: 'Opće savjetovanje i analiza polica', label: 'Opće savjetovanje' },
              ]}
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <Button
            type="submit"
            variant="primary"
            disabled={isBooking}
            className="w-full sm:w-auto px-8 shadow-md shadow-teal-600/20"
          >
            {isBooking ? 'Rezervacija u tijeku...' : 'Potvrdi rezervaciju termina'}
          </Button>
        </div>
      </form>
    </Card>
  );
};
