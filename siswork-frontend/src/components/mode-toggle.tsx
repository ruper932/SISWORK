import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

export function ModeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        theme === "dark"
          ? "Cambiar a modo claro"
          : "Cambiar a modo oscuro"
      }
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition hover:bg-muted"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  )
}