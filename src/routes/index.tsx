import { Link, createFileRoute, useRouterState } from "@tanstack/react-router";
import {
  ArrowRight,
  Building2,
  Camera,
  ChevronDown,
  CheckCircle2,
  ClipboardCheck,
  CircleX,
  LayoutDashboard,
  MapPinned,
  Navigation,
  PackageCheck,
  Route as RouteIcon,
  ShieldCheck,
  Store,
  Truck,
  UserCheck,
  Warehouse,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { CTABlockLight, PromoBadge } from "@/components/CTABlock";
import { PageMeta, useFaqItems } from "@/components/PageMeta";
import { PublicShell, Section, SectionTitle, CTAButton } from "@/components/PublicShell";
import { SellerDashboardHero } from "@/components/SellerDashboardHero";
import { TashkentMapPreview } from "@/components/TashkentMapPreview";
import { WarehouseBookingDemo } from "@/components/WarehouseBookingDemo";
import { WarehouseMapSection } from "@/components/WarehouseMapSection";
import { useTranslation } from "@/lib/i18n";
import { ROUTES } from "@/lib/routes";
import { buildSeoMeta } from "@/lib/seo";
import { scrollToHash } from "@/lib/scroll";
import { cn } from "@/lib/utils";

const ROLE_CARD_ORDER = [1, 3, 4, 5, 7, 8, 2, 6, 0] as const;

const ROLE_CARD_ICONS: LucideIcon[] = [
  Store,
  Building2,
  PackageCheck,
  Warehouse,
  Truck,
  UserCheck,
  ClipboardCheck,
  LayoutDashboard,
  ShieldCheck,
];

const ROLE_CARD_LINKS = [
  ROUTES.forSellers,
  ROUTES.forShops,
  ROUTES.forSuppliers,
  ROUTES.forWarehouses,
  ROUTES.forCouriers,
  ROUTES.forBuyers,
  ROUTES.forSellers,
  ROUTES.forWarehouses,
  undefined,
] as const;

const PROCESS_ICONS: LucideIcon[] = [PackageCheck, Store, Warehouse, Truck, UserCheck];
const PROOF_ICONS: LucideIcon[] = [Camera, ClipboardCheck, RouteIcon, ShieldCheck];
const AUDIENCE_ICONS: LucideIcon[] = [Store, Building2, PackageCheck, Warehouse];
const ROUTE_OVERLAY_POINTS = [
  { key: "created", Icon: PackageCheck, className: "left-[29%] top-[63%] sm:left-[16%]" },
  { key: "received", Icon: UserCheck, className: "left-[72%] top-[26%] sm:left-[84%]" },
] as const;

export const Route = createFileRoute("/")({
  head: () => buildSeoMeta({ locale: "uz", page: "home" }),
  component: Landing,
});

function HeroRouteMap() {
  return (
    <div
      className="pointer-events-none absolute inset-y-0 left-0 -z-10 w-full overflow-hidden lg:w-[54%]"
      aria-hidden
    >
      <svg
        className="absolute -left-28 top-8 h-[340px] w-[760px] text-primary/35 sm:top-4 lg:top-10"
        viewBox="0 0 980 360"
        fill="none"
      >
        <path
          d="M36 262 C168 164 226 278 330 178 C408 102 486 118 548 92 C656 46 712 110 780 76 C846 44 898 58 944 30"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="9 18"
          className="route-map-line"
        />
        <path
          d="M82 60 C190 30 284 56 360 116 C438 178 510 204 612 172 C724 138 810 164 914 234"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.18"
        />
        {[148, 330, 548, 780, 914].map((x, index) => (
          <g key={x}>
            <circle
              cx={x}
              cy={[188, 178, 92, 76, 234][index]}
              r="13"
              fill="currentColor"
              opacity="0.08"
            />
            <circle
              cx={x}
              cy={[188, 178, 92, 76, 234][index]}
              r="4"
              fill="currentColor"
              opacity="0.72"
            />
          </g>
        ))}
      </svg>
    </div>
  );
}

function MetricStrip({ stats }: { stats: { value: string; label: string }[] }) {
  return (
    <Section className="-mt-2 pb-14">
      <div className="rounded-[22px] border border-border bg-card px-5 py-5 shadow-[0_18px_60px_-42px_rgba(0,0,0,0.45)] md:px-8">
        <div className="grid grid-cols-2 gap-y-5 md:grid-cols-5">
          {stats.map((item, index) => (
            <div
              key={item.label}
              className={cn(
                "px-2 text-center md:px-5",
                index > 0 && "md:border-l md:border-border/70",
              )}
            >
              <div className="font-display text-[25px] font-semibold leading-none text-primary md:text-[31px]">
                {item.value}
              </div>
              <div className="mt-2 text-[12px] leading-snug text-muted-foreground">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

function RouteVisual() {
  const { t } = useTranslation();

  return (
    <div className="relative min-h-[430px] overflow-hidden rounded-[24px] border border-border bg-card shadow-[0_24px_80px_-56px_rgba(0,0,0,0.45)]">
      <TashkentMapPreview className="absolute inset-0 min-h-[430px]" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/96 via-background/34 to-background/92"
      />

      <div className="relative z-10 max-w-[290px] p-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-[11px] font-semibold text-primary">
          <Navigation className="h-3.5 w-3.5" aria-hidden />
          {t("landing.map.visualEyebrow")}
        </div>
        <h3 className="mt-4 font-display text-[25px] font-semibold leading-tight">
          {t("landing.map.visualTitle")}
        </h3>
      </div>

      <div className="pointer-events-none absolute inset-x-4 top-[52%] z-10 h-[180px] -translate-y-1/2 sm:inset-x-8">
        <svg
          className="absolute inset-0 h-full w-full text-primary"
          viewBox="0 0 520 180"
          fill="none"
          aria-hidden
        >
          <path id="route-overlay-path" d="M82 116 C178 48 304 122 438 62" opacity="0" />
          <path
            d="M82 116 C178 48 304 122 438 62"
            stroke="currentColor"
            strokeWidth="4.5"
            strokeDasharray="12 14"
            className="route-map-line"
            opacity="0.84"
          />
          <circle className="route-flow-dot" r="6.5" fill="currentColor">
            <animateMotion dur="5.4s" repeatCount="indefinite" rotate="auto">
              <mpath href="#route-overlay-path" />
            </animateMotion>
          </circle>
        </svg>

        <div className="absolute left-1/2 top-[47%] z-10 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-primary/25 bg-card/95 text-primary shadow-lg shadow-foreground/10 backdrop-blur">
          <Truck className="h-5 w-5" aria-hidden />
        </div>

        {ROUTE_OVERLAY_POINTS.map(({ key, Icon, className }) => (
          <div
            key={key}
            className={cn(
              "route-overlay-point absolute z-20 w-[150px] -translate-x-1/2 -translate-y-1/2 rounded-[16px] border border-border bg-card/95 p-3 shadow-lg shadow-foreground/8 backdrop-blur sm:w-[168px]",
              className,
            )}
          >
            <div className="flex items-center gap-2 text-[12px] font-semibold">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-primary-foreground">
                <Icon className="h-3.5 w-3.5" aria-hidden />
              </span>
              {t(`landing.map.visualOverlay.${key}.title`)}
            </div>
            <p className="mt-1 text-[11.5px] text-muted-foreground">
              {t(`landing.map.visualOverlay.${key}.text`)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ComparisonSection({
  comparison,
}: {
  comparison: {
    beforeTitle: string;
    afterTitle: string;
    before: string[];
    after: string[];
  };
}) {
  const { t } = useTranslation();

  return (
    <Section id="platform" className="py-16">
      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <SectionTitle title={t("landing.why.title")} sub={t("landing.why.subtitle")} />

          <div className="mt-8 grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-stretch">
            <div className="rounded-[20px] border border-red-200 bg-red-50/70 p-5 dark:border-red-500/25 dark:bg-red-500/10">
              <h3 className="text-[17px] font-semibold">{comparison.beforeTitle}</h3>
              <ul className="mt-5 grid gap-3">
                {comparison.before.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[13px] leading-relaxed">
                    <CircleX
                      className="mt-0.5 h-4 w-4 shrink-0 text-red-600 dark:text-red-400"
                      aria-hidden
                    />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid place-items-center">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-primary text-[13px] font-semibold text-primary-foreground shadow-lg shadow-primary/20">
                VS
              </div>
            </div>

            <div className="rounded-[20px] border border-primary/30 bg-primary/5 p-5">
              <h3 className="text-[17px] font-semibold text-primary">{comparison.afterTitle}</h3>
              <ul className="mt-5 grid gap-3">
                {comparison.after.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[13px] leading-relaxed">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <RouteVisual />
      </div>
    </Section>
  );
}

function RolesSection({
  roles,
}: {
  roles: { title: string; description: string; benefit: string }[];
}) {
  const { t } = useTranslation();
  const orderedRoles = ROLE_CARD_ORDER.map((sourceIndex, cardIndex) => ({
    ...roles[sourceIndex],
    Icon: ROLE_CARD_ICONS[cardIndex] ?? ShieldCheck,
    route: ROLE_CARD_LINKS[cardIndex],
  })).filter((role) => role.title);

  return (
    <Section id="roles" className="py-16">
      <SectionTitle title={t("landing.roles.title")} sub={t("landing.roles.subtitle")} center />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {orderedRoles.map(({ title, description, benefit, Icon, route }) => (
          <article
            key={title}
            className="group rounded-[18px] border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-[0_20px_60px_-45px_rgba(0,0,0,0.45)]"
          >
            <div className="flex items-start gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px] border border-primary/20 bg-primary/8 text-primary">
                <Icon className="h-5 w-5" aria-hidden />
              </div>
              <div>
                <h3 className="text-[15px] font-semibold">{title}</h3>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>
            </div>
            <p className="mt-4 rounded-[14px] bg-muted/45 px-3 py-2 text-[12px] leading-relaxed text-muted-foreground">
              {benefit}
            </p>
            {route && (
              <Link
                to={route}
                className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-primary hover:opacity-80"
              >
                {t("landing.roles.detailCta")}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            )}
          </article>
        ))}
      </div>
    </Section>
  );
}

function SearchAudienceSection({
  items,
}: {
  items: { title: string; text: string; tags: string[] }[];
}) {
  const { t } = useTranslation();

  return (
    <Section className="py-16">
      <div className="grid gap-8 lg:grid-cols-[0.45fr_0.55fr] lg:items-start">
        <SectionTitle
          eyebrow={t("landing.searchAudience.eyebrow")}
          title={t("landing.searchAudience.title")}
          sub={t("landing.searchAudience.subtitle")}
        />

        <div className="grid gap-3 sm:grid-cols-2">
          {items.map((item, index) => {
            const Icon = AUDIENCE_ICONS[index] ?? Store;

            return (
              <article
                key={item.title}
                className="rounded-[18px] border border-border bg-card p-5 shadow-[0_18px_60px_-48px_rgba(0,0,0,0.45)]"
              >
                <div className="grid h-10 w-10 place-items-center rounded-[14px] bg-primary/8 text-primary">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="mt-4 text-[15px] font-semibold">{item.title}</h3>
                <p className="mt-2 text-[12.5px] leading-relaxed text-muted-foreground">
                  {item.text}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-primary/20 bg-primary/7 px-2.5 py-1 text-[11px] font-medium text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

function ProcessSection({ steps }: { steps: { title: string; text: string }[] }) {
  const { t } = useTranslation();

  return (
    <Section id="workflow" className="py-16">
      <SectionTitle title={t("landing.process.title")} sub={t("landing.process.subtitle")} center />

      <div className="relative mt-12">
        <div className="absolute left-[8%] right-[8%] top-7 hidden border-t border-dashed border-primary/35 md:block" />
        <div className="grid gap-6 md:grid-cols-5">
          {steps.map((step, index) => {
            const Icon = PROCESS_ICONS[index] ?? ClipboardCheck;
            return (
              <div key={step.title} className="relative text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-primary/25 bg-card text-primary shadow-[0_14px_40px_-26px_rgba(0,0,0,0.45)]">
                  <Icon className="h-6 w-6" aria-hidden />
                </div>
                <div className="mt-4 text-[12px] font-semibold text-primary">
                  {index + 1}. {step.title}
                </div>
                <p className="mx-auto mt-2 max-w-[190px] text-[12px] leading-relaxed text-muted-foreground">
                  {step.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

function ProofStrip({ items }: { items: { title: string; text: string }[] }) {
  return (
    <Section className="py-10">
      <div className="grid gap-3 rounded-[22px] border border-border bg-card p-4 md:grid-cols-4 md:p-5">
        {items.map((item, index) => {
          const Icon = PROOF_ICONS[index] ?? ShieldCheck;
          return (
            <div key={item.title} className="flex gap-3 px-2 py-2">
              <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/8 text-primary">
                <Icon className="h-4.5 w-4.5" aria-hidden />
              </div>
              <div>
                <h3 className="text-[13px] font-semibold">{item.title}</h3>
                <p className="mt-1 text-[11.5px] leading-relaxed text-muted-foreground">
                  {item.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

function WarehouseAndMapSections() {
  const { t } = useTranslation();

  return (
    <>
      <Section id="ombor" className="py-16">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
          <div>
            <SectionTitle
              title={t("landing.warehouse.title")}
              sub={t("landing.warehouse.subtitle")}
            />
            <div className="mt-6">
              <CTAButton href={ROUTES.forWarehouses}>
                {t("landing.roles.detailCta")} <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </CTAButton>
            </div>
          </div>
          <WarehouseBookingDemo />
        </div>
      </Section>

      <Section id="xarita" className="py-16">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
          <div>
            <SectionTitle title={t("landing.map.title")} sub={t("landing.map.subtitle")} />
            <div className="mt-6 flex flex-wrap gap-3">
              <CTAButton href={ROUTES.preRegistration} primary>
                {t("nav.registerCta")} <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </CTAButton>
              <CTAButton href={ROUTES.contact}>{t("nav.contact")}</CTAButton>
            </div>
          </div>
          <div className="rounded-[22px] border border-border bg-card p-3 shadow-[0_20px_70px_-52px_rgba(0,0,0,0.45)]">
            <WarehouseMapSection />
          </div>
        </div>
      </Section>
    </>
  );
}

function Landing() {
  const { t, tRaw } = useTranslation();
  const faqItems = useFaqItems();
  const heroRef = useRef<HTMLDivElement>(null);
  const hash = useRouterState({ select: (state) => state.location.hash });

  const stats = tRaw<{ value: string; label: string }[]>("landing.stats");
  const roles =
    tRaw<{ title: string; description: string; benefit: string }[]>("landing.roles.items");
  const searchAudience = tRaw<{ title: string; text: string; tags: string[] }[]>(
    "landing.searchAudience.items",
  );
  const comparison = tRaw<{
    beforeTitle: string;
    afterTitle: string;
    before: string[];
    after: string[];
  }>("landing.comparison");
  const proofItems = tRaw<{ title: string; text: string }[]>("landing.proof.items");
  const processSteps = tRaw<{ title: string; text: string }[]>("landing.process.steps");

  useEffect(() => {
    if (hash) scrollToHash(`#${hash}`);
  }, [hash]);

  useEffect(() => {
    if (!heroRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        "[data-landing-reveal]",
        { y: 22, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.72, stagger: 0.08, ease: "power3.out" },
      );
    }, heroRef);

    return () => context.revert();
  }, []);

  return (
    <PublicShell>
      <PageMeta page="home" faqItems={faqItems} />

      <div ref={heroRef} className="relative isolate overflow-hidden border-b border-border/60">
        <HeroRouteMap />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(70%_50%_at_12%_24%,color-mix(in_oklab,var(--primary)_12%,transparent)_0%,transparent_62%),linear-gradient(180deg,#ffffff_0%,var(--background)_100%)]"
        />

        <Section className="relative min-h-[calc(100vh-74px)] pt-14 pb-12 md:pt-20 lg:flex lg:items-center">
          <div className="grid w-full items-center gap-10 lg:grid-cols-[0.76fr_1.24fr]">
            <div>
              <h1
                data-landing-reveal
                className="font-display text-[50px] font-semibold leading-[0.98] tracking-tight text-foreground md:text-[76px] lg:text-[82px]"
              >
                {t("hero.title")}
              </h1>

              <p
                data-landing-reveal
                className="mt-5 max-w-lg text-[17px] leading-relaxed text-muted-foreground md:text-[18px]"
              >
                {t("hero.subtitle")}
              </p>

              <div data-landing-reveal className="mt-7 flex flex-wrap gap-3">
                <CTAButton href={ROUTES.preRegistration} primary>
                  {t("nav.registerCta")} <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </CTAButton>
                <CTAButton href="#roles">
                  {t("hero.rolesCta")} <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </CTAButton>
              </div>

              <div data-landing-reveal className="mt-6">
                <PromoBadge />
              </div>

              <div
                data-landing-reveal
                className="mt-8 grid max-w-lg gap-3 text-[12px] text-muted-foreground sm:grid-cols-3"
              >
                {[
                  { icon: RouteIcon, label: t("hero.secure") },
                  { icon: CheckCircle2, label: t("hero.rolesCount") },
                  { icon: ShieldCheck, label: t("hero.warehouse") },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2">
                    <Icon className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div data-landing-reveal>
              <SellerDashboardHero />
            </div>
          </div>
        </Section>
      </div>

      <MetricStrip stats={stats} />
      <ComparisonSection comparison={comparison} />
      <SearchAudienceSection items={searchAudience} />
      <RolesSection roles={roles} />
      <ProcessSection steps={processSteps} />
      <WarehouseAndMapSections />
      <ProofStrip items={proofItems} />

      <Section className="py-16">
        <CTABlockLight />
      </Section>

      <Section id="faq" className="py-16">
        <div className="grid gap-8 lg:grid-cols-[0.42fr_0.58fr] lg:items-start">
          <div className="rounded-[24px] border border-primary/20 bg-primary/8 p-6">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <CheckCircle2 className="h-5 w-5" aria-hidden />
            </div>
            <h2 className="mt-5 font-display text-[32px] font-semibold leading-tight md:text-[42px]">
              {t("landing.faq.title")}
            </h2>
            <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
              {t("landing.faq.subtitle")}
            </p>
            <div className="mt-6 rounded-[16px] border border-border bg-card px-4 py-3 text-[12px] text-muted-foreground">
              {t("landing.faq.visualText")}
            </div>
          </div>

          <div className="space-y-3">
            {faqItems.map((item, index) => (
              <details
                key={item.question}
                className="group rounded-[18px] border border-border bg-card p-0 shadow-[0_14px_50px_-44px_rgba(0,0,0,0.45)]"
              >
                <summary className="flex cursor-pointer list-none items-center gap-4 p-5 marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/8 text-[12px] font-semibold text-primary">
                    {index + 1}
                  </span>
                  <span className="flex-1 text-[15px] font-semibold">{item.question}</span>
                  <ChevronDown
                    className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
                    aria-hidden
                  />
                </summary>
                <div className="border-t border-border px-5 pb-5 pt-4">
                  <p className="text-[13.5px] leading-relaxed text-muted-foreground">
                    {item.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </Section>
    </PublicShell>
  );
}
