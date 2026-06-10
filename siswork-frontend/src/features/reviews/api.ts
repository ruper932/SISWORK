import api from "@/lib/axios"
import type { ReviewCreateInput, ReviewItem } from "./types"

export async function createReview(payload: ReviewCreateInput) {
  const { data } = await api.post<ReviewItem>("/reviews", payload)
  return data
}

export async function listReviewsForMe() {
  const { data } = await api.get<ReviewItem[]>("/reviews/me")
  return data
}

export async function getReviewById(reviewId: string) {
  const { data } = await api.get<ReviewItem>(`/reviews/${reviewId}`)
  return data
}