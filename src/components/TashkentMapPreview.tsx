import { Map } from "@maptiler/sdk";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useTranslation } from "@/lib/i18n";
import {
  configureMaptiler,
  getMapStyle,
  hasMaptilerApiKey,
  TASHKENT_CENTER_LNG_LAT,
} from "@/lib/maptiler";
import { cn } from "@/lib/utils";

import "@maptiler/sdk/dist/maptiler-sdk.css";

function TashkentMapFallback({ className }: { className?: string }) {
  return (
    <div className={cn("relative h-full min-h-[360px] overflow-hidden bg-[#edf3ee]", className)}>
      <div
        aria-hidden
        className="absolute inset-0 opacity-75"
        style={{
          backgroundImage:
            "linear-gradient(28deg, transparent 0 47%, rgba(71, 114, 84, 0.22) 48% 52%, transparent 53% 100%), linear-gradient(122deg, transparent 0 46%, rgba(71, 114, 84, 0.16) 47% 52%, transparent 53% 100%), linear-gradient(0deg, rgba(255,255,255,0.38) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.38) 1px, transparent 1px)",
          backgroundSize: "220px 90px, 180px 80px, 42px 42px, 42px 42px",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_48%_44%,rgba(40,167,69,0.16),transparent_34%),radial-gradient(circle_at_68%_24%,rgba(23,162,184,0.12),transparent_28%)]"
      />
    </div>
  );
}

export function TashkentMapPreview({ className }: { className?: string }) {
  const { t } = useTranslation();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    if (!hasMaptilerApiKey() || !mapContainerRef.current || mapRef.current) return;

    try {
      configureMaptiler();
      const map = new Map({
        container: mapContainerRef.current,
        style: getMapStyle(),
        projection: "mercator",
        logSDKVersion: false,
        center: TASHKENT_CENTER_LNG_LAT,
        zoom: 11.2,
        pitch: 0,
        interactive: false,
      });

      map.on("load", () => setMapReady(true));
      map.on("error", () => setMapError(true));
      mapRef.current = map;
    } catch {
      setMapError(true);
    }

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      setMapReady(false);
    };
  }, []);

  if (!hasMaptilerApiKey() || mapError) {
    return <TashkentMapFallback className={className} />;
  }

  return (
    <div className={cn("relative h-full min-h-[360px] overflow-hidden", className)}>
      {!mapReady && (
        <div className="absolute inset-0 z-10 grid place-items-center bg-muted/35 backdrop-blur-sm">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" aria-hidden />
          <span className="sr-only">{t("landing.map.loadError")}</span>
        </div>
      )}
      <div
        ref={mapContainerRef}
        className="h-full min-h-[360px] w-full"
        role="img"
        aria-label={t("landing.map.visualTitle")}
      />
    </div>
  );
}
