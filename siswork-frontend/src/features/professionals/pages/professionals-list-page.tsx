import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { useProfessionalsQuery } from "../hooks"
import type { ProfessionalPublic } from "../types"

function getVerificationLabel(status: ProfessionalPublic["verification_status"]) {
  switch (status) {
    case "APPROVED":
      return "Aprobado"
    case "PENDING":
      return "Pendiente"
    case "REJECTED":
      return "Rechazado"
    default:
      return status
  }
}

export function ProfessionalsListPage() {
  const [q, setQ] = useState("")
  const [cityFilter, setCityFilter] = useState("")
  const [specialtyFilter, setSpecialtyFilter] = useState("")
  const [verificationFilter, setVerificationFilter] = useState("")

  const { data, isLoading, isError } = useProfessionalsQuery({
    q: q || undefined,
    city: cityFilter || undefined,
  })

  const cities = useMemo(() => {
    if (!data) return []

    const citySet = new Set(
      data.map((p) => p.city).filter((c): c is string => Boolean(c))
    )

    return Array.from(citySet).sort((a, b) => a.localeCompare(b))
  }, [data])

  const verificationStatuses = useMemo(() => {
    if (!data) return []

    const statusSet = new Set(
      data
        .map((p) => p.verification_status)
        .filter((s): s is string => Boolean(s))
    )

    return Array.from(statusSet).sort((a, b) => a.localeCompare(b))
  }, [data])

  const specialties = useMemo(() => {
    if (!data) return []

    const specialtySet = new Set(
      data.flatMap((p) => p.specialties.map((s) => s.name)).filter(Boolean)
    )

    return Array.from(specialtySet).sort((a, b) => a.localeCompare(b))
  }, [data])

  const filteredData = useMemo(() => {
    if (!data) return []

    return data.filter((p) => {
      const matchSpecialty = specialtyFilter
        ? p.specialties.some((s) => s.name === specialtyFilter)
        : true

      const matchVerification = verificationFilter
        ? p.verification_status === verificationFilter
        : true

      return matchSpecialty && matchVerification
    })
  }, [data, specialtyFilter, verificationFilter])

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-medium text-foreground">Profesionales</h1>
          <p className="text-sm text-muted-foreground">
            Busca por nombre, ciudad o especialidad.
          </p>
        </div>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar..."
          className="w-full rounded-md border border-border/60 bg-background px-3 py-1.5 text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:ring-1 focus:ring-primary sm:max-w-xs"
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <select
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className="rounded-md border border-border/60 bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="">Todas las ciudades</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>

        <select
          value={specialtyFilter}
          onChange={(e) => setSpecialtyFilter(e.target.value)}
          className="rounded-md border border-border/60 bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="">Todas las especialidades</option>
          {specialties.map((specialty) => (
            <option key={specialty} value={specialty}>
              {specialty}
            </option>
          ))}
        </select>

        <select
          value={verificationFilter}
          onChange={(e) => setVerificationFilter(e.target.value)}
          className="rounded-md border border-border/60 bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="">Todos los estados</option>
          {verificationStatuses.map((status) => (
            <option key={status} value={status}>
              {getVerificationLabel(status)}
            </option>
          ))}
        </select>

        {(cityFilter || specialtyFilter || verificationFilter) && (
          <button
            type="button"
            onClick={() => {
              setCityFilter("")
              setSpecialtyFilter("")
              setVerificationFilter("")
            }}
            className="text-sm text-muted-foreground transition hover:text-foreground"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {isLoading && (
        <div className="mt-6 text-sm text-muted-foreground">Cargando...</div>
      )}

      {isError && (
        <div className="mt-6 text-sm text-destructive">
          No se pudieron cargar los profesionales.
        </div>
      )}

      {!isLoading && !isError && (
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredData.length > 0 ? (
            filteredData.map((professional) => (
              <Link
                key={professional.id}
                to={`/professionals/${professional.user_ci}`}
                className="group rounded-xl border border-border/40 bg-background/60 p-3 transition hover:bg-accent/20"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-medium text-foreground">
                      {professional.full_name}
                    </h3>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {professional.city || "Sin ciudad"}
                      {professional.zone ? ` · ${professional.zone}` : ""}
                    </p>
                  </div>

                  <span className="whitespace-nowrap text-[10px] uppercase tracking-wide text-muted-foreground/70">
                    {professional.verification_status}
                  </span>
                </div>

                <p className="mt-2 line-clamp-2 text-xs text-muted-foreground/80">
                  {professional.bio || "Sin biografía."}
                </p>

                {professional.specialties.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {professional.specialties.slice(0, 3).map((specialty) => (
                      <span
                        key={specialty.id}
                        className="rounded-full border border-border/30 px-2 py-0.5 text-[10px] text-muted-foreground/70"
                      >
                        {specialty.name}
                      </span>
                    ))}

                    {professional.specialties.length > 3 && (
                      <span className="text-[10px] text-muted-foreground/70">
                        +{professional.specialties.length - 3}
                      </span>
                    )}
                  </div>
                )}

                <div className="mt-3 flex items-center gap-3 text-[11px] text-muted-foreground/70">
                  <span>⭐ {professional.rating_average.toFixed(1)}</span>
                  <span>·</span>
                  <span>{professional.rating_count} reseñas</span>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full rounded-xl border border-dashed border-border/50 p-6 text-center text-sm text-muted-foreground">
              No hay profesionales que coincidan con los filtros aplicados.
            </div>
          )}
        </div>
      )}
    </main>
  )
}