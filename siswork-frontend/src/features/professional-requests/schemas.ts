import { z } from "zod"

export const professionalRequestCreateSchema = z.object({
  bio: z
    .string()
    .max(1000, "La biografía no puede exceder 1000 caracteres")
    .optional()
    .or(z.literal("")),
  experience_years: z.coerce
    .number()
    .int("Debe ser un número entero")
    .min(0, "No puede ser menor a 0")
    .max(80, "No puede ser mayor a 80"),
  motivation: z
    .string()
    .max(5000, "La motivación no puede exceder 5000 caracteres")
    .optional()
    .or(z.literal("")),
})

export type ProfessionalRequestCreateInput = z.input<
  typeof professionalRequestCreateSchema
>

export type ProfessionalRequestCreateOutput = z.output<
  typeof professionalRequestCreateSchema
>

export const professionalRequestRejectSchema = z.object({
  rejection_reason: z
    .string()
    .min(5, "El motivo debe tener al menos 5 caracteres")
    .max(1000, "El motivo no puede exceder 1000 caracteres"),
})

export type ProfessionalRequestRejectInput = z.input<
  typeof professionalRequestRejectSchema
>

export type ProfessionalRequestRejectOutput = z.output<
  typeof professionalRequestRejectSchema
>