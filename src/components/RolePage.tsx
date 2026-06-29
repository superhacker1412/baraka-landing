import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Boxes,
  Camera,
  CheckCircle2,
  ClipboardCheck,
  MapPinned,
  PackageCheck,
  PenLine,
  QrCode,
  ShieldCheck,
  ShoppingBag,
  Store,
  Truck,
  UserRound,
  Warehouse,
  type LucideIcon,
} from "lucide-react";

import { CTABlockLight, PromoBadge } from "@/components/CTABlock";
import { PageMeta } from "@/components/PageMeta";
import { PublicShell, Section, SectionTitle } from "@/components/PublicShell";
import { SeoQueryTagsSection } from "@/components/SeoQueryTags";
import { useTranslation } from "@/lib/i18n";
import { ROUTES } from "@/lib/routes";
import type { SeoPageKey } from "@/lib/seo";
import { cn } from "@/lib/utils";

export type RolePageId = "sellers" | "shops" | "suppliers" | "warehouses" | "couriers" | "buyers";

type RolePageContent = {
  title: string;
  subtitle: string;
  audienceTitle: string;
  audience: string[];
  featureTitle: string;
  features: string[];
  workflowTitle: string;
  workflow: { title: string; text: string }[];
  scenarioTitle: string;
  scenarioText: string;
  proofTitle: string;
  proofText: string;
  ctaTitle: string;
  ctaText: string;
  visualTitle: string;
  visualItems: string[];
};

const ROLE_META: Record<RolePageId, SeoPageKey> = {
  sellers: "forSellers",
  shops: "forShops",
  suppliers: "forSuppliers",
  warehouses: "forWarehouses",
  couriers: "forCouriers",
  buyers: "forBuyers",
};

const ROLE_ICON: Record<RolePageId, LucideIcon> = {
  sellers: ShoppingBag,
  shops: Store,
  suppliers: PackageCheck,
  warehouses: Warehouse,
  couriers: Truck,
  buyers: QrCode,
};

const VISUAL_ICON: LucideIcon[] = [Boxes, MapPinned, Camera, PenLine];

function RoleVisual({ role, content }: { role: RolePageId; content: RolePageContent }) {
  const Icon = ROLE_ICON[role];

  return (
    <div className="surface relative overflow-hidden rounded-3xl p-5 md:p-6">
      <div
        aria-hidden
        className="absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(70% 55% at 20% 0%, color-mix(in oklab, var(--primary) 10%, transparent) 0%, transparent 62%), linear-gradient(180deg, color-mix(in oklab, var(--card) 92%, var(--primary)) 0%, var(--card) 100%)",
        }}
      />
      <div className="relative">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-[12px] font-semibold uppercase text-muted-foreground">
              {content.visualTitle}
            </div>
            <div className="mt-1 font-display text-[24px] font-semibold tracking-tight">
              {content.title}
            </div>
          </div>
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <Icon className="h-6 w-6" aria-hidden />
          </div>
        </div>

        <div className="mt-6 grid gap-3">
          {content.visualItems.map((item, index) => {
            const ItemIcon = VISUAL_ICON[index % VISUAL_ICON.length];
            return (
              <div
                key={item}
                className="flex items-start gap-3 rounded-2xl border border-border bg-background/82 p-3 shadow-sm backdrop-blur"
              >
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <ItemIcon className="h-4 w-4" aria-hidden />
                </div>
                <div className="text-[13px] leading-relaxed">{item}</div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 rounded-2xl border border-border bg-background/88 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="text-[12px] font-semibold text-muted-foreground">
              {content.proofTitle}
            </div>
            <ShieldCheck className="h-4 w-4 text-success" aria-hidden />
          </div>
          <p className="text-[13px] leading-relaxed text-muted-foreground">{content.proofText}</p>
        </div>
      </div>
    </div>
  );
}

export function RolePage({ role }: { role: RolePageId }) {
  const { t, tRaw } = useTranslation();
  const content = tRaw<RolePageContent>(`rolePages.${role}`);

  return (
    <PublicShell>
      <PageMeta page={ROLE_META[role]} />

      <Section className="py-14 md:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <h1 className="font-display text-[42px] font-semibold leading-[1.04] tracking-tight md:text-[64px]">
              {content.title}
            </h1>
            <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-muted-foreground">
              {content.subtitle}
            </p>
            <div className="mt-6">
              <PromoBadge />
            </div>
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
          <RoleVisual role={role} content={content} />
        </div>
      </Section>

      <Section className="py-10">
        <div className="grid gap-5 lg:grid-cols-[0.75fr_1.25fr]">
          <div className="surface rounded-3xl p-6 md:p-8">
            <h2 className="font-display text-[28px] font-semibold tracking-tight">
              {content.audienceTitle}
            </h2>
            <ul className="mt-5 grid gap-3">
              {content.audience.map((item) => (
                <li key={item} className="flex items-start gap-2 text-[14px]">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {content.features.map((item, index) => (
              <div key={item} className="surface rounded-2xl p-5">
                <div className="mb-3 grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
                  <ClipboardCheck className="h-4 w-4" aria-hidden />
                </div>
                <div className="text-[12px] font-semibold uppercase text-muted-foreground">
                  {content.featureTitle} {index + 1}
                </div>
                <p className="mt-2 text-[14px] leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="py-12">
        <SectionTitle title={content.workflowTitle} sub={content.scenarioText} />
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {content.workflow.map((step, index) => (
            <article key={step.title} className="relative surface rounded-2xl p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-primary text-[13px] font-bold text-primary-foreground">
                  {index + 1}
                </div>
                <ArrowRight
                  className={cn(
                    "hidden h-4 w-4 text-muted-foreground lg:block",
                    index === content.workflow.length - 1 && "opacity-0",
                  )}
                  aria-hidden
                />
              </div>
              <h3 className="text-[15px] font-semibold">{step.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{step.text}</p>
            </article>
          ))}
        </div>
      </Section>

      <SeoQueryTagsSection compact />

      <Section className="py-10">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionTitle title={content.scenarioTitle} sub={content.ctaText} />
          </div>
          <CTABlockLight />
        </div>
      </Section>
    </PublicShell>
  );
}
