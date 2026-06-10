export type UserRole =
  | "CLIENT"
  | "PROFESSIONAL"
  | "ADMIN"
  | "SUPPORT"
  | "SUPERADMIN"
  | string

export interface User {
  ci: string
  first_name: string
  last_name: string
  mother_last_name: string
  birth_date: string
  email: string
  phone: string
  city: string
  zone: string
  is_active: boolean
  is_verified: boolean
  roles: UserRole[]
}

export interface LoginFormValues {
  username: string
  password: string
}

export interface RegisterFormValues {
  ci: string
  first_name: string
  last_name: string
  mother_last_name: string
  birth_date: string
  email: string
  phone: string
  password: string
  city: string
  zone: string
}

export interface TokenResponse {
  access_token: string
  token_type: string
}