import api from "@/lib/axios"
import type {
  ApplicationCreateInput,
  ApplicationItem,
  ApplicationListResponse,
} from "./types"

export async function createApplication(payload: ApplicationCreateInput) {
  const { data } = await api.post<ApplicationItem>("/applications", payload)
  return data
}

export async function listMyApplications() {
  const { data } = await api.get<ApplicationListResponse>("/applications/me")
  return data
}

export async function getApplicationById(applicationId: string) {
  const { data } = await api.get<ApplicationItem>(
    `/applications/${applicationId}`,
  )
  return data
}

export async function listRequestApplications(requestId: string) {
  const { data } = await api.get<ApplicationListResponse>(
    `/applications/request/${requestId}`,
  )
  return data
}

export async function acceptApplication(applicationId: string) {
  const { data } = await api.post<ApplicationItem>(
    `/applications/${applicationId}/accept`,
  )
  return data
}

export async function rejectApplication(applicationId: string) {
  const { data } = await api.post<ApplicationItem>(
    `/applications/${applicationId}/reject`,
  )
  return data
}

export async function cancelMyApplication(applicationId: string) {
  const { data } = await api.post<ApplicationItem>(
    `/applications/${applicationId}/cancel`,
  )
  return data
}