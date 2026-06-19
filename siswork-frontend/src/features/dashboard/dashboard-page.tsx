import { Link } from "react-router-dom"
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  FileText,
  MapPin,
  ShieldCheck,
  Star,
  UserPen,
  Users,
} from "lucide-react"
import { useAuth } from "@/features/auth/use-auth"

type QuickAction = {
  to: string
  label: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  allowedRoles?: string[]
}

const quickActions: QuickAction[] = [
  {
    to: "/account/profile",
    label: "Editar perfil",
    description: "Actualiza tus datos personales y de contacto.",
    icon: UserPen,
  },
  {
    to: "/account/security",
    label: "Seguridad",
    description: "Administra tu contraseña y la verificación en dos pasos.",
    icon: ShieldCheck,
  },
  {
    to: "/requests",
    label: "Solicitudes",
    description: "Consulta y administra las solicitudes disponibles.",
    icon: BriefcaseBusiness,
  },
  {
    to: "/applications/me",
    label: "Postulaciones",
    description: "Revisa tus postulaciones activas e historial.",
    icon: FileText,
    allowedRoles: ["PROFESSIONAL", "ADMIN", "SUPERADMIN"],
  },
  {
    to: "/reviews/me",
    label: "Reseñas",
    description: "Mira las reseñas asociadas a tu cuenta.",
    icon: Star,
  },
  {
    to: "/professionals",
    label: "Profesionales",
    description: "Explora perfiles profesionales disponibles.",
    icon: Users,
  },
  {
    to: "/professional-requests/me",
    label: "Ser profesional",
    description: "Solicita la verificación de tu perfil profesional.",
    icon: BadgeCheck,
    allowedRoles: ["CLIENT"],
  },
]

function hasSomeRole(userRoles: string[], allowedRoles?: string[]) {
  if (!allowedRoles || allowedRoles.length === 0) return true
  return allowedRoles.some((role) => userRoles.includes(role))
}

function getRoleLabel(roles: string[]) {
  if (roles.includes("SUPERADMIN")) return "Superadministrador"
  if (roles.includes("ADMIN")) return "Administrador"
  if (roles.includes("SUPPORT")) return "Soporte"
  if (roles.includes("PROFESSIONAL")) return "Profesional"
  if (roles.includes("CLIENT")) return "Cliente"
  return "Usuario"
}

export function DashboardPage() {
  const { user } = useAuth()

  const userRoles = user?.roles ?? []
  const visibleQuickActions = quickActions.filter((item) =>
    hasSomeRole(userRoles, item.allowedRoles)
  )

  const fullName =
    [user?.first_name, user?.last_name, user?.mother_last_name]
      .filter(Boolean)
      .join(" ")
      .trim() || "Usuario"

  const roleLabel = getRoleLabel(userRoles)
  const is2FAEnabled = Boolean(user?.totp_enabled)
  const isVerified = Boolean(user?.is_verified)
  const isActive = Boolean(user?.is_active)

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-4">
            <div className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
              {roleLabel}
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Hola, {user?.first_name ?? "bienvenido"}
              </h2>
              <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
                Desde aquí puedes gestionar tu cuenta, revisar accesos rápidos y
                mantener tu información al día dentro de SISWORK.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                to="/account/profile"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
              >
                <UserPen className="h-4 w-4" />
                Editar perfil
              </Link>

              <Link
                to="/account/security"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted"
              >
                <ShieldCheck className="h-4 w-4" />
                Seguridad
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:w-[360px]">
            <div className="rounded-2xl border border-border/60 bg-background p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Cuenta
              </p>
              <p className="mt-2 text-sm font-semibold text-foreground">
                {isActive ? "Activa" : "Inactiva"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Estado general de tu usuario.
              </p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-background p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Verificación
              </p>
              <p className="mt-2 text-sm font-semibold text-foreground">
                {isVerified ? "Verificada" : "Pendiente"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Confirmación del perfil en plataforma.
              </p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-background p-4 sm:col-span-2">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Seguridad
              </p>
              <p className="mt-2 text-sm font-semibold text-foreground">
                {is2FAEnabled ? "2FA habilitado" : "2FA deshabilitado"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {is2FAEnabled
                  ? "Tu cuenta tiene una capa adicional de protección."
                  : "Activa la verificación en dos pasos para mejorar la seguridad."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Acciones rápidas
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Accesos directos a las secciones que más vas a usar.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {visibleQuickActions.map((item) => {
              const Icon = item.icon

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className="group rounded-2xl border border-border/60 bg-background p-4 transition hover:border-primary/30 hover:bg-muted/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="rounded-xl border border-border/60 bg-card p-2.5 text-primary transition group-hover:border-primary/20">
                      <Icon className="h-4 w-4" />
                    </div>

                    <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" />
                  </div>

                  <div className="mt-4">
                    <p className="text-sm font-semibold text-foreground">
                      {item.label}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        <div className="space-y-6">
          <section className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-foreground">
              Resumen de tu perfil
            </h3>

            <div className="mt-5 space-y-4">
              <div className="rounded-2xl border border-border/60 bg-background p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Nombre completo
                </p>
                <p className="mt-2 text-sm font-medium text-foreground">
                  {fullName}
                </p>
              </div>

              <div className="rounded-2xl border border-border/60 bg-background p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Correo
                </p>
                <p className="mt-2 break-all text-sm font-medium text-foreground">
                  {user?.email ?? "Sin correo registrado"}
                </p>
              </div>

              <div className="rounded-2xl border border-border/60 bg-background p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <p className="text-xs uppercase tracking-[0.18em]">
                    Ubicación
                  </p>
                </div>

                <p className="mt-2 text-sm font-medium text-foreground">
                  {[user?.city, user?.zone].filter(Boolean).join(" • ") ||
                    "Sin ubicación registrada"}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-foreground">
              Recomendaciones
            </h3>

            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="rounded-2xl border border-border/60 bg-background p-4">
                Completa o corrige tus datos desde{" "}
                <Link
                  to="/account/profile"
                  className="font-medium text-primary hover:underline"
                >
                  Editar perfil
                </Link>
                .
              </li>

              <li className="rounded-2xl border border-border/60 bg-background p-4">
                Refuerza tu cuenta desde{" "}
                <Link
                  to="/account/security"
                  className="font-medium text-primary hover:underline"
                >
                  Seguridad
                </Link>
                .
              </li>

              {userRoles.includes("CLIENT") && (
                <li className="rounded-2xl border border-border/60 bg-background p-4">
                  Si quieres ofrecer servicios, inicia tu proceso en{" "}
                  <Link
                    to="/professional-requests/me"
                    className="font-medium text-primary hover:underline"
                  >
                    Ser profesional
                  </Link>
                  .
                </li>
              )}
            </ul>
          </section>
        </div>
      </section>
    </div>
  )
}