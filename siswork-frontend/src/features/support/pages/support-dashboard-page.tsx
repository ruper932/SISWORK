import { Link } from "react-router-dom"

export function SupportDashboardPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Panel de soporte</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Administra tareas operativas del sistema.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Link
          to="/support/verification-requests"
          className="rounded-xl border bg-background p-5 shadow-sm transition hover:shadow-md"
        >
          <h2 className="text-lg font-semibold">Solicitudes de verificación</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Aprueba o rechaza verificaciones pendientes.
          </p>
        </Link>
      </div>
    </main>
  )
}