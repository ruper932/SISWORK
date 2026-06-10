import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "react-router-dom"
import { useRequestVerificationMutation } from "../hooks"
import {
  verificationRequestSchema,
  type VerificationRequestSchema,
} from "../schemas"

export function RequestVerificationPage() {
  const navigate = useNavigate()
  const mutation = useRequestVerificationMutation()

  const form = useForm<VerificationRequestSchema>({
    resolver: zodResolver(verificationRequestSchema),
  })

  const onSubmit = async (values: VerificationRequestSchema) => {
    await mutation.mutateAsync({
      ciPhoto: values.ciPhoto,
      selfiePhoto: values.selfiePhoto,
      certificatePdf: values.certificatePdf,
    })
    navigate("/dashboard")
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Solicitar verificación</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Sube tus documentos para que soporte revise tu cuenta profesional.
      </p>

      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="ciPhoto">
            Foto del CI
          </label>
          <input
            id="ciPhoto"
            type="file"
            accept="image/*"
            onChange={(e) =>
              form.setValue("ciPhoto", e.target.files?.[0] as File, {
                shouldValidate: true,
              })
            }
            className="block w-full rounded-md border bg-background px-3 py-2"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="selfiePhoto">
            Selfie
          </label>
          <input
            id="selfiePhoto"
            type="file"
            accept="image/*"
            onChange={(e) =>
              form.setValue("selfiePhoto", e.target.files?.[0] as File, {
                shouldValidate: true,
              })
            }
            className="block w-full rounded-md border bg-background px-3 py-2"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="certificatePdf">
            Certificado PDF
          </label>
          <input
            id="certificatePdf"
            type="file"
            accept="application/pdf"
            onChange={(e) =>
              form.setValue("certificatePdf", e.target.files?.[0] as File, {
                shouldValidate: true,
              })
            }
            className="block w-full rounded-md border bg-background px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {mutation.isPending ? "Enviando..." : "Enviar solicitud"}
        </button>
      </form>
    </main>
  )
}