import api from "@/lib/axios"
import type {
  ProfessionalPublic,
  ProfessionalSearchParams,
  VerificationRequestResponse,
} from "./types"

export async function searchProfessionals(params: ProfessionalSearchParams = {}) {
  const { data } = await api.get<ProfessionalPublic[]>("/professionals", {
    params,
  })
  return data
}

export async function getProfessionalDetail(userCi: string) {
  const { data } = await api.get<ProfessionalPublic>(`/professionals/${userCi}`)
  return data
}

export async function requestVerification(payload: {
  ciPhoto: File
  selfiePhoto: File
  certificatePdf: File
}) {
  const formData = new FormData()
  formData.append("ci_photo", payload.ciPhoto)
  formData.append("selfie_photo", payload.selfiePhoto)
  formData.append("certificate_pdf", payload.certificatePdf)

  const { data } = await api.post<VerificationRequestResponse>(
    "/professionals/request-verification",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  )

  return data
}