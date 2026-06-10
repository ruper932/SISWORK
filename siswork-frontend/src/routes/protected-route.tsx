import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "@/features/auth/use-auth"

type ProtectedRouteProps = {
  roles?: string[]
}

export function ProtectedRoute({ roles }: ProtectedRouteProps) {
  const location = useLocation()
  const { user, isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <div className="p-6 text-sm text-muted-foreground">Cargando sesión...</div>
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (roles && roles.length > 0) {
    const userRoles = user.roles ?? []
    const hasRequiredRole = roles.some((role) => userRoles.includes(role))

    if (!hasRequiredRole) {
      return <Navigate to="/dashboard" replace />
    }
  }

  return <Outlet />
}