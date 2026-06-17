import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ClipboardList,
  Crown,
  ShoppingBag,
  Store,
  Truck,
  Warehouse,
  type LucideIcon,
} from "lucide-react";
import { Eyebrow } from "@/components/PublicShell";
import { useTranslation } from "@/lib/i18n";
import { ROUTES } from "@/lib/routes";

const PARTNER_ICONS: Record<string, LucideIcon> = {
  ombor: Warehouse,
  sotuvchi: Crown,
  yetkazib: Truck,
  kuryer: ClipboardList,
  dokon: Store,
  xaridor: ShoppingBag,
};

export function MapPartnerCTAs() {
  const { t, tRaw } = useTranslation();
  const items = tRaw<{ id: string; title: string; pitch: string }[]>("landing.map.partners.items");

  return (
    <div className="mt-8 border-t border-border/60 pt-8 md:mt-10 md:pt-10">
      <div className="text-center">
        <Eyebrow>{t("landing.map.partners.eyebrow")}</Eyebrow>
        <h3 className="mt-3 font-display text-[22px] font-semibold tracking-tight md:text-[28px]">
          {t("landing.map.partners.title")}
        </h3>
        <p className="mx-auto mt-2 max-w-2xl text-[13.5px] text-muted-foreground md:text-[14px]">
          {t("landing.map.partners.subtitle")}
        </p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const Icon = PARTNER_ICONS[item.id] ?? Warehouse;
          return (
            <article
              key={item.id}
              className="flex flex-col rounded-2xl border border-border/80 bg-card/50 p-4 md:p-5"
            >
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary/20 to-info/10">
                <Icon className="h-4 w-4 text-primary" aria-hidden />
              </div>
              <h4 className="mt-3 text-[14px] font-semibold">{item.title}</h4>
              <p className="mt-1.5 flex-1 text-[12.5px] leading-relaxed text-muted-foreground">
                {item.pitch}
              </p>
              <Link
                to={ROUTES.feedback}
                className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 text-[12.5px] font-medium transition-colors hover:bg-accent sm:w-auto sm:justify-start"
              >
                {t("landing.map.partners.applyCta")}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}
