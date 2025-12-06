"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"

export interface Project {
  _id: string
  name: string
  description: string
  timelinePhoto: string
  liveLink: string
  frontendCode: string
  backendCode: string
  cloudinaryId?: string
  createdAt: string
}

export interface CreateProjectPayload {
  name: string
  description: string
  liveLink: string
  frontendCode: string
  backendCode: string
  timelinePhoto?: File
}

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await apiClient.get<Project[]>("/project")
      return response.data
    },
  })
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      const response = await apiClient.get<Project>(`/project/${id}`)
      return response.data
    },
    enabled: !!id,
  })
}

export function useCreateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateProjectPayload) => {
      const formData = new FormData()
      formData.append("name", payload.name)
      formData.append("description", payload.description)
      formData.append("liveLink", payload.liveLink)
      formData.append("frontendCode", payload.frontendCode)
      formData.append("backendCode", payload.backendCode)
      if (payload.timelinePhoto) {
        formData.append("timelinePhoto", payload.timelinePhoto)
      }

      const response = await apiClient.post<Project>("/project", formData, true)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
    },
  })
}

export function useUpdateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<CreateProjectPayload> }) => {
      const formData = new FormData()
      if (payload.name) formData.append("name", payload.name)
      if (payload.description) formData.append("description", payload.description)
      if (payload.liveLink) formData.append("liveLink", payload.liveLink)
      if (payload.frontendCode) formData.append("frontendCode", payload.frontendCode)
      if (payload.backendCode) formData.append("backendCode", payload.backendCode)
      if (payload.timelinePhoto) formData.append("timelinePhoto", payload.timelinePhoto)

      const response = await apiClient.put<Project>(`/project/${id}`, formData, true)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
    },
  })
}

export function useDeleteProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete<void>(`/project/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
    },
  })
}
