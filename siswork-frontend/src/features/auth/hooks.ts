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
    mutationFn: (values: LoginSchema) => auth.login(values),
    onSuccess: (user) => {
      const redirectTo =
        location.state?.from?.pathname || getDefaultRouteByRole(user.roles)

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