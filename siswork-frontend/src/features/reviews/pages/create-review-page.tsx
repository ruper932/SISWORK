import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useCreateReviewMutation } from "../hooks"
import {
  reviewCreateSchema,
  type ReviewCreateFormInput,
  type ReviewCreateFormOutput,
} from "../schemas"

export function CreateReviewPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const applicationId = searchParams.get("applicationId") ?? ""
  const mutation = useCreateReviewMutation()

  const form = useForm<ReviewCreateFormInput, unknown, ReviewCreateFormOutput>({
    resolver: zodResolver(reviewCreateSchema),
    defaultValues: {
      application_id: applicationId,
      rating: 5,
      comment: "",
    },
  })

  const onSubmit = async (values: ReviewCreateFormOutput) => {
    await mutation.mutateAsync({
      application_id: values.application_id,
      rating: values.rating,
      comment: values.comment,
    })

    navigate("/reviews/me")
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Crear reseña</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Califica la experiencia del servicio realizado.
      </p>

      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div className="space-y-2">
          <label htmlFor="application_id" className="text-sm font-medium">
            Application ID
          </label>
          <input
            id="application_id"
            className="w-full rounded-md border px-3 py-2"
            {...form.register("application_id")}
          />
          {form.formState.errors.application_id && (
            <p className="text-sm text-red-600">
              {form.formState.errors.application_id.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="rating" className="text-sm font-medium">
            Calificación
          </label>
          <select
            id="rating"
            className="w-full rounded-md border px-3 py-2"
            {...form.register("rating")}
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>
          {form.formState.errors.rating && (
            <p className="text-sm text-red-600">
              {form.formState.errors.rating.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="comment" className="text-sm font-medium">
            Comentario
          </label>
          <textarea
            id="comment"
            rows={5}
            className="w-full rounded-md border px-3 py-2"
            {...form.register("comment")}
          />
          {form.formState.errors.comment && (
            <p className="text-sm text-red-600">
              {form.formState.errors.comment.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {mutation.isPending ? "Guardando..." : "Enviar reseña"}
        </button>
      </form>
    </main>
  )
}