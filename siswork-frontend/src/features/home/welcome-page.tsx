import { Link } from "react-router-dom"
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Clock3,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react"
import { useAuth } from "@/features/auth/use-auth"

function getDefaultRouteByRole(roles: string[]) {
  if (roles.includes("ADMIN")) return "/admin"
  return "/dashboard"
}

const stats = [
  { label: "Profesionales verificados", value: "250+" },
  { label: "Solicitudes activas", value: "120+" },
  { label: "Calificación promedio", value: "4.8/5" },
]

const features = [
  {
    icon: Search,
    title: "Encuentra al profesional ideal",
    description:
      "Explora perfiles, experiencia y servicios disponibles en un solo lugar.",
  },
  {
    icon: ShieldCheck,
    title: "Más confianza y seguridad",
    description:
      "SISWORK prioriza perfiles confiables y una experiencia clara para ambas partes.",
  },
  {
    icon: Clock3,
    title: "Ahorra tiempo al contratar",
    description:
      "Publica una solicitud o encuentra ayuda profesional sin procesos innecesarios.",
  },
]

const steps = [
  {
    icon: BriefcaseBusiness,
    title: "Publica tu necesidad",
    description:
      "Describe el servicio que necesitas y recibe interés de profesionales.",
  },
  {
    icon: Users,
    title: "Compara opciones",
    description:
      "Revisa perfiles, roles y experiencia para elegir mejor.",
  },
  {
    icon: BadgeCheck,
    title: "Conecta con confianza",
    description:
      "Gestiona postulaciones, soporte y seguimiento desde la plataforma.",
  },
]

export function WelcomePage() {
  const { isAuthenticated, isLoading, user, logout } = useAuth()

  if (isLoading) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center px-6">
        <p className="text-sm text-muted-foreground">Cargando...</p>
      </section>
    )
  }

  const dashboardRoute = user ? getDefaultRouteByRole(user.roles) : "/dashboard"

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.14),transparent_28%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.12),transparent_24%)]" />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-4 py-2 text-sm text-muted-foreground shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4 text-primary" />
              Plataforma de servicios profesionales
            </span>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Conecta con profesionales confiables de forma rápida y clara
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              SISWORK une clientes, profesionales y administradores en una sola
              plataforma para publicar solicitudes, gestionar postulaciones y
              construir relaciones de trabajo con más confianza.
            </p>

            {!isAuthenticated ? (
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition hover:opacity-95"
                >
                  Crear cuenta
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-2xl border border-border bg-background px-6 py-3 text-sm font-medium text-foreground transition hover:bg-muted"
                >
                  Iniciar sesión
                </Link>
              </div>
            ) : (
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to={dashboardRoute}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition hover:opacity-95"
                >
                  Ir a mi panel
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <button
                  type="button"
                  onClick={logout}
                  className="inline-flex items-center justify-center rounded-2xl border border-border bg-background px-6 py-3 text-sm font-medium text-foreground transition hover:bg-muted"
                >
                  Cerrar sesión
                </button>
              </div>
            )}

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm backdrop-blur"
                >
                  <p className="text-2xl font-semibold tracking-tight text-foreground">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="rounded-4xl border border-border/60 bg-card p-5 shadow-2xl shadow-primary/10">
              <div className="rounded-3xl bg-linear-to-br from-primary/10 via-background to-violet-500/10 p-5">
                <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-background/80 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Búsqueda inteligente
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Encuentra perfiles según tu necesidad
                    </p>
                  </div>
                  <Search className="h-5 w-5 text-primary" />
                </div>

                <div className="mt-4 space-y-3">
                  <div className="rounded-2xl border border-border/60 bg-background p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-foreground">
                          Técnico electricista
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Instalaciones, mantenimiento y soporte.
                        </p>
                      </div>
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        Disponible
                      </span>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      4.9 calificación promedio
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border/60 bg-background p-4 shadow-sm">
                    <p className="text-sm text-muted-foreground">
                      Solicitud reciente
                    </p>
                    <p className="mt-2 font-medium text-foreground">
                      Mantenimiento de red en oficina pequeña
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      6 profesionales interesados en las últimas 24 horas.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-primary p-4 text-primary-foreground shadow-lg shadow-primary/20">
                    <p className="text-sm text-primary-foreground/80">
                      Flujo de trabajo
                    </p>
                    <p className="mt-1 text-lg font-semibold">
                      Publica, compara y contrata desde un solo panel
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isAuthenticated && user && (
          <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
            <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm">
              <p className="text-sm font-medium text-muted-foreground">
                Sesión activa
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-foreground">
                {user.first_name} {user.last_name}
              </h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-muted/60 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Correo
                  </p>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {user.email}
                  </p>
                </div>
                <div className="rounded-2xl bg-muted/60 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    CI
                  </p>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {user.ci}
                  </p>
                </div>
                <div className="rounded-2xl bg-muted/60 p-4 sm:col-span-2">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Roles
                  </p>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {user.roles.join(", ")}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm">
              <p className="text-sm font-medium text-muted-foreground">
                Qué puedes hacer en SISWORK
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                {steps.map((step) => {
                  const Icon = step.icon

                  return (
                    <div
                      key={step.title}
                      className="rounded-2xl border border-border/60 bg-background p-4"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-4 font-semibold text-foreground">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon

            return (
              <div
                key={feature.title}
                className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>

        <div className="rounded-4xl border border-border/60 bg-card p-8 text-center shadow-sm">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">
            Empieza hoy
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Gestiona servicios y oportunidades desde una sola plataforma
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Publica solicitudes, encuentra profesionales y administra tu flujo de
            trabajo con una experiencia simple, moderna y segura.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center rounded-2xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition hover:opacity-95"
                >
                  Crear cuenta gratis
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-2xl border border-border bg-background px-6 py-3 text-sm font-medium text-foreground transition hover:bg-muted"
                >
                  Ya tengo cuenta
                </Link>
              </>
            ) : (
              <Link
                to={dashboardRoute}
                className="inline-flex items-center justify-center rounded-2xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition hover:opacity-95"
              >
                Ir al panel
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}