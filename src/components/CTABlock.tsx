import { Link } from "@tanstack/react-router";
import { ArrowRight, Gift } from "lucide-react";
import { CTAButton } from "@/components/PublicShell";
import { useTranslation } from "@/lib/i18n";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

type PromoBadgeProps = {
  className?: string;
  size?: "md" | "lg";
  variant?: "light" | "dark";
};

export function PromoBadge({ className = "", size = "md", variant = "light" }: PromoBadgeProps) {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full font-semibold",
        variant === "light"
          ? "border-success/35 bg-success/10 text-success"
          : "border-white/35 bg-white/10 text-white",
        size === "md" &&
          "gap-2 border px-4 py-1.5 text-[13px] md:text-[14px] [&_svg]:h-4 [&_svg]:w-4",
        size === "lg" &&
          "gap-2.5 border-2 px-5 py-2.5 text-[15px] shadow-[0_8px_24px_-8px_rgba(15,143,97,0.35)] md:gap-3 md:px-7 md:py-3.5 md:text-[18px] [&_svg]:h-5 [&_svg]:w-5 md:[&_svg]:h-6 md:[&_svg]:w-6",
        className,
      )}
    >
      <Gift className="shrink-0" aria-hidden />
      {t("hero.promo")}
    </div>
  );
}

type CTABlockProps = {
  id?: string;
  className?: string;
};

export function CTABlock({ id, className = "" }: CTABlockProps) {
  const { t } = useTranslation();

  return (
    <div
      id={id}
      className={`relative overflow-hidden rounded-[2rem] p-8 text-white shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)] md:p-12 ${className}`}
      style={{
        background:
          "radial-gradient(120% 80% at 0% 0%, color-mix(in oklab, var(--primary) 42%, transparent) 0%, transparent 56%), radial-gradient(120% 80% at 100% 100%, rgba(255,255,255,0.1) 0%, transparent 58%), linear-gradient(135deg, #06130f 0%, #0a1f19 58%, #050b09 100%)",
      }}
    >
      <div className="relative max-w-2xl">
        <h3 className="font-display text-[28px] font-semibold leading-[1.1] tracking-tight text-white md:text-[40px]">
          {t("cta.title")}
        </h3>
        <p className="mt-3 text-[14px] text-white/70 md:text-[15px]">{t("cta.subtitle")}</p>
        <PromoBadge size="lg" variant="dark" className="mt-5" />
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            to={ROUTES.preRegistration}
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-6 py-3 text-[14px] font-semibold text-slate-900 shadow-lg hover:opacity-90"
          >
            {t("nav.registerCta")} <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link
            to={ROUTES.feedback}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/5 px-6 py-3 text-[14px] font-medium text-white backdrop-blur hover:bg-white/10"
          >
            {t("nav.feedbackCta")}
          </Link>
        </div>
      </div>
    </div>
  );
}

export function CTABlockLight({ id }: { id?: string }) {
  const { t } = useTranslation();

  return (
    <div id={id} className="surface rounded-3xl p-8 text-center md:p-10">
      <h3 className="font-display text-[24px] font-semibold tracking-tight md:text-[32px]">
        {t("cta.title")}
      </h3>
      <p className="mx-auto mt-3 max-w-xl text-[14px] text-muted-foreground md:text-[15px]">
        {t("cta.subtitleLight")}
      </p>
      <PromoBadge size="lg" className="mx-auto mt-6" />
      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        <CTAButton href={ROUTES.preRegistration} primary>
          {t("nav.registerCta")} <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </CTAButton>
        <CTAButton href={ROUTES.feedback}>{t("nav.feedbackCta")}</CTAButton>
      </div>
    </div>
  );
}
