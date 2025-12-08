// lib/hooks/use-auth.ts
"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"

interface LoginPayload {
  email: string
  password: string
}

export interface User {
  _id: string
  email: string
  name: string
  profilePicture?: string
  bio?: string
  about?: string
  createdAt: string
  updatedAt: string

  socialLinks?: Array<{
    _id?: string
    platform: string
    url: string
    icon?: string
  }>

  education?: Array<{
    _id?: string
    institution: string
    degree: string
    timePeriod: string
  }>

  skills?: string[]

  workExperience?: Array<{
    _id?: string
    title: string
    designation: string
    location: string
    timePeriod: string
    details: string
  }>
}

interface LoginResponse {
  id: string
  email: string
  token: string
}

export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const res = await apiClient.post<LoginResponse>("/auth/login", payload)
      return res.data
    },
    onSuccess: (data) => {
      apiClient.setToken(data.token)
      queryClient.invalidateQueries({ queryKey: ["user"] })
    },
  })
}

export function useUser() {
  const isClient = typeof window !== "undefined"
  const enabled = isClient && !!sessionStorage.getItem("token")

  return useQuery({
    queryKey: ["user"],
    queryFn: async (): Promise<User> => {
      const response = await apiClient.get<User>("/user/me")
      return response.data
    },
    enabled,
    staleTime: 1000 * 60 * 5,
  })
}

// UPDATED: Now uses apiClient + supports FormData (image upload)
export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await apiClient.put<User>("/user/me", formData, true) 
      return response.data
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["user"], updatedUser)
      queryClient.invalidateQueries({ queryKey: ["user"] })
    },
    onError: (error: any) => {
    },
  })
}