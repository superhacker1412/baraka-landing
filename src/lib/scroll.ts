const HEADER_OFFSET = 96;

type LenisInstance = {
  scroll: number;
  scrollTo: (target: HTMLElement | string | number, options?: { offset?: number }) => void;
  on: (event: "scroll", callback: () => void) => void;
  off: (event: "scroll", callback: () => void) => void;
};

function getLenis(): LenisInstance | null {
  if (typeof window === "undefined") return null;
  return (window as Window & { __lenis?: LenisInstance }).__lenis ?? null;
}

export function scrollToElement(el: HTMLElement, offset = HEADER_OFFSET) {
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(el, { offset: -offset });
    return;
  }
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: "smooth" });
}

export function scrollToHash(hash: string, offset = HEADER_OFFSET) {
  if (!hash || hash === "#") return;
  const el = document.querySelector(hash);
  if (el instanceof HTMLElement) scrollToElement(el, offset);
}

export function getScrollY() {
  const lenis = getLenis();
  if (lenis) return lenis.scroll;
  return window.scrollY;
}

export function scrollToTop() {
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(0);
    return;
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export function subscribeScroll(callback: () => void) {
  const lenis = getLenis();
  if (lenis) {
    lenis.on("scroll", callback);
    return () => lenis.off("scroll", callback);
  }
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
}
