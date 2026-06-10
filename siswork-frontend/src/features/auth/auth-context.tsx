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

interface AuthContextValue {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (values: LoginFormValues) => Promise<User>
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

  const login = useCallback(async (values: LoginFormValues) => {
    const response = await loginRequest(values)
    setAccessToken(response.access_token)
    setTokenState(response.access_token)

    const me = await getMe()
    setUser(me)
    return me
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