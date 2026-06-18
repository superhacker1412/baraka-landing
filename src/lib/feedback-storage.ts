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
  email?: string | null;
  businessType: BusinessType;
  city: string;
  note?: string | null;
  ip?: string;
  createdAt: string;
};

export type FeedbackSubmission = {
  id: string;
  name: string;
  phone: string;
  topic: FeedbackTopic;
  message: string;
  ip?: string;
  createdAt: string;
};

export type StorageStats = {
  preRegistrationCount: number;
  feedbackCount: number;
  totalCount: number;
  byBusinessType: Record<string, number>;
  byTopic: Record<string, number>;
};

export function computeStats(
  preRegs: PreRegistration[],
  feedback: FeedbackSubmission[],
): StorageStats {
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
