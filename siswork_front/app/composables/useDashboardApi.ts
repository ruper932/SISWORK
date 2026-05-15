import type { AdminDashboardSummary } from '~/types/dashboard'

export function useDashboardApi() {
  const { apiAuth } = useApiAuth()

  const getSummary = () =>
    apiAuth<AdminDashboardSummary>('/api/v1/dashboard/summary', {
      method: 'GET'
    })

  return {
    getSummary
  }
}