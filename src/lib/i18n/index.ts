import { useCallback } from "react";
import { useApp, type AppLocale } from "@/lib/store";
import en from "@/locales/en.json";
import ru from "@/locales/ru.json";
import uz from "@/locales/uz.json";

export type Locale = AppLocale;

export const LOCALES: Locale[] = ["uz", "ru", "en"];
export const DEFAULT_LOCALE: Locale = "uz";

const messages: Record<Locale, typeof uz> = { uz, ru, en };

export function htmlLang(locale: Locale): string {
  switch (locale) {
    case "uz":
      return "uz-Latn-UZ";
    case "ru":
      return "ru";
    case "en":
      return "en";
  }
}

function getNested(obj: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) return template;
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => String(params[key] ?? ""));
}

export function translate(
  locale: Locale,
  key: string,
  params?: Record<string, string | number>,
): string {
  const value = getNested(messages[locale] as Record<string, unknown>, key);
  if (typeof value === "string") return interpolate(value, params);
  if (import.meta.env.DEV) {
    console.warn(`Missing translation [${locale}]: ${key}`);
  }
  return key;
}

export function translateRaw<T>(locale: Locale, key: string): T {
  return getNested(messages[locale] as Record<string, unknown>, key) as T;
}

export function useTranslation() {
  const lang = useApp((state) => state.lang);
  const setLang = useApp((state) => state.setLang);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => translate(lang, key, params),
    [lang],
  );

  const tRaw = useCallback(<T>(key: string) => translateRaw<T>(lang, key), [lang]);

  return { t, tRaw, lang, setLang, locale: lang };
}
