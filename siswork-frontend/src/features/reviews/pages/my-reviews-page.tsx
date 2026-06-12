import { Link } from "react-router-dom"
import { MessageSquareQuote, Star } from "lucide-react"

import { useMyReviewsQuery } from "../hooks"

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString("es-BO")
}

export function MyReviewsPage() {
  const { data, isLoading, isError } = useMyReviewsQuery()
  const reviews = data ?? []

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-4xl border border-border/60 bg-card p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-primary/10 p-3 text-primary">
            <MessageSquareQuote className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Mis reseñas
            </h1>
            <p className="text-sm text-muted-foreground">
              Consulta las reseñas asociadas a tu cuenta.
            </p>
          </div>
        </div>
      </section>

      {isLoading ? (
        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm"
            >
              <div className="h-5 w-28 rounded bg-muted" />
              <div className="mt-4 h-4 w-full rounded bg-muted" />
              <div className="mt-2 h-4 w-2/3 rounded bg-muted" />
            </div>
          ))}
        </section>
      ) : null}

      {isError ? (
        <section className="mt-6 rounded-3xl border border-destructive/20 bg-destructive/10 px-5 py-4 text-sm text-destructive">
          No se pudieron cargar las reseñas.
        </section>
      ) : null}

      {!isLoading && !isError ? (
        <section className="mt-6">
          {reviews.length ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {reviews.map((review) => (
                <Link
                  key={review.id}
                  to={`/reviews/${review.id}`}
                  className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1 text-amber-500">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          className={`h-4 w-4 ${index < review.rating ? "fill-current" : ""}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(review.created_at)}
                    </span>
                  </div>

                  <p className="mt-4 line-clamp-4 text-sm leading-6 text-muted-foreground">
                    {review.comment || "Sin comentario."}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-border/60 bg-card p-10 text-center shadow-sm">
              <h2 className="text-xl font-semibold text-foreground">
                No hay reseñas todavía
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Cuando generes una reseña, aparecerá aquí.
              </p>
            </div>
          )}
        </section>
      ) : null}
    </main>
  )
}