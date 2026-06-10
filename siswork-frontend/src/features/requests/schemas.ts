import { z } from "zod"

const optionalNumber = () =>
  z.preprocess((value) => {
    if (value === "" || value === null || value === undefined) return undefined
    if (typeof value === "number") return value
    if (typeof value === "string") return Number(value)
    return value
  }, z.number().nonnegative("El valor no puede ser negativo").optional())

export const requestCreateSchema = z.object({
  specialty_id: z.string().min(1, "La especialidad es obligatoria"),
  title: z.string().min(3, "El título es obligatorio"),
  description: z.string().min(10, "La descripción es obligatoria"),
  budget: optionalNumber(),
  proposed_final_price: optionalNumber(),
  scheduled_date: z.string().optional(),
  city: z.string().min(2, "La ciudad es obligatoria"),
  zone: z.string().optional(),
  latitude: optionalNumber(),
  longitude: optionalNumber(),
  urgency: z.enum(["LOW", "MEDIUM", "HIGH"]),
})

export const requestCancelSchema = z.object({
  cancellation_reason: z.string().max(1000).optional(),
})

export type RequestCreateFormInput = z.input<typeof requestCreateSchema>
export type RequestCreateFormOutput = z.output<typeof requestCreateSchema>
export type RequestCancelSchema = z.infer<typeof requestCancelSchema>