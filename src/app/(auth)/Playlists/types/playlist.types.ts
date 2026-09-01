import type { Media } from "../../Medias/types";
import type { PlaylistOverlayBar } from "../../OverlayBars/types";

export type PlaylistOrientation = "LANDSCAPE" | "PORTRAIT";

export interface PlaylistItem {
  id: string;
  playlistId: string;
  mediaId: string;
  order: number;
  duration?: number | null;
  muted?: boolean | null;
  createdAt: string;
  media: Media;
  sourceItemId?: string;
}

export interface PlaylistSchedule {
  id: string;
  name: string;
  active: boolean;
  deviceId: string;
  playlistId: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  daysOfWeek: string;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

export interface PlaylistCount {
  items: number;
  overlayBars?: number;
  schedules: number;
}

export interface Playlist {
  id: string;
  name: string;
  orientation: PlaylistOrientation;
  companyId: string;
  createdAt: string;
  updatedAt: string;

  items: PlaylistItem[];
  overlayBars?: PlaylistOverlayBar[];
  schedules?: PlaylistSchedule[];

  _count?: PlaylistCount;
}

export interface CreatePlaylistPayload {
  name: string;
  orientation: PlaylistOrientation;
}

export interface UpdatePlaylistPayload {
  orientation: PlaylistOrientation;
}

export interface AddPlaylistItemPayload {
  mediaId: string;
  duration?: number;
}

export interface UpdatePlaylistItemPayload {
  duration?: number;
  muted?: boolean;
}

export interface ReorderPlaylistItem {
  id: string;
  order: number;
}

export interface ReorderPlaylistPayload {
  items: ReorderPlaylistItem[];
}

export interface SavePlaylistCompositionItem {
  id?: string;
  sourceItemId?: string;
  order: number;
  duration?: number;
  muted?: boolean;
}

export interface SavePlaylistCompositionPayload {
  items: SavePlaylistCompositionItem[];
  orientation: PlaylistOrientation;
  overlayBarIds: string[];
}

export interface DeletePlaylistResponse {
  success: boolean;
  message: string;
  removedItems: number;
  removedSchedules: number;
}

export interface DeletePlaylistItemResponse {
  success: boolean;
  message: string;
}

export interface DeletePlaylistItemsResponse extends DeletePlaylistItemResponse {
  removedItems: number;
}
