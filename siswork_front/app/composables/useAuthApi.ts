export type RegisterPayload = {
  first_name: string
  last_name: string
  email: string
  password: string
}

export type RegisterResponse = {
  id: string
  first_name: string
  last_name: string
  email: string
  role?: string
  status?: string
}

export function useAuthApi() {
  const config = useRuntimeConfig()

  async function register(payload: RegisterPayload): Promise<RegisterResponse> {
    return await $fetch<RegisterResponse>('/api/v1/auth/register', {
      baseURL: config.public.apiBase,
      method: 'POST',
      body: payload
    })
  }

  return {
    register
  }
}