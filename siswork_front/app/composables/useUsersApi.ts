import type { UserListItem } from '~/types/user'

export const useUsersApi = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase as string

  const getUsers = () =>
    $fetch<UserListItem[]>('/api/v1/users', {
      baseURL
    })

  const getUser = (id: string) =>
    $fetch(`/api/v1/users/${id}`, {
      baseURL
    })

  const createUser = (payload: any) =>
    $fetch('/api/v1/users', {
      baseURL,
      method: 'POST',
      body: payload
    })

  const updateUser = (id: string, payload: any) =>
    $fetch(`/api/v1/users/${id}`, {
      baseURL,
      method: 'PATCH',
      body: payload
    })

  const deleteUser = (id: string) =>
    $fetch(`/api/v1/users/${id}`, {
      baseURL,
      method: 'DELETE'
    })

  return { getUsers, getUser, createUser, updateUser, deleteUser }
}