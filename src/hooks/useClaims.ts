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
      evidenceFiles,
    }: {
      claimData: Omit<Claim, 'id' | 'createdAt' | 'updatedAt'>;
      files?: File[];
      evidenceFiles?: File[];
    }) => {
      let evidenceUrls: string[] = claimData.evidenceUrls || [];
      const filesToUpload = files || evidenceFiles || [];
      if (filesToUpload.length > 0) {
        const claimNum = claimData.claimNumber || `claim-${Date.now()}`;
        const uploaded = await storageService.uploadMultipleEvidence(claimNum, filesToUpload);
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
