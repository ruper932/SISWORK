export interface SupportVerificationItem {
  id: string
  status: "PENDING" | "APPROVED" | "REJECTED" | string
  rejection_reason: string | null
}

export interface RejectVerificationInput {
  verification_request_id: string
  rejection_reason: string
}