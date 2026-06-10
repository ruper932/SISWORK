import api from "@/lib/axios"
import type { SpecialtyItem } from "./types"

export async function listSpecialties() {
  const { data } = await api.get<SpecialtyItem[]>("/specialties")
  return data
}