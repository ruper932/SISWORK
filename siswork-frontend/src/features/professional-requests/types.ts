export type ProfessionalRequestStatus = "PENDING" | "APPROVED" | "REJECTED"

export interface ProfessionalRequest {
  id: string
  user_ci: string
  bio: string | null
  experience_years: number
  motivation: string | null
  status: ProfessionalRequestStatus
  rejection_reason: string | null
  reviewed_by_ci: string | null
  created_at: string
  updated_at: string
}

export interface ProfessionalRequestListResponse {
  items: ProfessionalRequest[]
  total: number
  skip: number
  limit: number
}