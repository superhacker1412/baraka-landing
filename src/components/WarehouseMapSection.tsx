import { FullscreenControl, Map, Marker, NavigationControl } from "@maptiler/sdk";
import { Loader2, MapPin, Warehouse } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "@/lib/i18n";
import {
  configureMaptiler,
  getMapStyle,
  hasMaptilerApiKey,
  TASHKENT_CENTER_LNG_LAT,
} from "@/lib/maptiler";

import "@maptiler/sdk/dist/maptiler-sdk.css";

type DemoWarehouse = {
  id: string;
  name: string;
  area: string;
  lng: number;
  lat: number;
};

const DEMO_WAREHOUSES: DemoWarehouse[] = [
  { id: "sergeli", name: "Sergeli ombor", area: "1 200 m²", lng: 69.218, lat: 41.215 },
  { id: "chilonzor", name: "Chilonzor Hub", area: "800 m²", lng: 69.204, lat: 41.286 },
  { id: "yunusobod", name: "Yunusobod depo", area: "650 m²", lng: 69.289, lat: 41.365 },
  { id: "mirzo", name: "Mirzo Ulug'bek", area: "420 m²", lng: 69.334, lat: 41.338 },
  { id: "yakkasaroy", name: "Yakkasaroy markaz", area: "540 m²", lng: 69.278, lat: 41.295 },
];

function MapPlaceholder() {
  const { t } = useTranslation();

  return (
    <div className="relative h-[min(420px,60vh)] overflow-hidden rounded-2xl border border-border bg-muted/30">
      <div
        aria-hidden
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 60% at 50% 45%, color-mix(in oklab, var(--info) 12%, transparent) 0%, transparent 70%)",
        }}
      />

      {DEMO_WAREHOUSES.map((wh, i) => (
        <div
          key={wh.id}
          className="absolute flex -translate-x-1/2 -translate-y-full flex-col items-center"
          style={{
            left: `${18 + (i % 3) * 28 + Math.floor(i / 3) * 4}%`,
            top: `${22 + Math.floor(i / 3) * 28 + (i % 2) * 8}%`,
          }}
        >
          <MapPin className="h-7 w-7 text-primary drop-shadow-sm" fill="currentColor" aria-hidden />
          <span className="mt-1 max-w-[88px] truncate rounded-md bg-card/95 px-2 py-0.5 text-[10px] font-medium shadow-sm backdrop-blur">
            {wh.name}
          </span>
        </div>
      ))}

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/95 to-transparent p-4 pt-10 text-center">
        <p className="text-[13px] font-medium">{t("landing.map.demoTitle")}</p>
        <p className="mt-1 text-[11.5px] text-muted-foreground">
          {t("landing.map.demoHint")}{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-[10.5px]">VITE_MAPTILER_API_KEY</code>
        </p>
      </div>
    </div>
  );
}

function LiveMap() {
  const { t } = useTranslation();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(DEMO_WAREHOUSES[0]?.id ?? null);

  useEffect(() => {
    if (!hasMaptilerApiKey() || !mapContainerRef.current || mapRef.current) return;

    try {
      configureMaptiler();
      const map = new Map({
        container: mapContainerRef.current,
        style: getMapStyle(),
        center: TASHKENT_CENTER_LNG_LAT,
        zoom: 10.5,
      });

      map.addControl(new NavigationControl(), "top-right");
      map.addControl(new FullscreenControl(), "top-right");

      map.on("load", () => setMapReady(true));
      map.on("error", () => setMapError(t("landing.map.loadError")));

      mapRef.current = map;
    } catch {
      setMapError(t("landing.map.loadError"));
    }

    return () => {
      for (const marker of markersRef.current) marker.remove();
      markersRef.current = [];
      mapRef.current?.remove();
      mapRef.current = null;
      setMapReady(false);
    };
  }, [t]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    for (const marker of markersRef.current) marker.remove();
    markersRef.current = [];

    for (const wh of DEMO_WAREHOUSES) {
      const el = document.createElement("button");
      el.type = "button";
      el.className = "group flex flex-col items-center border-0 bg-transparent p-0 cursor-pointer";
      el.setAttribute("aria-label", wh.name);
      el.innerHTML = `
        <div class="rounded-full bg-primary p-1.5 shadow-md ring-2 ring-background transition-transform group-hover:scale-110">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
        </div>
        <span class="mt-1 max-w-[96px] truncate rounded-md bg-card px-2 py-0.5 text-[10px] font-medium shadow-sm">${wh.name}</span>
      `;
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        setActiveId(wh.id);
        map.flyTo({ center: [wh.lng, wh.lat], zoom: 13, duration: 800 });
      });

      const marker = new Marker({ element: el, anchor: "bottom" })
        .setLngLat([wh.lng, wh.lat])
        .addTo(map);
      markersRef.current.push(marker);
    }
  }, [mapReady]);

  if (mapError) return <MapPlaceholder />;

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
      <div className="relative overflow-hidden rounded-2xl border border-border">
        {!mapReady && (
          <div className="absolute inset-0 z-10 grid place-items-center bg-muted/40 backdrop-blur-sm">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" aria-hidden />
            <span className="sr-only">{t("landing.map.loadError")}</span>
          </div>
        )}
        <div
          ref={mapContainerRef}
          className="h-[min(420px,60vh)] w-full"
          role="region"
          aria-label={t("landing.map.title")}
        />
      </div>

      <ul className="flex flex-row gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
        {DEMO_WAREHOUSES.map((wh) => (
          <li key={wh.id}>
            <button
              type="button"
              onClick={() => {
                setActiveId(wh.id);
                mapRef.current?.flyTo({ center: [wh.lng, wh.lat], zoom: 13, duration: 800 });
              }}
              className={`flex w-full min-w-[180px] items-start gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-colors lg:min-w-0 ${
                activeId === wh.id
                  ? "border-primary/40 bg-primary/5"
                  : "border-border bg-card hover:bg-accent/50"
              }`}
            >
              <Warehouse className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              <div className="min-w-0">
                <div className="truncate text-[13px] font-medium">{wh.name}</div>
                <div className="text-[11px] text-muted-foreground">{wh.area}</div>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function WarehouseMapSection() {
  return hasMaptilerApiKey() ? <LiveMap /> : <MapPlaceholder />;
}
