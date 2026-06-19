import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import { ArrowRight, KeyRound, ShieldCheck, UserRound } from "lucide-react"
import { loginSchema, type LoginSchema } from "./schemas"
import { useLoginMutation } from "./hooks"
import { getApiErrorMessage } from "@/lib/api-error"

export function LoginPage() {
  const loginMutation = useLoginMutation()

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const onSubmit = async (values: LoginSchema) => {
    await loginMutation.mutateAsync(values)
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.12),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.12),transparent_22%)]" />

      <div className="mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_520px] lg:px-8">
        <div className="hidden lg:block">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-4 py-2 text-sm text-muted-foreground shadow-sm backdrop-blur">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Acceso seguro a SISWORK
            </span>

            <h1 className="mt-6 text-5xl font-bold tracking-tight text-foreground">
              Administra servicios y oportunidades desde un solo lugar
            </h1>

            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              Inicia sesión para acceder a tu panel, revisar solicitudes,
              explorar profesionales y gestionar tu actividad dentro de la
              plataforma.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm">
                <p className="text-2xl font-semibold tracking-tight text-foreground">
                  250+
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Profesionales registrados
                </p>
              </div>

              <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm">
                <p className="text-2xl font-semibold tracking-tight text-foreground">
                  120+
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Solicitudes activas
                </p>
              </div>

              <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm">
                <p className="text-2xl font-semibold tracking-tight text-foreground">
                  4.8/5
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Satisfacción promedio
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full">
          <div className="mx-auto w-full max-w-md rounded-4xl border border-border/60 bg-card/95 p-6 shadow-2xl shadow-primary/10 backdrop-blur sm:p-8">
            <div className="mb-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-lg font-bold text-primary-foreground shadow-lg shadow-primary/20">
                S
              </div>

              <h1 className="mt-5 text-3xl font-semibold tracking-tight text-foreground">
                Iniciar sesión
              </h1>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Ingresa con tu CI o correo electrónico para acceder a tu cuenta.
              </p>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <label
                  htmlFor="username"
                  className="text-sm font-medium text-foreground"
                >
                  CI o correo
                </label>

                <div className="relative">
                  <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="username"
                    type="text"
                    placeholder="Ingresa tu CI o correo"
                    className="h-12 w-full rounded-2xl border border-border bg-background pl-10 pr-4 text-sm outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-4 focus:ring-primary/10"
                    {...form.register("username")}
                  />
                </div>

                {form.formState.errors.username && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.username.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-foreground"
                  >
                    Contraseña
                  </label>

                  
                </div>

                <div className="relative">
                  <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="password"
                    type="password"
                    placeholder="Ingresa tu contraseña"
                    className="h-12 w-full rounded-2xl border border-border bg-background pl-10 pr-4 text-sm outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-4 focus:ring-primary/10"
                    {...form.register("password")}
                  />
                </div>

                {form.formState.errors.password && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              {loginMutation.isError && (
                <div className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {getApiErrorMessage(loginMutation.error)}
                </div>
              )}

              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loginMutation.isPending ? "Ingresando..." : "Ingresar"}
                {!loginMutation.isPending && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>

            <div className="mt-6 rounded-2xl bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
              ¿No tienes cuenta?{" "}
              <Link
                to="/register"
                className="font-semibold text-foreground transition hover:text-primary"
              >
                Regístrate aquí
              </Link>
            </div>

            <div className="mt-6 text-center text-xs leading-6 text-muted-foreground">
              Al ingresar, accedes a un espacio seguro para gestionar
              solicitudes, postulaciones y soporte dentro de SISWORK.
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}