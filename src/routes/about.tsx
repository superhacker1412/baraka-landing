import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Building2, CheckCircle2, MapPinned, ShieldCheck } from "lucide-react";

import { CTABlockLight, PromoBadge } from "@/components/CTABlock";
import { PageMeta } from "@/components/PageMeta";
import { PublicShell, Section, SectionTitle } from "@/components/PublicShell";
import { useTranslation } from "@/lib/i18n";
import { ROUTES } from "@/lib/routes";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  head: () => buildSeoMeta({ locale: "uz", page: "about" }),
  component: AboutPage,
});

function AboutPage() {
  const { t, tRaw } = useTranslation();
  const principles = tRaw<{ title: string; text: string }[]>("aboutPage.principles");
  const steps = tRaw<{ title: string; text: string }[]>("aboutPage.steps");

  return (
    <PublicShell>
      <PageMeta page="about" />

      <Section className="py-14 md:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[0.92fr_1.08fr]">
          <div>
            <div className="mb-5 flex">
              <PromoBadge />
            </div>
            <h1 className="font-display text-[42px] font-semibold leading-[1.04] tracking-tight md:text-[64px]">
              {t("aboutPage.heroTitle")}
            </h1>
            <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-muted-foreground">
              {t("aboutPage.heroSubtitle")}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to={ROUTES.preRegistration}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-[13.5px] font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:opacity-90"
              >
                {t("nav.registerCta")}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
              <Link
                to={ROUTES.contact}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-5 py-2.5 text-[13.5px] font-medium hover:bg-accent"
              >
                {t("nav.contact")}
              </Link>
            </div>
          </div>

          <div className="surface overflow-hidden rounded-3xl p-6 md:p-8">
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { icon: Building2, label: t("aboutPage.visual.business") },
                { icon: MapPinned, label: t("aboutPage.visual.regions") },
                { icon: ShieldCheck, label: t("aboutPage.visual.trust") },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="rounded-2xl border border-border bg-background p-4">
                  <Icon className="h-5 w-5 text-primary" aria-hidden />
                  <div className="mt-3 text-[13px] font-semibold leading-snug">{label}</div>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-2xl border border-border bg-background p-5">
              <div className="text-[12px] font-semibold uppercase text-muted-foreground">
                {t("aboutPage.missionLabel")}
              </div>
              <p className="mt-3 text-[15px] leading-relaxed">{t("aboutPage.missionText")}</p>
            </div>
          </div>
        </div>
      </Section>

      <Section className="py-12">
        <SectionTitle title={t("aboutPage.principlesTitle")} sub={t("aboutPage.principlesSub")} />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {principles.map((item) => (
            <article key={item.title} className="surface rounded-2xl p-5">
              <CheckCircle2 className="h-5 w-5 text-success" aria-hidden />
              <h2 className="mt-4 text-[16px] font-semibold">{item.title}</h2>
              <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">
                {item.text}
              </p>
            </article>
          ))}
        </div>
      </Section>

      <Section className="py-12">
        <SectionTitle title={t("aboutPage.stepsTitle")} sub={t("aboutPage.stepsSub")} center />
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {steps.map((step, index) => (
            <article key={step.title} className="surface rounded-2xl p-5">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-primary text-[13px] font-bold text-primary-foreground">
                {index + 1}
              </div>
              <h2 className="mt-4 text-[15px] font-semibold">{step.title}</h2>
              <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{step.text}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section className="py-10">
        <CTABlockLight />
      </Section>
    </PublicShell>
  );
}
