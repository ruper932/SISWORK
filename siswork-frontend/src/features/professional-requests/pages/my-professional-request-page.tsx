import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  professionalRequestCreateSchema,
  type ProfessionalRequestCreateInput,
  type ProfessionalRequestCreateOutput,
} from "../schemas"
import {
  useCreateProfessionalRequestMutation,
  useMyProfessionalRequestsQuery,
} from "../hooks"

function getStatusLabel(status: "PENDING" | "APPROVED" | "REJECTED") {
  switch (status) {
    case "PENDING":
      return "Pendiente"
    case "APPROVED":
      return "Aprobada"
    case "REJECTED":
      return "Rechazada"
  }
}

export function MyProfessionalRequestPage() {
  const createMutation = useCreateProfessionalRequestMutation()
  const myRequestsQuery = useMyProfessionalRequestsQuery()

  const form = useForm<
    ProfessionalRequestCreateInput,
    unknown,
    ProfessionalRequestCreateOutput
  >({
    resolver: zodResolver(professionalRequestCreateSchema),
    defaultValues: {
      bio: "",
      experience_years: 0,
      motivation: "",
    },
  })

  const onSubmit = async (values: ProfessionalRequestCreateOutput) => {
    await createMutation.mutateAsync(values)
    form.reset({
      bio: "",
      experience_years: 0,
      motivation: "",
    })
  }

  const pendingRequest = myRequestsQuery.data?.items.find(
    (item) => item.status === "PENDING",
  )

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Solicitar ser profesional</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Envía tu solicitud para que un rol de soporte o superior revise tu cambio
        de rol.
      </p>

      {!pendingRequest && (
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-6 space-y-4 rounded-xl border p-4"
        >
          <div className="space-y-2">
            <label htmlFor="bio" className="text-sm font-medium">
              Biografía
            </label>
            <textarea
              id="bio"
              rows={4}
              className="w-full rounded-md border px-3 py-2"
              placeholder="Cuéntanos sobre tu experiencia y perfil profesional"
              {...form.register("bio")}
            />
            {form.formState.errors.bio && (
              <p className="text-sm text-red-600">
                {form.formState.errors.bio.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="experience_years" className="text-sm font-medium">
              Años de experiencia
            </label>
            <input
              id="experience_years"
              type="number"
              min={0}
              max={80}
              className="w-full rounded-md border px-3 py-2"
              {...form.register("experience_years", { valueAsNumber: true })}
            />
            {form.formState.errors.experience_years && (
              <p className="text-sm text-red-600">
                {form.formState.errors.experience_years.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="motivation" className="text-sm font-medium">
              Motivación
            </label>
            <textarea
              id="motivation"
              rows={5}
              className="w-full rounded-md border px-3 py-2"
              placeholder="Explica por qué quieres ofrecer servicios como profesional"
              {...form.register("motivation")}
            />
            {form.formState.errors.motivation && (
              <p className="text-sm text-red-600">
                {form.formState.errors.motivation.message}
              </p>
            )}
          </div>

          {createMutation.error instanceof Error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {createMutation.error.message}
            </div>
          )}

          <button
            type="submit"
            disabled={createMutation.isPending}
            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {createMutation.isPending ? "Enviando..." : "Enviar solicitud"}
          </button>
        </form>
      )}

      {pendingRequest && (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-medium text-amber-800">
            Ya tienes una solicitud pendiente. Debes esperar la revisión antes de
            enviar otra.
          </p>
        </div>
      )}

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Mis solicitudes</h2>

        <div className="mt-4 space-y-3">
          {myRequestsQuery.isLoading && (
            <p className="text-sm text-muted-foreground">Cargando...</p>
          )}

          {myRequestsQuery.data?.items.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Aún no tienes solicitudes registradas.
            </p>
          )}

          {myRequestsQuery.data?.items.map((item) => (
            <article key={item.id} className="rounded-xl border p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium">
                  Estado: {getStatusLabel(item.status)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(item.created_at).toLocaleString()}
                </p>
              </div>

              {item.bio && <p className="mt-2 text-sm">{item.bio}</p>}

              <p className="mt-2 text-sm">
                Experiencia: {item.experience_years} años
              </p>

              {item.motivation && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {item.motivation}
                </p>
              )}

              {item.rejection_reason && (
                <p className="mt-2 text-sm text-red-600">
                  Motivo de rechazo: {item.rejection_reason}
                </p>
              )}
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}