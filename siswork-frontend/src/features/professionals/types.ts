export interface SpecialtySimple {
  id: string
  name: string
  description: string
}

export interface ProfessionalAvailability {
  id: string
  day_of_week: number
  start_time: string
  end_time: string
  is_active: boolean
}

export interface ProfessionalPublic {
  id: string
  user_ci: string
  full_name: string
  bio: string | null
  experience_years: number
  verification_status: "PENDING" | "APPROVED" | "REJECTED" | string
  rating_average: number
  rating_count: number
  is_available: boolean
  city: string | null
  zone: string | null
  specialties: SpecialtySimple[]
  availabilities: ProfessionalAvailability[]
}

export interface VerificationRequestResponse {
  id: string
  status: "PENDING" | "APPROVED" | "REJECTED" | string
  rejection_reason: string | null
}

export interface ProfessionalSearchParams {
  q?: string
  specialty_id?: string
  city?: string
  zone?: string
  min_rating?: number
  is_available?: boolean
  skip?: number
  limit?: number
}

export interface VerificationRequestInput {
  ciPhoto: File
  selfiePhoto: File
  certificatePdf: File
}