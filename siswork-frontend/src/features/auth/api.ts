import api from "@/lib/axios"
import type {
  LoginFormValues,
  RegisterFormValues,
  TokenResponse,
  User,
} from "./types"

export async function login(payload: LoginFormValues) {
  const params = new URLSearchParams()
  params.append("username", payload.username)
  params.append("password", payload.password)

  const { data } = await api.post<TokenResponse>("/auth/login", params, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })

  return data
}

export async function register(payload: RegisterFormValues) {
  const { data } = await api.post<User>("/auth/register", payload)
  return data
}

export async function getMe() {
  const { data } = await api.get<User>("/users/me")
  return data
}