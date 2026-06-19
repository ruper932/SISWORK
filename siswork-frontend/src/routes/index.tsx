import { createBrowserRouter } from "react-router-dom"

import { PublicLayout } from "@/layouts/public-layout"
import { PrivateLayout } from "@/layouts/private-layout"

import { PublicOnlyRoute } from "./public-only-route"
import { ProtectedRoute } from "./protected-route"

import { WelcomePage } from "@/features/home/welcome-page"
import { LoginPage } from "@/features/auth/login-page"
import { RegisterPage } from "@/features/auth/register-page"
import { DashboardPage } from "@/features/dashboard/dashboard-page"

import { RequestsListPage } from "@/features/requests/pages/requests-list-page"
import { RequestCreatePage } from "@/features/requests/pages/request-create-page"
import { RequestDetailPage } from "@/features/requests/pages/request-detail-page"
import { ClientRequestsHistoryPage } from "@/features/requests/pages/client-requests-history-page"

import { ProfessionalsListPage } from "@/features/professionals/pages/professionals-list-page"
import { ProfessionalDetailPage } from "@/features/professionals/pages/professional-detail-page"
import { RequestVerificationPage } from "@/features/professionals/pages/request-verification-page"

import { MyApplicationsPage } from "@/features/applications/pages/my-applications-page"
import { RequestApplicationsPage } from "@/features/applications/pages/request-applications-page"
import { ApplicationDetailPage } from "@/features/applications/pages/application-detail-page"

import { MyReviewsPage } from "@/features/reviews/pages/my-reviews-page"
import { CreateReviewPage } from "@/features/reviews/pages/create-review-page"
import { ReviewDetailPage } from "@/features/reviews/pages/review-detail-page"

import { SupportDashboardPage } from "@/features/support/pages/support-dashboard-page"
import { VerificationRequestsPage } from "@/features/support/pages/verification-requests-page"

import { AdminPage } from "@/features/admin/admin-page"
import { UsersAdminPage } from "@/features/users/pages/users-admin-page"

import { MyProfessionalRequestPage } from "@/features/professional-requests/pages/my-professional-request-page"
import { PendingProfessionalRequestsPage } from "@/features/professional-requests/pages/pending-professional-requests-page"

import { Login2FAPage } from "@/features/auth/login-2fa-page"
import { SecurityPage } from "@/features/account/pages/security-page"
import { ProfilePage } from "@/features/account/pages/profile-page"

function NotFoundPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Página no encontrada</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        La ruta que intentaste abrir no existe.
      </p>
    </main>
  )
}

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      {
        path: "/",
        element: <WelcomePage />,
      },
      {
        element: <PublicOnlyRoute />,
        children: [
          {
            path: "/login",
            element: <LoginPage />,
          },
          {
            path: "/login/2fa",
            element: <Login2FAPage />,
          },
          {
            path: "/register",
            element: <RegisterPage />,
          },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <PrivateLayout />,
        children: [
          {
            path: "/dashboard",
            element: <DashboardPage />,
          },
          {
            path: "/account/profile",
            element: <ProfilePage />,
          },
          {
            path: "/account/security",
            element: <SecurityPage />,
          },
          {
            path: "/requests",
            element: <RequestsListPage />,
          },
          {
            path: "/requests/new",
            element: <RequestCreatePage />,
          },
          {
            path: "/requests/history",
            element: <ClientRequestsHistoryPage />,
          },
          {
            path: "/requests/:requestId",
            element: <RequestDetailPage />,
          },
          {
            path: "/professionals",
            element: <ProfessionalsListPage />,
          },
          {
            path: "/professionals/:userCi",
            element: <ProfessionalDetailPage />,
          },
          {
            path: "/professionals/request-verification",
            element: <RequestVerificationPage />,
          },
          {
            path: "/applications/me",
            element: <MyApplicationsPage />,
          },
          {
            path: "/applications/:applicationId",
            element: <ApplicationDetailPage />,
          },
          {
            path: "/applications/request/:requestId",
            element: <RequestApplicationsPage />,
          },
          {
            path: "/reviews/me",
            element: <MyReviewsPage />,
          },
          {
            path: "/reviews/new",
            element: <CreateReviewPage />,
          },
          {
            path: "/reviews/:reviewId",
            element: <ReviewDetailPage />,
          },
          {
            path: "/professional-requests/me",
            element: <MyProfessionalRequestPage />,
          },
          {
            path: "/support",
            element: <SupportDashboardPage />,
          },
          {
            path: "/support/verification-requests",
            element: <VerificationRequestsPage />,
          },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute roles={["SUPPORT","ADMIN", "SUPERADMIN"]} />,
    children: [
      {
        element: <PrivateLayout />,
        children: [
          {
            path: "/admin",
            element: <AdminPage />,
          },
          {
            path: "/admin/users",
            element: <UsersAdminPage />,
          },
          {
            path: "/support/professional-requests",
            element: <PendingProfessionalRequestsPage />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
])