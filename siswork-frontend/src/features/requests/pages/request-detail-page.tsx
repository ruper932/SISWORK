import { Link, useParams } from "react-router-dom"
import { useMemo, useState } from "react"
import { Star } from "lucide-react"

import {
  useCancelRequestMutation,
  useCompleteRequestMutation,
  useRequestQuery,
  useStartRequestMutation,
} from "../hooks"
import { useAuth } from "@/features/auth/use-auth"
import { CreateApplicationDialog } from "@/features/applications/components/create-application-dialog"
import {
  useMyApplicationsQuery,
  useRequestApplicationsQuery,
} from "@/features/applications/hooks"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RequestLocationMap } from "@/components/request-location-map"

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

function formatDate(value: string | null) {
  if (!value) return "—"

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return date.toLocaleString("es-BO")
}

function getStatusLabel(status: string) {
  switch (status) {
    case "OPEN":
      return "Abierta"
    case "IN_PROGRESS":
      return "En progreso"
    case "COMPLETED":
      return "Completada"
    case "CANCELLED":
      return "Cancelada"
    case "EXPIRED":
      return "Expirada"
    default:
      return status
  }
}

function getUrgencyLabel(urgency: string) {
  switch (urgency) {
    case "LOW":
      return "Baja"
    case "MEDIUM":
      return "Media"
    case "HIGH":
      return "Alta"
    default:
      return urgency
  }
}

export function RequestDetailPage() {
  const { requestId = "" } = useParams()
  const { user } = useAuth()
  const [isCreateApplicationOpen, setIsCreateApplicationOpen] = useState(false)

  const { data: request, isLoading, isError } = useRequestQuery(requestId)
  const { data: myApplicationsData } = useMyApplicationsQuery()
  const { data: requestApplicationsData } = useRequestApplicationsQuery(requestId)

  const cancelMutation = useCancelRequestMutation()
  const startMutation = useStartRequestMutation()
  const completeMutation = useCompleteRequestMutation()

  const userRoles = user?.roles ?? []
  const myApplications = myApplicationsData?.items ?? []
  const requestApplications = requestApplicationsData?.items ?? []

  const hasApplied = useMemo(() => {
    if (!request) return false
    return myApplications.some((application) => application.request_id === request.id)
  }, [myApplications, request])

  const assignedProfessionalProfileId =
    request?.assigned_professional_profile_id ?? null

  const acceptedApplication = useMemo(() => {
    if (!requestApplications.length) return null

    return (
      requestApplications.find((application) => application.status === "ACCEPTED") ??
      requestApplications.find(
        (application) =>
          assignedProfessionalProfileId !== null &&
          application.professional_profile_id === assignedProfessionalProfileId,
      ) ??
      null
    )
  }, [requestApplications, assignedProfessionalProfileId])

  const permissions = useMemo(() => {
    if (!request || !user) {
      return {
        isOwnerClient: false,
        isProfessional: false,
        isAssignedProfessional: false,
        canStart: false,
        canComplete: false,
        canCancel: false,
        canViewApplications: false,
        canApply: false,
        canReview: false,
      }
    }

    const isOwnerClient = request.client_ci === user.ci
    const isProfessional = userRoles.includes("PROFESSIONAL")
    const isAssignedProfessional =
      request.assigned_professional?.user_ci === user.ci

    const canStart =
      request.status === "OPEN" &&
      (isOwnerClient || isAssignedProfessional)

    const canComplete =
      request.status === "IN_PROGRESS" &&
      (isOwnerClient || isAssignedProfessional)

    const canCancel =
      isOwnerClient &&
      request.status !== "COMPLETED" &&
      request.status !== "CANCELLED"

    const canViewApplications = isOwnerClient

    const canApply =
      isProfessional &&
      !isOwnerClient &&
      !isAssignedProfessional &&
      request.status === "OPEN" &&
      !request.assigned_professional_profile_id &&
      !hasApplied

    const canReview =
      isOwnerClient &&
      request.status === "COMPLETED" &&
      request.can_review &&
      request.is_review_enabled

    return {
      isOwnerClient,
      isProfessional,
      isAssignedProfessional,
      canStart,
      canComplete,
      canCancel,
      canViewApplications,
      canApply,
      canReview,
    }
  }, [request, user, userRoles, hasApplied])

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-4xl px-4 py-8">
        Cargando...
      </main>
    )
  }

  if (isError || !request) {
    return (
      <main className="mx-auto w-full max-w-4xl px-4 py-8">
        <p className="text-sm text-red-600">No se pudo cargar la solicitud.</p>
      </main>
    )
  }

  const reviewLink = acceptedApplication
    ? {
        pathname: "/reviews/new",
        search: `?applicationId=${encodeURIComponent(acceptedApplication.id)}`,
      }
    : null

  const latitude = request.latitude
  const longitude = request.longitude
  const hasLocation =
    typeof latitude === "number" && typeof longitude === "number"

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8">
      <Link to="/requests" className="text-sm underline">
        ← Volver
      </Link>

      <Card className="mt-4">
        <CardContent className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold">{request.title}</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {request.city}
                {request.zone ? ` · ${request.zone}` : ""}
              </p>
            </div>

            <Badge variant="outline">{getStatusLabel(request.status)}</Badge>
          </div>

          <p className="mt-6 whitespace-pre-line text-sm leading-6 text-muted-foreground">
            {request.description}
          </p>

          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                Presupuesto
              </dt>
              <dd className="mt-1 text-sm font-medium">
                {formatMoney(request.budget)}
              </dd>
            </div>

            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                Precio final propuesto
              </dt>
              <dd className="mt-1 text-sm font-medium">
                {formatMoney(request.proposed_final_price)}
              </dd>
            </div>

            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                Urgencia
              </dt>
              <dd className="mt-1 text-sm font-medium">
                {getUrgencyLabel(request.urgency)}
              </dd>
            </div>

            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                Fecha programada
              </dt>
              <dd className="mt-1 text-sm font-medium">
                {formatDate(request.scheduled_date)}
              </dd>
            </div>

            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                Creada
              </dt>
              <dd className="mt-1 text-sm font-medium">
                {formatDate(request.created_at)}
              </dd>
            </div>

            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                Actualizada
              </dt>
              <dd className="mt-1 text-sm font-medium">
                {formatDate(request.updated_at)}
              </dd>
            </div>
          </dl>

          {hasLocation && (
            <div className="mt-6 space-y-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Ubicación
                </p>
                <p className="mt-1 text-sm font-medium">
                  Latitud: {latitude} · Longitud: {longitude}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Vista referencial de la ubicación registrada en la solicitud.
                </p>
              </div>

              <RequestLocationMap
                latitude={latitude}
                longitude={longitude}
              />
            </div>
          )}

          {request.assigned_professional && (
            <div className="mt-6 rounded-lg border bg-muted/30 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Profesional asignado
              </p>
              <p className="mt-1 text-sm font-medium">
                {request.assigned_professional.user_ci}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Experiencia: {request.assigned_professional.experience_years} años
              </p>
            </div>
          )}

          {request.cancellation_reason && (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
              <span className="font-medium">Motivo de cancelación:</span>{" "}
              {request.cancellation_reason}
            </div>
          )}

          {hasApplied && (
            <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
              Ya realizaste una postulación para esta solicitud.
            </div>
          )}

          {permissions.canReview && !reviewLink && (
            <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
              La solicitud puede ser reseñada, pero aún no se pudo resolver la
              aplicación aceptada desde el detalle.
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            {permissions.canStart && (
              <Button
                type="button"
                onClick={() => startMutation.mutate(request.id)}
                disabled={startMutation.isPending}
              >
                {startMutation.isPending ? "Iniciando..." : "Iniciar"}
              </Button>
            )}

            {permissions.canComplete && (
              <Button
                type="button"
                onClick={() => completeMutation.mutate(request.id)}
                disabled={completeMutation.isPending}
              >
                {completeMutation.isPending ? "Completando..." : "Completar"}
              </Button>
            )}

            {permissions.canCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  cancelMutation.mutate({
                    requestId: request.id,
                    payload: {
                      cancellation_reason: "Cancelada por el cliente",
                    },
                  })
                }
                disabled={cancelMutation.isPending}
              >
                {cancelMutation.isPending ? "Cancelando..." : "Cancelar"}
              </Button>
            )}

            {permissions.canViewApplications && (
              <Button asChild variant="secondary">
                <Link to={`/applications/request/${request.id}`}>
                  Ver postulaciones
                </Link>
              </Button>
            )}

            {permissions.canReview && reviewLink && (
              <Button asChild>
                <Link to={reviewLink}>
                  <Star className="mr-2 h-4 w-4" />
                  Dejar reseña
                </Link>
              </Button>
            )}

            {hasApplied ? (
              <Button type="button" variant="secondary" disabled>
                Ya postulaste
              </Button>
            ) : (
              permissions.canApply && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsCreateApplicationOpen(true)}
                >
                  Postularme
                </Button>
              )
            )}
          </div>
        </CardContent>
      </Card>

      <CreateApplicationDialog
        open={isCreateApplicationOpen}
        onOpenChange={setIsCreateApplicationOpen}
        requestId={request.id}
      />
    </main>
  )
}