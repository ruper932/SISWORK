import { useParams } from "react-router-dom"
import { useReviewQuery } from "../hooks"

export function ReviewDetailPage() {
  const { reviewId = "" } = useParams()
  const { data, isLoading, isError } = useReviewQuery(reviewId)

  if (isLoading) {
    return <main className="mx-auto w-full max-w-4xl px-4 py-8">Cargando...</main>
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
      <h1 className="text-2xl font-semibold">Detalle de reseña</h1>

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
            <dd className="mt-1 text-sm font-medium">{data.application_id}</dd>
          </div>
        </dl>

        <div className="mt-6">
          <h2 className="text-lg font-semibold">Comentario</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {data.comment}
          </p>
        </div>
      </div>
    </main>
  )
}