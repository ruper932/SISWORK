export type User = {
  ci: string
  first_name: string
  last_name: string
  mother_last_name?: string | null
  birth_date: string
  email: string
  phone: string
  city?: string | null
  zone?: string | null
  is_active: boolean
  is_verified: boolean
  roles: string[]
}

export type UserListResponse = {
  items: User[]
  total: number
  skip: number
  limit: number
}

export type UserFilters = {
  q?: string
  role?: string
  city?: string
  zone?: string
  is_active?: boolean
  is_verified?: boolean
  include_deleted?: boolean
  skip?: number
  limit?: number
}

export type CreateUserInput = {
  ci: string
  first_name: string
  last_name: string
  mother_last_name?: string
  birth_date: string
  email: string
  phone: string
  password: string
  city?: string
  zone?: string
}

export type UpdateUserInput = {
  first_name?: string
  last_name?: string
  mother_last_name?: string
  birth_date?: string
  email?: string
  phone?: string
  password?: string
  city?: string
  zone?: string
  whatsapp_enabled?: boolean
  profile_photo_path?: string
  latitude?: number
  longitude?: number
  is_active?: boolean
  is_verified?: boolean
}