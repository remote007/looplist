// This is a utility file to help with API calls from the frontend

type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE"
  body?: any
  headers?: Record<string, string>
}

// Base API client function
export async function apiClient<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { method = "GET", body, headers = {} } = options

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  }

  // Get auth token from localStorage if available
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token")
    if (token) {
      requestHeaders["Authorization"] = `Bearer ${token}`
    }
  }

  const config: RequestInit = {
    method,
    headers: requestHeaders,
  }

  if (body) {
    config.body = JSON.stringify(body)
  }

  const response = await fetch(`/api/${endpoint}`, config)

  if (!response.ok) {
    // Handle different error status codes
    if (response.status === 401) {
      // Handle unauthorized (e.g., redirect to login)
      if (typeof window !== "undefined") {
        window.location.href = "/"
      }
    }

    // Try to get error details from response
    let errorMessage
    try {
      const errorData = await response.json()
      errorMessage = errorData.error || `API error: ${response.status}`
    } catch {
      errorMessage = `API error: ${response.status}`
    }

    throw new Error(errorMessage)
  }

  return response.json()
}

// Example usage functions
export function getTasks() {
  return apiClient<{ data: any[] }>("tasks")
}

export function createTask(data: any) {
  return apiClient<{ data: any }>("tasks", {
    method: "POST",
    body: data,
  })
}

export function updateTask(id: number, data: any) {
  return apiClient<{ data: any }>(`tasks/${id}`, {
    method: "PUT",
    body: data,
  })
}

export function deleteTask(id: number) {
  return apiClient<{ success: boolean }>(`tasks/${id}`, {
    method: "DELETE",
  })
}
