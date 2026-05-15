export type VerificationStatus =
  | 'PENDING'
  | 'INREVIEW'
  | 'APPROVED'
  | 'REJECTED'

export interface ProfessionalProfilePublic {
  professionalprofileid: string
  userid: string
  firstname: string
  lastname: string
  fullname: string
  bio: string | null
  yearsexperience: number
  mainzone: string
  averagerating: number
  ratingscount: number
  completedservicescount: number
  availablenow: boolean
  phone: string | null
  whatsappnumber: string | null
  specialties: string | null
  verificationstatus: VerificationStatus
}