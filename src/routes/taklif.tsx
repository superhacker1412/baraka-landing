import { createFileRoute } from "@tanstack/react-router";
import { FeedbackForm } from "@/components/forms/FeedbackForm";
import { PageMeta } from "@/components/PageMeta";
import { PublicShell, Section, SectionTitle } from "@/components/PublicShell";
import { useTranslation } from "@/lib/i18n";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/taklif")({
  head: () => buildSeoMeta({ locale: "uz", page: "feedback" }),
  component: FeedbackPage,
});

function FeedbackPage() {
  const { t } = useTranslation();

  return (
    <PublicShell>
      <PageMeta page="feedback" />
      <Section className="py-14 md:py-20">
        <div className="mx-auto max-w-2xl">
          <SectionTitle
            eyebrow={t("forms.feedback.eyebrow")}
            title={t("forms.feedback.title")}
            sub={t("forms.feedback.subtitle")}
            center
            level="h1"
          />
          <div className="mt-8 surface rounded-3xl p-6 md:p-8">
            <FeedbackForm />
          </div>
        </div>
      </Section>
    </PublicShell>
  );
}
