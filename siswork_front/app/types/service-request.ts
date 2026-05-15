export type ServiceRequestStatus =
  | 'OPEN'
  | 'INPROGRESS'
  | 'ASSIGNED'
  | 'COMPLETED'
  | 'CANCELLED'

export type ContactChannel =
  | 'WHATSAPP'
  | 'PHONE'
  | 'INTERNALCHAT'
  | 'OTHER'

export interface ServiceRequest {
  id: string
  clientuserid: string
  specialtyid: string
  title: string
  description: string
  department: string
  city: string
  zone: string
  address?: string | null
  reference?: string | null
  preferreddate?: string | null
  preferredstarttime?: string | null
  preferredendtime?: string | null
  minimumbudget?: number | null
  maximumbudget?: number | null
  status: ServiceRequestStatus
  assignedprofessionalprofileid?: string | null
  contactchannel: ContactChannel
  isactive: boolean
  createdat?: string
  updatedat?: string
  closedat?: string | null
}