import api from "@/lib/axios"

export type AdminDashboardResponse = {
  message: string
  user: string
}

export async function getAdminDashboard(): Promise<AdminDashboardResponse> {
  const { data } = await api.get<AdminDashboardResponse>("/admin/dashboard")
  return data
}