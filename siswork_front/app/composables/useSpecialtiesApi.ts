import type {
  SpecialtyCreateRequest,
  SpecialtyListFilters,
  SpecialtyResponse,
  SpecialtyUpdateRequest
} from '~/types/specialty'

export function useSpecialtiesApi() {
  const { apiAuth } = useApiAuth()

  async function getSpecialties(filters: SpecialtyListFilters = {}): Promise<SpecialtyResponse[]> {
    const query = new URLSearchParams()

    if (filters.search?.trim()) {
      query.append('search', filters.search.trim())
    }

    if (typeof filters.is_active === 'boolean') {
      query.append('is_active', String(filters.is_active))
    }

    const queryString = query.toString()
    const url = queryString
      ? `/api/v1/specialties?${queryString}`
      : '/api/v1/specialties'

    return await apiAuth<SpecialtyResponse[]>(url)
  }

  async function getSpecialtyById(id: string): Promise<SpecialtyResponse> {
    return await apiAuth<SpecialtyResponse>(`/api/v1/specialties/${id}`)
  }

  async function createSpecialty(payload: SpecialtyCreateRequest): Promise<SpecialtyResponse> {
    return await apiAuth<SpecialtyResponse>('/api/v1/specialties', {
      method: 'POST',
      body: payload
    })
  }

  async function updateSpecialty(id: string, payload: SpecialtyUpdateRequest): Promise<SpecialtyResponse> {
    return await apiAuth<SpecialtyResponse>(`/api/v1/specialties/${id}`, {
      method: 'PUT',
      body: payload
    })
  }

  async function deleteSpecialty(id: string): Promise<void> {
    await apiAuth(`/api/v1/specialties/${id}`, {
      method: 'DELETE'
    })
  }

  return {
    getSpecialties,
    getSpecialtyById,
    createSpecialty,
    updateSpecialty,
    deleteSpecialty
  }
}