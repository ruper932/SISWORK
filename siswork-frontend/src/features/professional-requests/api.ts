import { api } from "@/lib/axios"
import type {
  ProfessionalRequest,
  ProfessionalRequestListResponse,
} from "./types"
import type {
  ProfessionalRequestCreateOutput,
  ProfessionalRequestRejectOutput,
} from "./schemas"

export async function createProfessionalRequest(
  payload: ProfessionalRequestCreateOutput,
) {
  const body = {
    bio: payload.bio?.trim() || null,
    experience_years: payload.experience_years,
    motivation: payload.motivation?.trim() || null,
  }

  const { data } = await api.post<ProfessionalRequest>(
    "/professional-requests",
    body,
  )

  return data
}

export async function listMyProfessionalRequests() {
  const { data } = await api.get<ProfessionalRequestListResponse>(
    "/professional-requests/me",
  )
  return data
}

export async function listPendingProfessionalRequests() {
  const { data } = await api.get<ProfessionalRequestListResponse>(
    "/professional-requests/pending",
  )
  return data
}

export async function approveProfessionalRequest(id: string) {
  const { data } = await api.post<ProfessionalRequest>(
    `/professional-requests/${id}/approve`,
  )
  return data
}

export async function rejectProfessionalRequest(
  id: string,
  payload: ProfessionalRequestRejectOutput,
) {
  const { data } = await api.post<ProfessionalRequest>(
    `/professional-requests/${id}/reject`,
    payload,
  )
  return data
}