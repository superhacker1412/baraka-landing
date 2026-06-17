export type BusinessType =
  | "Sotuvchi"
  | "Do'kon"
  | "Yetkazib beruvchi"
  | "Ombor egasi"
  | "Kuryer"
  | "Xaridor"
  | "Boshqa";

export type FeedbackTopic =
  | "Hamkorlik"
  | "Ombor qo'shish"
  | "Yetkazib beruvchi bo'lish"
  | "Taklif"
  | "Muammo"
  | "Boshqa";

export type PreRegistration = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  businessType: BusinessType;
  city: string;
  note?: string;
  createdAt: string;
};

export type FeedbackSubmission = {
  id: string;
  name: string;
  phone: string;
  topic: FeedbackTopic;
  message: string;
  createdAt: string;
};

export type StorageStats = {
  preRegistrationCount: number;
  feedbackCount: number;
  totalCount: number;
  byBusinessType: Record<string, number>;
  byTopic: Record<string, number>;
};

const PRE_REG_KEY = "barakali-pre-registrations";
const FEEDBACK_KEY = "barakali-feedback";

function readJson<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function writeJson<T>(key: string, data: T[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
}

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function savePreRegistration(
  data: Omit<PreRegistration, "id" | "createdAt">,
): PreRegistration {
  const entry: PreRegistration = {
    ...data,
    id: createId(),
    createdAt: new Date().toISOString(),
  };
  const all = readJson<PreRegistration>(PRE_REG_KEY);
  all.unshift(entry);
  writeJson(PRE_REG_KEY, all);
  return entry;
}

export function saveFeedback(
  data: Omit<FeedbackSubmission, "id" | "createdAt">,
): FeedbackSubmission {
  const entry: FeedbackSubmission = {
    ...data,
    id: createId(),
    createdAt: new Date().toISOString(),
  };
  const all = readJson<FeedbackSubmission>(FEEDBACK_KEY);
  all.unshift(entry);
  writeJson(FEEDBACK_KEY, all);
  return entry;
}

export function getAllPreRegistrations(): PreRegistration[] {
  return readJson<PreRegistration>(PRE_REG_KEY);
}

export function getAllFeedback(): FeedbackSubmission[] {
  return readJson<FeedbackSubmission>(FEEDBACK_KEY);
}

export function getStats(): StorageStats {
  const preRegs = getAllPreRegistrations();
  const feedback = getAllFeedback();

  const byBusinessType: Record<string, number> = {};
  for (const item of preRegs) {
    byBusinessType[item.businessType] = (byBusinessType[item.businessType] ?? 0) + 1;
  }

  const byTopic: Record<string, number> = {};
  for (const item of feedback) {
    byTopic[item.topic] = (byTopic[item.topic] ?? 0) + 1;
  }

  return {
    preRegistrationCount: preRegs.length,
    feedbackCount: feedback.length,
    totalCount: preRegs.length + feedback.length,
    byBusinessType,
    byTopic,
  };
}

/** Prepare POST body for future POST /public/pre-registration */
export function toPreRegistrationPayload(data: Omit<PreRegistration, "id" | "createdAt">) {
  return {
    name: data.name,
    phone: data.phone,
    email: data.email ?? null,
    businessType: data.businessType,
    city: data.city,
    note: data.note ?? null,
  };
}

/** Prepare POST body for future POST /public/feedback */
export function toFeedbackPayload(data: Omit<FeedbackSubmission, "id" | "createdAt">) {
  return {
    name: data.name,
    phone: data.phone,
    topic: data.topic,
    message: data.message,
  };
}
