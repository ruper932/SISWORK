import { useMemo } from "react"
import { useQueries } from "@tanstack/react-query"
import { useAuth } from "@/features/auth/use-auth"
import {
  getAllRequests,
  getMyApplications,
  getMyProfessionalRequests,
  getMyRequests,
  getMyReviews,
  getPendingProfessionalRequests,
  getProfessionals,
  getUsersTotal,
} from "./api"

const dayLabels = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

function getLast7DaysActivity(dates: string[]) {
  const today = new Date()
  const result = []

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)

    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, "0")
    const dd = String(date.getDate()).padStart(2, "0")
    const key = `${yyyy}-${mm}-${dd}`

    const value = dates.filter((d) => d.startsWith(key)).length

    result.push({
      day: dayLabels[date.getDay()],
      value,
    })
  }

  return result
}

export function useDashboardData() {
  const { user } = useAuth()
  const roles = user?.roles ?? []

  const isAdmin = roles.includes("ADMIN") || roles.includes("SUPERADMIN")
  const isSupport = roles.includes("SUPPORT")
  const isClient = roles.includes("CLIENT")
  const isProfessional = roles.includes("PROFESSIONAL")

  const results = useQueries({
    queries: [
      {
        queryKey: ["dashboard", "requests"],
        queryFn: getAllRequests,
      },
      {
        queryKey: ["dashboard", "professionals"],
        queryFn: getProfessionals,
      },
      {
        queryKey: ["dashboard", "applications", "me"],
        queryFn: getMyApplications,
      },
      {
        queryKey: ["dashboard", "reviews", "me"],
        queryFn: getMyReviews,
      },
      {
        queryKey: ["dashboard", "requests", "me"],
        queryFn: getMyRequests,
        enabled: isClient,
      },
      {
        queryKey: ["dashboard", "professional-requests", "me"],
        queryFn: getMyProfessionalRequests,
        enabled: isClient,
      },
      {
        queryKey: ["dashboard", "professional-requests", "pending"],
        queryFn: getPendingProfessionalRequests,
        enabled: isSupport || isAdmin,
      },
      {
        queryKey: ["dashboard", "users", "total"],
        queryFn: getUsersTotal,
        enabled: isAdmin,
      },
    ],
  })

  const [
    requestsQuery,
    professionalsQuery,
    applicationsQuery,
    reviewsQuery,
    myRequestsQuery,
    myProfessionalRequestsQuery,
    pendingProfessionalRequestsQuery,
    usersTotalQuery,
  ] = results

  return useMemo(() => {
    const requestsTotal = requestsQuery.data?.total ?? 0
    const professionalsTotal = professionalsQuery.data?.length ?? 0
    const applicationsTotal = applicationsQuery.data?.total ?? 0
    const reviews = reviewsQuery.data ?? []
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length
        : 0

    const activityDates = [
      ...(requestsQuery.data?.items ?? []).map((item) => item.created_at),
      ...(applicationsQuery.data?.items ?? []).map((item) => item.created_at),
      ...reviews.map((item) => item.created_at),
      ...((myProfessionalRequestsQuery.data?.items ?? []).map((item) => item.created_at)),
      ...((pendingProfessionalRequestsQuery.data?.items ?? []).map((item) => item.created_at)),
    ]

    const overviewCards = [
      {
        title: isClient ? "Mis solicitudes" : "Solicitudes activas",
        value: String(isClient ? myRequestsQuery.data?.total ?? 0 : requestsTotal),
        description: isClient
          ? "Solicitudes creadas por tu cuenta"
          : "Solicitudes registradas en la plataforma",
      },
      {
        title: isAdmin ? "Usuarios" : "Profesionales",
        value: String(isAdmin ? usersTotalQuery.data ?? 0 : professionalsTotal),
        description: isAdmin
          ? "Usuarios totales registrados"
          : "Perfiles visibles en la plataforma",
      },
      {
        title: "Postulaciones",
        value: String(applicationsTotal),
        description: isProfessional
          ? "Postulaciones enviadas por tu perfil"
          : "Postulaciones relacionadas a tu cuenta",
      },
      {
        title: "Calificación media",
        value: avgRating > 0 ? avgRating.toFixed(1) : "—",
        description: "Promedio basado en reseñas recibidas",
      },
    ]

    const weeklyActivity = getLast7DaysActivity(activityDates)

    return {
      isLoading: results.some((q) => q.isLoading),
      isError: results.some((q) => q.isError),
      overviewCards,
      weeklyActivity,
      stats: {
        requestsTotal,
        professionalsTotal,
        applicationsTotal,
        avgRating,
        myRequestsTotal: myRequestsQuery.data?.total ?? 0,
        myProfessionalRequestsTotal: myProfessionalRequestsQuery.data?.total ?? 0,
        pendingProfessionalRequestsTotal: pendingProfessionalRequestsQuery.data?.total ?? 0,
        usersTotal: usersTotalQuery.data ?? 0,
      },
    }
  }, [results, requestsQuery.data, professionalsQuery.data, applicationsQuery.data, reviewsQuery.data, myRequestsQuery.data, myProfessionalRequestsQuery.data, pendingProfessionalRequestsQuery.data, usersTotalQuery.data, isAdmin, isClient, isProfessional])
}