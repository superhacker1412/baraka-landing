import { useEffect, type ReactNode } from "react";
import { htmlLang } from "@/lib/i18n";
import { useApp, type AppLocale } from "@/lib/store";

function parseQueryLang(): AppLocale | null {
  if (typeof window === "undefined") return null;
  const value = new URLSearchParams(window.location.search).get("lang");
  if (value === "uz" || value === "ru" || value === "en") return value;
  return null;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const lang = useApp((state) => state.lang);
  const setLang = useApp((state) => state.setLang);

  useEffect(() => {
    const queryLang = parseQueryLang();
    if (queryLang) {
      setLang(queryLang);
    }
  }, [setLang]);

  useEffect(() => {
    document.documentElement.lang = htmlLang(lang);
  }, [lang]);

  return children;
}
