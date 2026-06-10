import { Link } from "react-router-dom"
import { useMemo, useState } from "react"
import {
  ArrowRight,
  BriefcaseBusiness,
  CircleDollarSign,
  MapPin,
  Plus,
  Sparkles,
  History,
  Search,
  Filter,
} from "lucide-react"

import { useRequestsQuery } from "../hooks"
import type { RequestItem } from "../types"
import { useAuth } from "@/features/auth/use-auth"

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

function safeText(value: string | null | undefined) {
  return value?.trim() ?? ""
}

function formatBudgetValue(value: string | null | undefined) {
  if (!value) return 0
  const parsed = Number(value)
  return Number.isNaN(parsed) ? 0 : parsed
}

function formatDateValue(value: string | null | undefined) {
  if (!value) return 0
  const parsed = new Date(value).getTime()
  return Number.isNaN(parsed) ? 0 : parsed
}

function getStatusLabel(status: string) {
  switch (status) {
    case "OPEN":
      return "Abierta"
    case "IN_PROGRESS":
      return "En progreso"
    case "COMPLETED":
      return "Completada"
    case "CANCELLED":
      return "Cancelada"
    case "EXPIRED":
      return "Expirada"
    default:
      return status
  }
}

function getUrgencyLabel(urgency: string) {
  switch (urgency) {
    case "HIGH":
      return "Alta"
    case "MEDIUM":
      return "Media"
    case "LOW":
      return "Baja"
    default:
      return urgency
  }
}

function getStatusClasses(status: string) {
  switch (status.toUpperCase()) {
    case "OPEN":
      return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400"
    case "IN_PROGRESS":
      return "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400"
    case "COMPLETED":
      return "bg-slate-500/10 text-slate-600 border-slate-500/20 dark:text-slate-300"
    case "CANCELLED":
      return "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400"
    case "EXPIRED":
      return "bg-zinc-500/10 text-zinc-600 border-zinc-500/20 dark:text-zinc-400"
    default:
      return "bg-primary/10 text-primary border-primary/20"
  }
}

function getUrgencyClasses(urgency: string) {
  switch (urgency.toUpperCase()) {
    case "HIGH":
      return "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400"
    case "MEDIUM":
      return "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400"
    case "LOW":
      return "bg-sky-500/10 text-sky-600 border-sky-500/20 dark:text-sky-400"
    default:
      return "bg-muted text-muted-foreground border-border"
  }
}

function RequestCard({ request }: { request: RequestItem }) {
  return (
    <Link
      to={`/requests/${request.id}`}
      className="group block rounded-[1.75rem] border border-border/60 bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Solicitud publicada
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

        <span
          className={`shrink-0 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${getStatusClasses(
            request.status,
          )}`}
        >
          {getStatusLabel(request.status)}
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
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Urgencia
          </p>
          <div className="mt-2">
            <span
              className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${getUrgencyClasses(
                request.urgency,
              )}`}
            >
              {getUrgencyLabel(request.urgency)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 text-sm font-medium text-primary">
        Ver detalle
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
      </div>
    </Link>
  )
}

function RequestSkeleton() {
  return (
    <div className="rounded-[1.75rem] border border-border/60 bg-card p-5 shadow-sm">
      <div className="h-6 w-28 rounded-full bg-muted" />
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

export function RequestsListPage() {
  const { user } = useAuth()
  const { data, isLoading, isError } = useRequestsQuery()

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [urgencyFilter, setUrgencyFilter] = useState("ALL")
  const [cityFilter, setCityFilter] = useState("ALL")
  const [zoneFilter, setZoneFilter] = useState("ALL")
  const [minBudget, setMinBudget] = useState("")
  const [maxBudget, setMaxBudget] = useState("")
  const [sortBy, setSortBy] = useState("updated_desc")

  const allRequests = data?.items ?? []
  const userRoles = user?.roles ?? []

  const canViewAllRequests =
    userRoles.includes("ADMIN") ||
    userRoles.includes("SUPPORT") ||
    userRoles.includes("SUPERADMIN")

  const baseRequests = canViewAllRequests
    ? allRequests
    : allRequests.filter((request) => request.client_ci === user?.ci)

  const requestsWithoutHistory = canViewAllRequests
    ? baseRequests
    : baseRequests.filter((request) => request.status !== "COMPLETED")

  const cities = useMemo(() => {
    return Array.from(
      new Set(
        requestsWithoutHistory
          .map((request) => safeText(request.city))
          .filter((city) => city.length > 0),
      ),
    ).sort((a, b) => safeText(a).localeCompare(safeText(b)))
  }, [requestsWithoutHistory])

  const zones = useMemo(() => {
    return Array.from(
      new Set(
        requestsWithoutHistory
          .map((request) => safeText(request.zone))
          .filter((zone) => zone.length > 0),
      ),
    ).sort((a, b) => safeText(a).localeCompare(safeText(b)))
  }, [requestsWithoutHistory])

  const requests = useMemo(() => {
    const searchTerm = search.trim().toLowerCase()
    const min = minBudget ? Number(minBudget) : null
    const max = maxBudget ? Number(maxBudget) : null

    let filtered = [...requestsWithoutHistory]

    if (searchTerm) {
      filtered = filtered.filter((request) => {
        const haystack = [
          safeText(request.title),
          safeText(request.description),
          safeText(request.city),
          safeText(request.zone),
        ]
          .join(" ")
          .toLowerCase()

        return haystack.includes(searchTerm)
      })
    }

    if (statusFilter !== "ALL") {
      filtered = filtered.filter((request) => request.status === statusFilter)
    }

    if (urgencyFilter !== "ALL") {
      filtered = filtered.filter((request) => request.urgency === urgencyFilter)
    }

    if (cityFilter !== "ALL") {
      filtered = filtered.filter(
        (request) => safeText(request.city) === safeText(cityFilter),
      )
    }

    if (zoneFilter !== "ALL") {
      filtered = filtered.filter(
        (request) => safeText(request.zone) === safeText(zoneFilter),
      )
    }

    if (min !== null && !Number.isNaN(min)) {
      filtered = filtered.filter(
        (request) => formatBudgetValue(request.budget) >= min,
      )
    }

    if (max !== null && !Number.isNaN(max)) {
      filtered = filtered.filter(
        (request) => formatBudgetValue(request.budget) <= max,
      )
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "title_asc":
          return safeText(a.title).localeCompare(safeText(b.title))
        case "title_desc":
          return safeText(b.title).localeCompare(safeText(a.title))
        case "budget_asc":
          return formatBudgetValue(a.budget) - formatBudgetValue(b.budget)
        case "budget_desc":
          return formatBudgetValue(b.budget) - formatBudgetValue(a.budget)
        case "updated_asc":
          return formatDateValue(a.updated_at) - formatDateValue(b.updated_at)
        case "updated_desc":
        default:
          return formatDateValue(b.updated_at) - formatDateValue(a.updated_at)
      }
    })

    return filtered
  }, [
    requestsWithoutHistory,
    search,
    statusFilter,
    urgencyFilter,
    cityFilter,
    zoneFilter,
    minBudget,
    maxBudget,
    sortBy,
  ])

  const total = requests.length

  const clearFilters = () => {
    setSearch("")
    setStatusFilter("ALL")
    setUrgencyFilter("ALL")
    setCityFilter("ALL")
    setZoneFilter("ALL")
    setMinBudget("")
    setMaxBudget("")
    setSortBy("updated_desc")
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] border border-border/60 bg-gradient-to-br from-primary via-primary to-violet-500 p-6 text-primary-foreground shadow-xl shadow-primary/10 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium tracking-wide">
              <BriefcaseBusiness className="h-4 w-4" />
              Marketplace de servicios
            </div>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              {canViewAllRequests
                ? "Explora solicitudes disponibles"
                : "Tus solicitudes"}
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-primary-foreground/80 sm:text-base">
              {canViewAllRequests
                ? "Encuentra oportunidades activas, revisa presupuestos, urgencia y ubicación, y accede a cada detalle desde un solo panel."
                : "Revisa las solicitudes activas que publicaste, filtra por estado, ubicación, urgencia o presupuesto, y accede también a tu historial."}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {!canViewAllRequests && (
              <Link
                to="/requests/history"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/15"
              >
                <History className="h-4 w-4" />
                Ver historial
              </Link>
            )}

            <Link
              to="/requests/new"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-medium text-slate-900 transition hover:opacity-95"
            >
              <Plus className="h-4 w-4" />
              Nueva solicitud
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Solicitudes visibles</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            {isLoading ? "—" : total}
          </p>
        </div>

        <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Estado del listado</p>
          <p className="mt-2 text-lg font-semibold text-foreground">
            {isError ? "Con incidencias" : "Disponible"}
          </p>
        </div>

        <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Acción recomendada</p>
          <p className="mt-2 text-lg font-semibold text-foreground">
            {canViewAllRequests
              ? "Revisa nuevas oportunidades"
              : "Gestiona tus solicitudes"}
          </p>
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-border/60 bg-card p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">
            {canViewAllRequests
              ? "Listado de solicitudes"
              : "Listado de tus solicitudes"}
          </h2>
        </div>

        <p className="mt-1 text-sm text-muted-foreground">
          {canViewAllRequests
            ? "Aplica filtros por texto, estado, urgencia, ubicación, presupuesto y orden."
            : "Aquí se muestran tus solicitudes no completadas. Las completadas se encuentran en el historial."}
        </p>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="xl:col-span-2">
            <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Buscar
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Título, descripción, ciudad o zona"
                className="h-11 w-full rounded-2xl border border-border bg-background pl-10 pr-4 text-sm outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-4 focus:ring-primary/10"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Estado
            </label>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="h-11 w-full rounded-2xl border border-border bg-background px-4 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
            >
              <option value="ALL">Todos</option>
              <option value="OPEN">Abierta</option>
              <option value="IN_PROGRESS">En progreso</option>
              <option value="CANCELLED">Cancelada</option>
              <option value="EXPIRED">Expirada</option>
              {canViewAllRequests && <option value="COMPLETED">Completada</option>}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Urgencia
            </label>
            <select
              value={urgencyFilter}
              onChange={(event) => setUrgencyFilter(event.target.value)}
              className="h-11 w-full rounded-2xl border border-border bg-background px-4 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
            >
              <option value="ALL">Todas</option>
              <option value="HIGH">Alta</option>
              <option value="MEDIUM">Media</option>
              <option value="LOW">Baja</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Ciudad
            </label>
            <select
              value={cityFilter}
              onChange={(event) => setCityFilter(event.target.value)}
              className="h-11 w-full rounded-2xl border border-border bg-background px-4 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
            >
              <option value="ALL">Todas</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Zona
            </label>
            <select
              value={zoneFilter}
              onChange={(event) => setZoneFilter(event.target.value)}
              className="h-11 w-full rounded-2xl border border-border bg-background px-4 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
            >
              <option value="ALL">Todas</option>
              {zones.map((zone) => (
                <option key={zone} value={zone}>
                  {zone}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Presupuesto mínimo
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={minBudget}
              onChange={(event) => setMinBudget(event.target.value)}
              placeholder="0"
              className="h-11 w-full rounded-2xl border border-border bg-background px-4 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Presupuesto máximo
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={maxBudget}
              onChange={(event) => setMaxBudget(event.target.value)}
              placeholder="1000"
              className="h-11 w-full rounded-2xl border border-border bg-background px-4 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Ordenar por
            </label>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="h-11 w-full rounded-2xl border border-border bg-background px-4 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
            >
              <option value="updated_desc">Más recientes</option>
              <option value="updated_asc">Más antiguas</option>
              <option value="title_asc">Título A-Z</option>
              <option value="title_desc">Título Z-A</option>
              <option value="budget_asc">Menor presupuesto</option>
              <option value="budget_desc">Mayor presupuesto</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-border bg-background px-4 text-sm font-medium text-foreground transition hover:bg-muted"
          >
            Limpiar filtros
          </button>

          <p className="text-sm text-muted-foreground">
            {total === 1 ? "1 resultado encontrado" : `${total} resultados encontrados`}
          </p>
        </div>
      </section>

      {isLoading && (
        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <RequestSkeleton key={index} />
          ))}
        </section>
      )}

      {isError && (
        <section className="mt-6 rounded-3xl border border-destructive/20 bg-destructive/10 px-5 py-4 text-sm text-destructive">
          No se pudieron cargar las solicitudes. Intenta nuevamente en unos
          momentos.
        </section>
      )}

      {!isLoading && !isError && (
        <section className="mt-6">
          {requests.length ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {requests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-border/60 bg-card p-10 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <BriefcaseBusiness className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-xl font-semibold text-foreground">
                No hay solicitudes disponibles
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                {canViewAllRequests
                  ? "No hay resultados con los filtros actuales."
                  : "No tienes solicitudes activas que coincidan con los filtros aplicados."}
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center justify-center rounded-2xl border border-border bg-background px-5 py-3 text-sm font-medium text-foreground transition hover:bg-muted"
                >
                  Limpiar filtros
                </button>

                <Link
                  to="/requests/new"
                  className="inline-flex items-center justify-center rounded-2xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition hover:opacity-95"
                >
                  Crear solicitud
                </Link>
              </div>
            </div>
          )}
        </section>
      )}
    </main>
  )
}