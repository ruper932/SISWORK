import { Link } from "react-router-dom"
import { useCancelMyApplicationMutation, useMyApplicationsQuery } from "../hooks"
import type { ApplicationResponse } from "../types"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

function formatMoney(value: string | null) {
  if (!value) return "—"

  const numberValue = Number(value)
  if (Number.isNaN(numberValue)) return value

  return new Intl.NumberFormat("es-BO", {
    style: "currency",
    currency: "BOB",
    maximumFractionDigits: 2,
  }).format(numberValue)
}

function getStatusLabel(status: ApplicationResponse["status"]) {
  switch (status) {
    case "PENDING":
      return "Pendiente"
    case "ACCEPTED":
      return "Aceptada"
    case "REJECTED":
      return "Rechazada"
    case "CANCELLED":
      return "Cancelada"
    default:
      return status
  }
}

function getStatusClasses(status: ApplicationResponse["status"]) {
  switch (status) {
    case "PENDING":
      return "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400"
    case "ACCEPTED":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
    case "REJECTED":
      return "border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-400"
    case "CANCELLED":
      return "border-slate-500/20 bg-slate-500/10 text-slate-700 dark:text-slate-300"
    default:
      return "border-border bg-muted text-muted-foreground"
  }
}

function ApplicationCard({
  application,
  onCancel,
  isCancelling,
}: {
  application: ApplicationResponse
  onCancel: (applicationId: string) => void
  isCancelling: boolean
}) {
  const canCancel = application.status === "PENDING"

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold">
              Solicitud {application.request_id}
            </h3>

            <div className="mt-2">
              <Badge
                variant="outline"
                className={getStatusClasses(application.status)}
              >
                {getStatusLabel(application.status)}
              </Badge>
            </div>
          </div>

          <Button asChild variant="outline">
            <Link to={`/applications/${application.id}`}>Ver detalle</Link>
          </Button>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          {application.proposal_message}
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Precio propuesto
            </p>
            <p className="mt-1 text-sm font-medium">
              {formatMoney(application.proposed_price)}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Tiempo estimado
            </p>
            <p className="mt-1 text-sm font-medium">
              {application.estimated_time_hours
                ? `${application.estimated_time_hours} horas`
                : "—"}
            </p>
          </div>
        </div>

        {canCancel && (
          <div className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onCancel(application.id)}
              disabled={isCancelling}
            >
              {isCancelling ? "Cancelando..." : "Cancelar postulación"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function MyApplicationsPage() {
  const { data, isLoading, isError } = useMyApplicationsQuery()
  const cancelMutation = useCancelMyApplicationMutation()

  const applications: ApplicationResponse[] = data?.items ?? []

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Mis postulaciones</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Revisa el estado de tus propuestas enviadas.
      </p>

      {isLoading && (
        <p className="mt-6 text-sm text-muted-foreground">Cargando...</p>
      )}

      {isError && (
        <p className="mt-6 text-sm text-red-600">
          No se pudieron cargar tus postulaciones.
        </p>
      )}

      {!isLoading && !isError && (
        <div className="mt-6 grid gap-4">
          {applications.length > 0 ? (
            applications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                onCancel={(applicationId) => cancelMutation.mutate(applicationId)}
                isCancelling={cancelMutation.isPending}
              />
            ))
          ) : (
            <div className="rounded-xl border bg-muted/20 p-6 text-sm text-muted-foreground">
              Aún no tienes postulaciones.
            </div>
          )}
        </div>
      )}
    </main>
  )
}