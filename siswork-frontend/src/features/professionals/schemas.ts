import { z } from "zod"

export const professionalSearchSchema = z.object({
  q: z.string().optional(),
  specialty_id: z.string().optional(),
  city: z.string().optional(),
  zone: z.string().optional(),
  min_rating: z.union([z.string(), z.number()]).optional(),
  is_available: z.union([z.boolean(), z.string()]).optional(),
  skip: z.union([z.string(), z.number()]).optional(),
  limit: z.union([z.string(), z.number()]).optional(),
})

export const verificationRequestSchema = z.object({
  ciPhoto: z.instanceof(File, { message: "Debes subir una foto del CI" }),
  selfiePhoto: z.instanceof(File, { message: "Debes subir una selfie" }),
  certificatePdf: z.instanceof(File, { message: "Debes subir el certificado PDF" }),
})

export type ProfessionalSearchSchema = z.infer<typeof professionalSearchSchema>
export type VerificationRequestSchema = z.infer<typeof verificationRequestSchema>