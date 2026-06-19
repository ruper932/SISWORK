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
  totp_enabled?: boolean
}

export interface LoginFormValues {
  username: string
  password: string
}

export interface Login2FAValues {
  temp_token: string
  code: string
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
  requires_2fa: boolean
  access_token: string | null
  token_type: string
  temp_token: string | null
  message?: string
}