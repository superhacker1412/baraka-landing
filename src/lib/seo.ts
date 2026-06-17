import { LOGO_PATH } from "@/lib/brand";
import { htmlLang, translate, type Locale } from "@/lib/i18n";

export const SITE_URL =
  (import.meta.env.VITE_SITE_URL as string | undefined)?.trim() || "https://barakali.uz";

// Social preview asset (1914×939; ideal OG size is 1200×630)
export const OG_IMAGE_PATH = "/images/dashboard.png";
export const OG_IMAGE = `${SITE_URL}${OG_IMAGE_PATH}`;

export const PUBLIC_PATHS = ["/", "/oldindan-royxat", "/taklif", "/aloqa", "/tariff"] as const;

export type SeoPageKey = "home" | "preRegistration" | "feedback" | "contact" | "pricing";

const PAGE_PATH: Record<SeoPageKey, string> = {
  home: "/",
  preRegistration: "/oldindan-royxat",
  feedback: "/taklif",
  contact: "/aloqa",
  pricing: "/tariff",
};

export function pagePath(page: SeoPageKey): string {
  return PAGE_PATH[page];
}

export function canonicalUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized === "/" ? "" : normalized}`;
}

export function buildHreflangLinks(path: string) {
  return (["uz", "ru", "en"] as Locale[]).map((locale) => ({
    rel: "alternate" as const,
    hrefLang: htmlLang(locale),
    href: `${canonicalUrl(path)}?lang=${locale}`,
  }));
}

type MetaInput = {
  locale?: Locale;
  page?: SeoPageKey;
  path?: string;
};

export function buildSeoMeta({ locale = "uz", page = "home", path }: MetaInput = {}) {
  const pagePathValue = path ?? PAGE_PATH[page];
  const url = canonicalUrl(pagePathValue);
  const title = translate(locale, `seo.pages.${page}.title`);
  const description = translate(locale, `seo.pages.${page}.description`);
  const keywords = translate(locale, `seo.pages.${page}.keywords`);
  const ogTitle = translate(locale, `seo.pages.${page}.ogTitle`);
  const ogDescription = translate(locale, `seo.pages.${page}.ogDescription`);

  return {
    meta: [
      { title },
      { name: "description", content: description },
      { name: "keywords", content: keywords },
      { property: "og:title", content: ogTitle },
      { property: "og:description", content: ogDescription },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:url", content: url },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: htmlLang(locale) },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: ogTitle },
      { name: "twitter:description", content: ogDescription },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [
      { rel: "canonical", href: url },
      ...buildHreflangLinks(pagePathValue),
      { rel: "alternate", hrefLang: "x-default", href: url },
    ],
  };
}

export function organizationJsonLd(locale: Locale = "uz") {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Barakali Savdo",
    url: SITE_URL,
    logo: `${SITE_URL}${LOGO_PATH}`,
    description: translate(locale, "seo.organization.description"),
    email: "zhonglifiverr@gmail.com",
    telephone: "+998909854315",
    sameAs: ["https://t.me/reizogenshin"],
    areaServed: {
      "@type": "Country",
      name: "Uzbekistan",
    },
  };
}

export function websiteJsonLd(locale: Locale = "uz") {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Barakali Savdo",
    url: SITE_URL,
    description: translate(locale, "seo.website.description"),
    inLanguage: htmlLang(locale),
  };
}

export function softwareApplicationJsonLd(locale: Locale = "uz") {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Barakali Savdo",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "UZS",
      description: translate(locale, "seo.software.offer"),
    },
    description: translate(locale, "seo.software.description"),
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
