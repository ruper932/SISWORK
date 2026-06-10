import { useMutation, useQueryClient } from "@tanstack/react-query"
import { approveVerification, rejectVerification } from "./api"
import type { RejectVerificationInput } from "./types"

export const supportKeys = {
  all: ["support"] as const,
  verificationRequests: () => [...supportKeys.all, "verification-requests"] as const,
}

export function useApproveVerificationMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (verificationRequestId: string) =>
      approveVerification(verificationRequestId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: supportKeys.all }),
        queryClient.invalidateQueries({ queryKey: ["professionals"] }),
        queryClient.invalidateQueries({ queryKey: ["admin"] }),
        queryClient.invalidateQueries({ queryKey: ["users"] }),
      ])
    },
  })
}

export function useRejectVerificationMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: RejectVerificationInput) => rejectVerification(payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: supportKeys.all }),
        queryClient.invalidateQueries({ queryKey: ["professionals"] }),
        queryClient.invalidateQueries({ queryKey: ["admin"] }),
        queryClient.invalidateQueries({ queryKey: ["users"] }),
      ])
    },
  })
}