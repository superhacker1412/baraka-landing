import { useState } from "react";
import { toast } from "sonner";
import { CaptchaField, executeRecaptcha } from "@/components/CaptchaField";
import { captchaConfig } from "@/lib/captcha.config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/lib/i18n";
import { submitFeedback } from "@/lib/api";
import type { FeedbackTopic } from "@/lib/feedback-storage";

const TOPICS: FeedbackTopic[] = [
  "Hamkorlik",
  "Ombor qo'shish",
  "Yetkazib beruvchi bo'lish",
  "Taklif",
  "Muammo",
  "Boshqa",
];

type FeedbackFormProps = {
  onSuccess?: () => void;
  className?: string;
};

export function FeedbackForm({ onSuccess, className = "" }: FeedbackFormProps) {
  const { t, tRaw } = useTranslation();
  const topicLabels = tRaw<string[]>("forms.feedback.topics");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    let token = captchaToken;
    if (captchaConfig.isV3) {
      token = await executeRecaptcha("feedback");
    }
    if (!token) {
      toast.error(t("forms.captchaRequired"));
      return;
    }

    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const topic = String(data.get("topic") ?? "") as FeedbackTopic;
    const message = String(data.get("message") ?? "").trim();

    if (!name || !phone || !topic || !message) {
      toast.error(t("forms.feedback.required"));
      return;
    }

    setSubmitting(true);
    try {
      await submitFeedback({ name, phone, topic, message }, token);

      toast.success(t("forms.feedback.success"));
      form.reset();
      setCaptchaToken(null);
      onSuccess?.();
    } catch {
      toast.error(t("forms.submitError"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`grid gap-4 ${className}`}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="fb-name">{t("forms.feedback.name")} *</Label>
          <Input
            id="fb-name"
            name="name"
            required
            placeholder={t("forms.feedback.namePlaceholder")}
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="fb-phone">{t("forms.feedback.phone")} *</Label>
          <Input
            id="fb-phone"
            name="phone"
            required
            placeholder={t("forms.feedback.phonePlaceholder")}
          />
        </div>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="fb-topic">{t("forms.feedback.topic")} *</Label>
        <Select id="fb-topic" name="topic" required defaultValue="">
          <option value="" disabled>
            {t("common.select")}
          </option>
          {TOPICS.map((topic, index) => (
            <option key={topic} value={topic}>
              {topicLabels[index] ?? topic}
            </option>
          ))}
        </Select>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="fb-message">{t("forms.feedback.message")} *</Label>
        <Textarea
          id="fb-message"
          name="message"
          required
          placeholder={t("forms.feedback.messagePlaceholder")}
        />
      </div>

      <CaptchaField onTokenChange={captchaConfig.isV2 ? setCaptchaToken : undefined} />

      <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
        {submitting ? t("common.submitting") : t("common.sendMessage")}
      </Button>
    </form>
  );
}
