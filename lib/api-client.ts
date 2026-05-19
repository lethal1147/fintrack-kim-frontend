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

// ── Transaction types ─────────────────────────────────────────────────────

export type Transaction = {
  id: string
  merchant: string
  category: string
  note: string
  date: string        // "YYYY-MM-DD"
  amount: number
  type: "income" | "expense"
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export type TransactionListResponse = {
  transactions: Transaction[]
  total: number
  page: number
  limit: number
  pages: number
}

export type CategoryStat = {
  category: string
  type: "income" | "expense"
  total: number
  count: number
}

export type MonthStat = {
  month: string  // "YYYY-MM"
  income: number
  expense: number
  net: number
}

export type TransactionSummary = {
  total_income: number
  total_expense: number
  net: number
  by_category: CategoryStat[]
  by_month: MonthStat[]
}

export type CreateTransactionBody = {
  merchant: string
  category: string
  note?: string
  date: string
  amount: number
  type: "income" | "expense"
}

export type UpdateTransactionBody = CreateTransactionBody

export type TransactionListParams = {
  type?: "income" | "expense"
  category?: string
  search?: string
  from?: string
  to?: string
  page?: number
  limit?: number
}

export type SummaryParams = {
  from?: string
  to?: string
}

// ── Transaction API helpers ───────────────────────────────────────────────

export const transactionApi = {
  list(params: TransactionListParams, token: string): Promise<TransactionListResponse> {
    const q = new URLSearchParams()
    if (params.type)     q.set("type", params.type)
    if (params.category) q.set("category", params.category)
    if (params.search)   q.set("search", params.search)
    if (params.from)     q.set("from", params.from)
    if (params.to)       q.set("to", params.to)
    if (params.page)     q.set("page", String(params.page))
    if (params.limit)    q.set("limit", String(params.limit))
    const qs = q.toString() ? "?" + q.toString() : ""
    return apiFetch(`/api/transactions${qs}`, { headers: authHeaders(token) })
  },

  create(body: CreateTransactionBody, token: string): Promise<Transaction> {
    return apiFetch("/api/transactions", {
      method: "POST",
      body: JSON.stringify(body),
      headers: authHeaders(token),
    })
  },

  get(id: string, token: string): Promise<Transaction> {
    return apiFetch(`/api/transactions/${id}`, { headers: authHeaders(token) })
  },

  update(id: string, body: UpdateTransactionBody, token: string): Promise<Transaction> {
    return apiFetch(`/api/transactions/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
      headers: authHeaders(token),
    })
  },

  delete(id: string, token: string): Promise<void> {
    return apiFetch(`/api/transactions/${id}`, {
      method: "DELETE",
      headers: authHeaders(token),
    })
  },

  summary(params: SummaryParams, token: string): Promise<TransactionSummary> {
    const q = new URLSearchParams()
    if (params.from) q.set("from", params.from)
    if (params.to)   q.set("to", params.to)
    const qs = q.toString() ? "?" + q.toString() : ""
    return apiFetch(`/api/transactions/summary${qs}`, { headers: authHeaders(token) })
  },
}

// ── Auth API helpers ──────────────────────────────────────────────────────

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
