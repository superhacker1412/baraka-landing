import { Link } from "@tanstack/react-router";
import { ArrowRight, FileText, MessageCircle, Shield, Sparkles, type LucideIcon } from "lucide-react";
import { Section, SectionTitle } from "@/components/PublicShell";
import { useTranslation } from "@/lib/i18n";
import { ROUTES } from "@/lib/routes";

const FEATURE_ICONS: LucideIcon[] = [FileText, Shield, MessageCircle, Sparkles];

export function ComingSoonSection() {
  const { t, tRaw } = useTranslation();
  const items = tRaw<{ title: string; text: string }[]>("landing.comingSoon.items");

  return (
    <Section id="coming-soon" className="py-14 pb-20">
      <SectionTitle
        eyebrow={t("landing.comingSoon.eyebrow")}
        title={t("landing.comingSoon.title")}
        sub={t("landing.comingSoon.subtitle")}
        center
      />

      <div
        className="relative mt-10 overflow-hidden rounded-[2rem] p-6 text-white shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)] md:p-10"
        style={{
          background:
            "radial-gradient(100% 80% at 0% 0%, #1e3a8a 0%, transparent 55%), radial-gradient(90% 70% at 100% 100%, #6610f2 0%, transparent 60%), linear-gradient(135deg, #050816 0%, #0b1226 55%, #0a0a1a 100%)",
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 80% 70%, white 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative grid gap-4 sm:grid-cols-2">
          {items.map((item, index) => {
            const Icon = FEATURE_ICONS[index] ?? Sparkles;
            return (
              <article
                key={item.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/10">
                    <Icon className="h-5 w-5 text-white" aria-hidden />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-[15px] font-semibold text-white">{item.title}</h3>
                      <span className="rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white/70">
                        {t("landing.comingSoon.badge")}
                      </span>
                    </div>
                    <p className="mt-2 text-[13px] leading-relaxed text-white/70">{item.text}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="relative mt-8 rounded-2xl border border-white/15 bg-white/5 p-6 text-center backdrop-blur-sm md:p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-white/80">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            {t("landing.comingSoon.ctaEyebrow")}
          </div>
          <h3 className="mt-4 font-display text-[22px] font-semibold tracking-tight text-white md:text-[28px]">
            {t("landing.comingSoon.ctaTitle")}
          </h3>
          <p className="mx-auto mt-3 max-w-2xl text-[14px] leading-relaxed text-white/70">
            {t("landing.comingSoon.ctaText")}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              to={ROUTES.preRegistration}
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-6 py-3 text-[14px] font-semibold text-slate-900 shadow-lg hover:opacity-90"
            >
              {t("landing.comingSoon.registerCta")} <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              to={ROUTES.feedback}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/5 px-6 py-3 text-[14px] font-medium text-white backdrop-blur hover:bg-white/10"
            >
              {t("landing.comingSoon.applyCta")}
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}
