import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { CreateUserInput, UpdateUserInput, User } from "../types"

type Props = {
  open: boolean
  mode: "create" | "edit"
  user?: User | null
  onOpenChange: (open: boolean) => void
  onSubmit: (payload: CreateUserInput | UpdateUserInput) => Promise<void> | void
  isSubmitting?: boolean
}

export function UserFormDialog({
  open,
  mode,
  user,
  onOpenChange,
  onSubmit,
  isSubmitting = false,
}: Props) {
  const [form, setForm] = useState({
    ci: "",
    first_name: "",
    last_name: "",
    mother_last_name: "",
    birth_date: "",
    email: "",
    phone: "",
    password: "",
    city: "",
    zone: "",
    is_active: true,
    is_verified: false,
  })

  useEffect(() => {
    if (mode === "edit" && user) {
      setForm({
        ci: user.ci,
        first_name: user.first_name,
        last_name: user.last_name,
        mother_last_name: user.mother_last_name ?? "",
        birth_date: user.birth_date,
        email: user.email,
        phone: user.phone,
        password: "",
        city: user.city ?? "",
        zone: user.zone ?? "",
        is_active: user.is_active,
        is_verified: user.is_verified,
      })
    }

    if (mode === "create") {
      setForm({
        ci: "",
        first_name: "",
        last_name: "",
        mother_last_name: "",
        birth_date: "",
        email: "",
        phone: "",
        password: "",
        city: "",
        zone: "",
        is_active: true,
        is_verified: false,
      })
    }
  }, [mode, user, open])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (mode === "create") {
      await onSubmit({
        ci: form.ci,
        first_name: form.first_name,
        last_name: form.last_name,
        mother_last_name: form.mother_last_name || undefined,
        birth_date: form.birth_date,
        email: form.email,
        phone: form.phone,
        password: form.password,
        city: form.city || undefined,
        zone: form.zone || undefined,
      })
      return
    }

    await onSubmit({
      first_name: form.first_name,
      last_name: form.last_name,
      mother_last_name: form.mother_last_name || undefined,
      birth_date: form.birth_date || undefined,
      email: form.email,
      phone: form.phone,
      password: form.password || undefined,
      city: form.city || undefined,
      zone: form.zone || undefined,
      is_active: form.is_active,
      is_verified: form.is_verified,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Crear usuario" : "Editar usuario"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label>CI</Label>
            <Input
              value={form.ci}
              disabled={mode === "edit"}
              onChange={(e) => setForm((s) => ({ ...s, ci: e.target.value }))}
            />
          </div>

          <div className="grid gap-2">
            <Label>Fecha de nacimiento</Label>
            <Input
              type="date"
              value={form.birth_date}
              onChange={(e) => setForm((s) => ({ ...s, birth_date: e.target.value }))}
            />
          </div>

          <div className="grid gap-2">
            <Label>Nombres</Label>
            <Input
              value={form.first_name}
              onChange={(e) => setForm((s) => ({ ...s, first_name: e.target.value }))}
            />
          </div>

          <div className="grid gap-2">
            <Label>Apellido paterno</Label>
            <Input
              value={form.last_name}
              onChange={(e) => setForm((s) => ({ ...s, last_name: e.target.value }))}
            />
          </div>

          <div className="grid gap-2">
            <Label>Apellido materno</Label>
            <Input
              value={form.mother_last_name}
              onChange={(e) => setForm((s) => ({ ...s, mother_last_name: e.target.value }))}
            />
          </div>

          <div className="grid gap-2">
            <Label>Teléfono</Label>
            <Input
              value={form.phone}
              onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
            />
          </div>

          <div className="grid gap-2 md:col-span-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
            />
          </div>

          <div className="grid gap-2">
            <Label>{mode === "create" ? "Contraseña" : "Nueva contraseña"}</Label>
            <Input
              type="password"
              value={form.password}
              onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
            />
          </div>

          <div className="grid gap-2">
            <Label>Ciudad</Label>
            <Input
              value={form.city}
              onChange={(e) => setForm((s) => ({ ...s, city: e.target.value }))}
            />
          </div>

          <div className="grid gap-2">
            <Label>Zona</Label>
            <Input
              value={form.zone}
              onChange={(e) => setForm((s) => ({ ...s, zone: e.target.value }))}
            />
          </div>

          <div className="md:col-span-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {mode === "create" ? "Crear" : "Guardar cambios"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}