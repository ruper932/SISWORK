import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  approveProfessionalRequest,
  createProfessionalRequest,
  listMyProfessionalRequests,
  listPendingProfessionalRequests,
  rejectProfessionalRequest,
} from "./api"

export const professionalRequestKeys = {
  all: ["professional-requests"] as const,
  mine: ["professional-requests", "me"] as const,
  pending: ["professional-requests", "pending"] as const,
}

export function useMyProfessionalRequestsQuery() {
  return useQuery({
    queryKey: professionalRequestKeys.mine,
    queryFn: listMyProfessionalRequests,
  })
}

export function usePendingProfessionalRequestsQuery() {
  return useQuery({
    queryKey: professionalRequestKeys.pending,
    queryFn: listPendingProfessionalRequests,
  })
}

export function useCreateProfessionalRequestMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createProfessionalRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: professionalRequestKeys.mine,
      })
    },
  })
}

export function useApproveProfessionalRequestMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: approveProfessionalRequest,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: professionalRequestKeys.pending,
        }),
        queryClient.invalidateQueries({
          queryKey: professionalRequestKeys.mine,
        }),
      ])
    },
  })
}

export function useRejectProfessionalRequestMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: { id: string; rejection_reason: string }) =>
      rejectProfessionalRequest(params.id, {
        rejection_reason: params.rejection_reason,
      }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: professionalRequestKeys.pending,
        }),
        queryClient.invalidateQueries({
          queryKey: professionalRequestKeys.mine,
        }),
      ])
    },
  })
}