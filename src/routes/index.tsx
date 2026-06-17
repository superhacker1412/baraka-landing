import { createFileRoute } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowRight,
  Building2,
  CheckCircle2,
  ClipboardList,
  Crown,
  Lightbulb,
  Link2,
  Package,
  Shield,
  ShoppingBag,
  Store,
  Truck,
  UserCog,
  Warehouse,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { gsap } from "gsap";
import { CTABlockLight, PromoBadge } from "@/components/CTABlock";
import { PageMeta, useFaqItems } from "@/components/PageMeta";
import { PublicShell, Section, SectionTitle, CTAButton, Eyebrow } from "@/components/PublicShell";
import { SplineHeroPanel } from "@/components/SplineHeroPanel";
import { WarehouseBookingDemo } from "@/components/WarehouseBookingDemo";
import { ComingSoonSection } from "@/components/ComingSoonSection";
import { MapPartnerCTAs } from "@/components/MapPartnerCTAs";
import { WarehouseMapSection } from "@/components/WarehouseMapSection";
import { useTranslation } from "@/lib/i18n";
import { ROUTES } from "@/lib/routes";
import { buildSeoMeta } from "@/lib/seo";
import { scrollToHash } from "@/lib/scroll";
import { cn } from "@/lib/utils";

const ROLE_ICONS: LucideIcon[] = [
  Shield,
  Crown,
  UserCog,
  Store,
  Truck,
  Warehouse,
  Package,
  ClipboardList,
  ShoppingBag,
];

const WORKFLOW_ICONS: LucideIcon[] = [ShoppingBag, Crown, Warehouse, Truck, ClipboardList];

export const Route = createFileRoute("/")({
  head: () => buildSeoMeta({ locale: "uz", page: "home" }),
  component: Landing,
});

function Landing() {
  const { t, tRaw } = useTranslation();
  const faqItems = useFaqItems();
  const heroRef = useRef<HTMLDivElement>(null);
  const hash = useRouterState({ select: (state) => state.location.hash });
  const workflowItems =
    tRaw<
      { id: string; title: string; summary: string; steps: { title: string; text: string }[] }[]
    >("landing.workflow.items");
  const [activeWorkflowId, setActiveWorkflowId] = useState(workflowItems[0]?.id ?? "xaridor");
  const activeWorkflow =
    workflowItems.find((role) => role.id === activeWorkflowId) ?? workflowItems[0];

  const stats = tRaw<{ value: string; label: string }[]>("landing.stats");
  const aboutCards = tRaw<{ title: string; text: string }[]>("landing.about.cards");
  const roles =
    tRaw<{ title: string; description: string; benefit: string }[]>("landing.roles.items");
  const painPoints = tRaw<string[]>("landing.why.painPoints");
  const solutions = tRaw<{ pain: string; solution: string }[]>("landing.why.solutions");
  const connectionRoles = tRaw<string[]>("landing.connections.roles");
  const connections = tRaw<{ from: string; to: string; label: string }[]>(
    "landing.connections.items",
  );

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

      gsap.to("[data-landing-float]", {
        y: -8,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, heroRef);

    return () => context.revert();
  }, []);

  return (
    <PublicShell>
      <PageMeta page="home" faqItems={faqItems} />

      <div ref={heroRef} className="relative isolate overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(80% 60% at 15% 20%, color-mix(in oklab, var(--info) 18%, transparent) 0%, transparent 60%), radial-gradient(70% 55% at 85% 30%, color-mix(in oklab, var(--purple) 16%, transparent) 0%, transparent 65%), linear-gradient(180deg, var(--background) 0%, color-mix(in oklab, var(--info) 4%, var(--background)) 50%, var(--background) 100%)",
          }}
        />

        <Section className="relative pt-14 pb-16 md:pt-24 md:pb-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <div data-landing-reveal className="flex flex-wrap items-center gap-2">
                <Eyebrow>
                  <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                  {t("hero.eyebrow")}
                </Eyebrow>
                <PromoBadge />
              </div>

              <h1
                data-landing-reveal
                className="mt-5 font-display text-[38px] font-semibold leading-[1.05] tracking-tight md:text-[58px]"
              >
                {t("hero.titleBefore")}{" "}
                <span className="bg-gradient-to-r from-primary to-info bg-clip-text text-transparent">
                  {t("hero.titleHighlight")}
                </span>
                {t("hero.titleAfter") ? ` ${t("hero.titleAfter")}` : ""}
              </h1>

              <p data-landing-reveal className="mt-5 max-w-xl text-[16px] text-muted-foreground">
                {t("hero.subtitle")}
              </p>

              <div data-landing-reveal className="mt-7 flex flex-wrap gap-3">
                <CTAButton href={ROUTES.preRegistration} primary>
                  {t("nav.registerCta")} <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </CTAButton>
                <CTAButton href={ROUTES.feedback}>{t("nav.feedbackCta")}</CTAButton>
              </div>

              <div
                data-landing-reveal
                className="mt-7 flex flex-wrap items-center gap-4 text-[11.5px] text-muted-foreground"
              >
                <span className="inline-flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5" aria-hidden />
                  {t("hero.secure")}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-success" aria-hidden />
                  {t("hero.rolesCount")}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5" aria-hidden />
                  {t("hero.warehouse")}
                </span>
              </div>
            </div>

            <div data-landing-reveal data-landing-float>
              <SplineHeroPanel />
            </div>
          </div>
        </Section>
      </div>

      <Section className="pb-12">
        <div className="surface rounded-3xl p-6 md:p-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-5">
            {stats.map((item) => (
              <div key={item.label} className="text-center md:text-left">
                <div className="font-display text-[28px] font-semibold tracking-tight md:text-[36px]">
                  {item.value}
                </div>
                <div className="mt-1 text-[12px] text-muted-foreground">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section id="about" className="py-14">
        <SectionTitle
          eyebrow={t("landing.about.eyebrow")}
          title={t("landing.about.title")}
          sub={t("landing.about.subtitle")}
        />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {aboutCards.map((item) => (
            <div key={item.title} className="surface rounded-2xl p-5">
              <div className="text-[15px] font-semibold">{item.title}</div>
              <p className="mt-2 text-[13.5px] text-muted-foreground">{item.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="py-8">
        <CTABlockLight />
      </Section>

      <Section id="roles" className="py-14">
        <SectionTitle
          eyebrow={t("landing.roles.eyebrow")}
          title={t("landing.roles.title")}
          sub={t("landing.roles.subtitle")}
          center
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map((role, index) => {
            const Icon = ROLE_ICONS[index] ?? Shield;
            return (
              <article key={role.title} className="surface rounded-2xl p-5">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary/20 to-info/10">
                  <Icon className="h-5 w-5 text-primary" aria-hidden />
                </div>
                <h3 className="mt-3 text-[15px] font-semibold">{role.title}</h3>
                <p className="mt-2 text-[13px] text-muted-foreground">{role.description}</p>
                <div className="mt-3 rounded-xl bg-muted/50 px-3 py-2 text-[12px]">
                  <span className="font-medium text-foreground">{t("common.benefitPrefix")} </span>
                  {role.benefit}
                </div>
              </article>
            );
          })}
        </div>
      </Section>

      <Section id="ombor" className="py-14">
        <SectionTitle
          eyebrow={t("landing.warehouse.eyebrow")}
          title={t("landing.warehouse.title")}
          sub={t("landing.warehouse.subtitle")}
        />
        <div className="mt-6">
          <WarehouseBookingDemo />
        </div>
      </Section>

      <Section id="xarita" className="py-14">
        <SectionTitle
          eyebrow={t("landing.map.eyebrow")}
          title={t("landing.map.title")}
          sub={t("landing.map.subtitle")}
          center
        />
        <div className="mt-10 surface rounded-3xl p-4 md:p-6">
          <WarehouseMapSection />
          <MapPartnerCTAs />
        </div>
      </Section>

      <Section id="workflow" className="py-14">
        <SectionTitle
          eyebrow={t("landing.workflow.eyebrow")}
          title={t("landing.workflow.title")}
          sub={t("landing.workflow.subtitle")}
          center
        />
        <div className="mt-10 surface rounded-3xl p-4 md:p-6">
          <div
            className="flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            role="tablist"
            aria-label={t("landing.workflow.tabsAria")}
          >
            {workflowItems.map((role, index) => {
              const Icon = WORKFLOW_ICONS[index] ?? ClipboardList;
              return (
                <button
                  key={role.id}
                  type="button"
                  role="tab"
                  aria-selected={activeWorkflowId === role.id}
                  onClick={() => setActiveWorkflowId(role.id)}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-medium transition-colors",
                    activeWorkflowId === role.id
                      ? "bg-foreground text-background"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted",
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                  {role.title}
                </button>
              );
            })}
          </div>

          <div className="mt-6" role="tabpanel">
            <p className="text-[13.5px] text-muted-foreground">{activeWorkflow.summary}</p>
            <ol className="mt-6 space-y-0">
              {activeWorkflow.steps.map((step, index) => (
                <li key={step.title} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/10 text-[13px] font-bold text-primary">
                      {index + 1}
                    </div>
                    {index < activeWorkflow.steps.length - 1 && (
                      <div className="my-2 w-px flex-1 min-h-6 bg-border" />
                    )}
                  </div>
                  <div className={cn("pb-5", index === activeWorkflow.steps.length - 1 && "pb-0")}>
                    <h3 className="text-[14px] font-semibold">{step.title}</h3>
                    <p className="mt-1 text-[13px] text-muted-foreground">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Section>

      <Section id="why" className="py-14">
        <SectionTitle
          eyebrow={t("landing.why.eyebrow")}
          title={t("landing.why.title")}
          sub={t("landing.why.subtitle")}
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="surface rounded-3xl p-6">
            <div className="flex items-center gap-2 text-warning">
              <AlertCircle className="h-5 w-5" aria-hidden />
              <h3 className="text-[16px] font-semibold">{t("landing.why.problemsTitle")}</h3>
            </div>
            <ul className="mt-4 space-y-2">
              {painPoints.map((pain) => (
                <li key={pain} className="flex items-start gap-2 text-[13px]">
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-warning"
                    aria-hidden
                  />
                  {pain}
                </li>
              ))}
            </ul>
          </div>
          <div className="surface rounded-3xl p-6">
            <div className="flex items-center gap-2 text-success">
              <Lightbulb className="h-5 w-5" aria-hidden />
              <h3 className="text-[16px] font-semibold">{t("landing.why.solutionsTitle")}</h3>
            </div>
            <ul className="mt-4 space-y-3">
              {solutions.map((item) => (
                <li key={item.pain} className="rounded-xl bg-muted/40 p-3">
                  <div className="text-[12px] text-muted-foreground">{item.pain}</div>
                  <div className="mt-1 text-[13px] font-medium">{item.solution}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section id="faq" className="py-14">
        <SectionTitle
          eyebrow={t("landing.faq.eyebrow")}
          title={t("landing.faq.title")}
          sub={t("landing.faq.subtitle")}
          center
        />
        <div className="mx-auto mt-10 max-w-3xl space-y-3">
          {faqItems.map((item) => (
            <details key={item.question} className="surface group rounded-2xl p-5">
              <summary className="cursor-pointer list-none text-[15px] font-semibold marker:content-none [&::-webkit-details-marker]:hidden">
                {item.question}
              </summary>
              <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </Section>

      <Section id="connections" className="py-14">
        <SectionTitle
          eyebrow={t("landing.connections.eyebrow")}
          title={t("landing.connections.title")}
          sub={t("landing.connections.subtitle")}
          center
        />
        <div className="mt-10 surface rounded-3xl p-6 md:p-8">
          <div className="flex flex-col items-center gap-4 md:flex-row md:flex-wrap md:justify-center">
            {connectionRoles.map((role, i, arr) => (
              <div key={role} className="flex items-center gap-3">
                <div
                  className={cn(
                    "rounded-2xl border border-border bg-card px-4 py-3 text-center text-[13px] font-semibold shadow-sm",
                    i === 1 && "border-primary/40 bg-primary/5",
                  )}
                >
                  {role}
                </div>
                {i < arr.length - 1 && (
                  <ArrowRight
                    className="hidden h-4 w-4 text-muted-foreground md:block"
                    aria-hidden
                  />
                )}
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-center gap-2 text-[12px] text-muted-foreground">
            <Building2 className="h-4 w-4" aria-hidden />
            <span>{t("landing.connections.summary")}</span>
          </div>
          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            {connections.map((conn) => (
              <div
                key={conn.from + conn.to}
                className="flex items-center gap-2 rounded-xl bg-muted/40 px-3 py-2 text-[12px]"
              >
                <Link2 className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
                <span>
                  <strong>{conn.from}</strong> → <strong>{conn.to}</strong>: {conn.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section id="example" className="py-14">
        <SectionTitle
          eyebrow={t("landing.example.eyebrow")}
          title={t("landing.example.title")}
          sub={t("landing.example.subtitle")}
        />
        <div className="mt-8 surface rounded-3xl p-6 md:p-8">
          <div className="space-y-4 text-[14px] leading-relaxed text-muted-foreground">
            <p>{t("landing.example.p1")}</p>
            <p>{t("landing.example.p2")}</p>
            <p>{t("landing.example.p3")}</p>
            <p>{t("landing.example.p4")}</p>
          </div>
        </div>
      </Section>

      <ComingSoonSection />
    </PublicShell>
  );
}
