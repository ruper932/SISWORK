import { useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { useCreateApplicationMutation } from "../hooks"
import {
  applicationCreateSchema,
  type ApplicationCreateFormInput,
  type ApplicationCreateFormOutput,
} from "../schemas"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface CreateApplicationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  requestId: string
}

export function CreateApplicationDialog({
  open,
  onOpenChange,
  requestId,
}: CreateApplicationDialogProps) {
  const navigate = useNavigate()
  const createMutation = useCreateApplicationMutation()

  const defaultValues = useMemo<ApplicationCreateFormInput>(
    () => ({
      request_id: requestId,
      proposal_message: "",
      proposed_price: undefined,
      estimated_time_hours: undefined,
    }),
    [requestId],
  )

  const form = useForm<
    ApplicationCreateFormInput,
    unknown,
    ApplicationCreateFormOutput
  >({
    resolver: zodResolver(applicationCreateSchema),
    defaultValues,
  })

  useEffect(() => {
    if (open) {
      form.reset({
        request_id: requestId,
        proposal_message: "",
        proposed_price: undefined,
        estimated_time_hours: undefined,
      })
    }
  }, [open, requestId, form])

  const handleDialogChange = (nextOpen: boolean) => {
    if (createMutation.isPending) return
    onOpenChange(nextOpen)
  }

  const onSubmit = async (values: ApplicationCreateFormOutput) => {
    await createMutation.mutateAsync(values)

    form.reset({
      request_id: requestId,
      proposal_message: "",
      proposed_price: undefined,
      estimated_time_hours: undefined,
    })

    onOpenChange(false)
    navigate("/applications/me")
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Postularme a esta solicitud</DialogTitle>
          <DialogDescription>
            Envía tu propuesta con precio y tiempo estimado.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <input type="hidden" {...form.register("request_id")} />

          <div className="space-y-2">
            <Label htmlFor="proposal_message">Propuesta</Label>
            <Textarea
              id="proposal_message"
              rows={6}
              placeholder="Describe cómo realizarías el trabajo, tu experiencia y lo que incluye tu propuesta."
              {...form.register("proposal_message")}
            />
            {form.formState.errors.proposal_message && (
              <p className="text-sm text-red-600">
                {form.formState.errors.proposal_message.message}
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="proposed_price">Precio propuesto</Label>
              <Input
                id="proposed_price"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...form.register("proposed_price")}
              />
              {form.formState.errors.proposed_price && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.proposed_price.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimated_time_hours">Horas estimadas</Label>
              <Input
                id="estimated_time_hours"
                type="number"
                step="1"
                placeholder="8"
                {...form.register("estimated_time_hours")}
              />
              {form.formState.errors.estimated_time_hours && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.estimated_time_hours.message}
                </p>
              )}
            </div>
          </div>

          {createMutation.isError && (
            <p className="text-sm text-red-600">
              No se pudo enviar la postulación. Revisa los datos e intenta nuevamente.
            </p>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createMutation.isPending}
            >
              Cancelar
            </Button>

            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Enviando..." : "Enviar postulación"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}