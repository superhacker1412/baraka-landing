import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Building2, Check, Gift, Package, Store, Truck, User, Zap } from "lucide-react";
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

const ROLE_IDS = ["supplier", "sellerOwner", "shopOwner", "warehouseOwner", "courier"] as const;
const MAIN_TIER_IDS = ["start", "standard", "premium"] as const;
const ENTERPRISE_TIER_ID = "organization" as const;
const TIER_IDS = [...MAIN_TIER_IDS, ENTERPRISE_TIER_ID] as const;

type RoleId = (typeof ROLE_IDS)[number];
type TierId = (typeof TIER_IDS)[number];
type PlanAudience = "individual" | "organization";

const ROLE_ICONS: Record<RoleId, ElementType> = {
  supplier: Package,
  sellerOwner: User,
  shopOwner: Store,
  warehouseOwner: Building2,
  courier: Truck,
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

function getDiscountedPrice(amount: number): number {
  return Math.round(amount * 0.5);
}

export function TariffPage() {
  const { t, tRaw, lang } = useTranslation();
  const [activeRole, setActiveRole] = useState<RoleId>("supplier");
  const [planAudience, setPlanAudience] = useState<PlanAudience>("individual");

  const roles = tRaw<Record<RoleId, RolePricing>>("pricing.roles");
  const tiers = tRaw<Record<TierId, TierInfo>>("pricing.tiers");
  const activeRoleData = roles[activeRole];
  const enterpriseTier = tiers[ENTERPRISE_TIER_ID];
  const enterprisePlan = activeRoleData.plans[ENTERPRISE_TIER_ID];

  const localeTag = useMemo(() => {
    if (lang === "en") return "en-US";
    if (lang === "ru") return "ru-RU";
    return "uz-UZ";
  }, [lang]);

  const renderSubscriptionPrice = (plan: PlanPricing, large = false) => {
    if (plan.free) return t("pricing.free");
    if (plan.subscriptionCustom) return t("pricing.customPrice");
    if (plan.subscriptionPrice == null) return " - ";

    return (
      <div className="flex flex-wrap items-end gap-x-2 gap-y-1">
        <span>{formatUzs(getDiscountedPrice(plan.subscriptionPrice), localeTag)}</span>
        <span
          className={cn(
            "pb-1 font-sans font-medium text-muted-foreground",
            large ? "text-[13px]" : "text-[12px]",
          )}
        >
          {t("pricing.perMonth")}
        </span>
      </div>
    );
  };

  return (
    <PublicShell>
      <PageMeta page="pricing" />

      <div className="border-b border-success/20 bg-success/5">
        <Section className="py-4">
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-success/35 bg-success/10 px-4 py-2 text-[13px] font-semibold text-success md:text-[14px]">
              <Gift className="h-4 w-4 shrink-0" aria-hidden />
              {t("pricing.banner")}
            </div>
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

        <div className="mt-12">
          <div className="text-center text-[11px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            {t("pricing.roleTabsTitle")}
          </div>

          <div
            className="mt-5 flex flex-wrap justify-center gap-2"
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

          <div className="mx-auto mt-6 grid w-full max-w-[420px] grid-cols-2 rounded-full border border-border bg-muted/45 p-1">
            {(["individual", "organization"] as PlanAudience[]).map((audience) => (
              <button
                key={audience}
                type="button"
                onClick={() => setPlanAudience(audience)}
                className={cn(
                  "rounded-full px-4 py-2 text-[12.5px] font-semibold ease-spring transition-colors",
                  planAudience === audience
                    ? "bg-foreground text-background shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t(`pricing.planTabs.${audience}`)}
              </button>
            ))}
          </div>

          {planAudience === "individual" ? (
            <div className="mx-auto mt-12 grid max-w-6xl gap-4 lg:grid-cols-3 lg:items-stretch">
              {MAIN_TIER_IDS.map((tierId) => {
                const tier = tiers[tierId];
                const plan = activeRoleData.plans[tierId];
                const TierIcon = TIER_ICONS[tierId];
                const highlighted = tier.highlighted === true;
                const visibleFeatures = tier.features.slice(0, highlighted ? 4 : 3);

                return (
                  <article
                    key={tierId}
                    className={cn(
                      "surface relative flex flex-col overflow-hidden rounded-3xl ease-spring transition-[box-shadow,transform] hover:-translate-y-0.5",
                      highlighted
                        ? "border-primary/40 bg-primary/5 p-6 shadow-2xl shadow-primary/10 ring-1 ring-primary/25 lg:-mt-5 lg:min-h-[500px]"
                        : "p-5 lg:mt-6 lg:min-h-[460px]",
                    )}
                  >
                    {highlighted && (
                      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
                    )}

                    <div className="flex items-start justify-between gap-3">
                      <div
                        className={cn(
                          "grid h-10 w-10 place-items-center rounded-2xl bg-foreground/5",
                          highlighted && "h-11 w-11 bg-primary text-primary-foreground",
                        )}
                      >
                        <TierIcon className="h-4 w-4" aria-hidden />
                      </div>
                      {highlighted && (
                        <div className="rounded-full bg-foreground px-3 py-1 text-[10px] font-bold tracking-[0.14em] text-background uppercase">
                          {t("pricing.popular")}
                        </div>
                      )}
                    </div>

                    <div className="mt-6">
                      <h3
                        className={cn(
                          "font-display font-semibold tracking-tight",
                          highlighted ? "text-[28px] md:text-[32px]" : "text-[23px] md:text-[26px]",
                        )}
                      >
                        {tier.name}
                      </h3>
                      <p className="mt-2 min-h-[2.2rem] text-[13px] leading-snug text-muted-foreground">
                        {tier.description}
                      </p>
                    </div>

                    <div
                      className={cn(
                        "mt-5 rounded-2xl border p-4",
                        highlighted
                          ? "border-primary/20 bg-background/70"
                          : "border-border bg-muted/35",
                      )}
                    >
                      <div className="text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                        {t("pricing.subscriptionLabel")}
                      </div>
                      <div
                        className={cn(
                          "mt-2 font-display font-semibold tracking-tight",
                          highlighted ? "text-[36px] leading-[1.05] md:text-[42px]" : "text-[30px]",
                        )}
                      >
                        {renderSubscriptionPrice(plan, highlighted)}
                      </div>
                    </div>

                    <ul className="mt-5 flex-1 space-y-2.5">
                      {visibleFeatures.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-[13px]">
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" aria-hidden />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      to={ROUTES.preRegistration}
                      className={cn(
                        "mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full px-4 text-[13px] font-semibold ease-spring transition-colors",
                        highlighted
                          ? "bg-foreground text-background shadow-lg shadow-foreground/10 hover:opacity-90"
                          : "border border-border bg-card hover:bg-accent",
                      )}
                    >
                      {highlighted ? t("pricing.popular") : t("pricing.ctaRegister")}
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                    </Link>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="surface mx-auto mt-12 grid max-w-4xl gap-6 rounded-3xl p-6 md:grid-cols-[1fr_0.85fr] md:p-8">
              <div>
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                  <Building2 className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="mt-5 font-display text-[30px] font-semibold tracking-tight md:text-[38px]">
                  {enterpriseTier.name}
                </h3>
                <p className="mt-2 max-w-xl text-[13.5px] leading-relaxed text-muted-foreground">
                  {enterpriseTier.description}
                </p>
                <ul className="mt-6 grid gap-2.5">
                  {enterpriseTier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-[13px]">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" aria-hidden />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-border bg-muted/35 p-5">
                <div className="text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  {t("pricing.subscriptionLabel")}
                </div>
                <div className="mt-3 font-display text-[34px] font-semibold tracking-tight">
                  {renderSubscriptionPrice(enterprisePlan, true)}
                </div>
                <Link
                  to={ROUTES.feedback}
                  className="mt-7 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-foreground px-4 text-[13px] font-semibold text-background shadow-lg shadow-foreground/10 hover:opacity-90"
                >
                  {t("pricing.ctaApply")}
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="surface mt-16 rounded-3xl p-8 text-center md:p-10">
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
