// Railway production must always talk to the backend service, never localhost.
const API_BASE = import.meta.env.PROD
  ? "https://astarbackend-production.up.railway.app"
  : (import.meta.env.VITE_API_URL?.trim() || "http://localhost:3000");

const getToken = (): string | null => localStorage.getItem("astar_token");

export type SubscriptionPlan = "essentials" | "portal" | "depth";
export type BillingCycle = "monthly" | "annual";

export interface ApiUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "client";
  isActive: boolean;
  subscriptionStatus: "active" | "inactive" | "cancelled";
}

export interface AuthApiResponse {
  user?: ApiUser;
  access_token?: string;
  accessToken?: string;
  token?: string;
  data?: {
    user?: ApiUser;
    access_token?: string;
    accessToken?: string;
    token?: string;
  };
}

function extractAuthResponse(body: AuthApiResponse): { user?: ApiUser; access_token?: string } {
  return {
    user: body.user ?? body.data?.user,
    access_token: body.access_token ?? body.accessToken ?? body.token ?? body.data?.access_token ?? body.data?.accessToken ?? body.data?.token,
  };
}

export async function apiLogin(email: string, password: string): Promise<{ user: ApiUser; access_token: string }> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? "Invalid credentials");
  }
  const body = (await res.json().catch(() => ({}))) as AuthApiResponse;
  const normalized = extractAuthResponse(body);
  if (!normalized.user || !normalized.access_token) {
    throw new Error("Login response was empty or malformed.");
  }
  return normalized as { user: ApiUser; access_token: string };
}

export async function apiRegister(data: {
  name: string;
  email: string;
  password: string;
  birthDate: string;
  birthPlace: string;
  birthTime: string;
}): Promise<{ user: ApiUser; access_token: string }> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const body = (await res.json().catch(() => ({}))) as AuthApiResponse & { message?: string };
  if (!res.ok) throw new Error(body.message ?? "Registration failed");
  const normalized = extractAuthResponse(body);
  if (!normalized.user || !normalized.access_token) {
    throw new Error("Registration response was empty or malformed.");
  }
  return normalized as { user: ApiUser; access_token: string };
}

export async function apiMe(): Promise<ApiUser | null> {
  const token = getToken();
  if (!token) return null;
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  return res.json();
}

export function setToken(token: string): void {
  localStorage.setItem("astar_token", token);
}

export function clearToken(): void {
  localStorage.removeItem("astar_token");
}

export async function apiCreatePayPalSubscription(data: {
  plan: SubscriptionPlan;
  billing: BillingCycle;
}): Promise<{ subscriptionId: string; approvalUrl: string }> {
  const res = await fetch(`${API_BASE}/payments/paypal/subscription/create`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((body as { message?: string }).message ?? "No se pudo iniciar la suscripción con PayPal");
  }
  return body as { subscriptionId: string; approvalUrl: string };
}

export async function apiConfirmPayPalSubscription(subscriptionId: string): Promise<{
  subscriptionId: string;
  paypalStatus: string;
  subscriptionStatus: "active" | "inactive" | "cancelled";
  plan: SubscriptionPlan | null;
  billing: BillingCycle | null;
}> {
  const res = await fetch(`${API_BASE}/payments/paypal/subscription/confirm`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ subscriptionId }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((body as { message?: string }).message ?? "No se pudo confirmar la suscripción con PayPal");
  }
  return body as {
    subscriptionId: string;
    paypalStatus: string;
    subscriptionStatus: "active" | "inactive" | "cancelled";
    plan: SubscriptionPlan | null;
    billing: BillingCycle | null;
  };
}

export async function apiCancelPayPalSubscription(reason?: string): Promise<{ ok: true }> {
  const res = await fetch(`${API_BASE}/payments/paypal/subscription/cancel`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ reason }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((body as { message?: string }).message ?? "No se pudo cancelar la suscripción");
  }
  return body as { ok: true };
}

export async function apiCreateMercadoPagoSubscription(data: {
  plan: SubscriptionPlan;
  billing: BillingCycle;
}): Promise<{ subscriptionId: string; approvalUrl: string }> {
  const res = await fetch(`${API_BASE}/payments/mercado-pago/subscription/create`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((body as { message?: string }).message ?? "No se pudo iniciar la suscripción con Mercado Pago");
  }
  return body as { subscriptionId: string; approvalUrl: string };
}

export async function apiConfirmMercadoPagoSubscription(subscriptionId: string): Promise<{
  subscriptionId: string;
  mercadoPagoStatus: string;
  subscriptionStatus: "active" | "inactive" | "cancelled";
  plan: SubscriptionPlan | null;
  billing: BillingCycle | null;
}> {
  const res = await fetch(`${API_BASE}/payments/mercado-pago/subscription/confirm`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ subscriptionId, preapprovalId: subscriptionId }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((body as { message?: string }).message ?? "No se pudo confirmar la suscripción con Mercado Pago");
  }
  return body as {
    subscriptionId: string;
    mercadoPagoStatus: string;
    subscriptionStatus: "active" | "inactive" | "cancelled";
    plan: SubscriptionPlan | null;
    billing: BillingCycle | null;
  };
}

export async function apiCancelMercadoPagoSubscription(subscriptionId: string, reason?: string): Promise<{ ok: true }> {
  const res = await fetch(`${API_BASE}/payments/mercado-pago/subscription/cancel`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ subscriptionId, preapprovalId: subscriptionId, reason }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((body as { message?: string }).message ?? "No se pudo cancelar la suscripción");
  }
  return body as { ok: true };
}

export interface PayPalExtraSessionPricing {
  subscriberAmount: string;
  nonSubscriberAmount: string;
  amount: string;
  isSubscriber: boolean;
  currency: string;
}

export interface MercadoPagoExtraSessionPricing {
  subscriberAmount: string;
  nonSubscriberAmount: string;
  amount: string;
  isSubscriber: boolean;
  currency: string;
}

export async function apiGetPayPalExtraSessionPricing(): Promise<PayPalExtraSessionPricing> {
  const res = await fetch(`${API_BASE}/payments/paypal/extra-session/pricing`, {
    method: "GET",
    headers: authHeaders(),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((body as { message?: string }).message ?? "No se pudo obtener el precio de sesion extra");
  }
  return body as PayPalExtraSessionPricing;
}

export async function apiCreatePayPalExtraSessionOrder(): Promise<{
  orderId: string;
  approvalUrl: string;
  subscriberAmount: string;
  nonSubscriberAmount: string;
  amount: string;
  isSubscriber: boolean;
  currency: string;
}> {
  const res = await fetch(`${API_BASE}/payments/paypal/extra-session/create`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({}),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((body as { message?: string }).message ?? "No se pudo iniciar el pago de la sesion extra");
  }
  return body as {
    orderId: string;
    approvalUrl: string;
    subscriberAmount: string;
    nonSubscriberAmount: string;
    amount: string;
    isSubscriber: boolean;
    currency: string;
  };
}

export async function apiConfirmPayPalExtraSessionOrder(orderId: string): Promise<{
  ok: true;
  orderId: string;
  created?: boolean;
  amount: string;
  currency: string;
  tier: "subscriber" | "standard";
}> {
  const res = await fetch(`${API_BASE}/payments/paypal/extra-session/confirm`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ orderId, subscriptionId: orderId }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((body as { message?: string }).message ?? "No se pudo confirmar el pago de la sesion extra");
  }
  return body as {
    ok: true;
    orderId: string;
    created?: boolean;
    amount: string;
    currency: string;
    tier: "subscriber" | "standard";
  };
}

export async function apiGetMercadoPagoExtraSessionPricing(): Promise<MercadoPagoExtraSessionPricing> {
  const res = await fetch(`${API_BASE}/payments/mercado-pago/extra-session/pricing`, {
    method: "GET",
    headers: authHeaders(),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((body as { message?: string }).message ?? "No se pudo obtener el precio de sesion extra");
  }
  return body as MercadoPagoExtraSessionPricing;
}

export async function apiCreateMercadoPagoExtraSessionPreference(): Promise<{
  preferenceId: string;
  checkoutUrl: string;
  subscriberAmount: string;
  nonSubscriberAmount: string;
  amount: string;
  isSubscriber: boolean;
  currency: string;
}> {
  const res = await fetch(`${API_BASE}/payments/mercado-pago/extra-session/create`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({}),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((body as { message?: string }).message ?? "No se pudo iniciar el pago de la sesion extra");
  }
  return body as {
    preferenceId: string;
    checkoutUrl: string;
    subscriberAmount: string;
    nonSubscriberAmount: string;
    amount: string;
    isSubscriber: boolean;
    currency: string;
  };
}

export async function apiConfirmMercadoPagoExtraSessionPayment(paymentId: string): Promise<{
  ok: true;
  paymentId: string;
  created?: boolean;
  amount: string;
  currency: string;
  tier: "subscriber" | "standard";
}> {
  const res = await fetch(`${API_BASE}/payments/mercado-pago/extra-session/confirm`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ paymentId, collectionId: paymentId }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((body as { message?: string }).message ?? "No se pudo confirmar el pago de la sesion extra");
  }
  return body as {
    ok: true;
    paymentId: string;
    created?: boolean;
    amount: string;
    currency: string;
    tier: "subscriber" | "standard";
  };
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ——— Public: birth chart preview (no auth) ———

export interface BirthChartPreviewResult {
  sun: { sign: string; symbol: string; description: string };
  moon: { sign: string; symbol: string; description: string };
  ascendant: { sign: string; symbol: string; description: string };
}

export async function apiBirthChartPreview(data: {
  birthDate: string;
  birthTime: string;
  birthPlace: string;
}): Promise<BirthChartPreviewResult> {
  const res = await fetch(`${API_BASE}/birth-chart/preview`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((body as { message?: string }).message ?? "No se pudo calcular la carta");
  return body as BirthChartPreviewResult;
}

export async function apiUpdateProfile(data: { name?: string; email?: string }): Promise<ApiUser> {
  const res = await fetch(`${API_BASE}/auth/me`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const body = await res.json().catch(() => ({})); // ✅ parse once
  if (!res.ok) throw new Error((body as { message?: string }).message ?? "No se pudo actualizar el perfil");
  return body as ApiUser; 
}

export async function apiChangePassword(currentPassword: string, newPassword: string): Promise<void> {
  const res = await fetch(`${API_BASE}/auth/me/password`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  const err = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((err as { message?: string }).message ?? "No se pudo cambiar la contraseña");
}

// ——— Admin API (requires admin role) ———

export interface AdminUserListItem {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  subscriptionStatus: string;
  createdAt: string;
}

export interface AdminUsersResponse {
  data: AdminUserListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function adminGetUsers(params: { page?: number; limit?: number; search?: string }): Promise<AdminUsersResponse> {
  const sp = new URLSearchParams();
  if (params.page != null) sp.set("page", String(params.page));
  if (params.limit != null) sp.set("limit", String(params.limit));
  if (params.search) sp.set("search", params.search);
  const res = await fetch(`${API_BASE}/admin/users?${sp}`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Failed to load users");
  return res.json();
}

export interface AdminUserDetail {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  subscriptionStatus: string;
  birthDate: string | null;
  birthPlace: string | null;
  birthTime: string | null;
  createdAt: string;
}

export async function adminGetUser(id: string): Promise<AdminUserDetail> {
  const res = await fetch(`${API_BASE}/admin/users/${id}`, { headers: authHeaders() });
  if (!res.ok) {
    if (res.status === 404) throw new Error("User not found");
    throw new Error("Failed to load user");
  }
  return res.json();
}

export async function adminUpdateUser(
  id: string,
  body: { isActive?: boolean; subscriptionStatus?: "active" | "inactive" | "cancelled" }
): Promise<ApiUser> {
  const res = await fetch(`${API_BASE}/admin/users/${id}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Failed to update user");
  return res.json();
}

export interface AdminStats {
  totalUsers: number;
  activeSubscriptions: number;
  inactiveSubscriptions: number;
  cancelledSubscriptions: number;
}

export async function adminGetStats(): Promise<AdminStats> {
  const res = await fetch(`${API_BASE}/admin/stats`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Failed to load stats");
  return res.json();
}

export interface AdminOrderItem {
  id: string;
  user: string;
  userEmail: string;
  type: string;
  amount: string;
  method: string;
  date: string;
}

export async function adminGetOrders(): Promise<AdminOrderItem[]> {
  const res = await fetch(`${API_BASE}/admin/orders`, { headers: authHeaders() });
  if (!res.ok) return [];
  return res.json();
}

export interface AdminNotificationItem {
  id: string;
  type: string;
  title: string;
  description: string;
  date: string;
  link: string;
  unread: boolean;
}

export async function adminGetNotifications(): Promise<AdminNotificationItem[]> {
  const res = await fetch(`${API_BASE}/admin/notifications`, { headers: authHeaders() });
  if (!res.ok) return [];
  const data = await res.json();
  return data.notifications ?? [];
}

export async function adminMarkNotificationRead(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/notifications/${encodeURIComponent(id)}/read`, {
    method: "PATCH",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("No se pudo marcar como leída");
}

export async function adminMarkAllNotificationsRead(): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/notifications/read-all`, {
    method: "POST",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("No se pudieron marcar todas como leídas");
}

export interface AdminBlogPostItem {
  id: string;
  title: string;
  status: string;
  date: string;
  content: string;
}

export async function adminGetBlogPosts(): Promise<AdminBlogPostItem[]> {
  const res = await fetch(`${API_BASE}/admin/blog`, { headers: authHeaders() });
  if (!res.ok) return [];
  return res.json();
}

export async function adminGetBlogPost(id: string): Promise<AdminBlogPostItem | null> {
  const res = await fetch(`${API_BASE}/admin/blog/${encodeURIComponent(id)}`, { headers: authHeaders() });
  if (!res.ok) return null;
  return res.json();
}

export async function adminCreateBlogPost(payload: { title: string; content: string; status?: "draft" | "published" }): Promise<AdminBlogPostItem | null> {
  const res = await fetch(`${API_BASE}/admin/blog`, {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) return null;
  return res.json();
}

export async function adminUpdateBlogPost(
  id: string,
  payload: { title?: string; content?: string; status?: "draft" | "published" }
): Promise<AdminBlogPostItem | null> {
  const res = await fetch(`${API_BASE}/admin/blog/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) return null;
  return res.json();
}

export async function adminDeleteBlogPost(id: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/admin/blog/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return res.ok;
}

export interface AdminKnowledgeCategory {
  id: string;
  title: string;
  entries: { id: string; content: string }[];
}

export async function adminGetKnowledgeBase(): Promise<AdminKnowledgeCategory[]> {
  const res = await fetch(`${API_BASE}/admin/knowledge-base`, { headers: authHeaders() });
  if (!res.ok) return [];
  return res.json();
}

export async function adminCreateKnowledgeCategory(title: string): Promise<AdminKnowledgeCategory | null> {
  const res = await fetch(`${API_BASE}/admin/knowledge-base/categories`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ title: title.trim() }),
  });
  if (!res.ok) return null;
  return res.json();
}

export async function adminCreateKnowledgeEntry(
  categoryId: string,
  content: string
): Promise<{ id: string; content: string } | null> {
  const res = await fetch(`${API_BASE}/admin/knowledge-base/categories/${encodeURIComponent(categoryId)}/entries`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ content: content.trim() }),
  });
  if (!res.ok) return null;
  return res.json();
}

export async function adminUpdateKnowledgeEntry(
  entryId: string,
  content: string
): Promise<{ id: string; content: string } | null> {
  const res = await fetch(`${API_BASE}/admin/knowledge-base/entries/${encodeURIComponent(entryId)}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ content: content.trim() }),
  });
  if (!res.ok) return null;
  return res.json();
}

export async function adminDeleteKnowledgeEntry(entryId: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/admin/knowledge-base/entries/${encodeURIComponent(entryId)}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return res.ok;
}

export interface AdminQuestionItem {
  id: string;
  user: string;
  userEmail: string;
  question: string;
  answer: string | null;
  status: string;
  date: string;
}

export async function adminGetQuestions(): Promise<AdminQuestionItem[]> {
  const res = await fetch(`${API_BASE}/admin/questions`, { headers: authHeaders() });
  if (!res.ok) return [];
  return res.json();
}

export async function adminGetQuestion(id: string): Promise<AdminQuestionItem | null> {
  const res = await fetch(`${API_BASE}/admin/questions/${id}`, { headers: authHeaders() });
  if (!res.ok) return null;
  return res.json();
}

export async function adminUpdateQuestionAnswer(id: string, answer: string): Promise<AdminQuestionItem | null> {
  const res = await fetch(`${API_BASE}/admin/questions/${id}`, {
    method: "PATCH",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ answer: answer.trim() }),
  });
  if (!res.ok) return null;
  return res.json();
}

export interface AdminReportItem {
  id: string;
  user: string;
  userEmail: string;
  type: string;
  title: string;
  status: string;
  date: string;
  content: string | null;
}

export async function adminGetReports(): Promise<AdminReportItem[]> {
  const res = await fetch(`${API_BASE}/admin/reports`, { headers: authHeaders() });
  if (!res.ok) return [];
  return res.json();
}

export async function adminUpdateReport(
  id: string,
  payload: { content?: string; title?: string }
): Promise<AdminReportItem | null> {
  const res = await fetch(`${API_BASE}/admin/reports/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) return null;
  return res.json();
}

export interface AdminConversationMessage {
  id: string;
  type: string;
  content: string;
  monthLabel: string | null;
  createdAt: string;
  fromAdmin: boolean;
}

export async function adminGetConversation(userId: string): Promise<AdminConversationMessage[]> {
  const res = await fetch(`${API_BASE}/admin/messages/${encodeURIComponent(userId)}`, { headers: authHeaders() });
  if (!res.ok) return [];
  return res.json();
}

export async function adminSendMessage(userId: string, content: string): Promise<AdminConversationMessage | null> {
  const res = await fetch(`${API_BASE}/admin/messages`, {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ userId, content: content.trim() }),
  });
  if (!res.ok) return null;
  return res.json();
}

// ——— Portal API (client, requires auth) ———

export interface PortalProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  subscriptionStatus: string;
  birthDate: string | null;
  birthPlace: string | null;
  birthTime: string | null;
  createdAt: string;
}

export interface PortalOrder {
  id: string;
  type: string;
  amount: string;
  method: string;
  createdAt: string;
}

export interface PortalReport {
  id: string;
  type: string;
  title: string;
  content: string | null;
  createdAt: string;
}

export async function portalGetMyOrders(): Promise<PortalOrder[]> {
  const res = await fetch(`${API_BASE}/portal/orders`, { headers: authHeaders() });
  if (!res.ok) return [];
  const data = await res.json().catch(() => []);
  return Array.isArray(data) ? data : [];
}

export interface PortalMessage {
  id: string;
  type: string;
  content: string;
  questionText: string | null;
  monthLabel: string | null;
  createdAt: string;
}

export interface PortalNotification {
  id: string;
  title: string;
  body: string | null;
  category: string | null;
  read: boolean;
  createdAt: string;
}

export async function portalGetProfile(): Promise<PortalProfile | null> {
  const res = await fetch(`${API_BASE}/portal/me`, { headers: authHeaders() });
  if (!res.ok) return null;
  return res.json();
}

export async function portalGetReports(): Promise<PortalReport[]> {
  const res = await fetch(`${API_BASE}/portal/reports`, { headers: authHeaders() });
  if (!res.ok) return [];
  return res.json();
}

export async function portalGetReportByType(type: string): Promise<PortalReport | null> {
  const res = await fetch(`${API_BASE}/portal/reports/${encodeURIComponent(type)}`, { headers: authHeaders() });
  if (!res.ok || res.status === 404) return null;
  const text = await res.text();
  if (!text.trim()) return null;
  try {
    return JSON.parse(text) as PortalReport;
  } catch {
    return null;
  }
}

export async function portalGetMessages(): Promise<PortalMessage[]> {
  const res = await fetch(`${API_BASE}/portal/messages`, { headers: authHeaders() });
  if (!res.ok) return [];
  return res.json();
}

// Generic API client for component requests
// ✅ FIXED - properly merges headers with auth token
export const api = {
  async get(url: string, options?: RequestInit) {
    const res = await fetch(`${API_BASE}${url}`, {
      method: 'GET',
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
        ...options?.headers,
      },
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();
    // Wrap response to match expected {data: ...} format
    return { data };
  },

  async post(url: string, data?: any, options?: RequestInit) {
    const res = await fetch(`${API_BASE}${url}`, {
      method: 'POST',
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const response = await res.json();
    // Wrap response to match expected {data: ...} format
    return { data: response };
  },

  async patch(url: string, data?: any, options?: RequestInit) {
    const res = await fetch(`${API_BASE}${url}`, {
      method: 'PATCH',
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const response = await res.json();
    // Wrap response to match expected {data: ...} format
    return { data: response };
  },

  async delete(url: string, options?: RequestInit) {
    const res = await fetch(`${API_BASE}${url}`, {
      method: 'DELETE',
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
        ...options?.headers,
      },
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const response = await res.json();
    // Wrap response to match expected {data: ...} format
    return { data: response };
  },
};

// Astro API functions
export async function astroGetUserNatalChart(): Promise<any> {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');
  const res = await fetch(`${API_BASE}/astro/natal-chart/user`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch natal chart');
  return res.json();
}

export async function astroGetUserNumerology(): Promise<any> {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');
  const res = await fetch(`${API_BASE}/astro/numerology/user`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch numerology');
  return res.json();
}

export async function portalGetNotifications(): Promise<PortalNotification[]> {
  const res = await fetch(`${API_BASE}/portal/notifications`, { headers: authHeaders() });
  if (!res.ok) return [];
  return res.json();
}

export async function portalMarkNotificationRead(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/portal/notifications/${encodeURIComponent(id)}/read`, {
    method: "PATCH",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("No se pudo marcar como leída");
}

export async function portalMarkAllNotificationsRead(): Promise<void> {
  const res = await fetch(`${API_BASE}/portal/notifications/read-all`, {
    method: "POST",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("No se pudieron marcar todas como leídas");
}

export interface PortalQuestionItem {
  id: string;
  question: string;
  answer: string | null;
  status: string;
  createdAt: string;
}

export async function portalGetMyQuestions(): Promise<PortalQuestionItem[]> {
  const res = await fetch(`${API_BASE}/portal/questions`, { headers: authHeaders() });
  if (!res.ok) return [];
  const data = await res.json().catch(() => []);
  return Array.isArray(data) ? data : [];
}

export async function portalSubmitQuestion(question: string): Promise<{ id: string; question: string; status: string; createdAt: string }> {
  const res = await fetch(`${API_BASE}/portal/questions`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ question: question.trim() }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { message?: string }).message ?? "No se pudo enviar la pregunta");
  return data as { id: string; question: string; status: string; createdAt: string };
}
