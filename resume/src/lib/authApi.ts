const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

export interface AuthUser {
  id: number | string;
  email: string;
  mobile_no?: string | null;
  full_name: string;
  first_name: string;
  avatar_url: string;
  signup_method: string;
  role: number;
  is_active: boolean;
}

interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: AuthUser;
}

export interface PlanItem {
  id: number;
  name: string;
  price: number;
  currency: string;
  durationHours: number;
  maxResumeDownload: number;
}

export interface PaymentSnapshot {
  id: number;
  plan_id: number;
  plan_name: string;
  status: string;
  plan_status: string;
  start_time: string;
  end_time: string;
  download_limit: number;
  download_used: number;
  downloads_left: number;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_invoice_id?: string | null;
  created_at: string;
}

export interface BuilderSettingsPayload {
  builder_free_visibility: boolean;
}

export interface AdminUserListItem {
  user: AuthUser;
  latest_payment: PaymentSnapshot | null;
  payment_count: number;
  quota: {
    used: number;
    limit: number;
    available: number;
  } | null;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface AdminAnalytics {
  cards: {
    total_users: number;
    active_users: number;
    total_admins: number;
    total_payments: number;
    active_plans: number;
    expired_plans: number;
    failed_payments: number;
    total_download_used: number;
    total_download_limit: number;
  };
  charts: {
    payments_by_plan: Array<{ label: string; value: number }>;
    payment_status_breakdown: Array<{ label: string; value: number }>;
    recent_user_registrations: Array<{ date: string; count: number }>;
    recent_payments: Array<{ date: string; count: number }>;
  };
}

const parseResponse = async <T>(response: Response): Promise<T> => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
};

export const registerUser = async (payload: {
  firstName: string;
  lastName: string;
  email: string;
  mobileNo: string;
  password: string;
}) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  return parseResponse<AuthResponse>(response);
};

export const loginUser = async (payload: { email: string; password: string }) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  return parseResponse<AuthResponse>(response);
};

const authHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
});

export const getCurrentUser = async (token: string): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseResponse<AuthResponse>(response);
};

export const getPlans = async (): Promise<{ success: boolean; plans: PlanItem[] }> => {
  const response = await fetch(`${API_BASE_URL}/api/payments/plans`, {
    method: 'GET',
  });

  return parseResponse<{ success: boolean; plans: PlanItem[] }>(response);
};

export const createOrder = async (token: string, planId: number | string) => {
  const response = await fetch(`${API_BASE_URL}/api/payments/create-order`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ planId }),
  });

  return parseResponse<{
    success: boolean;
    payment_id: number;
    order: { id: string; amount: number; currency: string };
    invoice?: { id: string; short_url?: string; status?: string };
    prefill: { name: string; email: string; contact?: string };
  }>(response);
};

export const verifyOrderPayment = async (
  token: string,
  payload: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }
) => {
  const response = await fetch(`${API_BASE_URL}/api/payments/verify`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });

  return parseResponse<{ success: boolean; message: string }>(response);
};

export const consumeDownloadClick = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/api/payments/consume-download`, {
    method: 'POST',
    headers: authHeaders(token),
  });

  return parseResponse<{ success: boolean; message: string }>(response);
};

export const getCurrentPlan = async (
  token: string
): Promise<{
  success: boolean;
  hasActivePlan: boolean;
  hasAnyPlan: boolean;
  payment: PaymentSnapshot | null;
}> => {
  const response = await fetch(`${API_BASE_URL}/api/payments/current-plan`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseResponse<{
    success: boolean;
    hasActivePlan: boolean;
    hasAnyPlan: boolean;
    payment: PaymentSnapshot | null;
  }>(response);
};

export const getPaymentLogs = async (
  token: string
): Promise<{ success: boolean; payments: PaymentSnapshot[] }> => {
  const response = await fetch(`${API_BASE_URL}/api/payments/logs`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseResponse<{ success: boolean; payments: PaymentSnapshot[] }>(response);
};

export const registerAdmin = async (payload: {
  firstName: string;
  lastName: string;
  email: string;
  mobileNo: string;
  password: string;
}) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  return parseResponse<AuthResponse>(response);
};

export const loginAdmin = async (payload: { email: string; password: string }) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  return parseResponse<AuthResponse>(response);
};

export const getAdminDashboardAnalytics = async (
  token: string
): Promise<{ success: boolean; analytics: AdminAnalytics }> => {
  const response = await fetch(`${API_BASE_URL}/api/admin/dashboard-analytics`, {
    method: 'GET',
    headers: authHeaders(token),
  });

  return parseResponse<{ success: boolean; analytics: AdminAnalytics }>(response);
};

export const getAdminUsers = async (
  token: string,
  filters: {
    plan_select?: string;
    payment_status?: string;
    plan_status?: string;
    download_used?: string;
  },
  pagination?: {
    page?: number;
    limit?: number;
  }
): Promise<{ success: boolean; users: AdminUserListItem[]; pagination: PaginationMeta }> => {
  const search = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      search.set(key, value);
    }
  });

  if (pagination?.page) {
    search.set('page', String(pagination.page));
  }

  if (pagination?.limit) {
    search.set('limit', String(pagination.limit));
  }

  const query = search.toString();
  const response = await fetch(`${API_BASE_URL}/api/admin/users${query ? `?${query}` : ''}`, {
    method: 'GET',
    headers: authHeaders(token),
  });

  return parseResponse<{ success: boolean; users: AdminUserListItem[]; pagination: PaginationMeta }>(
    response
  );
};

export const getAdminUserProfile = async (
  token: string,
  userId: number | string
): Promise<{ success: boolean; user: AuthUser }> => {
  const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/profile`, {
    method: 'GET',
    headers: authHeaders(token),
  });

  return parseResponse<{ success: boolean; user: AuthUser }>(response);
};

export const getAdminUserPlans = async (
  token: string,
  userId: number | string
): Promise<{ success: boolean; payments: PaymentSnapshot[] }> => {
  const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/plans`, {
    method: 'GET',
    headers: authHeaders(token),
  });

  return parseResponse<{ success: boolean; payments: PaymentSnapshot[] }>(response);
};

export const getPublicBuilderSettings = async (): Promise<{
  success: boolean;
  settings: BuilderSettingsPayload;
}> => {
  const response = await fetch(`${API_BASE_URL}/api/settings/public`, {
    method: 'GET',
  });

  return parseResponse<{ success: boolean; settings: BuilderSettingsPayload }>(response);
};

export const getAdminSettings = async (
  token: string
): Promise<{ success: boolean; settings: BuilderSettingsPayload }> => {
  const response = await fetch(`${API_BASE_URL}/api/admin/settings`, {
    method: 'GET',
    headers: authHeaders(token),
  });

  return parseResponse<{ success: boolean; settings: BuilderSettingsPayload }>(response);
};

export const updateAdminSettings = async (
  token: string,
  payload: BuilderSettingsPayload
): Promise<{ success: boolean; settings: BuilderSettingsPayload }> => {
  const response = await fetch(`${API_BASE_URL}/api/admin/settings`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });

  return parseResponse<{ success: boolean; settings: BuilderSettingsPayload }>(response);
};
