import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createUser,
  deleteUser,
  getUserByCi,
  getUsers,
  restoreUser,
  updateUser,
} from "./api"
import type { CreateUserInput, UpdateUserInput, UserFilters } from "./types"

export function useUsers(filters: UserFilters) {
  return useQuery({
    queryKey: ["users", filters],
    queryFn: () => getUsers(filters),
  })
}

export function useUser(ci: string, enabled = true) {
  return useQuery({
    queryKey: ["users", ci],
    queryFn: () => getUserByCi(ci),
    enabled,
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateUserInput) => createUser(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ ci, payload }: { ci: string; payload: UpdateUserInput }) =>
      updateUser(ci, payload),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["users"] }),
        queryClient.invalidateQueries({ queryKey: ["users", variables.ci] }),
      ])
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ci: string) => deleteUser(ci),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })
}

export function useRestoreUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ci: string) => restoreUser(ci),
    onSuccess: async (_, ci) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["users"] }),
        queryClient.invalidateQueries({ queryKey: ["users", ci] }),
      ])
    },
  })
}