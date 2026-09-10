import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { firestoreService } from '../api/firestoreService';
import { storageService } from '../api/storageService';
import { Claim } from '../types/database';

export const CLAIMS_QUERY_KEY = ['claims'];

export function useCreateClaim() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (claim: Omit<Claim, 'id' | 'createdAt' | 'updatedAt'>) =>
      firestoreService.createClaim(claim),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLAIMS_QUERY_KEY });
    },
  });
}

export function useUpdateClaimStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
      brokerNotes,
    }: {
      id: string;
      status: Claim['status'];
      brokerNotes?: string;
    }) => firestoreService.updateClaimStatus(id, status, brokerNotes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLAIMS_QUERY_KEY });
    },
  });
}

export function useClaims(userId?: string) {
  const query = useQuery({
    queryKey: [...CLAIMS_QUERY_KEY, userId],
    queryFn: () => firestoreService.getClaims(userId),
  });

  const createMutation = useCreateClaim();
  const updateStatusMutation = useUpdateClaimStatus();

  return {
    ...query,
    claims: (query.data || []) as Claim[],
    submitClaim: async ({
      claimData,
      files,
    }: {
      claimData: Omit<Claim, 'id' | 'createdAt' | 'updatedAt'>;
      files?: File[];
    }) => {
      let evidenceUrls: string[] = claimData.evidenceUrls || [];
      if (files && files.length > 0) {
        const uploaded = await storageService.uploadMultipleEvidence(claimData.claimNumber, files);
        evidenceUrls = [...evidenceUrls, ...uploaded];
      }
      return createMutation.mutateAsync({
        ...claimData,
        evidenceUrls,
      });
    },
    isSubmitting: createMutation.isPending,
    updateClaimStatus: (id: string, status: Claim['status'], brokerNotes?: string) =>
      updateStatusMutation.mutateAsync({ id, status, brokerNotes }),
    isUpdatingStatus: updateStatusMutation.isPending,
  };
}
