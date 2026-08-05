import type { Media } from "../../Medias/types";

export type OverlayBarPosition = "TOP" | "BOTTOM" | "LEFT" | "RIGHT";
export type OverlayBarFit = "CONTAIN" | "COVER" | "FILL";
export type OverlayBarContentPosition = "START" | "CENTER" | "END";
export type OverlayBarWidgetType = "NONE" | "CLOCK" | "DATE" | "WEATHER";
export type OverlayBarContentType = "TEXT" | "CLOCK" | "DATE" | "WEATHER" | "SPACER";
export type OverlayBarFontWeight = "NORMAL" | "SEMIBOLD" | "BOLD";
export type OverlayBarFontFamily =
  "SYSTEM" | "SANS_SERIF" | "SANS_SERIF_CONDENSED" | "SERIF" | "MONOSPACE";

export interface OverlayBarContentItem {
  id: string;
  type: OverlayBarContentType;
  text?: string;
  textColor: string;
  fontSize: number;
  fontWeight: OverlayBarFontWeight;
  fontFamily?: OverlayBarFontFamily;
  italic?: boolean;
  backgroundColor?: string;
  padding: number;
  borderRadius: number;
  spacerSize: number;
}

export interface OverlayBarPlaylistSummary {
  id: string;
  name: string;
}

export interface OverlayBarPlaylistLink {
  order: number;
  createdAt: string;
  playlist: OverlayBarPlaylistSummary;
}

export interface OverlayBar {
  id: string;
  name: string;
  position: OverlayBarPosition;
  sizePercent: number;
  backgroundColor: string;
  opacity: number;
  fit: OverlayBarFit;
  contentPosition: OverlayBarContentPosition;
  imageSizePercent: number;
  contentPadding: number;
  contentGap: number;
  contentItems?: OverlayBarContentItem[] | null;
  textContent?: string | null;
  textColor: string;
  fontSize: number;
  widgetType: OverlayBarWidgetType;
  weatherLocation?: string | null;
  companyId: string;
  mediaId?: string | null;
  media?: Media | null;
  playlists?: OverlayBarPlaylistLink[];
  _count?: {
    playlists: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface OverlayBarPayload {
  name: string;
  position: OverlayBarPosition;
  sizePercent: number;
  backgroundColor: string;
  opacity: number;
  fit: OverlayBarFit;
  contentPosition: OverlayBarContentPosition;
  imageSizePercent: number;
  contentPadding: number;
  contentGap: number;
  contentItems: OverlayBarContentItem[];
  textContent: string | null;
  textColor: string;
  fontSize: number;
  widgetType: OverlayBarWidgetType;
  weatherLocation: string | null;
  mediaId: string | null;
}

export interface PlaylistOverlayBar {
  playlistId: string;
  overlayBarId: string;
  order: number;
  createdAt: string;
  overlayBar: OverlayBar;
}

export interface DeleteOverlayBarResponse {
  success: boolean;
  message: string;
  affectedPlaylists: number;
}
