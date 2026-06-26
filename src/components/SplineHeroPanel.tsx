import { useEffect, useRef } from "react";
import {
  Boxes,
  CheckCircle2,
  MapPin,
  PackageCheck,
  PenLine,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { gsap } from "gsap";
import { useTranslation } from "@/lib/i18n";

export function SplineHeroPanel() {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);

  const warehouses = [
    [t("hero.panelWarehouseTashkent"), "32%"],
    [t("hero.panelWarehouseAndijan"), "48%"],
    [t("hero.panelWarehouseFergana"), "21%"],
  ] as const;

  useEffect(() => {
    if (!ref.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-hero-card]",
        { y: 18, opacity: 0, scale: 0.97 },
        { y: 0, opacity: 1, scale: 1, duration: 0.72, stagger: 0.08, ease: "power3.out" },
      );

      gsap.to("[data-hero-route]", {
        strokeDashoffset: -42,
        duration: 4.5,
        repeat: -1,
        ease: "none",
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      className="relative min-h-[460px] overflow-hidden rounded-[24px] border border-border bg-card shadow-2xl shadow-foreground/8"
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
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            "linear-gradient(36deg, transparent 47%, color-mix(in oklab, var(--border) 70%, transparent) 48%, transparent 49%), linear-gradient(118deg, transparent 47%, color-mix(in oklab, var(--border) 70%, transparent) 48%, transparent 49%)",
          backgroundSize: "82px 82px",
          maskImage:
            "linear-gradient(180deg, transparent 0%, black 24%, black 78%, transparent 100%)",
        }}
      />

      <svg
        aria-hidden
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 620 460"
        preserveAspectRatio="none"
      >
        <path
          data-hero-route
          d="M420 84 C500 92 525 144 486 189 L410 276 C372 319 425 374 532 386"
          fill="none"
          stroke="var(--primary)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray="18 24"
        />
      </svg>

      <div className="relative z-10 min-h-[460px] p-5">
        <div
          data-hero-card
          className="absolute left-5 top-6 w-[215px] rounded-2xl border border-border bg-card/94 p-4 shadow-xl shadow-foreground/10 backdrop-blur"
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="font-semibold">{t("hero.panelOrder")} #12548</div>
            <div className="rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-semibold text-success">
              {t("hero.panelNew")}
            </div>
          </div>
          {[
            [t("hero.panelProducts"), "12"],
            [t("hero.panelQuantity"), "34"],
            [t("hero.panelDeliveryDate"), "25.05.2025"],
            [t("hero.panelAddress"), "Toshkent"],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4 py-1 text-[12px]">
              <span className="text-muted-foreground">{label}</span>
              <span className="font-medium">{value}</span>
            </div>
          ))}
        </div>

        <div
          data-hero-card
          className="absolute bottom-8 left-8 w-[285px] rounded-2xl border border-border bg-card/94 p-4 shadow-xl shadow-foreground/10 backdrop-blur"
        >
          <div className="mb-3 flex items-center gap-2 text-[13px] font-semibold">
            <Boxes className="h-4 w-4 text-primary" aria-hidden />
            {t("hero.panelWarehouses")}
          </div>
          <div className="grid gap-3">
            {warehouses.map(([name, value]) => (
              <div key={name}>
                <div className="mb-1 flex items-center justify-between gap-3 text-[12px]">
                  <span className="font-medium">{name}</span>
                  <span className="text-muted-foreground">{value}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: value }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          data-hero-card
          className="absolute right-5 top-16 hidden w-[118px] rounded-2xl border border-border bg-card/90 p-3 text-center shadow-lg backdrop-blur sm:block"
        >
          <MapPin className="mx-auto h-7 w-7 text-primary" fill="currentColor" aria-hidden />
          <div className="mt-2 text-[11px] font-semibold">{t("hero.panelWarehouse")}</div>
        </div>

        <div
          data-hero-card
          className="absolute right-6 bottom-7 w-[190px] rounded-2xl border border-border bg-card/94 p-4 shadow-xl shadow-foreground/10 backdrop-blur"
        >
          <div className="mb-3 flex items-center gap-2 text-success">
            <CheckCircle2 className="h-4 w-4" aria-hidden />
            <span className="text-[13px] font-semibold">{t("hero.panelDelivered")}</span>
          </div>
          <div className="rounded-xl border border-border bg-background p-3">
            <div className="mb-3 flex items-center gap-2">
              <Truck className="h-4 w-4 text-primary" aria-hidden />
              <span className="text-[12px] font-medium">{t("hero.panelCourier")}</span>
            </div>
            <div className="h-10 rounded-lg bg-muted" aria-hidden />
            <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
              <PenLine className="h-3.5 w-3.5" aria-hidden />
              {t("hero.panelSignature")}
            </div>
          </div>
        </div>

        <div
          data-hero-card
          className="absolute right-[168px] top-[190px] grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25"
        >
          <PackageCheck className="h-6 w-6" aria-hidden />
        </div>

        <div
          data-hero-card
          className="absolute left-5 right-5 top-auto bottom-0 flex items-center gap-2 rounded-2xl border border-border bg-card/92 p-3 shadow-sm backdrop-blur sm:left-auto sm:right-[232px] sm:w-[245px]"
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
