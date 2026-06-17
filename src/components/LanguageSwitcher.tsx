import { cn } from "@/lib/utils";
import { LOCALES, useTranslation, type Locale } from "@/lib/i18n";

const LABELS: Record<Locale, string> = {
  uz: "UZ",
  ru: "RU",
  en: "EN",
};

type LanguageSwitcherProps = {
  className?: string;
  compact?: boolean;
};

export function LanguageSwitcher({ className, compact }: LanguageSwitcherProps) {
  const { lang, setLang, t } = useTranslation();

  return (
    <div
      className={cn("inline-flex rounded-full border border-border bg-card p-0.5", className)}
      role="group"
      aria-label={t("common.language")}
    >
      {LOCALES.map((locale) => (
        <button
          key={locale}
          type="button"
          onClick={() => setLang(locale)}
          aria-pressed={lang === locale}
          className={cn(
            "rounded-full px-2 py-1 text-[10.5px] font-semibold transition-colors",
            compact && "px-1.5",
            lang === locale
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {LABELS[locale]}
        </button>
      ))}
    </div>
  );
}
