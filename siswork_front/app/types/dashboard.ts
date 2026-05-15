export interface AdminDashboardSummary {
  totalusers: number
  totalclients: number
  totalprofessionals: number
  totalservicerequests: number
  openservicerequests: number
  completedservicerequests: number
  pendingvalidations: number
  platformaveragerating: number | null
}