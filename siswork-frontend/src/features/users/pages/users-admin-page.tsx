import { useMemo, useState } from "react"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserFilters } from "../components/user-filters"
import { UserFormDialog } from "../components/user-form-dialog"
import { UsersTable } from "../components/users-table"
import { DeleteUserDialogs } from "../components/delete-user-dialogs"
import {
  useCreateUser,
  useDeleteUser,
  useUpdateUser,
  useUsers,
} from "../hooks"
import type { CreateUserInput, UpdateUserInput, User } from "../types"
import { toast } from "sonner"

export function UsersAdminPage() {
  const [filters, setFilters] = useState({
    q: "",
    role: "ALL",
    city: "",
    zone: "",
    status: "ALL",
    verified: "ALL",
  })

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)
  const [deleteStep, setDeleteStep] = useState<1 | 2>(1)

  const queryFilters = useMemo(
    () => ({
      q: filters.q || undefined,
      role: filters.role === "ALL" ? undefined : filters.role,
      city: filters.city || undefined,
      zone: filters.zone || undefined,
      is_active:
        filters.status === "ALL" ? undefined : filters.status === "ACTIVE",
      is_verified:
        filters.verified === "ALL" ? undefined : filters.verified === "YES",
      skip: 0,
      limit: 50,
    }),
    [filters]
  )

  const usersQuery = useUsers(queryFilters)
  const createMutation = useCreateUser()
  const updateMutation = useUpdateUser()
  const deleteMutation = useDeleteUser()

  async function handleCreate(payload: CreateUserInput | UpdateUserInput) {
    await createMutation.mutateAsync(payload as CreateUserInput)
    toast.success("Usuario creado correctamente")
    setDialogOpen(false)
  }

  async function handleEdit(payload: CreateUserInput | UpdateUserInput) {
    if (!editingUser) return

    await updateMutation.mutateAsync({
      ci: editingUser.ci,
      payload: payload as UpdateUserInput,
    })

    toast.success("Usuario actualizado correctamente")
    setEditingUser(null)
    setDialogOpen(false)
  }

  async function handleDeactivate(user: User) {
    await updateMutation.mutateAsync({
      ci: user.ci,
      payload: {
        is_active: false,
      },
    })
    toast.success("Usuario desactivado")
  }

  async function handleRestore(user: User) {
    await updateMutation.mutateAsync({
      ci: user.ci,
      payload: {
        is_active: true,
      },
    })
    toast.success("Usuario reactivado")
  }

  function openDeleteFlow(user: User) {
    setDeletingUser(user)
    setDeleteStep(1)
  }

  function closeDeleteFlow() {
    setDeletingUser(null)
    setDeleteStep(1)
  }

  async function handleConfirmDelete() {
    if (!deletingUser) return

    await deleteMutation.mutateAsync(deletingUser.ci)
    toast.success("Usuario eliminado correctamente")
    closeDeleteFlow()
  }

  function getUserName(user: User) {
    const possibleName = [
      (user as User & { first_name?: string }).first_name,
      (user as User & { last_name?: string }).last_name,
    ]
      .filter(Boolean)
      .join(" ")

    return possibleName || user.email || user.ci
  }

  function getUserRoles(user: User) {
    const roles = (user as User & { roles?: string[] | string }).roles

    if (Array.isArray(roles)) {
      return roles.join(", ")
    }

    if (typeof roles === "string") {
      return roles
    }

    return ""
  }

  function handleExportPdf() {
    const users = usersQuery.data?.items ?? []

    if (!users.length) {
      toast.error("No hay datos para exportar")
      return
    }

    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    })

    const filtrosAplicados = [
      filters.q ? `Búsqueda: ${filters.q}` : null,
      filters.role !== "ALL" ? `Rol: ${filters.role}` : null,
      filters.city ? `Ciudad: ${filters.city}` : null,
      filters.zone ? `Zona: ${filters.zone}` : null,
      filters.status !== "ALL"
        ? `Estado: ${filters.status === "ACTIVE" ? "Activo" : "Inactivo"}`
        : null,
      filters.verified !== "ALL"
        ? `Verificado: ${filters.verified === "YES" ? "Sí" : "No"}`
        : null,
    ]
      .filter(Boolean)
      .join(" | ")

    doc.setFontSize(16)
    doc.text("Reporte de usuarios", 14, 15)

    doc.setFontSize(10)
    doc.text(`Fecha: ${new Date().toLocaleString("es-BO")}`, 14, 22)
    doc.text(`Total: ${users.length}`, 14, 28)

    const filtrosTexto = filtrosAplicados || "Sin filtros aplicados"
    const filtrosLineas = doc.splitTextToSize(`Filtros: ${filtrosTexto}`, 260)
    doc.text(filtrosLineas, 14, 34)

    autoTable(doc, {
      startY: 34 + filtrosLineas.length * 5,
      head: [[
        "CI",
        "Nombre",
        "Correo",
        "Roles",
        "Ciudad",
        "Zona",
        "Estado",
        "Verificado",
      ]],
      body: users.map((user) => [
        String(user.ci ?? ""),
        String(getUserName(user)),
        String(user.email ?? ""),
        String(getUserRoles(user)),
        String(user.city ?? ""),
        String(user.zone ?? ""),
        user.is_active ? "Activo" : "Inactivo",
        user.is_verified ? "Sí" : "No",
      ]),
      styles: {
        fontSize: 8,
      },
      headStyles: {
        fillColor: [41, 128, 185],
      },
    })

    doc.save("reporte-usuarios.pdf")
    toast.success("Reporte PDF generado correctamente")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle>Gestión de usuarios</CardTitle>
            <p className="text-sm text-muted-foreground">
              Administra cuentas, estados y datos básicos del sistema.
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportPdf}>
              Exportar PDF
            </Button>

            <Button
              onClick={() => {
                setEditingUser(null)
                setDialogOpen(true)
              }}
            >
              Nuevo usuario
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <UserFilters
            filters={filters}
            onChange={(patch) => setFilters((prev) => ({ ...prev, ...patch }))}
            onReset={() =>
              setFilters({
                q: "",
                role: "ALL",
                city: "",
                zone: "",
                status: "ALL",
                verified: "ALL",
              })
            }
          />

          <UsersTable
            users={usersQuery.data?.items ?? []}
            onEdit={(user) => {
              setEditingUser(user)
              setDialogOpen(true)
            }}
            onDeactivate={handleDeactivate}
            onRestore={handleRestore}
            onDelete={openDeleteFlow}
            deletingUserCi={deletingUser?.ci ?? null}
          />
        </CardContent>
      </Card>

      <UserFormDialog
        open={dialogOpen}
        mode={editingUser ? "edit" : "create"}
        user={editingUser}
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) setEditingUser(null)
        }}
        onSubmit={editingUser ? handleEdit : handleCreate}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteUserDialogs
        user={deletingUser}
        step={deleteStep}
        open={!!deletingUser}
        isDeleting={deleteMutation.isPending}
        onOpenChange={(open) => {
          if (!open) closeDeleteFlow()
        }}
        onContinue={() => setDeleteStep(2)}
        onBack={() => setDeleteStep(1)}
        onConfirm={handleConfirmDelete}
        onCancel={closeDeleteFlow}
      />
    </div>
  )
}