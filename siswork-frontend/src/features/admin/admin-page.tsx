import { useAdminDashboardQuery } from "./hooks"

export function AdminPage() {
  const { data, isLoading, isError } = useAdminDashboardQuery()

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Panel de administración</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Vista general del sistema.
      </p>

      {isLoading && (
        <p className="mt-6 text-sm text-muted-foreground">Cargando dashboard...</p>
      )}

      {isError && (
        <p className="mt-6 text-sm text-red-600">
          No se pudo cargar el dashboard de administración.
        </p>
      )}

      {!isLoading && !isError && data && (
        <section className="mt-6 rounded-xl border bg-background p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Respuesta del backend</h2>
          <div className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
            <p>
              <span className="font-medium text-foreground">Mensaje:</span>{" "}
              {data.message}
            </p>
            <p>
              <span className="font-medium text-foreground">Usuario:</span>{" "}
              {data.user}
            </p>
          </div>
        </section>
      )}
    </main>
  )
}