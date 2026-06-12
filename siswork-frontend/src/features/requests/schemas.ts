import { z } from "zod"

const preprocessOptionalNumber = (schema: z.ZodNumber) =>
  z.preprocess((value) => {
    if (value === "" || value === null || value === undefined) return undefined
    if (typeof value === "number") return value
    if (typeof value === "string") return Number(value)
    return value
  }, schema.optional())

const optionalNonNegativeNumber = () =>
  preprocessOptionalNumber(
    z.number().nonnegative("El valor no puede ser negativo")
  )

const optionalLatitude = () =>
  preprocessOptionalNumber(
    z
      .number()
      .min(-90, "La latitud debe ser mayor o igual a -90")
      .max(90, "La latitud debe ser menor o igual a 90")
  )

const optionalLongitude = () =>
  preprocessOptionalNumber(
    z
      .number()
      .min(-180, "La longitud debe ser mayor o igual a -180")
      .max(180, "La longitud debe ser menor o igual a 180")
  )

export const requestCreateSchema = z.object({
  specialty_id: z.string().min(1, "La especialidad es obligatoria"),
  title: z.string().min(3, "El título es obligatorio"),
  description: z.string().min(10, "La descripción es obligatoria"),
  budget: optionalNonNegativeNumber(),
  proposed_final_price: optionalNonNegativeNumber(),
  scheduled_date: z.string().optional(),
  city: z.string().min(2, "La ciudad es obligatoria"),
  zone: z.string().optional(),
  latitude: optionalLatitude(),
  longitude: optionalLongitude(),
  urgency: z.enum(["LOW", "MEDIUM", "HIGH"]),
})

export const requestCancelSchema = z.object({
  cancellation_reason: z.string().max(1000).optional(),
})

export type RequestCreateFormInput = z.input<typeof requestCreateSchema>
export type RequestCreateFormOutput = z.output<typeof requestCreateSchema>
export type RequestCancelSchema = z.infer<typeof requestCancelSchema>