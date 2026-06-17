/**
 * Google reCAPTCHA configuration (v2 checkbox or v3 invisible)
 *
 * Setup — https://www.google.com/recaptcha/admin
 * 1. Create keys matching VITE_RECAPTCHA_VERSION:
 *    - v2 → reCAPTCHA v2 → "I'm not a robot" Checkbox
 *    - v3 → reCAPTCHA v3 (score-based, invisible)
 * 2. Under "Domains", add EVERY host where the app runs:
 *    - localhost          (npm run dev)
 *    - 127.0.0.1          (npm run dev with --host 127.0.0.1)
 *    - your-production-domain.com  (e.g. barakalisavdo.uz, www.barakalisavdo.uz)
 *    Google does NOT auto-whitelist localhost — you must add both entries above.
 * 3. Set env vars (see .env.example).
 *
 * Environment variables:
 *   VITE_RECAPTCHA_VERSION=v3          (v2 | v3, default v3)
 *   VITE_RECAPTCHA_SITE_KEY=...
 *   VITE_RECAPTCHA_SECRET_KEY=...        (server-side verification, future use)
 *   VITE_RECAPTCHA_DEV_BYPASS=true       (optional — skip captcha locally without keys)
 *
 * Dev modes:
 *   - No site key → dev bypass (captcha skipped everywhere)
 *   - VITE_RECAPTCHA_DEV_BYPASS=true → explicit dev bypass
 */

export type RecaptchaVersion = "v2" | "v3";

/** Domains to register in Google reCAPTCHA admin console */
export const RECAPTCHA_CONSOLE_DOMAINS = [
  "localhost",
  "127.0.0.1",
  // Add production domain(s) here when deploying, e.g. "barakalisavdo.uz"
] as const;

const rawVersion = (import.meta.env.VITE_RECAPTCHA_VERSION ?? "v3").toLowerCase();

function parseEnvBool(value: string | undefined): boolean {
  if (!value) return false;
  const normalized = value.trim().toLowerCase();
  return normalized === "true" || normalized === "1" || normalized === "yes";
}

export function isLocalDevHost(): boolean {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  return host === "localhost" || host === "127.0.0.1";
}

export const captchaConfig = {
  version: (rawVersion === "v2" ? "v2" : "v3") as RecaptchaVersion,

  /** Public site key — safe to expose in frontend */
  siteKey: import.meta.env.VITE_RECAPTCHA_SITE_KEY ?? "",

  /** Secret key placeholder — only used server-side in future API integration */
  secretKey: import.meta.env.VITE_RECAPTCHA_SECRET_KEY ?? "",

  /** Explicit opt-in to skip captcha (local dev without Google console setup) */
  devBypassExplicit: parseEnvBool(import.meta.env.VITE_RECAPTCHA_DEV_BYPASS),

  /** When true, captcha validation is skipped (no keys configured or explicit bypass) */
  get devBypass() {
    return !this.siteKey || this.devBypassExplicit;
  },

  /** True when captcha should be skipped */
  get effectiveBypass() {
    return this.devBypass;
  },

  get isV2() {
    return this.version === "v2";
  },

  get isV3() {
    return this.version === "v3";
  },
};
