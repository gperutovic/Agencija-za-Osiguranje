import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { firestoreService } from '../api/firestoreService';
import { Policy } from '../types/database';

export const POLICIES_QUERY_KEY = ['policies'];

export function useRenewPolicy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (policyId: string) => firestoreService.renewPolicyRequest(policyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POLICIES_QUERY_KEY });
    },
  });
}

export function usePolicies(userId?: string) {
  const query = useQuery({
    queryKey: [...POLICIES_QUERY_KEY, userId],
    queryFn: () => firestoreService.getPolicies(userId),
  });

  const renewMutation = useRenewPolicy();

  return {
    ...query,
    policies: (query.data || []) as Policy[],
    renewPolicy: renewMutation.mutateAsync,
    isRenewing: renewMutation.isPending,
  };
}
