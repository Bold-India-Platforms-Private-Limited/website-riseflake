// Everything the resume site asks the Riseflake backend. Accounts are Riseflake
// accounts and the session is the httpOnly cookie the backend sets, shared with
// app.riseflake.com, so nothing here stores or passes a token.

const API_ROOT = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}/api/v2`;

export const APP_URL = 'https://app.riseflake.com';
export const MANAGE_SUBSCRIPTION_URL = `${APP_URL}/dashboard/subscription-plans`;

export interface AuthUser {
  id: number;
  email: string;
  mobile_no?: string | null;
  full_name: string;
  first_name: string;
  role: number;
}

export interface CurrentPlan {
  id: number;
  title: string;
  price: number;
  interval: string;
  status: string;
  current_end: string | null;
  next_charge_at: string | null;
}

export interface ResumeAccess {
  has_access: boolean;
  plan: CurrentPlan | null;
}

export interface PlanItem {
  id: number;
  razorpay_plan_id: string;
  title: string;
  description: string | null;
  price: number;
  currency: string;
  interval: string;
  job_view_limit: number;
  job_apply_limit: number;
}

export interface ResumeConfig {
  plans: PlanItem[];
  free_builder: boolean;
  razorpay_key: string | null;
}

export class ApiError extends Error {
  status: number;
  code?: string;
  field?: string;

  constructor(message: string, status: number, code?: string, field?: string) {
    super(message);
    this.status = status;
    this.code = code;
    this.field = field;
  }
}

const request = async <T>(path: string, body?: unknown): Promise<T> => {
  let response: Response;
  try {
    response = await fetch(`${API_ROOT}${path}`, {
      method: body === undefined ? 'GET' : 'POST',
      credentials: 'include',
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (_error) {
    throw new ApiError('Could not reach Riseflake. Please check your connection and try again.', 0);
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data.message || data.error?.[0]?.msg || 'Something went wrong. Please try again.';
    throw new ApiError(message, response.status, data.code, data.field);
  }
  return data;
};

export const getConfig = () => request<ResumeConfig & { status: boolean }>('/resume/config');

export const getSession = () =>
  request<{ user: AuthUser | null; access: ResumeAccess | null }>('/resume/me');

export const checkAccount = (payload: { email: string; mobile_no: string }) =>
  request<{ exists: boolean }>('/resume/auth/check-account', payload);

export const sendEmailOtp = (email: string) =>
  request<{ otpDisabled?: boolean; resendAfter?: number; message?: string }>('/auth/send-otp', {
    email,
    flow: 'candidate_registration',
  });

export const verifyEmailOtp = (email: string, otp: string) =>
  request<{ success: boolean }>('/auth/verify-otp', { email, otp });

export const registerAccount = (payload: {
  full_name: string;
  email: string;
  mobile_no: string;
  password: string;
  cf_turnstile_token: string;
}) => request<{ status: boolean }>('/resume/auth/register', payload);

export const loginAccount = (payload: {
  identifier: string;
  password: string;
  cf_turnstile_token: string;
}) => request<{ status: boolean }>('/auth/login-with-identifier', payload);

export const forgotPassword = (email: string, token: string) =>
  request<{ message: string }>('/resume/auth/forgot-password', { email, cf_turnstile_token: token });

export const googleLogin = (idToken: string) =>
  request('/auth/google', { google_id_token: idToken, signup_source: { utm_source: 'resume_builder' } });

export const logoutSession = () => request('/auth/logout', {});

export const createSubscription = (razorpayPlanId: string) =>
  request<{
    data: {
      subscription_id: string;
      plan_name: string;
      user_prefill: { name: string; email: string; contact: string };
    };
  }>('/subscription/create', { plan_id: razorpayPlanId });

export const recordDownload = (template?: string) => request('/resume/downloads', { template });

export const formatDate = (value?: string | null) =>
  value
    ? new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : '-';
