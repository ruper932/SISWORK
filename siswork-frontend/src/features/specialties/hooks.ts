import { useQuery } from "@tanstack/react-query"
import { listSpecialties } from "./api"

export const specialtyKeys = {
  all: ["specialties"] as const,
  lists: () => [...specialtyKeys.all, "list"] as const,
}

export function useSpecialtiesQuery() {
  return useQuery({
    queryKey: specialtyKeys.lists(),
    queryFn: listSpecialties,
  })
}