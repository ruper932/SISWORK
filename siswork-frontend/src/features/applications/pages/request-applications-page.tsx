// src/features/applications/pages/request-applications-page.tsx

import { useMemo } from "react"
import { useParams } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  MapPin,
  ShieldCheck,
  Star,
  XCircle,
} from "lucide-react"

import {
  acceptApplication,
  getRequestApplications,
  rejectApplication,
} from "@/features/applications/api"
import type { ApplicationResponse } from "@/features/applications/types"

const dayNames = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
]

function getStatusLabel(status: ApplicationResponse["status"]) {
  switch (status) {
    case "PENDING":
      return "Pendiente"
    case "ACCEPTED":
      return "Aceptada"
    case "REJECTED":
      return "Rechazada"
    case "CANCELLED":
      return "Cancelada"
    default:
      return status
  }
}

function getStatusClasses(status: ApplicationResponse["status"]) {
  switch (status) {
    case "PENDING":
      return "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400"
    case "ACCEPTED":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
    case "REJECTED":
      return "border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400"
    case "CANCELLED":
      return "border-muted-foreground/20 bg-muted text-muted-foreground"
    default:
      return "border-border bg-muted text-muted-foreground"
  }
}

function formatPrice(value: string | null) {
  if (!value) return "No especificado"

  const parsed = Number(value)
  if (Number.isNaN(parsed)) return value

  return new Intl.NumberFormat("es-BO", {
    style: "currency",
    currency: "BOB",
    minimumFractionDigits: 2,
  }).format(parsed)
}

function formatAvailability(application: ApplicationResponse) {
  const availabilities = application.professional_profile.availabilities

  if (!availabilities.length) return "Sin horarios registrados"

  return availabilities
    .filter((item) => item.is_active)
    .map((item) => {
      const day = dayNames[item.day_of_week] ?? `Día ${item.day_of_week}`
      return `${day}: ${item.start_time.slice(0, 5)} - ${item.end_time.slice(0, 5)}`
    })
    .join(" · ")
}

export function RequestApplicationsPage() {
  const { requestId } = useParams<{ requestId: string }>()
  const queryClient = useQueryClient()

  const applicationsQuery = useQuery({
    queryKey: ["request-applications", requestId],
    queryFn: () => getRequestApplications(requestId as string),
    enabled: Boolean(requestId),
  })

  const acceptMutation = useMutation({
    mutationFn: acceptApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["request-applications", requestId],
      })
    },
  })

  const rejectMutation = useMutation({
    mutationFn: rejectApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["request-applications", requestId],
      })
    },
  })

  const applications = useMemo(
    () => applicationsQuery.data?.items ?? [],
    [applicationsQuery.data]
  )

  if (!requestId) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-foreground">
          Postulaciones de la solicitud
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          No se encontró el identificador de la solicitud.
        </p>
      </div>
    )
  }

  if (applicationsQuery.isLoading) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="h-6 w-64 animate-pulse rounded bg-muted" />
          <div className="mt-3 h-4 w-80 animate-pulse rounded bg-muted" />
        </div>

        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-border bg-card p-6 shadow-sm"
          >
            <div className="h-5 w-48 animate-pulse rounded bg-muted" />
            <div className="mt-3 h-4 w-full animate-pulse rounded bg-muted" />
            <div className="mt-2 h-4 w-5/6 animate-pulse rounded bg-muted" />
            <div className="mt-6 h-10 w-48 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    )
  }

  if (applicationsQuery.isError) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-foreground">
          Postulaciones de la solicitud
        </h1>
        <p className="mt-2 text-sm text-destructive">
          No se pudieron cargar las postulaciones.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
              SISWORK
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-foreground">
              Postulaciones recibidas
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Revisa los profesionales que se postularon a esta solicitud y elige
              la mejor opción.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm text-muted-foreground">
            <BriefcaseBusiness className="h-4 w-4" />
            {applicationsQuery.data?.total ?? 0} postulaciones
          </div>
        </div>
      </section>

      {applications.length === 0 ? (
        <section className="rounded-2xl border border-border bg-card p-10 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <BriefcaseBusiness className="h-6 w-6" />
          </div>

          <h2 className="mt-4 text-lg font-semibold text-foreground">
            Aún no hay postulaciones
          </h2>

          <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
            Cuando los profesionales se postulen a esta solicitud, aparecerán aquí
            con su experiencia, especialidades y propuesta.
          </p>
        </section>
      ) : (
        <section className="grid gap-4">
          {applications.map((application) => {
            const profile = application.professional_profile
            const isPending = application.status === "PENDING"
            const isMutating =
              acceptMutation.isPending || rejectMutation.isPending

            return (
              <article
                key={application.id}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-lg font-semibold text-foreground">
                        {profile.full_name}
                      </h2>

                      <span
                        className={[
                          "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
                          getStatusClasses(application.status),
                        ].join(" ")}
                      >
                        {getStatusLabel(application.status)}
                      </span>

                      {profile.verification_status === "APPROVED" && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          Verificado
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {[profile.city, profile.zone].filter(Boolean).join(" · ") ||
                          "Ubicación no registrada"}
                      </span>

                      <span className="inline-flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        {profile.rating_average.toFixed(1)} ({profile.rating_count} reseñas)
                      </span>

                      <span className="inline-flex items-center gap-2">
                        <Clock3 className="h-4 w-4" />
                        {profile.experience_years} años de experiencia
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {profile.specialties.length > 0 ? (
                        profile.specialties.map((specialty) => (
                          <span
                            key={specialty.id}
                            className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground"
                          >
                            {specialty.name}
                          </span>
                        ))
                      ) : (
                        <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                          Sin especialidades registradas
                        </span>
                      )}
                    </div>

                    {profile.bio && (
                      <p className="text-sm leading-6 text-muted-foreground">
                        {profile.bio}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-3 rounded-2xl border border-border bg-background p-4 lg:min-w-[280px]">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                        Precio propuesto
                      </p>
                      <p className="mt-1 text-base font-semibold text-foreground">
                        {formatPrice(application.proposed_price)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                        Tiempo estimado
                      </p>
                      <p className="mt-1 text-sm text-foreground">
                        {application.estimated_time_hours
                          ? `${application.estimated_time_hours} horas`
                          : "No especificado"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                        Disponibilidad
                      </p>
                      <p className="mt-1 text-sm text-foreground">
                        {formatAvailability(application)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-border bg-background p-4">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    Mensaje de propuesta
                  </p>
                  <p className="mt-2 whitespace-pre-line text-sm leading-6 text-foreground">
                    {application.proposal_message}
                  </p>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    disabled={!isPending || isMutating}
                    onClick={() => rejectMutation.mutate(application.id)}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-4 text-sm font-medium text-destructive transition hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <XCircle className="h-4 w-4" />
                    Rechazar
                  </button>

                  <button
                    type="button"
                    disabled={!isPending || isMutating}
                    onClick={() => acceptMutation.mutate(application.id)}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Aceptar
                  </button>
                </div>
              </article>
            )
          })}
        </section>
      )}
    </div>
  )
}