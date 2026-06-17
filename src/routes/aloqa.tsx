import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";

import { PageMeta } from "@/components/PageMeta";
import { PublicShell, Section, SectionTitle } from "@/components/PublicShell";
import { CONTACT } from "@/lib/contact";
import { useTranslation } from "@/lib/i18n";
import { ROUTES } from "@/lib/routes";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/aloqa")({
  head: () => buildSeoMeta({ locale: "uz", page: "contact" }),
  component: ContactPage,
});

function ContactPage() {
  const { t } = useTranslation();

  const channels = [
    {
      icon: Mail,
      label: t("contact.emailLabel"),
      value: CONTACT.email,
      href: `mailto:${CONTACT.email}`,
      external: false,
    },
    {
      icon: Phone,
      label: t("contact.phoneLabel"),
      value: CONTACT.phoneDisplay,
      href: `tel:${CONTACT.phone}`,
      external: false,
    },
    {
      icon: Send,
      label: t("contact.telegramLabel"),
      value: t("contact.telegramValue"),
      href: CONTACT.telegram,
      external: true,
    },
    {
      icon: MapPin,
      label: t("contact.addressLabel"),
      value: CONTACT.address,
      href: CONTACT.addressMapUrl,
      external: true,
    },
  ] as const;

  return (
    <PublicShell>
      <PageMeta page="contact" />
      <Section className="py-14 md:py-20">
        <div className="mx-auto max-w-3xl">
          <SectionTitle
            eyebrow={t("contact.eyebrow")}
            title={t("contact.title")}
            sub={t("contact.subtitle")}
            center
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {channels.map(({ icon: Icon, label, value, href, external }) => (
              <a
                key={label}
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="surface group flex flex-col rounded-2xl p-5 ease-spring transition-[box-shadow,transform] hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="mb-4 grid h-10 w-10 place-items-center rounded-xl bg-foreground/5 text-foreground">
                  <Icon className="h-4 w-4" aria-hidden />
                </div>
                <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  {label}
                </div>
                <div className="mt-1 text-[14px] font-semibold leading-snug group-hover:text-primary">
                  {value}
                </div>
              </a>
            ))}
          </div>

          <div className="mt-8 surface rounded-3xl p-6 md:p-8">
            <div className="flex items-start gap-3">
              <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
              <div>
                <div className="text-[15px] font-semibold">{t("contact.helpTitle")}</div>
                <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
                  {t("contact.helpText")}
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    to={ROUTES.feedback}
                    className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-[13px] font-medium text-background hover:opacity-90"
                  >
                    {t("nav.feedbackCta")}
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                  </Link>
                  <Link
                    to={ROUTES.preRegistration}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-[13px] font-medium hover:bg-accent"
                  >
                    {t("nav.registerCta")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </PublicShell>
  );
}
