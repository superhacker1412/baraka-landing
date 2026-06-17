import { useEffect, useRef } from "react";
import { Boxes, CheckCircle2, Route, ShieldCheck, Truck } from "lucide-react";
import { gsap } from "gsap";
import { useTranslation } from "@/lib/i18n";

export function SplineHeroPanel() {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);

  const operationCards = [
    { title: t("hero.panelOrder"), value: "SL-24108", Icon: CheckCircle2, tone: "text-success" },
    { title: t("hero.panelWarehouse"), value: "Sergeli Hub", Icon: Boxes, tone: "text-info" },
    {
      title: t("hero.panelCourier"),
      value: t("hero.panelOnRoad"),
      Icon: Truck,
      tone: "text-purple",
    },
    { title: t("hero.panelRoute"), value: "12.8 km", Icon: Route, tone: "text-gold" },
  ];

  const stats = [
    [t("hero.panelSales"), "18.4M"],
    [t("hero.panelBooking"), "42 m2"],
    [t("hero.panelDelivery"), "12"],
  ] as const;

  useEffect(() => {
    if (!ref.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-hero-chip]",
        { y: 18, opacity: 0, scale: 0.96 },
        { y: 0, opacity: 1, scale: 1, duration: 0.75, stagger: 0.08, ease: "power3.out" },
      );

      gsap.to("[data-hero-track]", {
        xPercent: -18,
        duration: 18,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      className="relative min-h-[420px] overflow-hidden rounded-[24px] border border-border bg-card shadow-2xl"
      aria-label={t("hero.panelLiveMap")}
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(145deg, color-mix(in oklab, var(--background) 90%, var(--info)) 0%, var(--card) 48%, color-mix(in oklab, var(--background) 90%, var(--success)) 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.25]"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "42px 42px",
          maskImage:
            "linear-gradient(180deg, transparent 0%, black 24%, black 78%, transparent 100%)",
        }}
      />

      <div className="relative z-10 grid min-h-[420px] grid-rows-[auto_1fr_auto] gap-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <div
            data-hero-chip
            className="rounded-full border border-border bg-card/90 px-3 py-1.5 text-[11px] font-semibold shadow-sm backdrop-blur"
          >
            {t("hero.panelLiveMap")}
          </div>
          <div
            data-hero-chip
            className="rounded-full bg-success/10 px-3 py-1.5 text-[11px] font-semibold text-success shadow-sm backdrop-blur"
          >
            {t("hero.panelHistory")}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[20px] border border-border bg-background/70 p-4 shadow-sm backdrop-blur">
          <div data-hero-track className="absolute left-0 top-8 flex w-[140%] gap-3" aria-hidden>
            {operationCards.map(({ title, value, Icon, tone }) => (
              <div
                key={title}
                className="w-44 shrink-0 rounded-2xl border border-border bg-card/90 p-4 shadow-sm backdrop-blur"
              >
                <Icon className={`h-5 w-5 ${tone}`} />
                <div className="mt-4 text-[11px] uppercase text-muted-foreground">{title}</div>
                <div className="mt-1 truncate text-[16px] font-semibold">{value}</div>
              </div>
            ))}
          </div>

          <div className="absolute bottom-5 left-5 right-5 grid grid-cols-3 gap-3">
            {stats.map(([label, value]) => (
              <div
                key={label}
                className="rounded-xl border border-border bg-card/90 p-3 shadow-sm backdrop-blur"
              >
                <div className="text-[10.5px] text-muted-foreground">{label}</div>
                <div className="mt-1 text-[17px] font-semibold">{value}</div>
              </div>
            ))}
          </div>
        </div>

        <div
          data-hero-chip
          className="flex items-center gap-2 rounded-2xl border border-border bg-card/90 p-3 shadow-sm backdrop-blur"
        >
          <ShieldCheck className="h-4 w-4 shrink-0 text-success" aria-hidden />
          <div className="min-w-0">
            <div className="truncate text-[12.5px] font-semibold">{t("hero.panelProofTitle")}</div>
            <div className="truncate text-[11px] text-muted-foreground">
              {t("hero.panelProofText")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
