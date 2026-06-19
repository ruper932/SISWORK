import { useState } from "react"
import { useLocation, useNavigate, Navigate } from "react-router-dom"
import { ShieldCheck, ArrowRight } from "lucide-react"
import { loginWith2FA } from "./api"
import { useAuth } from "./use-auth"
import { setAccessToken } from "./auth-storage"

type Login2FALocationState = {
  temp_token?: string
}

export function Login2FAPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const auth = useAuth()

  const state = location.state as Login2FALocationState | null
  const tempToken = state?.temp_token ?? null

  const [code, setCode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  if (!tempToken) return <Navigate to="/login" replace />

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const safeTempToken = tempToken

    if (!safeTempToken) {
      setError("Sesión de verificación no válida")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await loginWith2FA({
        temp_token: safeTempToken,
        code,
      })

      const accessToken = response.access_token

      if (!accessToken) {
        throw new Error("La respuesta no contiene un token válido")
      }

      setAccessToken(accessToken)

      const user = await auth.refreshMe()
      const roles = user?.roles || []
      const redirectTo = roles.includes("ADMIN") ? "/admin" : "/dashboard"

      navigate(redirectTo, { replace: true })
    } catch (err: any) {
      setError(err.response?.data?.detail || "Código incorrecto")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-xl">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 rounded-full bg-primary/10 p-3 text-primary">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Autenticación en dos pasos
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Ingresa el código de 6 dígitos generado por tu aplicación autenticadora
            (ej. Authy).
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              autoFocus
              type="text"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="000000"
              className="h-14 w-full rounded-xl border border-border bg-background px-4 text-center text-2xl tracking-[0.5em] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {error && <p className="text-center text-sm text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={isLoading || code.length !== 6}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
          >
            {isLoading ? "Verificando..." : "Verificar código"}
            {!isLoading && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>
      </div>
    </div>
  )
}