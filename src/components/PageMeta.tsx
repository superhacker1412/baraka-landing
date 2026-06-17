import { useEffect } from "react";
import { useTranslation } from "@/lib/i18n";
import {
  buildHreflangLinks,
  buildSeoMeta,
  canonicalUrl,
  faqJsonLd,
  organizationJsonLd,
  pagePath,
  softwareApplicationJsonLd,
  websiteJsonLd,
  type SeoPageKey,
} from "@/lib/seo";

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

function upsertCanonical(href: string) {
  let el = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.rel = "canonical";
    document.head.appendChild(el);
  }
  el.href = href;
}

function upsertAlternate(hreflang: string, href: string) {
  let el = document.head.querySelector(
    `link[rel="alternate"][hreflang="${hreflang}"]`,
  ) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.rel = "alternate";
    document.head.appendChild(el);
  }
  el.hreflang = hreflang;
  el.href = href;
}

function upsertJsonLd(id: string, data: object) {
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement("script");
    el.id = id;
    el.type = "application/ld+json";
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

type PageMetaProps = {
  page: SeoPageKey;
  faqItems?: { question: string; answer: string }[];
};

export function PageMeta({ page, faqItems }: PageMetaProps) {
  const { lang } = useTranslation();
  const path = pagePath(page);

  useEffect(() => {
    const seo = buildSeoMeta({ locale: lang, page, path });
    document.title = seo.meta.find((item) => "title" in item)?.title ?? document.title;

    for (const item of seo.meta) {
      if ("title" in item) continue;
      if ("name" in item && item.name) upsertMeta("name", item.name, item.content);
      if ("property" in item && item.property) upsertMeta("property", item.property, item.content);
    }

    upsertCanonical(canonicalUrl(path));

    for (const link of buildHreflangLinks(path)) {
      upsertAlternate(link.hrefLang, link.href);
    }
    upsertAlternate("x-default", canonicalUrl(path));

    upsertJsonLd("jsonld-organization", organizationJsonLd(lang));
    upsertJsonLd("jsonld-website", websiteJsonLd(lang));
    upsertJsonLd("jsonld-software", softwareApplicationJsonLd(lang));

    if (faqItems?.length) {
      upsertJsonLd("jsonld-faq", faqJsonLd(faqItems));
    } else {
      document.getElementById("jsonld-faq")?.remove();
    }
  }, [lang, page, path, faqItems]);

  return null;
}

export function useFaqItems() {
  const { tRaw } = useTranslation();
  return tRaw<{ question: string; answer: string }[]>("landing.faq.items");
}
