import { Link, useParams } from "react-router-dom"
import { useReviewQuery } from "../hooks"

function formatDateTime(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString("es-BO")
}

export function ReviewDetailPage() {
  const { reviewId = "" } = useParams()
  const { data, isLoading, isError } = useReviewQuery(reviewId)

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-4xl px-4 py-8">
        <p className="text-sm text-muted-foreground">Cargando reseña...</p>
      </main>
    )
  }

  if (isError || !data) {
    return (
      <main className="mx-auto w-full max-w-4xl px-4 py-8">
        <p className="text-sm text-red-600">No se pudo cargar la reseña.</p>
      </main>
    )
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Detalle de reseña</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Creada el {formatDateTime(data.created_at)}
          </p>
        </div>

        <Link
          to="/reviews/me"
          className="rounded-md border px-4 py-2 text-sm font-medium"
        >
          Volver
        </Link>
      </div>

      <div className="mt-6 rounded-xl border bg-background p-6 shadow-sm">
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">
              Reviewer CI
            </dt>
            <dd className="mt-1 text-sm font-medium">{data.reviewer_ci}</dd>
          </div>

          <div>
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">
              Reviewed user CI
            </dt>
            <dd className="mt-1 text-sm font-medium">{data.reviewed_user_ci}</dd>
          </div>

          <div>
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">
              Calificación
            </dt>
            <dd className="mt-1 text-sm font-medium">{data.rating}/5</dd>
          </div>

          <div>
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">
              Application ID
            </dt>
            <dd className="mt-1 break-all text-sm font-medium">
              {data.application_id}
            </dd>
          </div>

          <div>
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">
              Actualizada
            </dt>
            <dd className="mt-1 text-sm font-medium">
              {formatDateTime(data.updated_at)}
            </dd>
          </div>
        </dl>

        <div className="mt-6">
          <h2 className="text-lg font-semibold">Comentario</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {data.comment || "Sin comentario."}
          </p>
        </div>
      </div>
    </main>
  )
}