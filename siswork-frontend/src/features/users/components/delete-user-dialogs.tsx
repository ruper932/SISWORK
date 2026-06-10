import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { AlertTriangle, Trash2, ShieldAlert, ArrowLeft } from "lucide-react"
import type { User } from "../types"

type Props = {
  user: User | null
  step: 1 | 2
  open: boolean
  isDeleting?: boolean
  onOpenChange: (open: boolean) => void
  onContinue: () => void
  onBack: () => void
  onConfirm: () => void
  onCancel: () => void
}

export function DeleteUserDialogs({
  user,
  step,
  open,
  isDeleting = false,
  onOpenChange,
  onContinue,
  onBack,
  onConfirm,
  onCancel,
}: Props) {
  if (!user) return null

  const fullName = [user.first_name, user.last_name, user.mother_last_name]
    .filter(Boolean)
    .join(" ")

  const rolesLabel = user.roles?.length ? user.roles.join(", ") : "Sin roles"

  const isFinalStep = step === 2

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md overflow-hidden border-border/70 bg-background p-0 shadow-2xl">
        <div className="border-b border-border/60 bg-linear-to-b from-destructive/10 via-destructive/5 to-transparent px-6 py-5">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/10 text-destructive shadow-[0_0_30px_rgba(239,68,68,0.15)]">
              {isFinalStep ? (
                <Trash2 className="h-5 w-5" />
              ) : (
                <ShieldAlert className="h-5 w-5" />
              )}
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center rounded-full border border-destructive/20 bg-destructive/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-destructive">
                {isFinalStep ? "Paso 2 de 2" : "Paso 1 de 2"}
              </div>

              <AlertDialogHeader className="space-y-1 text-left">
                <AlertDialogTitle className="text-xl font-semibold tracking-tight">
                  {isFinalStep ? "Confirmación final" : "Eliminar usuario"}
                </AlertDialogTitle>
                <AlertDialogDescription className="text-sm leading-6 text-muted-foreground">
                  {isFinalStep
                    ? "Esta es la última confirmación antes de eliminar el registro."
                    : "Vas a iniciar una acción destructiva sobre un usuario del sistema."}
                </AlertDialogDescription>
              </AlertDialogHeader>
            </div>
          </div>
        </div>

        <div className="space-y-5 px-6 py-5">
          <div className="rounded-2xl border border-border/60 bg-muted/40 p-4">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Usuario seleccionado
            </p>

            <div className="mt-3 space-y-2">
              <div>
                <p className="text-base font-semibold text-foreground">{fullName}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl border border-border/50 bg-background/80 px-3 py-2">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                    CI
                  </p>
                  <p className="mt-1 font-medium text-foreground">{user.ci}</p>
                </div>

                <div className="rounded-xl border border-border/50 bg-background/80 px-3 py-2">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                    Estado
                  </p>
                  <p className="mt-1 font-medium text-foreground">
                    {user.is_active ? "Activo" : "Inactivo"}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-border/50 bg-background/80 px-3 py-2">
                <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  Roles
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">{rolesLabel}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-destructive/15 bg-destructive/5 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
              <div className="space-y-1 text-sm leading-6">
                <p className="font-medium text-foreground">
                  {isFinalStep
                    ? "La eliminación será definitiva."
                    : "Aún estás a tiempo de cancelar."}
                </p>
                <p className="text-muted-foreground">
                  {isFinalStep
                    ? "Se perderá el acceso desde esta interfaz y podrías afectar historial, relaciones y trazabilidad del sistema."
                    : "Antes de continuar, verifica que no necesitas conservar este usuario para auditoría, soporte o seguimiento operativo."}
                </p>
              </div>
            </div>
          </div>
        </div>

        <AlertDialogFooter className="border-t border-border/60 bg-muted/20 px-6 py-4">
          {isFinalStep ? (
            <>
              <button
                type="button"
                onClick={onBack}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-medium text-foreground transition hover:bg-muted"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver
              </button>

              <AlertDialogCancel className="mt-0 rounded-xl">
                Cancelar
              </AlertDialogCancel>

              <AlertDialogAction
                className="rounded-xl bg-destructive text-destructive-foreground shadow-lg shadow-destructive/20 hover:bg-destructive/90"
                onClick={onConfirm}
                disabled={isDeleting}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {isDeleting ? "Eliminando..." : "Sí, eliminar usuario"}
              </AlertDialogAction>
            </>
          ) : (
            <>
              <AlertDialogCancel className="mt-0 rounded-xl" onClick={onCancel}>
                Conservar usuario
              </AlertDialogCancel>

              <AlertDialogAction
                className="rounded-xl bg-destructive text-destructive-foreground shadow-lg shadow-destructive/20 hover:bg-destructive/90"
                onClick={onContinue}
              >
                <ShieldAlert className="mr-2 h-4 w-4" />
                Entiendo, continuar
              </AlertDialogAction>
            </>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}