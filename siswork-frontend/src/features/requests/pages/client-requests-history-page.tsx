import { Link } from "react-router-dom"
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  MapPin,
  Star,
  XCircle,
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

function getHistoryMeta(status: string) {
  switch (status) {
    case "COMPLETED":
      return {
        badge: "Completada",
        title: "Solicitud completada",
        cardClass:
          "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
        icon: CheckCircle2,
      }
    case "CANCELLED":
      return {
        badge: "Cancelada",
        title: "Solicitud cancelada",
        cardClass:
          "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400",
        icon: XCircle,
      }
    default:
      return {
        badge: status,
        title: "Solicitud finalizada",
        cardClass:
          "bg-slate-500/10 text-slate-600 border-slate-500/20 dark:text-slate-300",
        icon: CheckCircle2,
      }
  }
}

function RequestHistoryCard({ request }: { request: RequestItem }) {
  const meta = getHistoryMeta(request.status)
  const StatusIcon = meta.icon

  const canGoDirectToReview =
    request.can_review && Boolean(request.reviewable_application_id)

  const directReviewLink = {
    pathname: "/reviews/new",
    search: `?applicationId=${encodeURIComponent(
      request.reviewable_application_id ?? "",
    )}`,
  }

  return (
    <article className="rounded-[1.75rem] border border-border/60 bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${meta.cardClass}`}
          >
            <StatusIcon className="h-3.5 w-3.5" />
            {meta.title}
          </div>

          <h3 className="mt-4 text-lg font-semibold tracking-tight text-foreground">
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

        <span
          className={`shrink-0 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${meta.cardClass}`}
        >
          {meta.badge}
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

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Link
          to={`/requests/${request.id}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-primary transition hover:opacity-80"
        >
          Ver detalle
          <ArrowRight className="h-4 w-4" />
        </Link>

        {canGoDirectToReview ? (
          <Link
            to={directReviewLink}
            className="inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition hover:opacity-95"
          >
            <Star className="h-4 w-4" />
            Dejar reseña
          </Link>
        ) : request.can_review ? (
          <Link
            to={`/requests/${request.id}`}
            className="inline-flex items-center gap-2 rounded-2xl border border-primary/30 px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary/5"
          >
            <Star className="h-4 w-4" />
            Ir al detalle para reseñar
          </Link>
        ) : null}
      </div>
    </article>
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

  const historyRequests = allRequests.filter((request) =>
    ["COMPLETED", "CANCELLED"].includes(request.status),
  )

  const completedCount = historyRequests.filter(
    (request) => request.status === "COMPLETED",
  ).length

  const cancelledCount = historyRequests.filter(
    (request) => request.status === "CANCELLED",
  ).length

  const total = historyRequests.length

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-4xl border border-border/60 bg-gradient-to-br from-emerald-600 via-emerald-600 to-teal-500 p-6 text-white shadow-xl shadow-emerald-500/10 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium tracking-wide">
              <CheckCircle2 className="h-4 w-4" />
              Historial del cliente
            </div>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Solicitudes finalizadas
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/80 sm:text-base">
              Revisa el historial de solicitudes completadas y canceladas.
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
          <p className="text-sm text-muted-foreground">Solicitudes finalizadas</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            {isLoading ? "—" : total}
          </p>
        </div>

        <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Completadas</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            {isLoading ? "—" : completedCount}
          </p>
        </div>

        <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Canceladas</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            {isLoading ? "—" : cancelledCount}
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
          No se pudo cargar el historial de solicitudes finalizadas.
        </section>
      )}

      {!isLoading && !isError && (
        <section className="mt-6">
          {historyRequests.length ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {historyRequests.map((request) => (
                <RequestHistoryCard key={request.id} request={request} />
              ))}
            </div>
          ) : (
            <div className="rounded-4xl border border-border/60 bg-card p-10 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-xl font-semibold text-foreground">
                Aún no tienes solicitudes finalizadas
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                Cuando una de tus solicitudes sea completada o cancelada, aparecerá aquí.
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