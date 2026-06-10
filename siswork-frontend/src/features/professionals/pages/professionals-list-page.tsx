import { useState } from "react"
import { Link } from "react-router-dom"
import { useProfessionalsQuery } from "../hooks"

export function ProfessionalsListPage() {
  const [q, setQ] = useState("")
  const { data, isLoading, isError } = useProfessionalsQuery({ q })

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Profesionales</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Busca profesionales por nombre, ciudad o especialidad.
          </p>
        </div>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar..."
          className="w-full rounded-md border bg-background px-3 py-2 md:max-w-sm"
        />
      </div>

      {isLoading && <p className="mt-6 text-sm text-muted-foreground">Cargando...</p>}

      {isError && (
        <p className="mt-6 text-sm text-red-600">
          No se pudieron cargar los profesionales.
        </p>
      )}

      {!isLoading && !isError && (
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data?.length ? (
            data.map((professional) => (
              <Link
                key={professional.id}
                to={`/professionals/${professional.user_ci}`}
                className="rounded-xl border bg-background p-4 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-semibold">{professional.full_name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {professional.city}
                      {professional.zone ? ` · ${professional.zone}` : ""}
                    </p>
                  </div>
                  <span className="rounded-full border px-2 py-1 text-xs uppercase tracking-wide">
                    {professional.verification_status}
                  </span>
                </div>

                <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
                  {professional.bio || "Sin biografía."}
                </p>

                <div className="mt-4 text-xs text-muted-foreground">
                  {professional.rating_average.toFixed(1)} · {professional.rating_count} reseñas
                </div>
              </Link>
            ))
          ) : (
            <div className="rounded-xl border bg-muted/20 p-6 text-sm text-muted-foreground">
              No hay profesionales que coincidan con tu búsqueda.
            </div>
          )}
        </div>
      )}
    </main>
  )
}