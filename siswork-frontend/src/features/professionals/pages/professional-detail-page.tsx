import { useParams } from "react-router-dom"
import { useProfessionalQuery } from "../hooks"

export function ProfessionalDetailPage() {
  const { userCi = "" } = useParams()
  const { data, isLoading, isError } = useProfessionalQuery(userCi)

  if (isLoading) {
    return <main className="mx-auto w-full max-w-4xl px-4 py-8">Cargando...</main>
  }

  if (isError || !data) {
    return (
      <main className="mx-auto w-full max-w-4xl px-4 py-8">
        <p className="text-sm text-red-600">No se pudo cargar el profesional.</p>
      </main>
    )
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-semibold">{data.full_name}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {data.city}
        {data.zone ? ` · ${data.zone}` : ""}
      </p>

      <div className="mt-6 rounded-xl border bg-background p-6 shadow-sm">
        <p className="text-sm leading-6 text-muted-foreground">{data.bio || "Sin biografía."}</p>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">Estado</dt>
            <dd className="mt-1 text-sm font-medium">{data.verification_status}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">Valoración</dt>
            <dd className="mt-1 text-sm font-medium">
              {data.rating_average.toFixed(1)} ({data.rating_count})
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">Experiencia</dt>
            <dd className="mt-1 text-sm font-medium">{data.experience_years} años</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">Disponibilidad</dt>
            <dd className="mt-1 text-sm font-medium">{data.is_available ? "Disponible" : "No disponible"}</dd>
          </div>
        </dl>

        <div className="mt-6">
          <h2 className="text-lg font-semibold">Especialidades</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {data.specialties.map((specialty) => (
              <li key={specialty.id} className="rounded-full border px-3 py-1 text-sm">
                {specialty.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  )
}