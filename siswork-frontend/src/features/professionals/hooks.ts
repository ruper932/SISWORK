import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  getProfessionalDetail,
  requestVerification,
  searchProfessionals,
} from "./api"
import type { ProfessionalSearchParams, VerificationRequestInput } from "./types"

export const professionalKeys = {
  all: ["professionals"] as const,
  lists: () => [...professionalKeys.all, "list"] as const,
  list: (params: ProfessionalSearchParams) =>
    [...professionalKeys.lists(), params] as const,
  details: () => [...professionalKeys.all, "detail"] as const,
  detail: (userCi: string) => [...professionalKeys.details(), userCi] as const,
}

export function useProfessionalsQuery(params: ProfessionalSearchParams = {}) {
  return useQuery({
    queryKey: professionalKeys.list(params),
    queryFn: () => searchProfessionals(params),
  })
}

export function useProfessionalQuery(userCi: string) {
  return useQuery({
    queryKey: professionalKeys.detail(userCi),
    queryFn: () => getProfessionalDetail(userCi),
    enabled: Boolean(userCi),
  })
}

export function useRequestVerificationMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: VerificationRequestInput) =>
      requestVerification({
        ciPhoto: payload.ciPhoto,
        selfiePhoto: payload.selfiePhoto,
        certificatePdf: payload.certificatePdf,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: professionalKeys.all })
    },
  })
}