import { Link } from "react-router-dom"
import {
  BriefcaseBusiness,
  FileText,
  ShieldCheck,
  Star,
  TrendingUp,
  Users,
} from "lucide-react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { useAuth } from "@/features/auth/use-auth"

const overviewCards = [
  {
    title: "Solicitudes activas",
    value: "12",
    description: "Servicios publicados recientemente",
    icon: BriefcaseBusiness,
  },
  {
    title: "Profesionales",
    value: "48",
    description: "Perfiles visibles en la plataforma",
    icon: Users,
  },
  {
    title: "Postulaciones",
    value: "27",
    description: "Candidaturas enviadas o recibidas",
    icon: FileText,
  },
  {
    title: "Calificación media",
    value: "4.8",
    description: "Reseñas verificadas de usuarios",
    icon: Star,
  },
]

const weeklyActivity = [
  { day: "Lun", value: 3 },
  { day: "Mar", value: 5 },
  { day: "Mié", value: 4 },
  { day: "Jue", value: 8 },
  { day: "Vie", value: 6 },
  { day: "Sáb", value: 7 },
  { day: "Dom", value: 5 },
]

const quickLinks = [
  {
    title: "Crear solicitud",
    description: "Publica un nuevo requerimiento de servicio.",
    to: "/requests/new",
  },
  {
    title: "Explorar profesionales",
    description: "Encuentra técnicos y especialistas disponibles.",
    to: "/professionals",
  },
  {
    title: "Ver postulaciones",
    description: "Revisa el estado de tus candidaturas.",
    to: "/applications/me",
  },
  {
    title: "Solicitar verificación",
    description: "Mejora la confianza de tu perfil profesional.",
    to: "/professionals/request-verification",
  },
]

export function DashboardPage() {
  const { user } = useAuth()

  return (
    <section className="space-y-6">
      <div className="overflow-hidden rounded-3xl border border-border/60 bg-to-br from-primary via-primary to-indigo-500 p-6 text-primary-foreground shadow-xl shadow-primary/10 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium tracking-wide">
              <ShieldCheck className="h-4 w-4" />
              Espacio principal de trabajo
            </div>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Bienvenido, {user?.first_name}
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-primary-foreground/80 sm:text-base">
              Gestiona solicitudes, revisa postulaciones, encuentra profesionales
              y sigue la actividad general de SISWORK desde un solo lugar.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              to="/requests/new"
              className="rounded-2xl bg-white px-4 py-3 text-sm font-medium text-slate-900 transition hover:opacity-95"
            >
              Nueva solicitud
            </Link>
            <Link
              to="/professionals"
              className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/15"
            >
              Buscar profesionales
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {overviewCards.map((card) => {
          const Icon = card.icon

          return (
            <div
              key={card.title}
              className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">{card.title}</p>
                  <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
                    {card.value}
                  </p>
                </div>

                <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <p className="mt-4 text-sm text-muted-foreground">
                {card.description}
              </p>
            </div>
          )
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Actividad semanal
              </p>
              <h3 className="mt-1 text-xl font-semibold text-foreground">
                Movimiento de la plataforma
              </h3>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <TrendingUp className="h-4 w-4" />
              +18% esta semana
            </div>
          </div>

          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyActivity}>
                <defs>
                  <linearGradient id="sisworkActivity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "16px",
                    border: "1px solid var(--color-border)",
                    background: "var(--color-card)",
                    color: "var(--color-card-foreground)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="var(--color-primary)"
                  strokeWidth={3}
                  fill="url(#sisworkActivity)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm sm:p-6">
            <p className="text-sm font-medium text-muted-foreground">
              Perfil actual
            </p>
            <h3 className="mt-1 text-xl font-semibold text-foreground">
              {user?.first_name} {user?.last_name}
            </h3>

            <div className="mt-5 space-y-3 text-sm">
              <div className="rounded-2xl bg-muted/60 px-4 py-3">
                <span className="block text-xs uppercase tracking-wide text-muted-foreground">
                  CI
                </span>
                <span className="mt-1 block font-medium text-foreground">
                  {user?.ci}
                </span>
              </div>

              <div className="rounded-2xl bg-muted/60 px-4 py-3">
                <span className="block text-xs uppercase tracking-wide text-muted-foreground">
                  Correo
                </span>
                <span className="mt-1 block font-medium text-foreground">
                  {user?.email}
                </span>
              </div>

              <div className="rounded-2xl bg-muted/60 px-4 py-3">
                <span className="block text-xs uppercase tracking-wide text-muted-foreground">
                  Roles
                </span>
                <span className="mt-1 block font-medium text-foreground">
                  {user?.roles.join(", ")}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm sm:p-6">
            <p className="text-sm font-medium text-muted-foreground">
              Acciones rápidas
            </p>

            <div className="mt-4 grid gap-3">
              {quickLinks.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="rounded-2xl border border-border/60 bg-background px-4 py-4 transition hover:border-primary/30 hover:bg-primary/5"
                >
                  <p className="font-medium text-foreground">{item.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}