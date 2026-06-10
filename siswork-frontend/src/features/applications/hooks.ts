import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  acceptApplication,
  cancelMyApplication,
  createApplication,
  getApplicationById,
  listMyApplications,
  listRequestApplications,
  rejectApplication,
} from "./api"
import type { ApplicationCreateInput } from "./types"

export const applicationKeys = {
  all: ["applications"] as const,
  mine: () => [...applicationKeys.all, "mine"] as const,
  details: () => [...applicationKeys.all, "detail"] as const,
  detail: (applicationId: string) =>
    [...applicationKeys.details(), applicationId] as const,
  requestLists: () => [...applicationKeys.all, "request"] as const,
  requestList: (requestId: string) =>
    [...applicationKeys.requestLists(), requestId] as const,
}

export function useMyApplicationsQuery() {
  return useQuery({
    queryKey: applicationKeys.mine(),
    queryFn: listMyApplications,
  })
}

export function useApplicationQuery(applicationId: string) {
  return useQuery({
    queryKey: applicationKeys.detail(applicationId),
    queryFn: () => getApplicationById(applicationId),
    enabled: Boolean(applicationId),
  })
}

export function useRequestApplicationsQuery(requestId: string) {
  return useQuery({
    queryKey: applicationKeys.requestList(requestId),
    queryFn: () => listRequestApplications(requestId),
    enabled: Boolean(requestId),
  })
}

export function useCreateApplicationMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: ApplicationCreateInput) => createApplication(payload),
    onSuccess: async (created) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: applicationKeys.all }),
        queryClient.invalidateQueries({
          queryKey: applicationKeys.requestList(created.request_id),
        }),
        queryClient.invalidateQueries({ queryKey: ["requests"] }),
      ])
    },
  })
}

export function useAcceptApplicationMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (applicationId: string) => acceptApplication(applicationId),
    onSuccess: async (updated) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: applicationKeys.all }),
        queryClient.invalidateQueries({
          queryKey: applicationKeys.detail(updated.id),
        }),
        queryClient.invalidateQueries({
          queryKey: applicationKeys.requestList(updated.request_id),
        }),
        queryClient.invalidateQueries({ queryKey: ["requests"] }),
      ])
    },
  })
}

export function useRejectApplicationMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (applicationId: string) => rejectApplication(applicationId),
    onSuccess: async (updated) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: applicationKeys.all }),
        queryClient.invalidateQueries({
          queryKey: applicationKeys.detail(updated.id),
        }),
        queryClient.invalidateQueries({
          queryKey: applicationKeys.requestList(updated.request_id),
        }),
      ])
    },
  })
}

export function useCancelMyApplicationMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (applicationId: string) => cancelMyApplication(applicationId),
    onSuccess: async (updated) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: applicationKeys.all }),
        queryClient.invalidateQueries({
          queryKey: applicationKeys.detail(updated.id),
        }),
        queryClient.invalidateQueries({
          queryKey: applicationKeys.requestList(updated.request_id),
        }),
      ])
    },
  })
}