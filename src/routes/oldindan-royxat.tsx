import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { PreRegistrationForm } from "@/components/forms/PreRegistrationForm";
import { PageMeta } from "@/components/PageMeta";
import { PublicShell, Section, SectionTitle } from "@/components/PublicShell";
import { useTranslation } from "@/lib/i18n";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/oldindan-royxat")({
  head: () => buildSeoMeta({ locale: "uz", page: "preRegistration" }),
  component: PreRegistrationPage,
});

function PreRegistrationPage() {
  const { t } = useTranslation();

  return (
    <PublicShell>
      <PageMeta page="preRegistration" />
      <Section className="py-14 md:py-20">
        <div className="mx-auto max-w-2xl">
          <SectionTitle
            eyebrow={t("forms.preRegistration.eyebrow")}
            title={t("forms.preRegistration.title")}
            sub={t("forms.preRegistration.subtitle")}
            center
          />
          <div className="mt-6 flex items-center justify-center gap-2 text-[12px] text-muted-foreground">
            <Sparkles className="h-4 w-4 text-primary" aria-hidden />
            {t("forms.preRegistration.note")}
          </div>
          <div className="mt-8 surface rounded-3xl p-6 md:p-8">
            <PreRegistrationForm />
          </div>
        </div>
      </Section>
    </PublicShell>
  );
}
