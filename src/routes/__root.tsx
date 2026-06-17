import { Link, Outlet, createRootRoute, useRouter } from "@tanstack/react-router";
import { Toaster } from "sonner";

import { I18nProvider } from "../components/I18nProvider";
import { MotionProvider } from "../components/MotionProvider";
import { RubberBand } from "../components/RubberBand";
import { useTranslation } from "../lib/i18n";

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

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

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
