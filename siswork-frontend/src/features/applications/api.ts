// src/features/applications/api.ts

import { api } from "@/lib/axios"
import type {
  ApplicationCreate,
  ApplicationListResponse,
  ApplicationResponse,
} from "./types"

export async function createApplication(payload: ApplicationCreate) {
  const { data } = await api.post<ApplicationResponse>("/applications", payload)
  return data
}

export async function getMyApplications() {
  const { data } = await api.get<ApplicationListResponse>("/applications/me")
  return data
}

export async function getApplicationById(applicationId: string) {
  const { data } = await api.get<ApplicationResponse>(
    `/applications/${applicationId}`
  )
  return data
}

export async function getRequestApplications(requestId: string) {
  const { data } = await api.get<ApplicationListResponse>(
    `/applications/request/${requestId}`
  )
  return data
}

export async function acceptApplication(applicationId: string) {
  const { data } = await api.post<ApplicationResponse>(
    `/applications/${applicationId}/accept`
  )
  return data
}

export async function rejectApplication(applicationId: string) {
  const { data } = await api.post<ApplicationResponse>(
    `/applications/${applicationId}/reject`
  )
  return data
}

export async function cancelMyApplication(applicationId: string) {
  const { data } = await api.post<ApplicationResponse>(
    `/applications/${applicationId}/cancel`
  )
  return data
}