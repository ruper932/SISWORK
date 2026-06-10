import { z } from "zod"

const requiredInteger = (label: string) =>
  z.preprocess(
    (value) => {
      if (value === "" || value === null || value === undefined) return undefined
      if (typeof value === "number") return value
      if (typeof value === "string") return Number(value)
      return value
    },
    z.number({ error: `${label} debe ser numérico` }),
  )

export const reviewCreateSchema = z.object({
  application_id: z.string().uuid("El application_id debe ser un UUID válido"),
  rating: requiredInteger("La calificación")
    .refine((value) => !Number.isNaN(value), {
      message: "La calificación debe ser numérica",
    })
    .refine((value) => Number.isInteger(value), {
      message: "La calificación debe ser un número entero",
    })
    .refine((value) => value >= 1 && value <= 5, {
      message: "La calificación debe estar entre 1 y 5",
    }),
  comment: z
    .string()
    .min(3, "El comentario debe tener al menos 3 caracteres")
    .max(500, "El comentario no puede superar 500 caracteres"),
})

export type ReviewCreateFormInput = z.input<typeof reviewCreateSchema>
export type ReviewCreateFormOutput = z.output<typeof reviewCreateSchema>