import api from "@/lib/axios"
import type {
  RequestCancelInput,
  RequestCreateInput,
  RequestItem,
  RequestListResponse,
  RequestUpdateInput,
  UrgencyLevel,
} from "./types"

export interface ListRequestsParams {
  q?: string
  specialty_id?: string
  city?: string
  zone?: string
  urgency?: UrgencyLevel
  skip?: number
  limit?: number
}

export async function listRequests(params: ListRequestsParams = {}) {
  const { data } = await api.get<RequestListResponse>("/requests", {
    params,
  })
  return data
}

export async function listMyRequests(skip = 0, limit = 50) {
  const { data } = await api.get<RequestListResponse>("/requests/me", {
    params: { skip, limit },
  })
  return data
}

export async function getRequestById(requestId: string) {
  const { data } = await api.get<RequestItem>(`/requests/${requestId}`)
  return data
}

export async function createRequest(payload: RequestCreateInput) {
  const { data } = await api.post<RequestItem>("/requests", payload)
  return data
}

export async function updateRequest(
  requestId: string,
  payload: RequestUpdateInput,
) {
  const { data } = await api.put<RequestItem>(`/requests/${requestId}`, payload)
  return data
}

export async function cancelRequest(
  requestId: string,
  payload?: RequestCancelInput,
) {
  const { data } = await api.post<RequestItem>(
    `/requests/${requestId}/cancel`,
    payload ?? {},
  )
  return data
}

export async function startRequest(requestId: string) {
  const { data } = await api.post<RequestItem>(`/requests/${requestId}/start`)
  return data
}

export async function completeRequest(requestId: string) {
  const { data } = await api.post<RequestItem>(`/requests/${requestId}/complete`)
  return data
}