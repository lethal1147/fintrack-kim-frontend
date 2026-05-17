export type UserProfile = {
  id: string
  email: string
  name: string
  avatar_url: string
  provider: string
  created_at: string
}

export type AuthResponse = {
  access_token: string
  user: UserProfile
}

export class ApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(path, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
  })

  const json = await res.json().catch(() => ({}))

  if (!res.ok) {
    const code = json?.error?.code ?? "UNKNOWN_ERROR"
    const message = json?.error?.message ?? res.statusText
    throw new ApiError(code, message, res.status)
  }

  return json.data as T
}

function authHeaders(accessToken: string): Record<string, string> {
  return { Authorization: `Bearer ${accessToken}` }
}

export const authApi = {
  register(name: string, email: string, password: string): Promise<AuthResponse> {
    return apiFetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    })
  },

  login(email: string, password: string): Promise<AuthResponse> {
    return apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  },

  // No body — backend reads the httpOnly cookie automatically
  refresh(): Promise<{ access_token: string }> {
    return apiFetch("/api/auth/refresh", { method: "POST" })
  },

  // No body — backend reads the httpOnly cookie and clears it
  logout(): Promise<void> {
    return apiFetch("/api/auth/logout", { method: "POST" })
  },

  logoutAll(accessToken: string): Promise<void> {
    return apiFetch("/api/auth/logout-all", {
      method: "POST",
      headers: authHeaders(accessToken),
    })
  },

  me(accessToken: string): Promise<UserProfile> {
    return apiFetch("/api/auth/me", {
      headers: authHeaders(accessToken),
    })
  },
}
