export interface ApiResponse<T> {
  data: T
  meta?: {
    total: number
    limit: number
    offset: number
  }
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {})
    }
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    throw new Error(errorBody?.error || response.statusText)
  }

  return response.json()
}

export const api = {
  listMatches: (params: { limit?: number; offset?: number; status?: number; mode?: number } = {}) => {
    const query = new URLSearchParams()
    if (params.limit) query.append('limit', params.limit.toString())
    if (params.offset) query.append('offset', params.offset.toString())
    if (typeof params.status === 'number') query.append('status', params.status.toString())
    if (typeof params.mode === 'number') query.append('mode', params.mode.toString())

    return request<ApiResponse<any>>(`/api/matches?${query.toString()}`)
  },
  getMatch: (id: number) => request<ApiResponse<any>>(`/api/matches/${id}`),
  getPlatformStats: () => request<ApiResponse<any>>('/api/stats/platform'),
  getRecentMatches: (limit = 5) => request<ApiResponse<any>>(`/api/stats/recent?limit=${limit}`),
  getUserStats: (address: string) => request<ApiResponse<any>>(`/api/users/${address}/stats`),
  getUserMatches: (address: string) => request<ApiResponse<any>>(`/api/users/${address}/matches`)
}
