import { useMutation } from "@tanstack/react-query"
import { useLocation, useNavigate } from "react-router-dom"
import { register as registerRequest } from "./api"
import { useAuth } from "./use-auth"
import type { LoginSchema, RegisterSchema } from "./schemas"

function getDefaultRouteByRole(roles: string[]) {
  if (roles.includes("ADMIN")) return "/admin"
  return "/dashboard"
}

export function useLoginMutation() {
  const navigate = useNavigate()
  const location = useLocation()
  const auth = useAuth()

  return useMutation({
    mutationFn: async (values: LoginSchema) => {
      // Usamos el import de api.ts directamente para ver qué devuelve
      const response = await import("./api").then(m => m.login(values))
      if ("requires_2fa" in response && response.requires_2fa) {
        return { requires_2fa: true, temp_token: response.temp_token }
      }
      return auth.login(values) // El login de context ya setea el token
    },
    onSuccess: (data) => {
      if (data && "requires_2fa" in data && data.requires_2fa) {
        // Redirigir a pantalla de desafío 2FA
        navigate("/login/2fa", { state: { temp_token: data.temp_token } })
        return
      }
      // @ts-ignore
      const redirectTo = location.state?.from?.pathname || getDefaultRouteByRole(data.roles)
      navigate(redirectTo, { replace: true })
    },
  })
}

export function useRegisterMutation() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (values: RegisterSchema) => registerRequest(values),
    onSuccess: () => {
      navigate("/login", { replace: true })
    },
  })
}