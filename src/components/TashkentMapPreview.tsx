import { Map, Marker, NavigationControl } from "@maptiler/sdk";
import { Loader2, MapPin } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";

import { useTranslation } from "@/lib/i18n";
import {
  configureMaptiler,
  getMapStyle,
  hasMaptilerApiKey,
  TASHKENT_CENTER_LNG_LAT,
} from "@/lib/maptiler";
import { cn } from "@/lib/utils";

import "@maptiler/sdk/dist/maptiler-sdk.css";

type PreviewPinId = "tashkentCity" | "sergeli" | "chilonzor" | "yunusobod";

type PreviewPin = {
  id: PreviewPinId;
  lng: number;
  lat: number;
  offset: { left: string; top: string };
};

const PREVIEW_PINS: PreviewPin[] = [
  { id: "tashkentCity", lng: 69.2468, lat: 41.3164, offset: { left: "46%", top: "43%" } },
  { id: "sergeli", lng: 69.218, lat: 41.215, offset: { left: "38%", top: "70%" } },
  { id: "chilonzor", lng: 69.204, lat: 41.286, offset: { left: "28%", top: "52%" } },
  { id: "yunusobod", lng: 69.289, lat: 41.365, offset: { left: "60%", top: "24%" } },
];

function clearMarkers(markers: MutableRefObject<Marker[]>) {
  for (const marker of markers.current) marker.remove();
  markers.current = [];
}

function createMarkerElement(label: string) {
  const element = document.createElement("button");
  element.type = "button";
  element.className = "group flex flex-col items-center border-0 bg-transparent p-0 cursor-pointer";
  element.setAttribute("aria-label", label);

  const pin = document.createElement("span");
  pin.className =
    "grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg ring-2 ring-background transition-transform group-hover:scale-110";
  pin.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>';

  const text = document.createElement("span");
  text.className =
    "mt-1 max-w-[118px] truncate rounded-md bg-card/95 px-2 py-0.5 text-[10.5px] font-semibold text-foreground shadow-sm backdrop-blur";
  text.textContent = label;

  element.append(pin, text);
  return element;
}

function TashkentMapFallback({ className }: { className?: string }) {
  const { t } = useTranslation();

  return (
    <div className={cn("relative h-full min-h-[360px] overflow-hidden bg-[#edf3ee]", className)}>
      <div
        aria-hidden
        className="absolute inset-0 opacity-75"
        style={{
          backgroundImage:
            "linear-gradient(28deg, transparent 0 47%, rgba(71, 114, 84, 0.24) 48% 52%, transparent 53% 100%), linear-gradient(122deg, transparent 0 46%, rgba(71, 114, 84, 0.18) 47% 52%, transparent 53% 100%), linear-gradient(0deg, rgba(255,255,255,0.38) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.38) 1px, transparent 1px)",
          backgroundSize: "220px 90px, 180px 80px, 42px 42px, 42px 42px",
        }}
      />
      {PREVIEW_PINS.map((pin) => (
        <div
          key={pin.id}
          className="absolute flex -translate-x-1/2 -translate-y-full flex-col items-center"
          style={pin.offset}
        >
          <MapPin className="h-7 w-7 text-primary drop-shadow-sm" fill="currentColor" aria-hidden />
          <span className="mt-1 max-w-[118px] truncate rounded-md bg-card/95 px-2 py-0.5 text-[10.5px] font-semibold shadow-sm backdrop-blur">
            {t(`landing.map.previewPins.${pin.id}.name`)}
          </span>
        </div>
      ))}
    </div>
  );
}

export function TashkentMapPreview({ className }: { className?: string }) {
  const { t } = useTranslation();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState(false);

  const pins = useMemo(
    () =>
      PREVIEW_PINS.map((pin) => ({
        ...pin,
        name: t(`landing.map.previewPins.${pin.id}.name`),
      })),
    [t],
  );

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
        zoom: 11.1,
        pitch: 0,
      });

      map.scrollZoom.disable();
      map.addControl(new NavigationControl({ showCompass: false }), "top-right");
      map.on("load", () => setMapReady(true));
      map.on("error", () => setMapError(true));
      mapRef.current = map;
    } catch {
      setMapError(true);
    }

    return () => {
      clearMarkers(markersRef);
      mapRef.current?.remove();
      mapRef.current = null;
      setMapReady(false);
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    clearMarkers(markersRef);

    for (const pin of pins) {
      const element = createMarkerElement(pin.name);
      element.addEventListener("click", (event) => {
        event.stopPropagation();
        map.flyTo({ center: [pin.lng, pin.lat], zoom: 13.2, duration: 700 });
      });

      markersRef.current.push(
        new Marker({ element, anchor: "bottom" }).setLngLat([pin.lng, pin.lat]).addTo(map),
      );
    }
  }, [mapReady, pins]);

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
        role="region"
        aria-label={t("landing.map.visualTitle")}
      />
    </div>
  );
}
