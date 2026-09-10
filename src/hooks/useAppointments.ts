import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { firestoreService } from '../api/firestoreService';
import { Appointment } from '../types/database';

export const APPOINTMENTS_QUERY_KEY = ['appointments'];

export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (apt: Omit<Appointment, 'id' | 'createdAt'>) =>
      firestoreService.createAppointment(apt),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENTS_QUERY_KEY });
    },
  });
}

export function useAppointments() {
  const query = useQuery({
    queryKey: APPOINTMENTS_QUERY_KEY,
    queryFn: () => firestoreService.getAppointments(),
  });

  const createMutation = useCreateAppointment();

  return {
    ...query,
    appointments: (query.data || []) as Appointment[],
    bookAppointment: createMutation.mutateAsync,
    isBooking: createMutation.isPending,
  };
}
