import type { ProfessionalProfilePublic } from '~/types/professional'

export function useProfessionalProfilesApi() {
  const { apiAuth } = useApiAuth()

  const list = () =>
    apiAuth<ProfessionalProfilePublic[]>('/api/v1/professional-profiles/public', {
      method: 'GET'
    })

  const getById = (id: string) =>
    apiAuth<ProfessionalProfilePublic>(`/api/v1/professional-profiles/public/${id}`, {
      method: 'GET'
    })

  return {
    list,
    getById
  }
}