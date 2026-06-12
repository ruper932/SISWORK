import { useEffect } from "react"
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

  useEffect(() => {
    if (applicationId) {
      form.setValue("application_id", applicationId, {
        shouldValidate: true,
        shouldDirty: false,
      })
    }
  }, [applicationId, form])

  const onSubmit = async (values: ReviewCreateFormOutput) => {
    try {
      await mutation.mutateAsync({
        application_id: values.application_id,
        rating: values.rating,
        comment: values.comment,
      })

      navigate("/reviews/me")
    } catch (error) {
      console.error("Error creating review:", error)
    }
  }

  const applicationIdError = form.formState.errors.application_id?.message
  const ratingError = form.formState.errors.rating?.message
  const commentError = form.formState.errors.comment?.message
  const mutationError =
    mutation.error instanceof Error ? mutation.error.message : null

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
            readOnly={Boolean(applicationId)}
            className="w-full rounded-md border px-3 py-2 read-only:bg-muted read-only:text-muted-foreground"
            {...form.register("application_id")}
          />
          {applicationIdError && (
            <p className="text-sm text-red-600">{applicationIdError}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="rating" className="text-sm font-medium">
            Calificación
          </label>
          <select
            id="rating"
            className="w-full rounded-md border px-3 py-2"
            {...form.register("rating", { valueAsNumber: true })}
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>
          {ratingError && <p className="text-sm text-red-600">{ratingError}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="comment" className="text-sm font-medium">
            Comentario
          </label>
          <textarea
            id="comment"
            rows={5}
            className="w-full rounded-md border px-3 py-2"
            placeholder="Describe cómo fue la experiencia con el profesional"
            {...form.register("comment")}
          />
          {commentError && <p className="text-sm text-red-600">{commentError}</p>}
        </div>

        {mutationError && (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {mutationError}
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {mutation.isPending ? "Guardando..." : "Enviar reseña"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/reviews/me")}
            className="rounded-md border px-4 py-2 text-sm font-medium"
          >
            Cancelar
          </button>
        </div>
      </form>
    </main>
  )
}