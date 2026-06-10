import { api } from "@/lib/axios"
import type {
  CreateUserInput,
  UpdateUserInput,
  User,
  UserFilters,
  UserListResponse,
} from "./types"

export async function getUsers(filters: UserFilters = {}): Promise<UserListResponse> {
  const { data } = await api.get("/users", { params: filters })
  return data
}

export async function getUserByCi(ci: string): Promise<User> {
  const { data } = await api.get(`/users/${ci}`)
  return data
}

export async function createUser(payload: CreateUserInput): Promise<User> {
  const { data } = await api.post("/users", payload)
  return data
}

export async function updateUser(ci: string, payload: UpdateUserInput): Promise<User> {
  const { data } = await api.patch(`/users/${ci}`, payload)
  return data
}

export async function deleteUser(ci: string): Promise<void> {
  await api.delete(`/users/${ci}`)
}

export async function restoreUser(ci: string): Promise<User> {
  const { data } = await api.patch(`/users/${ci}/restore`)
  return data
}