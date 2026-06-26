import { useTranslation } from "@/lib/i18n";

const SELLER_DASHBOARD_SRC = "/images/dashboard.png";

export function SellerDashboardHero() {
  const { t } = useTranslation();

  return (
    <div
      className="relative overflow-hidden rounded-[24px] border border-border bg-card shadow-[0_34px_100px_-62px_rgba(0,0,0,0.6)]"
      aria-label={t("hero.panelSellerCabinet")}
    >
      <div className="border-b border-border bg-foreground px-4 py-3 text-background">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" aria-hidden />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-300" aria-hidden />
            <span className="h-2.5 w-2.5 rounded-full bg-green-400" aria-hidden />
          </div>
          <div className="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-[11px] font-medium text-white/85">
            {t("hero.panelSellerCabinet")}
          </div>
        </div>
      </div>

      <div className="relative bg-white p-2.5 sm:p-3">
        <div className="overflow-hidden rounded-[18px] border border-border bg-white">
          <div className="aspect-[1914/939] w-full">
            <img
              src={SELLER_DASHBOARD_SRC}
              alt={t("hero.panelSellerCabinet")}
              className="h-full w-full object-contain"
              loading="eager"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
