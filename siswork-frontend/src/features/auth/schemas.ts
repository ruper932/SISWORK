import { z } from "zod";

// ---------- Constantes ----------
export const BOLIVIAN_CITIES = [
  "La Paz",
  "Santa Cruz",
  "Cochabamba",
  "Sucre",
  "Potosí",
  "Oruro",
  "Tarija",
  "Cobija",
  "Trinidad",
  "El Alto",
  "Villa Tunari",
  "Riberalta",
] as const;

// Palabras consideradas "fake" para nombres y apellidos
const FORBIDDEN_NAMES = [
  "nombre",
  "apellido",
  "test",
  "prueba",
  "fake",
  "example",
  "usuario",
  "user",
  "anonimo",
  "anon",
  "unknown",
  "desconocido",
  "n/a",
  "ninguno",
];

// ---------- Funciones auxiliares ----------
function calculateAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

function isNotFakeName(value: string): boolean {
  const normalized = value.trim().toLowerCase();
  if (normalized.length < 2) return false;
  if (FORBIDDEN_NAMES.includes(normalized)) return false;
  // Rechazar si está completamente en mayúsculas y es una palabra genérica
  if (value === value.toUpperCase() && /^[A-ZÁÉÍÓÚÑ]+$/.test(value)) {
    return false;
  }
  return true;
}

// Validación de Gmail: solo @gmail.com, sin puntos consecutivos, etc.
const gmailRegex = /^[a-z0-9](?!.*\.\.)(?!.*\.$)[a-z0-9.]*@gmail\.com$/i;

// ---------- Schemas ----------

export const loginSchema = z.object({
  username: z
    .string()
    .min(3, "Ingresa tu CI o correo electrónico (mínimo 3 caracteres)")
    .max(50, "El usuario es demasiado largo"),
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(100, "La contraseña es demasiado larga"),
});

export const registerSchema = z
  .object({
    ci: z
      .string()
      .min(1, "El CI es obligatorio")
      .regex(/^\d+$/, "El CI solo debe contener números"),
    first_name: z
      .string()
      .min(2, "El nombre debe tener al menos 2 caracteres")
      .max(50, "El nombre es demasiado largo")
      .regex(
        /^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]+$/,
        "El nombre solo puede contener letras y espacios"
      )
      .refine(isNotFakeName, { message: "Nombre no válido (parece falso)" }),
    last_name: z
      .string()
      .min(2, "El apellido paterno debe tener al menos 2 caracteres")
      .max(50, "El apellido paterno es demasiado largo")
      .regex(
        /^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]+$/,
        "El apellido solo puede contener letras y espacios"
      )
      .refine(isNotFakeName, {
        message: "Apellido paterno no válido (parece falso)",
      }),
    mother_last_name: z
      .string()
      .min(2, "El apellido materno debe tener al menos 2 caracteres")
      .max(50, "El apellido materno es demasiado largo")
      .regex(
        /^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]+$/,
        "El apellido solo puede contener letras y espacios"
      )
      .refine(isNotFakeName, {
        message: "Apellido materno no válido (parece falso)",
      }),
    birth_date: z
      .string()
      .min(1, "La fecha de nacimiento es obligatoria")
      .refine((date) => !isNaN(Date.parse(date)), {
        message: "Fecha de nacimiento inválida",
      })
      .refine((date) => calculateAge(date) >= 18, {
        message: "Debes ser mayor de 18 años para registrarte",
      }),
    email: z
      .string()
      .min(1, "El correo es obligatorio")
      .email("Formato de correo electrónico inválido")
      .refine((email) => gmailRegex.test(email), {
        message: "El correo debe ser una cuenta de Gmail válida (ejemplo@gmail.com)",
      }),
    phone: z
      .string()
      .min(1, "El teléfono es obligatorio")
      .regex(
        /^[0-9+\-\s]+$/,
        "El teléfono solo puede contener números, +, - y espacios"
      ),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .max(100, "La contraseña es demasiado larga")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        "La contraseña debe incluir mayúscula, minúscula, número y carácter especial"
      ),
    city: z.enum(BOLIVIAN_CITIES, {
      errorMap: () => ({
        message: `Selecciona una ciudad válida: ${BOLIVIAN_CITIES.join(", ")}`,
      }),
    }),
    zone: z
      .string()
      .min(1, "La zona es obligatoria")
      .max(100, "La zona es demasiado larga"),
  })
  .strict(); // Evita campos extra

// ---------- Tipos ----------
export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;