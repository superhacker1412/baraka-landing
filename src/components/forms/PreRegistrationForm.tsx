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
import { submitPreRegistration } from "@/lib/api";
import type { BusinessType } from "@/lib/feedback-storage";

const BUSINESS_TYPES: BusinessType[] = [
  "Sotuvchi",
  "Do'kon",
  "Yetkazib beruvchi",
  "Ombor egasi",
  "Kuryer",
  "Xaridor",
  "Boshqa",
];

type PreRegistrationFormProps = {
  onSuccess?: () => void;
  className?: string;
};

export function PreRegistrationForm({ onSuccess, className = "" }: PreRegistrationFormProps) {
  const { t, tRaw } = useTranslation();
  const businessLabels = tRaw<string[]>("forms.preRegistration.businessTypes");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    let token = captchaToken;
    if (captchaConfig.isV3) {
      token = await executeRecaptcha("pre_registration");
    }
    if (!token) {
      toast.error(t("forms.captchaRequired"));
      return;
    }

    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const businessType = String(data.get("businessType") ?? "") as BusinessType;
    const city = String(data.get("city") ?? "").trim();
    const note = String(data.get("note") ?? "").trim();

    if (!name || !phone || !businessType || !city) {
      toast.error(t("forms.preRegistration.required"));
      return;
    }

    setSubmitting(true);
    try {
      await submitPreRegistration(
        {
          name,
          phone,
          email: email || undefined,
          businessType,
          city,
          note: note || undefined,
        },
        token,
      );

      toast.success(t("forms.preRegistration.success"));
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
          <Label htmlFor="pre-name">{t("forms.preRegistration.name")} *</Label>
          <Input
            id="pre-name"
            name="name"
            required
            placeholder={t("forms.preRegistration.namePlaceholder")}
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="pre-phone">{t("forms.preRegistration.phone")} *</Label>
          <Input
            id="pre-phone"
            name="phone"
            required
            placeholder={t("forms.preRegistration.phonePlaceholder")}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="pre-email">{t("forms.preRegistration.email")}</Label>
          <Input
            id="pre-email"
            name="email"
            type="email"
            placeholder={t("forms.preRegistration.emailPlaceholder")}
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="pre-business">{t("forms.preRegistration.businessType")} *</Label>
          <Select id="pre-business" name="businessType" required defaultValue="">
            <option value="" disabled>
              {t("common.select")}
            </option>
            {BUSINESS_TYPES.map((type, index) => (
              <option key={type} value={type}>
                {businessLabels[index] ?? type}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="pre-city">{t("forms.preRegistration.city")} *</Label>
        <Input
          id="pre-city"
          name="city"
          required
          placeholder={t("forms.preRegistration.cityPlaceholder")}
        />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="pre-note">{t("forms.preRegistration.noteField")}</Label>
        <Textarea
          id="pre-note"
          name="note"
          placeholder={t("forms.preRegistration.notePlaceholder")}
        />
      </div>

      <CaptchaField onTokenChange={captchaConfig.isV2 ? setCaptchaToken : undefined} />

      <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
        {submitting ? t("common.submitting") : t("common.submit")}
      </Button>
    </form>
  );
}
