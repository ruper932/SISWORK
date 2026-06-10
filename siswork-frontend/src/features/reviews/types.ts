export interface ReviewItem {
  id: string
  application_id: string
  reviewer_ci: string
  reviewed_user_ci: string
  rating: number
  comment: string
  created_at: string
  updated_at: string
}

export interface ReviewCreateInput {
  application_id: string
  rating: number
  comment: string
}