function normalizeUrl(value: string | undefined, fallback: string) {
  return (value?.trim() || fallback).replace(/\/+$/, "");
}

export const API_BASE_URL = normalizeUrl(
  import.meta.env.VITE_BASE_URL_API,
  "http://localhost:3000",
);

export const MEDIA_BASE_URL = normalizeUrl(
  import.meta.env.VITE_BASE_URL_API_FILES,
  `${API_BASE_URL}/files/indoor-player-api`,
);
