import { useMemo, useState } from "react"
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
          <Button
            onClick={() => {
              setEditingUser(null)
              setDialogOpen(true)
            }}
          >
            Nuevo usuario
          </Button>
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