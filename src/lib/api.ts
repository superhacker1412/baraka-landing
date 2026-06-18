import type {
  BusinessType,
  FeedbackSubmission,
  FeedbackTopic,
  PreRegistration,
  StorageStats,
} from "@/lib/feedback-storage";

/**
 * Backend base URL.
 * - Default "/api" — same origin (Nginx proxies /api to the Node `memory.js` server).
 * - Override with VITE_API_URL when the backend lives on another host.
 */
const API_BASE = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") || "/api";

export type PreRegistrationInput = {
  name: string;
  phone: string;
  email?: string;
  businessType: BusinessType;
  city: string;
  note?: string;
};

export type FeedbackInput = {
  name: string;
  phone: string;
  topic: FeedbackTopic;
  message: string;
};

export type AdminData = {
  preRegistrations: PreRegistration[];
  feedback: FeedbackSubmission[];
  stats: StorageStats;
};

export class ApiError extends Error {
  status: number;
  code?: string;
  constructor(status: number, code?: string) {
    super(code ?? `HTTP ${status}`);
    this.status = status;
    this.code = code;
  }
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, "network");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, (data as { error?: string }).error);
  return data as T;
}

export function submitPreRegistration(
  input: PreRegistrationInput,
  captchaToken: string | null,
): Promise<{ ok: true; id: string }> {
  return postJson("/pre-registration", { ...input, captchaToken });
}

export function submitFeedback(
  input: FeedbackInput,
  captchaToken: string | null,
): Promise<{ ok: true; id: string }> {
  return postJson("/feedback", { ...input, captchaToken });
}

export function adminLogin(
  email: string,
  password: string,
  captchaToken: string | null,
): Promise<{ token: string }> {
  return postJson("/admin/login", { email, password, captchaToken });
}

export async function fetchAdminData(token: string): Promise<AdminData> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/admin/data`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    throw new ApiError(0, "network");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, (data as { error?: string }).error);
  return data as AdminData;
}
