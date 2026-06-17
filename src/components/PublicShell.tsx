import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowRight, ArrowUp, Mail, Menu, Moon, Phone, Sun, X } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";

import { BrandLogo } from "@/components/BrandLogo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { CONTACT } from "@/lib/contact";
import { useTranslation } from "@/lib/i18n";
import { ROUTES } from "@/lib/routes";
import { getScrollY, scrollToHash, scrollToTop, subscribeScroll } from "@/lib/scroll";
import { useApp } from "@/lib/store";

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

function handleAnchorClick(
  e: React.MouseEvent<HTMLAnchorElement>,
  hash: string,
  onDone?: () => void,
) {
  e.preventDefault();
  scrollToHash(`#${hash}`);
  onDone?.();
}

export function PublicHeader() {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const { theme, toggleTheme } = useApp();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const onHome = pathname === ROUTES.home;

  const nav = useMemo(
    () =>
      [
        { hash: "about", label: t("nav.system") },
        { hash: "roles", label: t("nav.roles") },
        { hash: "workflow", label: t("nav.workflow") },
        { to: ROUTES.pricing, label: t("nav.pricing") },
        { to: ROUTES.contact, label: t("nav.contact") },
      ] as const,
    [t],
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a[href^="#"]');
      if (!target || !(target instanceof HTMLAnchorElement)) return;
      const href = target.getAttribute("href");
      if (!href || href === "#" || href === "#top") return;
      e.preventDefault();
      scrollToHash(href);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return (
    <>
      <header className="glass-nav sticky top-0 z-40 border-b border-border/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3.5">
          <Link to={ROUTES.home} className="flex items-center gap-3" aria-label={t("nav.homeAria")}>
            <BrandLogo className="h-11 w-11 shadow-sm" />
            <div className="text-[16px] font-semibold tracking-tight">{t("brand.name")}</div>
          </Link>

          <nav className="hidden gap-1 lg:flex" aria-label={t("nav.menu")}>
            {nav.map((item) =>
              "to" in item ? (
                <Link
                  key={item.to}
                  to={item.to}
                  className="rounded-full px-3 py-1.5 text-[12.5px] font-medium text-muted-foreground ease-spring hover:bg-accent hover:text-foreground"
                >
                  {item.label}
                </Link>
              ) : (
                <Link
                  key={item.hash}
                  to={ROUTES.home}
                  hash={item.hash}
                  onClick={(e) => {
                    if (onHome) handleAnchorClick(e, item.hash);
                  }}
                  className="rounded-full px-3 py-1.5 text-[12.5px] font-medium text-muted-foreground ease-spring hover:bg-accent hover:text-foreground"
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <div className="flex items-center gap-1.5">
            <LanguageSwitcher className="hidden sm:inline-flex" compact />
            <button
              onClick={toggleTheme}
              className="hidden h-8 w-8 place-items-center rounded-full border border-border bg-card sm:grid"
              aria-label={t("common.themeToggle")}
            >
              {theme === "dark" ? (
                <Sun className="h-3.5 w-3.5" />
              ) : (
                <Moon className="h-3.5 w-3.5" />
              )}
            </button>
            <Link
              to={ROUTES.preRegistration}
              className="inline-flex shrink-0 items-center gap-1 rounded-full bg-foreground px-3 py-1.5 text-[11.5px] font-medium whitespace-nowrap text-background hover:opacity-90 sm:px-3.5 sm:text-[12px]"
            >
              <span className="sm:hidden">{t("nav.registerShort")}</span>
              <span className="hidden sm:inline">{t("nav.registerHeaderCta")}</span>
              <ArrowRight className="hidden h-3 w-3 sm:block" aria-hidden />
            </Link>
            <button
              onClick={() => setOpen(true)}
              className="grid h-8 w-8 place-items-center rounded-full border border-border bg-card lg:hidden"
              aria-label={t("common.openMenu")}
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/40 backdrop-blur"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="animate-slide-in-right absolute inset-x-0 bottom-0 rounded-t-3xl border-t border-border bg-card p-5 pb-8">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-[14px] font-semibold">{t("nav.menu")}</div>
              <button
                onClick={() => setOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full bg-muted"
                aria-label={t("common.closeMenu")}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mb-4">
              <LanguageSwitcher />
            </div>
            <div className="grid gap-1">
              {nav.map((item) =>
                "to" in item ? (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-3 py-2.5 text-[14px] font-medium hover:bg-accent"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <Link
                    key={item.hash}
                    to={ROUTES.home}
                    hash={item.hash}
                    onClick={(e) => {
                      if (onHome) handleAnchorClick(e, item.hash, () => setOpen(false));
                      else setOpen(false);
                    }}
                    className="rounded-xl px-3 py-2.5 text-[14px] font-medium hover:bg-accent"
                  >
                    {item.label}
                  </Link>
                ),
              )}
            </div>
            <Link
              to={ROUTES.preRegistration}
              onClick={() => setOpen(false)}
              className="mt-4 block rounded-xl bg-foreground px-4 py-2.5 text-center text-[13px] font-medium text-background"
            >
              {t("nav.registerCta")}
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

export function PublicFooter() {
  const { t } = useTranslation();

  const footerLinks = [
    {
      title: t("footer.pageTitle"),
      links: [
        { label: t("nav.system"), to: ROUTES.home, hash: "about" },
        { label: t("nav.roles"), to: ROUTES.home, hash: "roles" },
        { label: t("nav.workflow"), to: ROUTES.home, hash: "workflow" },
        { label: t("nav.pricing"), to: ROUTES.pricing },
      ],
    },
    {
      title: t("footer.contactTitle"),
      links: [
        { label: t("nav.contact"), to: ROUTES.contact },
        { label: t("footer.preRegistration"), to: ROUTES.preRegistration },
        { label: t("footer.feedback"), to: ROUTES.feedback },
      ],
    },
  ] as const;

  return (
    <footer className="border-t border-border/70 bg-muted/30">
      <div className="mx-auto max-w-7xl px-5 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <BrandLogo className="h-10 w-10" />
              <div className="text-[15px] font-semibold">{t("brand.name")}</div>
            </div>
            <p className="mt-3 max-w-md text-[12px] text-muted-foreground">
              {t("footer.description")}
            </p>
            <div className="mt-4 space-y-2 text-[12px] text-muted-foreground">
              <a
                href={`mailto:${CONTACT.email}`}
                className="flex items-center gap-2 hover:text-foreground"
              >
                <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden />
                {CONTACT.email}
              </a>
              <a
                href={`tel:${CONTACT.phone}`}
                className="flex items-center gap-2 hover:text-foreground"
              >
                <Phone className="h-3.5 w-3.5 shrink-0" aria-hidden />
                {CONTACT.phoneDisplay}
              </a>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
              <a
                href={CONTACT.telegram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("footer.telegram")}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 hover:text-foreground"
              >
                <TelegramIcon className="h-3 w-3" />
                {t("footer.telegram")}
              </a>
            </div>
          </div>
          {footerLinks.map((column) => (
            <div key={column.title}>
              <div className="text-[12px] font-semibold">{column.title}</div>
              <ul className="mt-3 space-y-2">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      {...("hash" in link && link.hash ? { hash: link.hash } : {})}
                      className="text-[12.5px] text-muted-foreground hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 text-[11.5px] text-muted-foreground md:flex-row">
          <div>{t("footer.copyright")}</div>
          <div className="flex flex-wrap justify-center gap-4">
            <a href={`mailto:${CONTACT.email}`} className="hover:text-foreground">
              {CONTACT.email}
            </a>
            <a href={`tel:${CONTACT.phone}`} className="hover:text-foreground">
              {CONTACT.phoneDisplay}
            </a>
            <a
              href={CONTACT.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground"
            >
              {t("footer.telegram")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

const SCROLL_TOP_THRESHOLD = 350;

function ScrollToTopButton() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => setVisible(getScrollY() > SCROLL_TOP_THRESHOLD);
    update();
    return subscribeScroll(update);
  }, []);

  return (
    <button
      type="button"
      aria-label={t("common.scrollTop")}
      onClick={scrollToTop}
      className={`fixed bottom-5 right-5 z-30 grid h-11 w-11 place-items-center rounded-full border border-border bg-card text-foreground shadow-lg shadow-foreground/10 ease-spring transition-[opacity,transform] duration-300 hover:bg-accent hover:shadow-xl sm:bottom-6 sm:right-6 ${
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-2 opacity-0"
      }`}
    >
      <ArrowUp className="h-4 w-4" strokeWidth={2.25} />
    </button>
  );
}

export function PublicShell({ children }: { children: ReactNode }) {
  const theme = useApp((state) => state.theme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <div id="top" className="min-h-screen bg-background">
      <PublicHeader />
      <main>{children}</main>
      <PublicFooter />
      <ScrollToTopButton />
    </div>
  );
}

export function Section({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`mx-auto max-w-7xl scroll-mt-24 px-5 ${className}`}>
      {children}
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
      {children}
    </div>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  sub,
  center,
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-3xl"}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="mt-3 font-display text-[32px] font-semibold leading-[1.1] tracking-tight md:text-[44px]">
        {title}
      </h2>
      {sub && <p className="mt-3 text-[15px] text-muted-foreground">{sub}</p>}
    </div>
  );
}

export function CTAButton({
  href,
  children,
  primary = false,
}: {
  href: string;
  children: ReactNode;
  primary?: boolean;
}) {
  const className = `inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-[13.5px] font-medium ease-spring ${
    primary
      ? "bg-foreground text-background hover:opacity-90"
      : "border border-border bg-card hover:bg-accent"
  }`;

  if (href.startsWith("#")) {
    return (
      <a
        href={href}
        onClick={(e) => {
          e.preventDefault();
          scrollToHash(href);
        }}
        className={className}
      >
        {children}
      </a>
    );
  }

  return (
    <Link to={href} className={className}>
      {children}
    </Link>
  );
}
