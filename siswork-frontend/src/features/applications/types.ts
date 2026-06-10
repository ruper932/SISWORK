export type ApplicationStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED"
  | "WITHDRAWN"
  | "COMPLETED"
  | "CANCELLED"

export interface ApplicationItem {
  id: string
  request_id: string
  professional_profile_id: string
  proposal_message: string
  proposed_price: string | null
  estimated_time_hours: number | null
  status: ApplicationStatus
  created_at: string
  updated_at: string
}

export interface ApplicationListResponse {
  items: ApplicationItem[]
  total: number
}

export interface ApplicationCreateInput {
  request_id: string
  proposal_message: string
  proposed_price: number | null
  estimated_time_hours: number | null
}