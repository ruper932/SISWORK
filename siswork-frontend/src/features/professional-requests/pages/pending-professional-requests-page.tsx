import { useState } from "react"
import {
  useApproveProfessionalRequestMutation,
  usePendingProfessionalRequestsQuery,
  useRejectProfessionalRequestMutation,
} from "../hooks"

export function PendingProfessionalRequestsPage() {
  const { data, isLoading } = usePendingProfessionalRequestsQuery()
  const approveMutation = useApproveProfessionalRequestMutation()
  const rejectMutation = useRejectProfessionalRequestMutation()
  const [reasons, setReasons] = useState<Record<string, string>>({})

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-semibold">
        Solicitudes para ser profesional
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Revisa y decide qué solicitudes pueden aprobarse.
      </p>

      <div className="mt-6 space-y-4">
        {isLoading && (
          <p className="text-sm text-muted-foreground">Cargando...</p>
        )}

        {data?.items.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No hay solicitudes pendientes.
          </p>
        )}

        {data?.items.map((item) => (
          <article key={item.id} className="rounded-xl border p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-medium">CI: {item.user_ci}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(item.created_at).toLocaleString()}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={approveMutation.isPending || rejectMutation.isPending}
                  onClick={() => approveMutation.mutate(item.id)}
                  className="rounded-md bg-green-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
                >
                  Aprobar
                </button>

                <button
                  type="button"
                  disabled={
                    approveMutation.isPending ||
                    rejectMutation.isPending ||
                    (reasons[item.id]?.trim().length ?? 0) < 5
                  }
                  onClick={() =>
                    rejectMutation.mutate({
                      id: item.id,
                      rejection_reason: reasons[item.id] ?? "",
                    })
                  }
                  className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
                >
                  Rechazar
                </button>
              </div>
            </div>

            {item.bio && <p className="mt-3 text-sm">{item.bio}</p>}

            <p className="mt-2 text-sm">
              Experiencia: {item.experience_years} años
            </p>

            {item.motivation && (
              <p className="mt-2 text-sm text-muted-foreground">
                {item.motivation}
              </p>
            )}

            <div className="mt-4 space-y-2">
              <label className="text-sm font-medium">Motivo de rechazo</label>
              <textarea
                rows={3}
                value={reasons[item.id] ?? ""}
                onChange={(event) =>
                  setReasons((prev) => ({
                    ...prev,
                    [item.id]: event.target.value,
                  }))
                }
                className="w-full rounded-md border px-3 py-2"
                placeholder="Escribe un motivo si vas a rechazar"
              />
            </div>

            {rejectMutation.error instanceof Error && (
              <p className="mt-2 text-sm text-red-600">
                {rejectMutation.error.message}
              </p>
            )}

            {approveMutation.error instanceof Error && (
              <p className="mt-2 text-sm text-red-600">
                {approveMutation.error.message}
              </p>
            )}
          </article>
        ))}
      </div>
    </main>
  )
}