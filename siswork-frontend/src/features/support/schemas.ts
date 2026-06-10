import { z } from "zod"

export const rejectVerificationSchema = z.object({
  verification_request_id: z.string().uuid("El verification_request_id debe ser un UUID válido"),
  rejection_reason: z
    .string()
    .min(5, "Debes indicar un motivo de rechazo")
    .max(500, "El motivo no puede superar 500 caracteres"),
})

export type RejectVerificationSchema = z.infer<typeof rejectVerificationSchema>