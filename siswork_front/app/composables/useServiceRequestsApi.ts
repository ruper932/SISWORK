import type { ServiceRequest } from '~/types/service-request'

export function useServiceRequestsApi() {
  const { apiAuth } = useApiAuth()

  const list = () =>
    apiAuth<ServiceRequest[]>('/api/v1/service-requests', {
      method: 'GET'
    })

  const getById = (id: string) =>
    apiAuth<ServiceRequest>(`/api/v1/service-requests/${id}`, {
      method: 'GET'
    })

  return {
    list,
    getById
  }
}