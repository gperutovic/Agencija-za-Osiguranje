import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { firestoreService } from '../api/firestoreService';
import { QuoteRequest } from '../types/database';

export const QUOTES_QUERY_KEY = ['quotes'];

export function useCreateQuote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (quote: Omit<QuoteRequest, 'id' | 'createdAt'>) =>
      firestoreService.createQuote(quote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUOTES_QUERY_KEY });
    },
  });
}

export function useUpdateQuoteStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: QuoteRequest['status'] }) =>
      firestoreService.updateQuoteStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUOTES_QUERY_KEY });
    },
  });
}

export function useQuotes() {
  const query = useQuery({
    queryKey: QUOTES_QUERY_KEY,
    queryFn: () => firestoreService.getQuotes(),
  });

  const createMutation = useCreateQuote();
  const updateMutation = useUpdateQuoteStatus();

  return {
    ...query,
    quotes: (query.data || []) as QuoteRequest[],
    createQuote: createMutation.mutateAsync,
    updateQuoteStatus: (id: string, status: QuoteRequest['status']) =>
      updateMutation.mutateAsync({ id, status }),
    isCreating: createMutation.isPending,
  };
}
