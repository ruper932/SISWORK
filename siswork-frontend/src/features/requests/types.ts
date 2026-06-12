export type UrgencyLevel = "LOW" | "MEDIUM" | "HIGH"

export type RequestStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "EXPIRED"

export interface AssignedProfessional {
  id: string
  user_ci: string
  bio: string | null
  experience_years: number
  verification_status: string
  rating_average: number
  rating_count: number
  is_available: boolean
}

export interface RequestItem {
  id: string
  client_ci: string
  specialty_id: string
  assigned_professional_profile_id: string | null
  assigned_professional: AssignedProfessional | null
  title: string
  description: string
  budget: string | null
  proposed_final_price: string | null
  scheduled_date: string | null
  city: string
  zone: string | null
  latitude: number | null
  longitude: number | null
  urgency: UrgencyLevel
  status: RequestStatus
  is_review_enabled: boolean
  can_review: boolean
  reviewable_application_id?: string | null
  cancellation_reason: string | null
  created_at: string
  updated_at: string
}

export interface RequestListResponse {
  items: RequestItem[]
  total: number
  skip: number
  limit: number
}

export interface RequestCreateInput {
  specialty_id: string
  title: string
  description: string
  budget?: number | null
  proposed_final_price?: number | null
  scheduled_date?: string | null
  city: string
  zone?: string | null
  latitude?: number | null
  longitude?: number | null
  urgency: UrgencyLevel
}

export interface RequestUpdateInput {
  specialty_id?: string
  title?: string
  description?: string
  budget?: number | null
  proposed_final_price?: number | null
  scheduled_date?: string | null
  city?: string
  zone?: string | null
  latitude?: number | null
  longitude?: number | null
  urgency?: UrgencyLevel
}

export interface RequestCancelInput {
  cancellation_reason?: string | null
}