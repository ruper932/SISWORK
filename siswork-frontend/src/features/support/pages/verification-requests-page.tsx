import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  useApproveVerificationMutation,
  useRejectVerificationMutation,
} from "../hooks"
import {
  rejectVerificationSchema,
  type RejectVerificationSchema,
} from "../schemas"

export function VerificationRequestsPage() {
  const approveMutation = useApproveVerificationMutation()
  const rejectMutation = useRejectVerificationMutation()
  const [verificationRequestId, setVerificationRequestId] = useState("")

  const form = useForm<RejectVerificationSchema>({
    resolver: zodResolver(rejectVerificationSchema),
    defaultValues: {
      verification_request_id: "",
      rejection_reason: "",
    },
  })

  const handleApprove = async () => {
    if (!verificationRequestId) return
    await approveMutation.mutateAsync(verificationRequestId)
    setVerificationRequestId("")
  }

  const onReject = async (values: RejectVerificationSchema) => {
    await rejectMutation.mutateAsync(values)
    form.reset({
      verification_request_id: "",
      rejection_reason: "",
    })
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Gestión de verificaciones</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Aprueba o rechaza solicitudes de verificación profesional.
      </p>

      <section className="mt-6 rounded-xl border p-4">
        <h2 className="text-lg font-semibold">Aprobar verificación</h2>
        <div className="mt-4 flex gap-3">
          <input
            value={verificationRequestId}
            onChange={(e) => setVerificationRequestId(e.target.value)}
            placeholder="Verification request ID"
            className="w-full rounded-md border px-3 py-2"
          />
          <button
            type="button"
            onClick={handleApprove}
            disabled={approveMutation.isPending || !verificationRequestId}
            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {approveMutation.isPending ? "Aprobando..." : "Aprobar"}
          </button>
        </div>
      </section>

      <section className="mt-6 rounded-xl border p-4">
        <h2 className="text-lg font-semibold">Rechazar verificación</h2>

        <form onSubmit={form.handleSubmit(onReject)} className="mt-4 space-y-4">
          <div className="space-y-2">
            <label htmlFor="verification_request_id" className="text-sm font-medium">
              Verification request ID
            </label>
            <input
              id="verification_request_id"
              className="w-full rounded-md border px-3 py-2"
              {...form.register("verification_request_id")}
            />
            {form.formState.errors.verification_request_id && (
              <p className="text-sm text-red-600">
                {form.formState.errors.verification_request_id.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="rejection_reason" className="text-sm font-medium">
              Motivo de rechazo
            </label>
            <textarea
              id="rejection_reason"
              rows={4}
              className="w-full rounded-md border px-3 py-2"
              {...form.register("rejection_reason")}
            />
            {form.formState.errors.rejection_reason && (
              <p className="text-sm text-red-600">
                {form.formState.errors.rejection_reason.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={rejectMutation.isPending}
            className="rounded-md border px-4 py-2 text-sm font-medium text-red-600 disabled:opacity-60"
          >
            {rejectMutation.isPending ? "Rechazando..." : "Rechazar"}
          </button>
        </form>
      </section>
    </main>
  )
}