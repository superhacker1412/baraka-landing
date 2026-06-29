import { LOGO_PATH } from "@/lib/brand";
import { DEFAULT_LOCALE, htmlLang, translate, translateRaw, type Locale } from "@/lib/i18n";
import seoRoutes from "@/lib/seo-routes.json";

export const SITE_URL =
  (import.meta.env.VITE_SITE_URL as string | undefined)?.trim() || "https://barakalisavdo.uz";
export const SITE_ORIGIN = SITE_URL.replace(/\/+$/, "");

// Social preview asset for crawlers such as Telegram, Facebook, and X.
export const OG_IMAGE_PATH = "/og-image.png";
export const OG_IMAGE = `${SITE_ORIGIN}${OG_IMAGE_PATH}`;

export type SeoPageKey =
  | "home"
  | "about"
  | "forSellers"
  | "forShops"
  | "forSuppliers"
  | "forWarehouses"
  | "forCouriers"
  | "forBuyers"
  | "preRegistration"
  | "feedback"
  | "contact"
  | "pricing";

type SeoRouteConfig = {
  key: SeoPageKey;
  path: string;
  changefreq: string;
  priority: number;
};

export const SEO_ROUTES = seoRoutes.pages as SeoRouteConfig[];
export const PUBLIC_PATHS = SEO_ROUTES.map((page) => page.path);

const PAGE_PATH: Record<SeoPageKey, string> = SEO_ROUTES.reduce(
  (paths, page) => {
    paths[page.key] = page.path;
    return paths;
  },
  {} as Record<SeoPageKey, string>,
);

export function pagePath(page: SeoPageKey): string {
  return PAGE_PATH[page];
}

function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_ORIGIN}${normalized}`;
}

export function canonicalUrl(path: string, locale?: Locale): string {
  const url = absoluteUrl(path);
  return locale && locale !== DEFAULT_LOCALE ? `${url}?lang=${locale}` : url;
}

export function localizedUrl(path: string, locale: Locale): string {
  return canonicalUrl(path, locale);
}

export function buildHreflangLinks(path: string) {
  return (["uz", "ru", "en"] as Locale[]).map((locale) => ({
    rel: "alternate" as const,
    hrefLang: htmlLang(locale),
    href: localizedUrl(path, locale),
  }));
}

type MetaInput = {
  locale?: Locale;
  page?: SeoPageKey;
  path?: string;
};

export function buildSeoMeta({ locale = "uz", page = "home", path }: MetaInput = {}) {
  const pagePathValue = path ?? PAGE_PATH[page];
  const url = canonicalUrl(pagePathValue, locale);
  const defaultUrl = canonicalUrl(pagePathValue);
  const title = translate(locale, `seo.pages.${page}.title`);
  const description = translate(locale, `seo.pages.${page}.description`);
  const keywords = translate(locale, `seo.pages.${page}.keywords`);
  const ogTitle = translate(locale, `seo.pages.${page}.ogTitle`);
  const ogDescription = translate(locale, `seo.pages.${page}.ogDescription`);

  return {
    meta: [
      { title },
      { name: "title", content: title },
      { name: "description", content: description },
      { name: "keywords", content: keywords },
      {
        name: "robots",
        content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
      },
      {
        name: "googlebot",
        content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
      },
      { property: "og:site_name", content: "Barakali Savdo" },
      { property: "og:title", content: ogTitle },
      { property: "og:description", content: ogDescription },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:secure_url", content: OG_IMAGE },
      { property: "og:image:type", content: "image/png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Barakali Savdo platformasi" },
      { property: "og:url", content: url },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: htmlLang(locale) },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:url", content: url },
      { name: "twitter:title", content: ogTitle },
      { name: "twitter:description", content: ogDescription },
      { name: "twitter:image", content: OG_IMAGE },
      { name: "twitter:image:alt", content: "Barakali Savdo platformasi" },
    ],
    links: [
      { rel: "canonical", href: url },
      ...buildHreflangLinks(pagePathValue),
      { rel: "alternate", hrefLang: "x-default", href: defaultUrl },
    ],
  };
}

export function organizationJsonLd(locale: Locale = "uz") {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Barakali Savdo",
    url: SITE_ORIGIN,
    logo: `${SITE_ORIGIN}${LOGO_PATH}`,
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
    url: SITE_ORIGIN,
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

type PricingPlan = {
  subscriptionPrice: number | null;
  subscriptionCustom?: boolean;
  free?: boolean;
};

type PricingRole = {
  name: string;
  plans: Record<string, PricingPlan>;
};

type PricingTier = {
  name: string;
};

const PRICING_OFFER_ROLE_IDS = new Set([
  "supplier",
  "sellerOwner",
  "shopOwner",
  "warehouseOwner",
  "courier",
]);

function discountedPrice(price: number): number {
  return Math.round(price * 0.5);
}

export function pricingOfferCatalogJsonLd(locale: Locale = "uz") {
  const roles = translateRaw<Record<string, PricingRole>>(locale, "pricing.roles");
  const tiers = translateRaw<Record<string, PricingTier>>(locale, "pricing.tiers");

  const offers = Object.entries(roles).flatMap(([roleId, role]) => {
    if (!PRICING_OFFER_ROLE_IDS.has(roleId)) return [];

    return Object.entries(role.plans).flatMap(([tierId, plan]) => {
      if (plan.subscriptionCustom) return [];

      const price =
        plan.free || plan.subscriptionPrice === 0
          ? 0
          : plan.subscriptionPrice != null
            ? discountedPrice(plan.subscriptionPrice)
            : null;

      if (price == null) return [];

      return [
        {
          "@type": "Offer",
          name: `${role.name} - ${tiers[tierId]?.name ?? tierId}`,
          url: canonicalUrl(pagePath("pricing"), locale),
          price,
          priceCurrency: "UZS",
          availability: "https://schema.org/PreOrder",
          category: roleId,
          itemOffered: {
            "@type": "Service",
            name: `${role.name} ${tiers[tierId]?.name ?? tierId}`,
            serviceType: "B2B trade and logistics software subscription",
            areaServed: {
              "@type": "Country",
              name: "Uzbekistan",
            },
          },
        },
      ];
    });
  });

  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: translate(locale, "seo.pages.pricing.title"),
    url: canonicalUrl(pagePath("pricing"), locale),
    itemListElement: offers,
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
