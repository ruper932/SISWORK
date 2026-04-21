export const useApiAuth = () => {
  const config = useRuntimeConfig()

  async function apiAuth<T>(url: string, options: any = {}): Promise<T> {
    let token: string | null = null

    if (import.meta.client) {
      token = localStorage.getItem('access_token')
    }

    return await $fetch<T>(url, {
      baseURL: config.public.apiBase,
      ...options,
      headers: {
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    })
  }

  return { apiAuth }
}