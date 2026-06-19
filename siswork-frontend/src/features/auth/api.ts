import api from "@/lib/axios"
import type {
  LoginFormValues,
  RegisterFormValues,
  TokenResponse,
  User,
  Login2FAValues,
} from "./types"

export type TwoFactorSetupResponse = {
  qr_code_base64: string
  secret: string
  message: string
}

export type BasicMessageResponse = {
  message?: string
}

export type ChangePasswordPayload = {
  current_password: string
  new_password: string
}

export async function login(payload: LoginFormValues) {
  const params = new URLSearchParams()
  params.append("username", payload.username)
  params.append("password", payload.password)

  const { data } = await api.post<
    TokenResponse | { requires_2fa: true; temp_token: string; token_type: string; message?: string }
  >("/auth/login", params, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })

  return data
}

export async function loginWith2FA(payload: Login2FAValues) {
  const { data } = await api.post<TokenResponse>("/auth/2fa/validate", payload)
  return data
}

export async function setup2FA() {
  const { data } = await api.post<TwoFactorSetupResponse>("/auth/2fa/setup")
  return data
}

export async function verify2FA(code: string) {
  const { data } = await api.post<BasicMessageResponse>("/auth/2fa/verify", { code })
  return data
}

export async function disable2FA(payload: { password: string; code: string }) {
  const { data } = await api.post<BasicMessageResponse>("/auth/2fa/disable", payload)
  return data
}

export async function changePassword(payload: ChangePasswordPayload) {
  const { data } = await api.post<BasicMessageResponse>("/auth/change-password", payload)
  return data
}

export async function register(payload: RegisterFormValues) {
  const { data } = await api.post<User>("/auth/register", payload)
  return data
}

export async function getMe() {
  const { data } = await api.get<User>("/auth/me")
  return data
}