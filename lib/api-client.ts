const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://protpholio-six.vercel.app/api/v1"

interface ApiResponse<T> {
  status: boolean
  message: string
  data: T
}

interface ApiError {
  status: boolean
  message: string
}

class ApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
    this.loadToken()
  }

  private loadToken() {
    if (typeof window !== "undefined") {
      this.token = sessionStorage.getItem("token")
    }
  }

  setToken(token: string) {
    this.token = token
    if (typeof window !== "undefined") {
      sessionStorage.setItem("token", token)
    }
  }

  clearToken() {
    this.token = null
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("token")
    }
  }

  private getHeaders(contentType?: string) {
    const headers: HeadersInit = {}
    if (contentType && contentType !== "multipart/form-data") {
      headers["Content-Type"] = contentType
    }
    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`
    }
    return headers
  }

  async request<T>(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    body?: any,
    isFormData = false,
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`

    const options: RequestInit = {
      method,
      headers: this.getHeaders(isFormData ? "multipart/form-data" : "application/json"),
    }

    if (body) {
      options.body = isFormData ? body : JSON.stringify(body)
    }

    const response = await fetch(url, options)

    if (!response.ok) {
      const error = await response.json()
      throw error as ApiError
    }

    return response.json()
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, "GET")
  }

  async post<T>(endpoint: string, body?: any, isFormData = false): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, "POST", body, isFormData)
  }

  async put<T>(endpoint: string, body?: any, isFormData = false): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, "PUT", body, isFormData)
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, "DELETE")
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
