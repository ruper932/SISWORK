import type { ReactNode } from "react"
import { QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "sonner"
import { queryClient } from "@/lib/query-client"
import { AuthProvider } from "@/features/auth/auth-context"
import { ThemeProvider } from "@/components/theme-provider"

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              classNames: {
                toast:
                  "rounded-2xl border border-border bg-card text-card-foreground shadow-lg",
                title: "text-sm font-semibold",
                description: "text-sm text-muted-foreground",
              },
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}