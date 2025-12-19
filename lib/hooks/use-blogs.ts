"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"

export interface Blog {
  _id: string
  title: string
  content: string
  excerpt?: string
  slug: string
  published: boolean
  author?: string
  tags?: string[]
  featuredImage?: string
  cloudinaryId?: string
  reader?: number
  createdAt: string
  updatedAt: string
}


export interface PaginatedBlogs {
  blogs: Blog[]
  pagination: {
    currentPage: number
    totalPages: number
    totalBlogs: number
    limit: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export interface CreateBlogPayload {
  title: string
  content: string
  excerpt?: string
  slug?: string
  published?: boolean
  author?: string
  tags?: string[]
  featuredImage?: File
}

export function useBlogs(page: number = 1) {
  return useQuery({
    queryKey: ["blogs", page],
    queryFn: async () => {
      const response = await apiClient.get<PaginatedBlogs>(
        `/blog?page=${page}`
      )
      return response.data
    },
    placeholderData: (previousData) => previousData,
  })
}

export function useBlog(id: string) {

  return useQuery({
    queryKey: ["blog", id],
    queryFn: async () => {
      const response = await apiClient.get<Blog>(`/blog/${id}`)
      return response.data
    },
    enabled: !!id,
  })
}

export function useCreateBlog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateBlogPayload) => {
      const formData = new FormData()
      formData.append("title", payload.title)
      formData.append("content", payload.content)
      if (payload.excerpt) formData.append("excerpt", payload.excerpt)
      if (payload.slug) formData.append("slug", payload.slug)
      if (payload.published !== undefined) formData.append("published", String(payload.published))
      if (payload.author) formData.append("author", payload.author)
      if (payload.tags?.length) formData.append("tags", JSON.stringify(payload.tags))
      if (payload.featuredImage) formData.append("featuredImage", payload.featuredImage)

      const response = await apiClient.post<Blog>("/blog", formData, true)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] })
    },
  })
}

export function useUpdateBlog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<CreateBlogPayload> }) => {
      const formData = new FormData()
      if (payload.title) formData.append("title", payload.title)
      if (payload.content) formData.append("content", payload.content)
      if (payload.excerpt) formData.append("excerpt", payload.excerpt)
      if (payload.slug) formData.append("slug", payload.slug)
      if (payload.published !== undefined) formData.append("published", String(payload.published))
      if (payload.author) formData.append("author", payload.author)
      if (payload.tags?.length) formData.append("tags", JSON.stringify(payload.tags))
      if (payload.featuredImage) formData.append("featuredImage", payload.featuredImage)

      const response = await apiClient.put<Blog>(`/blog/${id}`, formData, true)

      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] })
    },
  })
}

export function useDeleteBlog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete<void>(`/blog/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] })
    },
  })
}
