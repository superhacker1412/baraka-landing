import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
  useRouter,
} from "@tanstack/react-router";
import { type ReactNode } from "react";
import { Toaster } from "sonner";

import { I18nProvider } from "../components/I18nProvider";
import { MotionProvider } from "../components/MotionProvider";
import { RubberBand } from "../components/RubberBand";
import { useTranslation } from "../lib/i18n";
import { SITE_ICON_LINKS } from "../lib/brand";
import {
  buildSeoMeta,
  organizationJsonLd,
  softwareApplicationJsonLd,
  websiteJsonLd,
} from "../lib/seo";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-8xl text-foreground">{t("errors.notFoundTitle")}</h1>
        <p className="mt-4 text-sm text-muted-foreground">{t("errors.notFoundText")}</p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          {t("errors.notFoundHome")}
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold text-foreground">{t("errors.genericTitle")}</h1>
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="mt-6 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          {t("errors.retry")}
        </button>
      </div>
    </div>
  );
}

const defaultSeo = buildSeoMeta({ locale: "uz", page: "home" });

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      ...defaultSeo.meta,
    ],
    links: [
      ...SITE_ICON_LINKS.map((link) => ({ ...link })),
      ...defaultSeo.links,
      { rel: "stylesheet", href: appCss },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify([
          organizationJsonLd("uz"),
          websiteJsonLd("uz"),
          softwareApplicationJsonLd("uz"),
        ]),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="uz-Latn-UZ">
      <head>
        <HeadContent />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap"
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <I18nProvider>
      <MotionProvider>
        <RubberBand>
          <Outlet />
        </RubberBand>
        <Toaster position="top-right" richColors closeButton />
      </MotionProvider>
    </I18nProvider>
  );
}
