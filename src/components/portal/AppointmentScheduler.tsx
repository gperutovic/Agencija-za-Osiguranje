import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Phone,
  Video,
  MapPin,
  CheckCircle2,
  Download,
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

  const timeSlots = [
    '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00',
    '15:30', '16:00', '16:30',
  ];

  const getNextBusinessDays = () => {
    const days: Array<{ value: string; label: string }> = [];
    const date = new Date();
    let count = 0;

    while (count < 10) {
      date.setDate(date.getDate() + 1);
      const dayOfWeek = date.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
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
  const [selectedTime, setSelectedTime] = useState(timeSlots[2]);

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
      <Card className="p-8 sm:p-10 text-center bg-white border-slate-200 shadow-sm max-w-xl mx-auto text-slate-900">
        <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Termin je uspješno rezerviran</h3>
        <p className="text-sm text-slate-600 mb-6">
          Vaš sastanak s ovlaštenim zastupnikom Agencije Život je zabilježen. Detalji su upućeni na{' '}
          <strong className="text-slate-900">{confirmedAppt.customerEmail}</strong>.
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left mb-6 space-y-2 text-xs text-slate-700 tabular-nums">
          <div className="flex justify-between">
            <span className="text-slate-500">Klijent:</span>
            <span className="font-semibold text-slate-900">{confirmedAppt.customerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Datum i vrijeme:</span>
            <span className="font-bold text-[#0F2942]">{formatDateTime(confirmedAppt.dateTime)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Vrsta sastanka:</span>
            <span className="font-semibold text-slate-900">
              {confirmedAppt.type === 'phone'
                ? 'Telefonski poziv'
                : confirmedAppt.type === 'video'
                ? 'Video sastanak'
                : 'Ured Zagreb (Palmotićeva 76)'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Tema:</span>
            <span className="font-semibold text-slate-900">{confirmedAppt.topic}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="primary"
            onClick={() => downloadAppointmentIcs(confirmedAppt)}
            className="flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Dodaj u kalendar (.ics)
          </Button>
          <Button
            variant="outline"
            onClick={() => setConfirmedAppt(null)}
          >
            Rezerviraj novi termin
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 sm:p-8 bg-white border-slate-200 text-slate-900 shadow-sm">
      <div className="mb-6 border-b border-slate-200 pb-4">
        <h3 className="text-lg font-bold text-slate-900">
          Dogovorite termin savjetovanja s ovlaštenim zastupnikom
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Odaberite kanal komunikacije, datum i satnicu. Pripremit ćemo usporedne izračune prema vašim zahtjevima.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Channel Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            1. Način savjetovanja
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'phone', label: 'Telefonski poziv', icon: Phone, sub: 'Zastupnik vas naziva' },
              { id: 'video', label: 'Video sastanak', icon: Video, sub: 'Online konzultacije' },
              { id: 'in_person', label: 'Ured Zagreb', icon: MapPin, sub: 'Palmotićeva 76' },
            ].map((ch) => {
              const Icon = ch.icon;
              const isSelected = selectedType === ch.id;
              return (
                <button
                  type="button"
                  key={ch.id}
                  onClick={() => setValue('type', ch.id as 'phone' | 'video' | 'in_person')}
                  className={`p-3.5 rounded-xl border text-left transition-colors flex flex-col items-start gap-2 cursor-pointer ${
                    isSelected
                      ? 'border-[#0F2942] bg-slate-50'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-[#0F2942] text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{ch.label}</p>
                    <p className="text-[11px] text-slate-500">{ch.sub}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Date Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            2. Odaberite radni dan
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {businessDays.map((d) => (
              <button
                type="button"
                key={d.value}
                onClick={() => updateDateTime(d.value, selectedTime)}
                className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition-colors cursor-pointer ${
                  selectedDay === d.value
                    ? 'bg-[#0F2942] text-white border-[#0F2942] font-semibold'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Time Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            3. Odaberite termin (30 min)
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 tabular-nums">
            {timeSlots.map((time) => (
              <button
                type="button"
                key={time}
                onClick={() => updateDateTime(selectedDay, time)}
                className={`py-2 px-2 rounded-lg text-xs border text-center transition-colors cursor-pointer ${
                  selectedTime === time
                    ? 'bg-[#0F2942] text-white border-[#0F2942] font-semibold'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        {/* Customer Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
          <Input
            label="Ime i prezime *"
            placeholder="npr. Ana Horvat"
            {...register('customerName')}
            error={errors.customerName?.message}
          />
          <Input
            label="Broj telefona *"
            placeholder="npr. +385 91 234 5678"
            {...register('customerPhone')}
            error={errors.customerPhone?.message}
          />
          <Input
            label="E-mail adresa *"
            placeholder="npr. ana.horvat@email.hr"
            type="email"
            {...register('customerEmail')}
            error={errors.customerEmail?.message}
          />
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tema savjetovanja
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

        <div className="pt-4 border-t border-slate-200 flex justify-end">
          <Button type="submit" variant="primary" disabled={isBooking} className="w-full sm:w-auto px-8">
            {isBooking ? 'Rezervacija u tijeku...' : 'Potvrdi rezervaciju termina'}
          </Button>
        </div>
      </form>
    </Card>
  );
};
