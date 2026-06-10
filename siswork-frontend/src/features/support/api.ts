import api from "@/lib/axios"
import type {
  RejectVerificationInput,
  SupportVerificationItem,
} from "./types"

export async function approveVerification(verificationRequestId: string) {
  const { data } = await api.post<string>(
    `/support/approve/${verificationRequestId}`,
  )
  return data
}

export async function rejectVerification({
  verification_request_id,
  rejection_reason,
}: RejectVerificationInput) {
  const { data } = await api.post<string>(
    `/support/reject/${verification_request_id}`,
    null,
    {
      params: {
        rejection_reason,
      },
    },
  )
  return data
}