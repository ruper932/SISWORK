import { ModeToggle } from "@/components/mode-toggle"
import { Link, NavLink, Outlet } from "react-router-dom"
import {
  LayoutDashboard,
  BriefcaseBusiness,
  Users,
  FileText,
  Star,
  ShieldCheck,
  Settings,
  LogOut,
  UserCog,
} from "lucide-react"
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
    to: "/support",
    label: "Soporte",
    icon: ShieldCheck,
    allowedRoles: ["ADMIN", "SUPERADMIN"],
  },
  /*{
    to: "/admin",
    label: "Admin",
    icon: Settings,
    allowedRoles: ["ADMIN", "SUPERADMIN"],
  },*/
  
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
                        "group flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all duration-200",
                        "rounded-xl",
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
            <div className="rounded-2xl border border-border/60 bg-background/80 p-4 shadow-sm">
              <p className="text-sm font-semibold text-foreground">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{user?.email}</p>

              <div className="mt-3 flex flex-wrap gap-2">
                {userRoles.map((role) => (
                  <span
                    key={role}
                    className="rounded-full border border-border bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
                  >
                    {role}
                  </span>
                ))}
              </div>

              <button
                type="button"
                onClick={logout}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm font-medium transition hover:bg-muted"
              >
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </button>
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