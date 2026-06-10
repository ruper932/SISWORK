import { Link, useParams } from "react-router-dom"
import { useApplicationQuery } from "../hooks"

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

export function ApplicationDetailPage() {
  const { applicationId = "" } = useParams()
  const { data, isLoading, isError } = useApplicationQuery(applicationId)

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-4xl px-4 py-8">
        Cargando...
      </main>
    )
  }

  if (isError || !data) {
    return (
      <main className="mx-auto w-full max-w-4xl px-4 py-8">
        <p className="text-sm text-red-600">No se pudo cargar la postulación.</p>
      </main>
    )
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Detalle de postulación</h1>

        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link to="/applications/me">Mis postulaciones</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to={`/requests/${data.request_id}`}>Ver solicitud</Link>
          </Button>
        </div>
      </div>

      <Card className="mt-6">
        <CardContent className="p-6">
          <div className="mb-6">
            <Badge
              variant="outline"
              className={getStatusClasses(data.status)}
            >
              {getStatusLabel(data.status)}
            </Badge>
          </div>

          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                ID solicitud
              </dt>
              <dd className="mt-1 text-sm font-medium">{data.request_id}</dd>
            </div>

            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                Estado
              </dt>
              <dd className="mt-1 text-sm font-medium">
                {getStatusLabel(data.status)}
              </dd>
            </div>

            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                Precio propuesto
              </dt>
              <dd className="mt-1 text-sm font-medium">
                {formatMoney(data.proposed_price)}
              </dd>
            </div>

            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                Horas estimadas
              </dt>
              <dd className="mt-1 text-sm font-medium">
                {data.estimated_time_hours
                  ? `${data.estimated_time_hours} horas`
                  : "—"}
              </dd>
            </div>
          </dl>

          <div className="mt-6">
            <h2 className="text-lg font-semibold">Mensaje</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-muted-foreground">
              {data.proposal_message}
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}