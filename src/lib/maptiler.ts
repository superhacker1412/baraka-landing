import { config, MapStyle } from "@maptiler/sdk";

/** MapTiler API key — set VITE_MAPTILER_API_KEY in .env */
export const MAPTILER_API_KEY = import.meta.env.VITE_MAPTILER_API_KEY?.trim() ?? "";

export function hasMaptilerApiKey() {
  return MAPTILER_API_KEY.length > 0;
}

/** Default map center: Toshkent */
export const TASHKENT_CENTER = { lng: 69.2797, lat: 41.3111 } as const;

export const TASHKENT_CENTER_LNG_LAT: [number, number] = [TASHKENT_CENTER.lng, TASHKENT_CENTER.lat];

let configured = false;

export function configureMaptiler() {
  if (configured || !hasMaptilerApiKey()) return false;
  config.apiKey = MAPTILER_API_KEY;
  configured = true;
  return true;
}

export function getMapStyle() {
  configureMaptiler();
  return MapStyle.STREETS;
}
