// src/features/applications/types.ts

export type ApplicationStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED"
  | "CANCELLED"

export type VerificationStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"

export type SpecialtySimple = {
  id: string
  name: string
  description: string | null
}

export type ProfessionalAvailability = {
  id: string
  day_of_week: number
  start_time: string
  end_time: string
  is_active: boolean
}

export type ProfessionalProfileSummary = {
  id: string
  user_ci: string
  full_name: string
  bio: string | null
  experience_years: number
  verification_status: VerificationStatus
  rating_average: number
  rating_count: number
  is_available: boolean
  city: string | null
  zone: string | null
  specialties: SpecialtySimple[]
  availabilities: ProfessionalAvailability[]
}

export type ApplicationResponse = {
  id: string
  request_id: string
  professional_profile_id: string
  proposal_message: string
  proposed_price: string | null
  estimated_time_hours: number | null
  status: ApplicationStatus
  created_at: string
  updated_at: string
  professional_profile: ProfessionalProfileSummary
}

export type ApplicationCreate = {
  request_id: string
  proposal_message: string
  proposed_price?: number | null
  estimated_time_hours?: number | null
}

export type ApplicationListResponse = {
  items: ApplicationResponse[]
  total: number
}