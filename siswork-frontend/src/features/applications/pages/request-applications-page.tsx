import { Link, useParams } from "react-router-dom"
import {
  useAcceptApplicationMutation,
  useRejectApplicationMutation,
  useRequestApplicationsQuery,
} from "../hooks"
import type { ApplicationItem } from "../types"

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

function getStatusLabel(status: string) {
  switch (status) {
    case "PENDING":
      return "Pendiente"
    case "ACCEPTED":
      return "Aceptada"
    case "REJECTED":
      return "Rechazada"
    case "WITHDRAWN":
      return "Retirada"
    case "COMPLETED":
      return "Completada"
    case "CANCELLED":
      return "Cancelada"
    default:
      return status
  }
}

function getStatusClasses(status: string) {
  switch (status) {
    case "PENDING":
      return "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400"
    case "ACCEPTED":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
    case "REJECTED":
      return "border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-400"
    case "WITHDRAWN":
      return "border-zinc-500/20 bg-zinc-500/10 text-zinc-700 dark:text-zinc-400"
    case "COMPLETED":
      return "border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-400"
    case "CANCELLED":
      return "border-slate-500/20 bg-slate-500/10 text-slate-700 dark:text-slate-300"
    default:
      return "border-border bg-muted text-muted-foreground"
  }
}

function ApplicationRow({
  application,
  onAccept,
  onReject,
  isBusy,
}: {
  application: ApplicationItem
  onAccept: (applicationId: string) => void
  onReject: (applicationId: string) => void
  isBusy: boolean
}) {
  const canDecide = application.status === "PENDING"

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold">
              {application.professional_profile_id}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Propuesta: {application.proposal_message}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <Badge
              variant="outline"
              className={getStatusClasses(application.status)}
            >
              {getStatusLabel(application.status)}
            </Badge>
            <div className="text-sm font-medium">
              {formatMoney(application.proposed_price)}
            </div>
          </div>
        </div>

        <div className="mt-3 grid gap-2 sm:grid-cols-2">
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

          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Estado
            </p>
            <p className="mt-1 text-sm font-medium">
              {getStatusLabel(application.status)}
            </p>
          </div>
        </div>

        {canDecide && (
          <div className="mt-4 flex gap-3">
            <Button
              type="button"
              onClick={() => onAccept(application.id)}
              disabled={isBusy}
            >
              Aceptar
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onReject(application.id)}
              disabled={isBusy}
            >
              Rechazar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function RequestApplicationsPage() {
  const { requestId = "" } = useParams()
  const { data, isLoading, isError } = useRequestApplicationsQuery(requestId)
  const acceptMutation = useAcceptApplicationMutation()
  const rejectMutation = useRejectApplicationMutation()

  const applications = data?.items ?? []
  const isBusy = acceptMutation.isPending || rejectMutation.isPending

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">
            Postulaciones de la solicitud
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Revisa y decide sobre las propuestas recibidas.
          </p>
        </div>

        <Button asChild variant="outline">
          <Link to={`/requests/${requestId}`}>Volver a la solicitud</Link>
        </Button>
      </div>

      {isLoading && (
        <p className="mt-6 text-sm text-muted-foreground">Cargando...</p>
      )}

      {isError && (
        <p className="mt-6 text-sm text-red-600">
          No se pudieron cargar las postulaciones.
        </p>
      )}

      {!isLoading && !isError && (
        <div className="mt-6 grid gap-4">
          {applications.length ? (
            applications.map((application) => (
              <ApplicationRow
                key={application.id}
                application={application}
                onAccept={(applicationId) => acceptMutation.mutate(applicationId)}
                onReject={(applicationId) => rejectMutation.mutate(applicationId)}
                isBusy={isBusy}
              />
            ))
          ) : (
            <div className="rounded-xl border bg-muted/20 p-6 text-sm text-muted-foreground">
              Esta solicitud aún no tiene postulaciones.
            </div>
          )}
        </div>
      )}
    </main>
  )
}