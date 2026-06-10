import { Link } from "react-router-dom"
import { useMyReviewsQuery } from "../hooks"
import type { ReviewItem } from "../types"

function ReviewCard({ review }: { review: ReviewItem }) {
  return (
    <div className="rounded-xl border bg-background p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold">
            Reseña para {review.reviewed_user_ci}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Calificación: {review.rating}/5
          </p>
        </div>

        <Link to={`/reviews/${review.id}`} className="text-sm underline">
          Ver detalle
        </Link>
      </div>

      <p className="mt-3 text-sm text-muted-foreground">{review.comment}</p>
    </div>
  )
}

export function MyReviewsPage() {
  const { data, isLoading, isError } = useMyReviewsQuery()

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Reseñas para mí</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Aquí puedes ver las reseñas que has recibido.
      </p>

      {isLoading && (
        <p className="mt-6 text-sm text-muted-foreground">Cargando...</p>
      )}

      {isError && (
        <p className="mt-6 text-sm text-red-600">
          No se pudieron cargar las reseñas.
        </p>
      )}

      {!isLoading && !isError && (
        <div className="mt-6 grid gap-4">
          {data?.length ? (
            data.map((review) => <ReviewCard key={review.id} review={review} />)
          ) : (
            <div className="rounded-xl border bg-muted/20 p-6 text-sm text-muted-foreground">
              Aún no tienes reseñas.
            </div>
          )}
        </div>
      )}
    </main>
  )
}