export type UserProfile = {
  id: string
  email: string
  name: string
  avatar_url: string
  provider: string
  totp_enabled: boolean
  locale: string
  created_at: string
}

export type TOTPChallenge = {
  totp_required: true
  challenge_token: string
}

export type AuthResponse = {
  access_token: string
  user: UserProfile
}

export class ApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number
  ) {
    super(message)
    this.name = "ApiError"
  }
}

// Paths where a 401 means wrong credentials, not a revoked session.
const NO_AUTO_LOGOUT_PATHS = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/totp-verify",
  "/api/auth/refresh",
  "/api/auth/forgot-password/request",
  "/api/auth/forgot-password/reset",
]

function forceLogout(path: string): void {
  if (NO_AUTO_LOGOUT_PATHS.some((p) => path.startsWith(p))) return
  // Lazy import avoids a circular dependency at module load time.
  import("@/store/auth-store").then(({ useAuthStore }) => {
    useAuthStore.getState().forceLogout()
  })
  if (typeof window !== "undefined") {
    window.location.replace("/login")
  }
}

// One refresh at a time — concurrent 401s share the same in-flight promise.
let refreshPromise: Promise<boolean> | null = null

function silentRefresh(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = import("@/store/auth-store")
      .then(({ useAuthStore }) => useAuthStore.getState().refreshAccessToken())
      .finally(() => {
        refreshPromise = null
      })
  }
  return refreshPromise
}

async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const doFetch = (overrides: Record<string, string> = {}) =>
    fetch(path, {
      ...init,
      credentials: "include",
      headers: { "Content-Type": "application/json", ...init.headers, ...overrides },
    })

  let res = await doFetch()
  let json = await res.json().catch(() => ({}))

  if (res.status === 401 && !NO_AUTO_LOGOUT_PATHS.some((p) => path.startsWith(p))) {
    const refreshed = await silentRefresh()
    if (refreshed) {
      const { useAuthStore } = await import("@/store/auth-store")
      const newToken = useAuthStore.getState().accessToken
      const overrides: Record<string, string> = {}
      if (newToken && (init.headers as Record<string, string>)?.Authorization) {
        overrides.Authorization = `Bearer ${newToken}`
      }
      res = await doFetch(overrides)
      json = await res.json().catch(() => ({}))
      if (res.ok) return json.data as T
    }
    forceLogout(path)
    throw new ApiError(
      json?.error?.code ?? "UNAUTHORIZED",
      json?.error?.message ?? "Session expired",
      401
    )
  }

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

// apiFetchRaw is like apiFetch but does NOT inject Content-Type (needed for FormData uploads).
async function apiFetchRaw<T>(path: string, init: RequestInit = {}): Promise<T> {
  const doFetch = (overrides: Record<string, string> = {}) =>
    fetch(path, { ...init, credentials: "include", headers: { ...init.headers, ...overrides } })

  let res = await doFetch()
  let json = await res.json().catch(() => ({}))

  if (res.status === 401 && !NO_AUTO_LOGOUT_PATHS.some((p) => path.startsWith(p))) {
    const refreshed = await silentRefresh()
    if (refreshed) {
      const { useAuthStore } = await import("@/store/auth-store")
      const newToken = useAuthStore.getState().accessToken
      const overrides: Record<string, string> = {}
      if (newToken && (init.headers as Record<string, string>)?.Authorization) {
        overrides.Authorization = `Bearer ${newToken}`
      }
      res = await doFetch(overrides)
      json = await res.json().catch(() => ({}))
      if (res.ok) return json.data as T
    }
    forceLogout(path)
    throw new ApiError(
      json?.error?.code ?? "UNAUTHORIZED",
      json?.error?.message ?? "Session expired",
      401
    )
  }

  if (!res.ok) {
    const code = json?.error?.code ?? "UNKNOWN_ERROR"
    const message = json?.error?.message ?? res.statusText
    throw new ApiError(code, message, res.status)
  }
  return json.data as T
}

// ── Transaction types ─────────────────────────────────────────────────────

export type Transaction = {
  id: string
  merchant: string
  category: string
  note: string
  date: string // "YYYY-MM-DD"
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
  month: string // "YYYY-MM"
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

// ── Analytics types ───────────────────────────────────────────────────────

export type CategoryStatWithPct = CategoryStat & { pct: number }

export type MerchantStat = {
  merchant: string
  total: number
  count: number
}

export type AnalyticsData = {
  total_income: number
  total_expense: number
  net: number
  tx_count: number
  savings_rate: number
  by_category: CategoryStatWithPct[]
  by_month: MonthStat[]
  top_merchants: MerchantStat[]
}

export type AnalyticsParams = {
  from?: string
  to?: string
}

// ── Transaction API helpers ───────────────────────────────────────────────

export const transactionApi = {
  list(params: TransactionListParams, token: string): Promise<TransactionListResponse> {
    const q = new URLSearchParams()
    if (params.type) q.set("type", params.type)
    if (params.category) q.set("category", params.category)
    if (params.search) q.set("search", params.search)
    if (params.from) q.set("from", params.from)
    if (params.to) q.set("to", params.to)
    if (params.page) q.set("page", String(params.page))
    if (params.limit) q.set("limit", String(params.limit))
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
    if (params.to) q.set("to", params.to)
    const qs = q.toString() ? "?" + q.toString() : ""
    return apiFetch(`/api/transactions/summary${qs}`, { headers: authHeaders(token) })
  },

  analytics(params: AnalyticsParams, token: string): Promise<AnalyticsData> {
    const q = new URLSearchParams()
    if (params.from) q.set("from", params.from)
    if (params.to) q.set("to", params.to)
    const qs = q.toString() ? "?" + q.toString() : ""
    return apiFetch(`/api/transactions/analytics${qs}`, { headers: authHeaders(token) })
  },
}

// ── Recurring types ───────────────────────────────────────────────────────

export type RecurringFrequency = "weekly" | "monthly" | "annual"
export type RecurringKind = "expense" | "income"
export type RecurringStatus = "active" | "paused"

export type RecurringItem = {
  id: string
  name: string
  category: string
  amount: number
  frequency: RecurringFrequency
  kind: RecurringKind
  status: RecurringStatus
  next_due: string // "YYYY-MM-DD"
  color: string
  created_at: string
  updated_at: string
}

export type CreateRecurringBody = {
  name: string
  category: string
  amount: number
  frequency: RecurringFrequency
  kind: RecurringKind
  next_due: string
  color: string
}

export type UpdateRecurringBody = CreateRecurringBody

// ── Recurring API helpers ─────────────────────────────────────────────────

export const recurringApi = {
  list(token: string): Promise<RecurringItem[]> {
    return apiFetch("/api/recurring", { headers: authHeaders(token) })
  },

  create(body: CreateRecurringBody, token: string): Promise<RecurringItem> {
    return apiFetch("/api/recurring", {
      method: "POST",
      body: JSON.stringify(body),
      headers: authHeaders(token),
    })
  },

  update(id: string, body: UpdateRecurringBody, token: string): Promise<RecurringItem> {
    return apiFetch(`/api/recurring/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
      headers: authHeaders(token),
    })
  },

  toggleStatus(id: string, token: string): Promise<RecurringItem> {
    return apiFetch(`/api/recurring/${id}/status`, {
      method: "PATCH",
      headers: authHeaders(token),
    })
  },

  delete(id: string, token: string): Promise<void> {
    return apiFetch(`/api/recurring/${id}`, {
      method: "DELETE",
      headers: authHeaders(token),
    })
  },

  process(token: string): Promise<{ generated: number }> {
    return apiFetch("/api/recurring/process", {
      method: "POST",
      headers: authHeaders(token),
    })
  },
}

// ── Budget types ──────────────────────────────────────────────────────────────

export type BudgetGroup = "Fixed" | "Flexible" | "Non-Monthly"

export type BudgetCategory = {
  id: string
  name: string
  group: BudgetGroup
  budgeted: number
  spent: number // computed by backend for requested month
  color: string
  created_at: string
  updated_at: string
}

export type CreateBudgetBody = {
  name: string
  group: BudgetGroup
  budgeted: number
  color: string
}

export type UpdateBudgetBody = CreateBudgetBody

// ── Budget API helpers ────────────────────────────────────────────────────────

export const budgetApi = {
  list(year: number, month: number, token: string): Promise<BudgetCategory[]> {
    const q = new URLSearchParams({ year: String(year), month: String(month) })
    return apiFetch(`/api/budget?${q.toString()}`, { headers: authHeaders(token) })
  },

  create(body: CreateBudgetBody, token: string): Promise<BudgetCategory> {
    return apiFetch("/api/budget", {
      method: "POST",
      body: JSON.stringify(body),
      headers: authHeaders(token),
    })
  },

  update(id: string, body: UpdateBudgetBody, token: string): Promise<BudgetCategory> {
    return apiFetch(`/api/budget/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
      headers: authHeaders(token),
    })
  },

  delete(id: string, token: string): Promise<void> {
    return apiFetch(`/api/budget/${id}`, {
      method: "DELETE",
      headers: authHeaders(token),
    })
  },
}

// ── Profile types + API ───────────────────────────────────────────────────────

export type UpdateProfileBody = {
  name: string
  email: string
  locale?: string
}

export const profileApi = {
  update(body: UpdateProfileBody, token: string): Promise<UserProfile> {
    return apiFetch("/api/profile", {
      method: "PATCH",
      body: JSON.stringify(body),
      headers: authHeaders(token),
    })
  },

  uploadAvatar(file: File, token: string): Promise<{ avatar_url: string }> {
    const form = new FormData()
    form.append("avatar", file)
    return apiFetchRaw("/api/profile/avatar", {
      method: "POST",
      body: form,
      headers: authHeaders(token), // no Content-Type — browser sets multipart boundary
    })
  },

  deleteAccount(password: string, token: string): Promise<void> {
    return apiFetch("/api/profile", {
      method: "DELETE",
      body: JSON.stringify({ password }),
      headers: authHeaders(token),
    })
  },
}

// ── Security types + API ──────────────────────────────────────────────────────

export type SessionInfo = {
  id: string
  device: string
  last_active_at: string
  is_current: boolean
}

export type TOTPSetupResult = {
  secret: string
  qr_code_uri: string
  backup_codes: string[]
}

export const securityApi = {
  listSessions(token: string): Promise<SessionInfo[]> {
    return apiFetch("/api/security/sessions", { headers: authHeaders(token) })
  },

  revokeSession(id: string, token: string): Promise<void> {
    return apiFetch(`/api/security/sessions/${id}`, {
      method: "DELETE",
      headers: authHeaders(token),
    })
  },

  requestPasswordChange(token: string): Promise<void> {
    return apiFetch("/api/security/password/request", {
      method: "POST",
      headers: authHeaders(token),
    })
  },

  changePassword(otp: string, newPassword: string, token: string): Promise<void> {
    return apiFetch("/api/security/password/change", {
      method: "POST",
      body: JSON.stringify({ otp, new_password: newPassword }),
      headers: authHeaders(token),
    })
  },

  setupTOTP(token: string): Promise<TOTPSetupResult> {
    return apiFetch("/api/security/totp/setup", {
      method: "POST",
      headers: authHeaders(token),
    })
  },

  confirmTOTP(code: string, token: string): Promise<{ backup_codes: string[] }> {
    return apiFetch("/api/security/totp/confirm", {
      method: "POST",
      body: JSON.stringify({ code }),
      headers: authHeaders(token),
    })
  },

  disableTOTP(code: string, token: string): Promise<void> {
    return apiFetch("/api/security/totp", {
      method: "DELETE",
      body: JSON.stringify({ code }),
      headers: authHeaders(token),
    })
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

  login(email: string, password: string): Promise<AuthResponse | TOTPChallenge> {
    return apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  },

  totpVerify(challengeToken: string, code: string): Promise<AuthResponse> {
    return apiFetch("/api/auth/totp-verify", {
      method: "POST",
      body: JSON.stringify({ challenge_token: challengeToken, code }),
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

  forgotPasswordRequest(email: string): Promise<void> {
    return apiFetch("/api/auth/forgot-password/request", {
      method: "POST",
      body: JSON.stringify({ email }),
    })
  },

  forgotPasswordReset(email: string, otp: string, newPassword: string): Promise<void> {
    return apiFetch("/api/auth/forgot-password/reset", {
      method: "POST",
      body: JSON.stringify({ email, otp, new_password: newPassword }),
    })
  },
}
