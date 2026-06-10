import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createReview, getReviewById, listReviewsForMe } from "./api"
import type { ReviewCreateInput } from "./types"

export const reviewKeys = {
  all: ["reviews"] as const,
  mine: () => [...reviewKeys.all, "mine"] as const,
  details: () => [...reviewKeys.all, "detail"] as const,
  detail: (reviewId: string) => [...reviewKeys.details(), reviewId] as const,
}

export function useMyReviewsQuery() {
  return useQuery({
    queryKey: reviewKeys.mine(),
    queryFn: listReviewsForMe,
  })
}

export function useReviewQuery(reviewId: string) {
  return useQuery({
    queryKey: reviewKeys.detail(reviewId),
    queryFn: () => getReviewById(reviewId),
    enabled: Boolean(reviewId),
  })
}

export function useCreateReviewMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: ReviewCreateInput) => createReview(payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: reviewKeys.all }),
        queryClient.invalidateQueries({ queryKey: ["applications"] }),
        queryClient.invalidateQueries({ queryKey: ["requests"] }),
        queryClient.invalidateQueries({ queryKey: ["professionals"] }),
      ])
    },
  })
}