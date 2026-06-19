import { api } from "@/lib/axios"

export type PaginatedResponse<T> = {
  items: T[]
  total: number
  skip?: number
  limit?: number
}

export type RequestItem = {
  id: string
  status: string
  created_at: string
}

export type ApplicationItem = {
  id: string
  status: string
  created_at: string
}

export type ReviewItem = {
  id: string
  rating: number
  created_at: string
}

export type ProfessionalItem = {
  id: string
  user_ci: string
  rating_average: number
  rating_count: number
}

export type ProfessionalRequestItem = {
  id: string
  status: string
  created_at: string
}

export type UserListItem = {
  ci: string
}

export const getAllRequests = async () => {
  const { data } = await api.get<PaginatedResponse<RequestItem>>("/requests", {
    params: { limit: 1, skip: 0 },
  })
  return data
}

export const getMyRequests = async () => {
  const { data } = await api.get<PaginatedResponse<RequestItem>>("/requests/me", {
    params: { limit: 100, skip: 0 },
  })
  return data
}

export const getMyApplications = async () => {
  const { data } = await api.get<PaginatedResponse<ApplicationItem>>("/applications/me")
  return data
}

export const getMyReviews = async () => {
  const { data } = await api.get<ReviewItem[]>("/reviews/me")
  return data
}

export const getProfessionals = async () => {
  const { data } = await api.get<ProfessionalItem[]>("/professionals", {
    params: { limit: 100, skip: 0 },
  })
  return data
}

export const getMyProfessionalRequests = async () => {
  const { data } = await api.get<PaginatedResponse<ProfessionalRequestItem>>(
    "/professional-requests/me",
    { params: { limit: 100, skip: 0 } }
  )
  return data
}

export const getPendingProfessionalRequests = async () => {
  const { data } = await api.get<PaginatedResponse<ProfessionalRequestItem>>(
    "/professional-requests/pending",
    { params: { limit: 100, skip: 0 } }
  )
  return data
}

export const getUsersTotal = async () => {
  const { data } = await api.get<PaginatedResponse<UserListItem>>("/users", {
    params: { limit: 1, skip: 0 },
  })
  return data.total
}