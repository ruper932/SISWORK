import { z } from "zod"

export const createUserSchema = z.object({
  ci: z.string().min(1, "CI requerido"),
  first_name: z.string().min(1, "Nombre requerido"),
  last_name: z.string().min(1, "Apellido requerido"),
  mother_last_name: z.string().optional().or(z.literal("")),
  birth_date: z.string().min(1, "Fecha requerida"),
  email: z.email("Correo inválido"),
  phone: z.string().min(1, "Teléfono requerido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  city: z.string().optional().or(z.literal("")),
  zone: z.string().optional().or(z.literal("")),
})

export const updateUserSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  mother_last_name: z.string().optional().or(z.literal("")),
  birth_date: z.string().optional(),
  email: z.email("Correo inválido").optional(),
  phone: z.string().optional(),
  password: z.string().min(6, "Mínimo 6 caracteres").optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  zone: z.string().optional().or(z.literal("")),
  is_active: z.boolean().optional(),
  is_verified: z.boolean().optional(),
})

export type CreateUserFormValues = z.infer<typeof createUserSchema>
export type UpdateUserFormValues = z.infer<typeof updateUserSchema>