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

const CONTACT_LANGUAGES = ["uz", "ru", "en"] as const;

type PreRegistrationFormProps = {
  onSuccess?: () => void;
  className?: string;
};

export function PreRegistrationForm({ onSuccess, className = "" }: PreRegistrationFormProps) {
  const { t, tRaw } = useTranslation();
  const businessLabels = tRaw<string[]>("forms.preRegistration.businessTypes");
  const contactLanguageLabels = tRaw<string[]>("forms.preRegistration.contactLanguages");
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
    const businessName = String(data.get("businessName") ?? "").trim();
    const city = String(data.get("city") ?? "").trim();
    const contactLanguage = String(data.get("contactLanguage") ?? "").trim();
    const note = String(data.get("note") ?? "").trim();

    if (!name || !phone || !businessType || !city) {
      toast.error(t("forms.preRegistration.required"));
      return;
    }

    setSubmitting(true);
    try {
      const languageIndex = CONTACT_LANGUAGES.findIndex((lang) => lang === contactLanguage);
      const contactLanguageLabel =
        languageIndex >= 0 ? (contactLanguageLabels[languageIndex] ?? contactLanguage) : "";
      const fullNote = [
        businessName ? `${t("forms.preRegistration.businessName")}: ${businessName}` : "",
        contactLanguageLabel
          ? `${t("forms.preRegistration.contactLanguage")}: ${contactLanguageLabel}`
          : "",
        note,
      ]
        .filter(Boolean)
        .join("\n");

      await submitPreRegistration(
        {
          name,
          phone,
          email: email || undefined,
          businessType,
          city,
          note: fullNote || undefined,
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
          <Label htmlFor="pre-business-name">{t("forms.preRegistration.businessName")}</Label>
          <Input
            id="pre-business-name"
            name="businessName"
            placeholder={t("forms.preRegistration.businessNamePlaceholder")}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
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
        <div className="grid gap-1.5">
          <Label htmlFor="pre-city">{t("forms.preRegistration.city")} *</Label>
          <Input
            id="pre-city"
            name="city"
            required
            placeholder={t("forms.preRegistration.cityPlaceholder")}
          />
        </div>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="pre-contact-language">{t("forms.preRegistration.contactLanguage")}</Label>
        <Select id="pre-contact-language" name="contactLanguage" defaultValue="uz">
          {CONTACT_LANGUAGES.map((lang, index) => (
            <option key={lang} value={lang}>
              {contactLanguageLabels[index] ?? lang}
            </option>
          ))}
        </Select>
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
