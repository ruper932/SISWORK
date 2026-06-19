import { useMemo } from "react"
import { useParams } from "react-router-dom"
import {
  BadgeCheck,
  Clock3,
  MapPin,
  ShieldCheck,
  Star,
  UserRound,
  Wrench,
} from "lucide-react"

import { useProfessionalQuery } from "../hooks"

const dayNames = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
]

function getVerificationLabel(status: string) {
  switch (status) {
    case "APPROVED":
      return "Verificado"
    case "PENDING":
      return "Verificación pendiente"
    case "REJECTED":
      return "Verificación rechazada"
    default:
      return status
  }
}

function getVerificationClasses(status: string) {
  switch (status) {
    case "APPROVED":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
    case "PENDING":
      return "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400"
    case "REJECTED":
      return "border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-400"
    default:
      return "border-border bg-muted text-muted-foreground"
  }
}

function getAvailabilityLabel(isAvailable: boolean) {
  return isAvailable ? "Disponible" : "No disponible"
}

function getAvailabilityClasses(isAvailable: boolean) {
  return isAvailable
    ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
    : "border-slate-500/20 bg-slate-500/10 text-slate-700 dark:text-slate-300"
}

export function ProfessionalDetailPage() {
  const { userCi = "" } = useParams()
  const { data, isLoading, isError } = useProfessionalQuery(userCi)

  const availabilityText = useMemo(() => {
    if (!data?.availabilities?.length) return []

    return data.availabilities.map((item) => {
      const day = dayNames[item.day_of_week] ?? `Día ${item.day_of_week}`
      const start = item.start_time.slice(0, 5)
      const end = item.end_time.slice(0, 5)
      return {
        id: item.id,
        label: `${day} · ${start} - ${end}`,
        active: item.is_active,
      }
    })
  }, [data])

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-6">
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="h-7 w-56 animate-pulse rounded bg-muted" />
            <div className="mt-3 h-4 w-40 animate-pulse rounded bg-muted" />
            <div className="mt-4 h-5 w-32 animate-pulse rounded-full bg-muted" />
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-border bg-card p-4"
              >
                <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                <div className="mt-3 h-6 w-20 animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="h-5 w-36 animate-pulse rounded bg-muted" />
            <div className="mt-4 h-4 w-full animate-pulse rounded bg-muted" />
            <div className="mt-2 h-4 w-11/12 animate-pulse rounded bg-muted" />
            <div className="mt-2 h-4 w-9/12 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </main>
    )
  }

  if (isError || !data) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-6">
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
          <p className="text-sm font-medium text-destructive">
            No se pudo cargar el profesional.
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Intenta recargar la página o verifica el identificador del perfil.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6">
      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <UserRound className="h-7 w-7" />
            </div>

            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                {data.full_name}
              </h1>

              <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {[data.city, data.zone].filter(Boolean).join(" · ") || "Ubicación no registrada"}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <span
                  className={[
                    "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium",
                    getVerificationClasses(data.verification_status),
                  ].join(" ")}
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {getVerificationLabel(data.verification_status)}
                </span>

                <span
                  className={[
                    "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
                    getAvailabilityClasses(data.is_available),
                  ].join(" ")}
                >
                  {getAvailabilityLabel(data.is_available)}
                </span>
              </div>
            </div>
          </div>

          <div className="grid min-w-[220px] gap-3 rounded-2xl border border-border bg-background p-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Valoración
              </p>
              <p className="mt-1 flex items-center gap-2 text-base font-semibold text-foreground">
                <Star className="h-4 w-4 text-amber-500" />
                {data.rating_average.toFixed(1)}
                <span className="text-sm font-normal text-muted-foreground">
                  ({data.rating_count} reseñas)
                </span>
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Experiencia
              </p>
              <p className="mt-1 text-sm font-medium text-foreground">
                {data.experience_years} años
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <ShieldCheck className="h-4 w-4" />
            <p className="text-xs uppercase tracking-[0.18em]">Estado</p>
          </div>
          <p className="mt-3 text-sm font-medium text-foreground">
            {getVerificationLabel(data.verification_status)}
          </p>
        </article>

        <article className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Star className="h-4 w-4" />
            <p className="text-xs uppercase tracking-[0.18em]">Valoración</p>
          </div>
          <p className="mt-3 text-sm font-medium text-foreground">
            {data.rating_average.toFixed(1)} · {data.rating_count} reseñas
          </p>
        </article>

        <article className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <BadgeCheck className="h-4 w-4" />
            <p className="text-xs uppercase tracking-[0.18em]">Experiencia</p>
          </div>
          <p className="mt-3 text-sm font-medium text-foreground">
            {data.experience_years} años
          </p>
        </article>

        <article className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock3 className="h-4 w-4" />
            <p className="text-xs uppercase tracking-[0.18em]">Disponibilidad</p>
          </div>
          <p className="mt-3 text-sm font-medium text-foreground">
            {getAvailabilityLabel(data.is_available)}
          </p>
        </article>
      </section>

      <section className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-base font-semibold text-foreground">Biografía</h2>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {data.bio || "Este profesional aún no añadió una biografía."}
        </p>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Wrench className="h-4 w-4 text-primary" />
            <h2 className="text-base font-semibold text-foreground">
              Especialidades
            </h2>
          </div>

          {data.specialties.length > 0 ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {data.specialties.map((specialty) => (
                <div
                  key={specialty.id}
                  className="rounded-xl border border-border bg-background p-4"
                >
                  <p className="text-sm font-medium text-foreground">
                    {specialty.name}
                  </p>
                  <p className="mt-1 text-xs leading-6 text-muted-foreground">
                    {specialty.description || "Sin descripción disponible."}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              No tiene especialidades registradas.
            </p>
          )}
        </article>

        <article className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Clock3 className="h-4 w-4 text-primary" />
            <h2 className="text-base font-semibold text-foreground">
              Horarios
            </h2>
          </div>

          {availabilityText.length > 0 ? (
            <ul className="mt-4 space-y-3">
              {availabilityText.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background px-4 py-3"
                >
                  <span className="text-sm text-foreground">{item.label}</span>
                  <span
                    className={[
                      "rounded-full px-2.5 py-1 text-[11px] font-medium",
                      item.active
                        ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                        : "bg-slate-500/10 text-slate-700 dark:text-slate-300",
                    ].join(" ")}
                  >
                    {item.active ? "Activo" : "Inactivo"}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              No registró horarios de atención.
            </p>
          )}
        </article>
      </section>
    </main>
  )
}