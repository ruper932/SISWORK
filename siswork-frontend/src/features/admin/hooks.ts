import { useQuery } from "@tanstack/react-query"
import { getAdminDashboard } from "./api"

export const adminKeys = {
  all: ["admin"] as const,
  dashboard: () => [...adminKeys.all, "dashboard"] as const,
}

export function useAdminDashboardQuery() {
  return useQuery({
    queryKey: adminKeys.dashboard(),
    queryFn: getAdminDashboard,
  })
}