import {
  BadgeCheck,
  LayoutDashboard,
  BriefcaseBusiness,
  Users,
  FileText,
  Star,
  ShieldCheck,
  LogOut,
  UserCog,
  UserPen,
  ChevronUp,
} from "lucide-react"
import { Link, NavLink, Outlet } from "react-router-dom"
import { ModeToggle } from "@/components/mode-toggle"
import { useAuth } from "@/features/auth/use-auth"

type NavItem = {
  to: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  allowedRoles?: string[]
}

const navItems: NavItem[] = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    to: "/admin/users",
    label: "Gestión de usuarios",
    icon: UserCog,
    allowedRoles: ["ADMIN", "SUPERADMIN"],
  },
  {
    to: "/professionals",
    label: "Profesionales",
    icon: Users,
  },
  {
    to: "/requests",
    label: "Solicitudes",
    icon: BriefcaseBusiness,
  },
  {
    to: "/applications/me",
    label: "Postulaciones",
    icon: FileText,
    allowedRoles: ["PROFESSIONAL", "ADMIN", "SUPERADMIN"],
  },
  {
    to: "/reviews/me",
    label: "Reseñas",
    icon: Star,
  },
  {
    to: "/professional-requests/me",
    label: "Ser profesional",
    icon: BadgeCheck,
    allowedRoles: ["CLIENT"],
  },
  {
    to: "/support/professional-requests",
    label: "Solicitudes profesionales",
    icon: BadgeCheck,
    allowedRoles: ["SUPPORT", "ADMIN", "SUPERADMIN"],
  },
  
]

export function PrivateLayout() {
  const { user, logout } = useAuth()

  const userRoles = user?.roles ?? []

  const visibleNavItems = navItems.filter((item) => {
    if (!item.allowedRoles || item.allowedRoles.length === 0) {
      return true
    }

    return item.allowedRoles.some((role) => userRoles.includes(role))
  })

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="hidden border-r border-border/60 bg-card/80 lg:flex lg:flex-col">
          <div className="border-b border-border/60 px-6 py-6">
            <Link to="/dashboard" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20">
                S
              </div>
              <div>
                <p className="text-sm font-semibold tracking-[0.18em] text-primary">
                  SISWORK
                </p>
                <p className="text-xs text-muted-foreground">Panel principal</p>
              </div>
            </Link>
          </div>

          <div className="px-4 py-6">
            <p className="px-3 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Navegación
            </p>

            <nav className="mt-4 space-y-1.5">
              {visibleNavItems.map((item) => {
                const Icon = item.icon

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      [
                        "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                        isActive
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground",
                      ].join(" ")
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          className={[
                            "h-4 w-4 transition-all duration-200",
                            isActive
                              ? "text-primary drop-shadow-[0_0_10px_hsl(var(--primary)/0.45)]"
                              : "text-muted-foreground group-hover:text-foreground",
                          ].join(" ")}
                        />
                        <span
                          className={[
                            "transition-all duration-200",
                            isActive
                              ? "text-primary [text-shadow:0_0_10px_hsl(var(--primary)/0.30)]"
                              : "text-muted-foreground group-hover:text-foreground",
                          ].join(" ")}
                        >
                          {item.label}
                        </span>
                      </>
                    )}
                  </NavLink>
                )
              })}
            </nav>
          </div>

          <div className="mt-auto border-t border-border/60 p-4">
            <div className="group relative">
              <div
                className="
                  flex cursor-pointer items-center justify-between gap-3 rounded-2xl
                  border border-border/60 bg-background/80 px-4 py-3 shadow-sm
                  transition-colors duration-150 hover:bg-background
                "
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {user?.first_name} {user?.last_name}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {user?.email}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {userRoles.map((role) => (
                      <span
                        key={role}
                        className="rounded-full border border-border bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>

                <ChevronUp
                  className="
                    h-4 w-4 shrink-0 text-muted-foreground
                    transition-all duration-150
                    group-hover:-translate-y-0.5 group-hover:text-foreground
                    group-focus-within:-translate-y-0.5 group-focus-within:text-foreground
                  "
                />
              </div>

              <div className="absolute inset-x-0 bottom-full h-3" />

              <div
                className="
                  pointer-events-none absolute bottom-[calc(100%+0.25rem)] left-0 right-0 z-40
                  origin-bottom rounded-2xl border border-border/60 bg-background/95 p-2
                  opacity-0 shadow-lg backdrop-blur-md
                  scale-[0.98] transition-all duration-150 ease-out
                  group-hover:pointer-events-auto group-hover:opacity-100 group-hover:scale-100
                  group-focus-within:pointer-events-auto group-focus-within:opacity-100 group-focus-within:scale-100
                "
              >
                <Link
                  to="/account/profile"
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus:bg-muted"
                >
                  <UserPen className="h-4 w-4 text-muted-foreground" />
                  Perfil
                </Link>

                <Link
                  to="/account/security"
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus:bg-muted"
                >
                  <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                  Seguridad
                </Link>

                <button
                  type="button"
                  onClick={logout}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 focus:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4" />
                  Salir
                </button>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-xl">
            <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
                  SISWORK
                </p>
                <h1 className="mt-1 text-lg font-semibold text-foreground">
                  Bienvenido, {user?.first_name}
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  to="/account/security"
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span className="hidden sm:inline">Seguridad</span>
                </Link>

                <ModeToggle />

                <div className="hidden rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground sm:block">
                  {user?.city || "Sin ciudad"}
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-7xl">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}