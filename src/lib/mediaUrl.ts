import { MEDIA_BASE_URL } from "./environment";

const KNOWN_MEDIA_PREFIXES = ["files/indoor-player-api/", "uploads/"];

export function resolveMediaUrl(fileUrl: string) {
  const normalized = String(fileUrl ?? "").trim();

  if (!normalized) {
    return "";
  }

  if (/^https?:\/\//i.test(normalized)) {
    return encodeURI(normalized);
  }

  let relativePath = normalized.replace(/^\/+/, "");

  for (const prefix of KNOWN_MEDIA_PREFIXES) {
    if (relativePath.startsWith(prefix)) {
      relativePath = relativePath.slice(prefix.length);
      break;
    }
  }

  return encodeURI(`${MEDIA_BASE_URL}/${relativePath}`);
}
