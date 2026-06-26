import { cn } from "@/lib/utils";
import { DEFAULT_LOCALE, LOCALES, useTranslation, type Locale } from "@/lib/i18n";

const LABELS: Record<Locale, string> = {
  uz: "UZ",
  ru: "RU",
  en: "EN",
};

type LanguageSwitcherProps = {
  className?: string;
  compact?: boolean;
};

function syncUrlLocale(locale: Locale) {
  if (typeof window === "undefined") return;

  const url = new URL(window.location.href);
  if (locale === DEFAULT_LOCALE) {
    url.searchParams.delete("lang");
  } else {
    url.searchParams.set("lang", locale);
  }

  window.history.replaceState(window.history.state, "", url.toString());
}

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
          onClick={() => {
            setLang(locale);
            syncUrlLocale(locale);
          }}
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
