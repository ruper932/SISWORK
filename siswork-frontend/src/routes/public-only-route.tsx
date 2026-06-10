import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "@/features/auth/use-auth"

function getDefaultRouteByRole(roles: string[]) {
  if (roles.includes("ADMIN")) return "/admin"
  return "/dashboard"
}

export function PublicOnlyRoute() {
  const { isAuthenticated, isLoading, user } = useAuth()

  if (isLoading) {
    return <div className="p-6">Cargando...</div>
  }

  if (isAuthenticated && user) {
    return <Navigate to={getDefaultRouteByRole(user.roles)} replace />
  }

  return <Outlet />
}