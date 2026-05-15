export type SpecialtyStatus = 'ACTIVE' | 'INACTIVE'

export interface SpecialtyResponse {
  id: string
  code: string
  name: string
  description: string | null
  is_active: boolean
  created_at?: string | null
}

export interface SpecialtyCreateRequest {
  code: string
  name: string
  description?: string | null
  is_active?: boolean
}

export interface SpecialtyUpdateRequest {
  code?: string
  name?: string
  description?: string | null
  is_active?: boolean
}

export interface SpecialtyListFilters {
  search?: string
  is_active?: boolean | null
}