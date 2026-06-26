import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Briefcase,
  Building2,
  Check,
  Gift,
  Handshake,
  Package,
  ShoppingBag,
  ShoppingCart,
  Store,
  Truck,
  User,
  Zap,
} from "lucide-react";
import { useMemo, useState, type ElementType } from "react";

import { PageMeta } from "@/components/PageMeta";
import { CTAButton, PublicShell, Section, SectionTitle } from "@/components/PublicShell";
import { useTranslation } from "@/lib/i18n";
import { ROUTES } from "@/lib/routes";
import { buildSeoMeta } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tariff")({
  head: () => buildSeoMeta({ locale: "uz", page: "pricing" }),
  component: TariffPage,
});

const ROLE_IDS = [
  "sellerOwner",
  "seller",
  "shopOwner",
  "supplier",
  "warehouseOwner",
  "courier",
  "buyer",
] as const;

const TIER_IDS = ["start", "standard", "premium", "organization"] as const;

type RoleId = (typeof ROLE_IDS)[number];
type TierId = (typeof TIER_IDS)[number];

const ROLE_ICONS: Record<RoleId, ElementType> = {
  sellerOwner: Briefcase,
  seller: User,
  shopOwner: Store,
  supplier: Truck,
  warehouseOwner: Package,
  courier: ShoppingBag,
  buyer: ShoppingCart,
};

const TIER_ICONS: Record<TierId, ElementType> = {
  start: Zap,
  standard: Store,
  premium: Building2,
  organization: Building2,
};

type PlanPricing = {
  subscriptionPrice: number | null;
  subscriptionCustom?: boolean;
  partnershipPercent: string;
  free?: boolean;
};

type RolePricing = {
  name: string;
  description: string;
  recommendedModel: "subscription" | "partnership";
  plans: Record<TierId, PlanPricing>;
};

type TierInfo = {
  name: string;
  description: string;
  features: string[];
  highlighted?: boolean;
};

function formatUzs(amount: number, locale: string): string {
  return new Intl.NumberFormat(locale === "en" ? "en-US" : "uz-UZ", {
    style: "decimal",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function TariffPage() {
  const { t, tRaw, lang } = useTranslation();
  const [activeRole, setActiveRole] = useState<RoleId>("sellerOwner");

  const roles = tRaw<Record<RoleId, RolePricing>>("pricing.roles");
  const tiers = tRaw<Record<TierId, TierInfo>>("pricing.tiers");
  const activeRoleData = roles[activeRole];

  const localeTag = useMemo(() => {
    if (lang === "en") return "en-US";
    if (lang === "ru") return "ru-RU";
    return "uz-UZ";
  }, [lang]);

  return (
    <PublicShell>
      <PageMeta page="pricing" />

      {/* Promo banner */}
      <div className="border-b border-success/20 bg-success/5">
        <Section className="py-5 md:py-6">
          <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-center sm:gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-success/35 bg-success/10 px-4 py-2 text-[14px] font-semibold text-success md:text-[15px]">
              <Gift className="h-4 w-4 shrink-0 md:h-5 md:w-5" aria-hidden />
              {t("pricing.banner")}
            </div>
            <p className="max-w-xl text-[13px] text-muted-foreground md:text-[14px]">
              {t("pricing.bannerSub")}
            </p>
          </div>
        </Section>
      </div>

      <Section className="py-14 md:py-20">
        <SectionTitle
          eyebrow={t("pricing.eyebrow")}
          title={t("pricing.title")}
          sub={t("pricing.subtitle")}
          center
          level="h1"
        />

        {/* Business models */}
        <div className="mt-14 grid gap-5 md:grid-cols-2">
          <div className="surface rounded-3xl p-6 md:p-8">
            <div className="mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-foreground/5">
              <Handshake className="h-5 w-5 text-foreground" aria-hidden />
            </div>
            <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              {t("pricing.models.partnership.badge")}
            </div>
            <h3 className="mt-2 font-display text-[22px] font-semibold tracking-tight md:text-[26px]">
              {t("pricing.models.partnership.title")}
            </h3>
            <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
              {t("pricing.models.partnership.description")}
            </p>
            <ul className="mt-4 space-y-2">
              {tRaw<string[]>("pricing.models.partnership.points").map((point) => (
                <li key={point} className="flex items-start gap-2 text-[13.5px]">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden />
                  {point}
                </li>
              ))}
            </ul>
            <p className="mt-4 rounded-xl bg-muted/60 px-3 py-2 text-[12.5px] text-muted-foreground">
              {t("pricing.models.partnership.goodFor")}
            </p>
          </div>

          <div className="surface rounded-3xl p-6 md:p-8">
            <div className="mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-foreground/5">
              <Zap className="h-5 w-5 text-foreground" aria-hidden />
            </div>
            <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              {t("pricing.models.subscription.badge")}
            </div>
            <h3 className="mt-2 font-display text-[22px] font-semibold tracking-tight md:text-[26px]">
              {t("pricing.models.subscription.title")}
            </h3>
            <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
              {t("pricing.models.subscription.description")}
            </p>
            <ul className="mt-4 space-y-2">
              {tRaw<string[]>("pricing.models.subscription.points").map((point) => (
                <li key={point} className="flex items-start gap-2 text-[13.5px]">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden />
                  {point}
                </li>
              ))}
            </ul>
            <p className="mt-4 rounded-xl bg-muted/60 px-3 py-2 text-[12.5px] text-muted-foreground">
              {t("pricing.models.subscription.goodFor")}
            </p>
          </div>
        </div>

        {/* Role tabs + pricing cards */}
        <div className="mt-16">
          <div className="text-center">
            <h3 className="font-display text-[24px] font-semibold tracking-tight md:text-[32px]">
              {t("pricing.roleTabsTitle")}
            </h3>
            <p className="mx-auto mt-2 max-w-2xl text-[14px] text-muted-foreground">
              {t("pricing.roleTabsSub")}
            </p>
          </div>

          <div
            className="mt-8 flex flex-wrap justify-center gap-2"
            role="tablist"
            aria-label={t("pricing.selectRole")}
          >
            {ROLE_IDS.map((roleId) => {
              const RoleIcon = ROLE_ICONS[roleId];
              const isActive = activeRole === roleId;
              return (
                <button
                  key={roleId}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveRole(roleId)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[12.5px] font-medium ease-spring transition-colors",
                    isActive
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground",
                  )}
                >
                  <RoleIcon className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  {roles[roleId].name}
                </button>
              );
            })}
          </div>

          <div className="mt-6 text-center">
            <p className="text-[14px] text-muted-foreground">{activeRoleData.description}</p>
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3 py-1 text-[12px] text-muted-foreground">
              {activeRoleData.recommendedModel === "partnership" ? (
                <Handshake className="h-3 w-3" aria-hidden />
              ) : (
                <Zap className="h-3 w-3" aria-hidden />
              )}
              {t(`pricing.recommended.${activeRoleData.recommendedModel}`)}
            </div>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {TIER_IDS.map((tierId) => {
              const tier = tiers[tierId];
              const plan = activeRoleData.plans[tierId];
              const TierIcon = TIER_ICONS[tierId];
              const highlighted = tier.highlighted === true;

              return (
                <div
                  key={tierId}
                  className={cn(
                    "surface relative flex flex-col rounded-3xl p-6 ease-spring transition-[box-shadow,transform] hover:-translate-y-0.5",
                    highlighted && "ring-2 ring-foreground/15 shadow-lg",
                  )}
                >
                  {highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-foreground px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-background">
                      {t("pricing.popular")}
                    </div>
                  )}

                  <div className="mb-4 grid h-10 w-10 place-items-center rounded-xl bg-foreground/5">
                    <TierIcon className="h-4 w-4" aria-hidden />
                  </div>

                  <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    {tier.name}
                  </div>
                  <p className="mt-1 min-h-[2.5rem] text-[12.5px] leading-snug text-muted-foreground">
                    {tier.description}
                  </p>

                  <div className="mt-5 border-t border-border/60 pt-5">
                    <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      {t("pricing.subscriptionLabel")}
                    </div>
                    <div className="mt-1 font-display text-[28px] font-semibold tracking-tight">
                      {plan.free ? (
                        t("pricing.free")
                      ) : plan.subscriptionCustom ? (
                        t("pricing.customPrice")
                      ) : plan.subscriptionPrice != null ? (
                        <>
                          {formatUzs(plan.subscriptionPrice, localeTag)}
                          <span className="ml-1 text-[13px] font-normal text-muted-foreground">
                            {t("pricing.perMonth")}
                          </span>
                        </>
                      ) : (
                        " - "
                      )}
                    </div>

                    <div className="mt-4 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      {t("pricing.partnershipLabel")}
                    </div>
                    <div className="mt-1 text-[15px] font-semibold">
                      {t("pricing.partnershipPercent", { percent: plan.partnershipPercent })}
                    </div>
                  </div>

                  <ul className="mt-5 flex-1 space-y-2 border-t border-border/60 pt-5">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-[12.5px]">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" aria-hidden />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 grid gap-2">
                    <CTAButton href={ROUTES.preRegistration} primary={highlighted}>
                      {t("pricing.ctaRegister")} <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                    </CTAButton>
                    <CTAButton href={ROUTES.feedback}>{t("pricing.ctaApply")}</CTAButton>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 surface rounded-3xl p-8 text-center md:p-10">
          <Gift className="mx-auto h-8 w-8 text-success" aria-hidden />
          <h3 className="mt-4 font-display text-[24px] font-semibold tracking-tight md:text-[32px]">
            {t("pricing.bottomCta.title")}
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-[14px] text-muted-foreground md:text-[15px]">
            {t("pricing.bottomCta.subtitle")}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <CTAButton href={ROUTES.preRegistration} primary>
              {t("pricing.ctaRegister")} <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </CTAButton>
            <CTAButton href={ROUTES.feedback}>{t("pricing.ctaApply")}</CTAButton>
          </div>
        </div>
      </Section>
    </PublicShell>
  );
}
