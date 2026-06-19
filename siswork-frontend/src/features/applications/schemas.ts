import { z } from "zod"

const requiredNumber = (label: string) =>
  z.preprocess(
    (value) => {
      if (value === "" || value === null || value === undefined) return undefined
      if (typeof value === "number") return value
      if (typeof value === "string") return Number(value)
      return value
    },
    z.number({ error: `${label} debe ser numérico` })
  )

export const applicationCreateSchema = z.object({
  request_id: z.string().uuid("El request_id debe ser un UUID válido"),
  proposal_message: z
    .string()
    .min(10, "La propuesta debe tener al menos 10 caracteres"),
  proposed_price: requiredNumber("El precio")
    .refine((value) => !Number.isNaN(value), {
      message: "El precio debe ser numérico",
    })
    .refine((value) => value >= 0, {
      message: "El precio no puede ser negativo",
    }),
  estimated_time_hours: requiredNumber("Las horas")
    .refine((value) => !Number.isNaN(value), {
      message: "Las horas deben ser numéricas",
    })
    .refine((value) => Number.isInteger(value), {
      message: "Las horas deben ser enteras",
    })
    .refine((value) => value >= 1, {
      message: "Debes indicar al menos 1 hora",
    }),
})

export type ApplicationCreateFormInput = z.input<typeof applicationCreateSchema>
export type ApplicationCreateFormOutput = z.output<typeof applicationCreateSchema>