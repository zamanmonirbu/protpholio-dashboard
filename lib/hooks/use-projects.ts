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
  updatedAt: string
  videoLink?: string
  technologies: string[]
  otherPhotos: File[];


}

export interface CreateProjectPayload {
  name: string
  description: string
  liveLink: string
  frontendCode: string
  backendCode: string
  videoLink?: string
  technologies?: string[]
  timelinePhoto?: File | null
  otherPhotos?: File[]
}


export interface ProjectsResponse {
  projects: Project[]
  pagination: {
    currentPage: number
    totalPages: number
    totalProjects: number
    limit: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export function useProjects(page: number = 1) {
  return useQuery({
    queryKey: ["projects", page],
    queryFn: async () => {
      const response = await apiClient.get<ProjectsResponse>(`/project?page=${page}`)
      return response.data
    },
    placeholderData: (previousData) => previousData,
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

      // Required fields
      formData.append("name", payload.name)
      formData.append("description", payload.description)
      formData.append("liveLink", payload.liveLink)
      formData.append("frontendCode", payload.frontendCode)
      formData.append("backendCode", payload.backendCode)

      // Optional scalar fields
      if (payload.videoLink) {
        formData.append("videoLink", payload.videoLink)
      }

      // Technologies (array)
      if (payload.technologies && payload.technologies.length > 0) {
        payload.technologies.forEach((tech) => {
          formData.append("technologies[]", tech)
        })
      }

      // Timeline photo
      if (payload.timelinePhoto) {
        formData.append("timelinePhoto", payload.timelinePhoto)
      }

      // Other photos (multiple)
      if (payload.otherPhotos && payload.otherPhotos.length > 0) {
        payload.otherPhotos.forEach((file) => {
          formData.append("otherPhotos", file)
        })
      }

      const response = await apiClient.post<Project>(
        "/project",
        formData,
        true // multipart flag
      )

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
      if (payload.videoLink) formData.append("videoLink", payload.videoLink)

      if (payload.technologies) {
        payload.technologies.forEach((tech) => {
          formData.append("technologies[]", tech)
        })
      }

      if (payload.timelinePhoto) {
        formData.append("timelinePhoto", payload.timelinePhoto)
      }

      if (payload.otherPhotos) {
        payload.otherPhotos.forEach((file) => {
          formData.append("otherPhotos", file)
        })
      }

      const response = await apiClient.put<Project>(
        `/project/${id}`,
        formData,
        true
      )

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
