import { Link } from "react-router-dom"
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  MapPin,
} from "lucide-react"

import { useMyRequestsQuery } from "../hooks"
import type { RequestItem } from "../types"

function formatMoney(value: string | null) {
  if (!value) return "—"
  const numberValue = Number(value)
  if (Number.isNaN(numberValue)) return value

  return new Intl.NumberFormat("es-BO", {
    style: "currency",
    currency: "BOB",
    maximumFractionDigits: 2,
  }).format(numberValue)
}

function formatDate(value: string | null) {
  if (!value) return "—"

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return date.toLocaleString("es-BO")
}

function RequestHistoryCard({ request }: { request: RequestItem }) {
  return (
    <Link
      to={`/requests/${request.id}`}
      className="group block rounded-[1.75rem] border border-border/60 bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Solicitud completada
          </div>

          <h3 className="mt-4 text-lg font-semibold tracking-tight text-foreground transition group-hover:text-primary">
            {request.title}
          </h3>

          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>
              {request.city}
              {request.zone ? ` · ${request.zone}` : ""}
            </span>
          </div>
        </div>

        <span className="shrink-0 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
          Completada
        </span>
      </div>

      <p className="mt-4 line-clamp-3 text-sm leading-6 text-muted-foreground">
        {request.description}
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-muted/50 p-3">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <CircleDollarSign className="h-4 w-4" />
            Presupuesto
          </div>
          <p className="mt-2 text-sm font-semibold text-foreground">
            {formatMoney(request.budget)}
          </p>
        </div>

        <div className="rounded-2xl bg-muted/50 p-3">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            Última actualización
          </div>
          <p className="mt-2 text-sm font-semibold text-foreground">
            {formatDate(request.updated_at)}
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 text-sm font-medium text-primary">
        Ver detalle
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
      </div>
    </Link>
  )
}

function HistorySkeleton() {
  return (
    <div className="rounded-[1.75rem] border border-border/60 bg-card p-5 shadow-sm">
      <div className="h-6 w-32 rounded-full bg-muted" />
      <div className="mt-4 h-6 w-3/4 rounded-lg bg-muted" />
      <div className="mt-3 h-4 w-1/2 rounded bg-muted" />
      <div className="mt-5 space-y-2">
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-2/3 rounded bg-muted" />
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="h-20 rounded-2xl bg-muted" />
        <div className="h-20 rounded-2xl bg-muted" />
      </div>
    </div>
  )
}

export function ClientRequestsHistoryPage() {
  const { data, isLoading, isError } = useMyRequestsQuery(0, 100)

  const allRequests = data?.items ?? []

  const completedRequests = allRequests.filter(
    (request) => request.status === "COMPLETED",
  )

  const total = completedRequests.length

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] border border-border/60 bg-gradient-to-br from-emerald-600 via-emerald-600 to-teal-500 p-6 text-white shadow-xl shadow-emerald-500/10 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium tracking-wide">
              <CheckCircle2 className="h-4 w-4" />
              Historial del cliente
            </div>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Solicitudes completadas
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/80 sm:text-base">
              Revisa el historial de solicitudes que ya concluyeron correctamente.
            </p>
          </div>

          <Link
            to="/requests"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-medium text-slate-900 transition hover:opacity-95"
          >
            <BriefcaseBusiness className="h-4 w-4" />
            Ver solicitudes activas
          </Link>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Solicitudes completadas</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            {isLoading ? "—" : total}
          </p>
        </div>

        <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Estado del historial</p>
          <p className="mt-2 text-lg font-semibold text-foreground">
            {isError ? "Con incidencias" : "Disponible"}
          </p>
        </div>

        <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Seguimiento</p>
          <p className="mt-2 text-lg font-semibold text-foreground">
            Revisa trabajos concluidos
          </p>
        </div>
      </section>

      {isLoading && (
        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <HistorySkeleton key={index} />
          ))}
        </section>
      )}

      {isError && (
        <section className="mt-6 rounded-3xl border border-destructive/20 bg-destructive/10 px-5 py-4 text-sm text-destructive">
          No se pudo cargar el historial de solicitudes completadas.
        </section>
      )}

      {!isLoading && !isError && (
        <section className="mt-6">
          {completedRequests.length ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {completedRequests.map((request) => (
                <RequestHistoryCard key={request.id} request={request} />
              ))}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-border/60 bg-card p-10 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-xl font-semibold text-foreground">
                Aún no tienes solicitudes completadas
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                Cuando una de tus solicitudes sea marcada como completada, aparecerá aquí.
              </p>
              <Link
                to="/requests"
                className="mt-6 inline-flex items-center justify-center rounded-2xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition hover:opacity-95"
              >
                Ver solicitudes
              </Link>
            </div>
          )}
        </section>
      )}
    </main>
  )
}