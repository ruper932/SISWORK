import { Link, Outlet } from "react-router-dom"
import { ModeToggle } from "@/components/mode-toggle"

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20">
              S
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.18em] text-primary">
                SISWORK
              </p>
              <p className="text-xs text-muted-foreground">
                Marketplace de servicios
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
              <Link to="/" className="transition hover:text-foreground">
                Inicio
              </Link>
              <Link to="/login" className="transition hover:text-foreground">
                Ingresar
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-primary px-4 py-2 font-medium text-primary-foreground shadow-md shadow-primary/20 transition hover:opacity-95"
              >
                Registro
              </Link>
            </nav>

            <ModeToggle />
          </div>
        </div>
      </header>

      <main className="relative">
        <Outlet />
      </main>
    </div>
  )
}