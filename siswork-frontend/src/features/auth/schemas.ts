import { z } from "zod"

export const loginSchema = z.object({
  username: z
    .string()
    .min(3, "Ingresa tu CI o correo electrónico"),
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
})

export const registerSchema = z.object({
  ci: z
    .string()
    .min(5, "El CI es obligatorio"),
  first_name: z
    .string()
    .min(2, "El nombre es obligatorio"),
  last_name: z
    .string()
    .min(2, "El apellido paterno es obligatorio"),
  mother_last_name: z
    .string()
    .min(2, "El apellido materno es obligatorio"),
  birth_date: z
    .string()
    .min(1, "La fecha de nacimiento es obligatoria"),
  email: z
    .string()
    .email("Correo electrónico inválido"),
  phone: z
    .string()
    .min(6, "El teléfono es obligatorio"),
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
  city: z
    .string()
    .min(2, "La ciudad es obligatoria"),
  zone: z
    .string()
    .min(2, "La zona es obligatoria"),
})

export type LoginSchema = z.infer<typeof loginSchema>
export type RegisterSchema = z.infer<typeof registerSchema>