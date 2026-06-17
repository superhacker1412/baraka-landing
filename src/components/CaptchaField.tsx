import { useCallback, useEffect, useRef, useState } from "react";
import { captchaConfig, isLocalDevHost, RECAPTCHA_CONSOLE_DOMAINS } from "@/lib/captcha.config";
import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
        },
      ) => number;
      reset: (widgetId?: number) => void;
    };
  }
}

const SCRIPT_ID = "recaptcha-script";

function loadRecaptchaScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      if (existing.getAttribute("data-src") === src) {
        if (window.grecaptcha) {
          resolve();
        } else {
          existing.addEventListener("load", () => resolve(), { once: true });
          existing.addEventListener("error", () => reject(new Error("reCAPTCHA script failed")), {
            once: true,
          });
        }
        return;
      }
      existing.remove();
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = src;
    script.async = true;
    script.defer = true;
    script.setAttribute("data-src", src);
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("reCAPTCHA script failed"));
    document.head.appendChild(script);
  });
}

function whenRecaptchaReady(): Promise<void> {
  return new Promise((resolve) => {
    if (window.grecaptcha) {
      window.grecaptcha.ready(() => resolve());
    } else {
      resolve();
    }
  });
}

export async function executeRecaptcha(action: string): Promise<string | null> {
  if (captchaConfig.effectiveBypass) {
    return "dev-bypass";
  }

  if (!captchaConfig.isV3) {
    return null;
  }

  try {
    await loadRecaptchaScript(
      `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(captchaConfig.siteKey)}`,
    );
    await whenRecaptchaReady();

    if (!window.grecaptcha) {
      return null;
    }

    const token = await window.grecaptcha.execute(captchaConfig.siteKey, { action });
    return token || null;
  } catch {
    return null;
  }
}

function DevBypassBanner({ className }: { className?: string }) {
  const { t } = useTranslation();
  const reason = captchaConfig.devBypassExplicit
    ? t("captcha.devBypassExplicit")
    : t("captcha.devBypassKeyMissing");

  return (
    <div
      className={cn(
        "rounded-xl border border-dashed border-warning/40 bg-warning/5 px-3 py-2 text-[11.5px] text-muted-foreground",
        className,
      )}
    >
      {t("captcha.devBypass", { reason })}
    </div>
  );
}

function useHideRecaptchaBadgeOnLocalhost() {
  useEffect(() => {
    if (!isLocalDevHost()) return;

    const styleId = "recaptcha-localhost-badge-hide";
    if (document.getElementById(styleId)) return;

    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = ".grecaptcha-badge { visibility: hidden !important; }";
    document.head.appendChild(style);

    return () => {
      document.getElementById(styleId)?.remove();
    };
  }, []);
}

function CaptchaLoadErrorBanner({ className }: { className?: string }) {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        "rounded-xl border border-destructive/40 bg-destructive/5 px-3 py-2.5 text-[11.5px]",
        className,
      )}
      role="alert"
    >
      <p className="font-medium text-destructive">{t("captcha.loadErrorTitle")}</p>
      <p className="mt-1 text-muted-foreground">
        {t("captcha.loadErrorText")}{" "}
        <code className="text-[10.5px]">{RECAPTCHA_CONSOLE_DOMAINS.join(", ")}</code>.{" "}
        {t("captcha.versionHint", { version: captchaConfig.version })}
      </p>
    </div>
  );
}

type CaptchaFieldProps = {
  onTokenChange?: (token: string | null) => void;
  className?: string;
};

function CaptchaV2Field({
  onTokenChange,
  className,
}: Required<Pick<CaptchaFieldProps, "onTokenChange">> & CaptchaFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const onError = useCallback(() => {
    onTokenChange(null);
    setLoadError(true);
  }, [onTokenChange]);

  useEffect(() => {
    const scriptId = SCRIPT_ID;
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    const renderWidget = () => {
      if (!containerRef.current || !window.grecaptcha || widgetIdRef.current != null) return;
      window.grecaptcha.ready(() => {
        if (!containerRef.current || widgetIdRef.current != null) return;
        try {
          widgetIdRef.current = window.grecaptcha!.render(containerRef.current, {
            sitekey: captchaConfig.siteKey,
            callback: (token) => onTokenChange(token),
            "expired-callback": () => onTokenChange(null),
            "error-callback": onError,
          });
          setReady(true);
        } catch {
          onError();
        }
      });
    };

    const onScriptError = () => {
      setLoadError(true);
      onTokenChange(null);
    };

    if (window.grecaptcha) {
      renderWidget();
    } else if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.onload = renderWidget;
      script.onerror = onScriptError;
      document.head.appendChild(script);
    } else {
      script.addEventListener("load", renderWidget);
      script.addEventListener("error", onScriptError);
    }

    return () => {
      script?.removeEventListener("load", renderWidget);
      script?.removeEventListener("error", onScriptError);
      if (widgetIdRef.current != null && window.grecaptcha) {
        window.grecaptcha.reset(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [onTokenChange, onError]);

  return (
    <div className={className}>
      {loadError && <CaptchaLoadErrorBanner className="mb-2" />}
      <div ref={containerRef} className={cn(!ready && !loadError && "min-h-[78px]")} />
    </div>
  );
}

function CaptchaV3Notice({ className }: Pick<CaptchaFieldProps, "className">) {
  const { t } = useTranslation();
  const [loadError, setLoadError] = useState(false);

  useHideRecaptchaBadgeOnLocalhost();

  useEffect(() => {
    void (async () => {
      try {
        await loadRecaptchaScript(
          `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(captchaConfig.siteKey)}`,
        );
        await whenRecaptchaReady();

        if (!window.grecaptcha) {
          setLoadError(true);
        }
      } catch {
        setLoadError(true);
      }
    })();
  }, []);

  return (
    <div className={className}>
      {loadError && <CaptchaLoadErrorBanner className="mb-2" />}
      <p className="text-[11px] text-muted-foreground">{t("captcha.protected")}</p>
    </div>
  );
}

export function CaptchaField({ onTokenChange, className }: CaptchaFieldProps) {
  useEffect(() => {
    if (captchaConfig.devBypass) {
      onTokenChange?.("dev-bypass");
    }
  }, [onTokenChange]);

  if (captchaConfig.devBypass) {
    return <DevBypassBanner className={className} />;
  }

  if (captchaConfig.isV3) {
    return <CaptchaV3Notice className={className} />;
  }

  return <CaptchaV2Field onTokenChange={onTokenChange ?? (() => {})} className={className} />;
}

export function useCaptchaReset() {
  const tokenRef = useRef<string | null>(null);
  const setToken = useCallback((token: string | null) => {
    tokenRef.current = token;
  }, []);

  const validateCaptcha = useCallback((): boolean => {
    if (captchaConfig.effectiveBypass) return true;
    if (captchaConfig.isV3) return true;
    return !!tokenRef.current;
  }, []);

  const resetCaptcha = useCallback(() => {
    tokenRef.current = null;
    if (window.grecaptcha && captchaConfig.isV2) {
      window.grecaptcha.reset();
    }
  }, []);

  return { setToken, validateCaptcha, resetCaptcha };
}
