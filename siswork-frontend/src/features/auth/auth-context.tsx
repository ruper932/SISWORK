import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { getMe, login as loginRequest } from "./api"
import { clearAccessToken, getAccessToken, setAccessToken } from "./auth-storage"
import type { LoginFormValues, User } from "./types"

type LoginResult =
  | { status: "authenticated"; user: User }
  | {
      status: "requires_2fa"
      temp_token: string
      message?: string
    }

interface AuthContextValue {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (values: LoginFormValues) => Promise<LoginResult>
  logout: () => void
  refreshMe: () => Promise<User | null>
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setTokenState] = useState<string | null>(getAccessToken())
  const [isLoading, setIsLoading] = useState(true)

  const refreshMe = useCallback(async () => {
    const storedToken = getAccessToken()

    if (!storedToken) {
      setUser(null)
      setTokenState(null)
      setIsLoading(false)
      return null
    }

    try {
      const me = await getMe()
      setUser(me)
      setTokenState(storedToken)
      return me
    } catch {
      clearAccessToken()
      setUser(null)
      setTokenState(null)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void refreshMe()
  }, [refreshMe])

  const login = useCallback(async (values: LoginFormValues): Promise<LoginResult> => {
    const response = await loginRequest(values)

    if ("access_token" in response) {
      const accessToken = response.access_token

      if (!accessToken) {
        throw new Error("La respuesta de autenticación no contiene un access token válido")
      }

      setAccessToken(accessToken)
      setTokenState(accessToken)

      const me = await getMe()
      setUser(me)

      return {
        status: "authenticated",
        user: me,
      }
    }

    if ("requires_2fa" in response && response.requires_2fa) {
      return {
        status: "requires_2fa",
        temp_token: response.temp_token,
        message: response.message,
      }
    }

    throw new Error("Respuesta de autenticación no válida")
  }, [])

  const logout = useCallback(() => {
    clearAccessToken()
    setUser(null)
    setTokenState(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      isLoading,
      login,
      logout,
      refreshMe,
    }),
    [user, token, isLoading, login, logout, refreshMe],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}