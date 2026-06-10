import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  cancelRequest,
  completeRequest,
  createRequest,
  getRequestById,
  listMyRequests,
  listRequests,
  startRequest,
  updateRequest,
  type ListRequestsParams,
} from "./api"
import type {
  RequestCancelInput,
  RequestCreateInput,
  RequestUpdateInput,
} from "./types"

export const requestKeys = {
  all: ["requests"] as const,
  lists: () => [...requestKeys.all, "list"] as const,
  list: (params: ListRequestsParams) => [...requestKeys.lists(), params] as const,
  myLists: () => [...requestKeys.all, "mine"] as const,
  myList: (skip: number, limit: number) =>
    [...requestKeys.myLists(), { skip, limit }] as const,
  details: () => [...requestKeys.all, "detail"] as const,
  detail: (id: string) => [...requestKeys.details(), id] as const,
}

export function useRequestsQuery(params: ListRequestsParams = {}) {
  return useQuery({
    queryKey: requestKeys.list(params),
    queryFn: () => listRequests(params),
  })
}

export function useMyRequestsQuery(skip = 0, limit = 50) {
  return useQuery({
    queryKey: requestKeys.myList(skip, limit),
    queryFn: () => listMyRequests(skip, limit),
  })
}

export function useRequestQuery(requestId: string) {
  return useQuery({
    queryKey: requestKeys.detail(requestId),
    queryFn: () => getRequestById(requestId),
    enabled: Boolean(requestId),
  })
}

export function useCreateRequestMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: RequestCreateInput) => createRequest(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: requestKeys.all })
    },
  })
}

export function useUpdateRequestMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      requestId,
      payload,
    }: {
      requestId: string
      payload: RequestUpdateInput
    }) => updateRequest(requestId, payload),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: requestKeys.all })
      await queryClient.invalidateQueries({
        queryKey: requestKeys.detail(variables.requestId),
      })
    },
  })
}

export function useCancelRequestMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      requestId,
      payload,
    }: {
      requestId: string
      payload?: RequestCancelInput
    }) => cancelRequest(requestId, payload),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: requestKeys.all })
      await queryClient.invalidateQueries({
        queryKey: requestKeys.detail(variables.requestId),
      })
    },
  })
}

export function useStartRequestMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (requestId: string) => startRequest(requestId),
    onSuccess: async (_, requestId) => {
      await queryClient.invalidateQueries({ queryKey: requestKeys.all })
      await queryClient.invalidateQueries({
        queryKey: requestKeys.detail(requestId),
      })
    },
  })
}

export function useCompleteRequestMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (requestId: string) => completeRequest(requestId),
    onSuccess: async (_, requestId) => {
      await queryClient.invalidateQueries({ queryKey: requestKeys.all })
      await queryClient.invalidateQueries({
        queryKey: requestKeys.detail(requestId),
      })
    },
  })
}