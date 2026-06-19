import { useMemo, useState } from "react"
import { UserPen, Mail, Phone, MapPin, CreditCard } from "lucide-react"
import { useAuth } from "@/features/auth/use-auth"

export function ProfilePage() {
  const { user } = useAuth()

  const initialValues = useMemo(
    () => ({
      ci: user?.ci ?? "",
      first_name: user?.first_name ?? "",
      last_name: user?.last_name ?? "",
      mother_last_name: user?.mother_last_name ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
      city: user?.city ?? "",
      zone: user?.zone ?? "",
    }),
    [user]
  )

  const [form, setForm] = useState(initialValues)

  const handleChange =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({
        ...prev,
        [field]: e.target.value,
      }))
    }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí luego conectas tu mutation para actualizar perfil
    console.log("Perfil a actualizar:", form)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Editar perfil</h1>
        <p className="text-sm text-muted-foreground">
          Actualiza tu información personal y de contacto.
        </p>
      </div>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-6 flex items-start gap-4">
          <div className="rounded-2xl bg-primary/10 p-3 text-primary">
            <UserPen className="h-6 w-6" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Información personal
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Revisa que tus datos estén correctos antes de guardar cambios.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Nombre
              </label>
              <input
                type="text"
                value={form.first_name}
                onChange={handleChange("first_name")}
                className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary"
                placeholder="Tu nombre"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Apellido paterno
              </label>
              <input
                type="text"
                value={form.last_name}
                onChange={handleChange("last_name")}
                className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary"
                placeholder="Tu apellido paterno"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Apellido materno
              </label>
              <input
                type="text"
                value={form.mother_last_name}
                onChange={handleChange("mother_last_name")}
                className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary"
                placeholder="Tu apellido materno"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                CI
              </label>
              <div className="relative">
                <CreditCard className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={form.ci}
                  disabled
                  className="h-11 w-full rounded-xl border border-border bg-muted pl-10 pr-3 text-sm text-muted-foreground outline-none"
                  placeholder="CI"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                El CI no se puede editar.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  value={form.email}
                  onChange={handleChange("email")}
                  className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-3 text-sm outline-none focus:border-primary"
                  placeholder="correo@ejemplo.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Teléfono
              </label>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={form.phone}
                  onChange={handleChange("phone")}
                  className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-3 text-sm outline-none focus:border-primary"
                  placeholder="77777777"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Ciudad
              </label>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={form.city}
                  onChange={handleChange("city")}
                  className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-3 text-sm outline-none focus:border-primary"
                  placeholder="Tu ciudad"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Zona
              </label>
              <input
                type="text"
                value={form.zone}
                onChange={handleChange("zone")}
                className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary"
                placeholder="Tu zona"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setForm(initialValues)}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-background px-4 text-sm font-medium text-foreground transition hover:bg-muted"
            >
              Restablecer
            </button>

            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              Guardar cambios
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}