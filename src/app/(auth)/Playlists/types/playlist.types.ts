import type {
  Media,
} from "../../medias/types";

export interface PlaylistItem {
  id: string;
  playlistId: string;
  mediaId: string;
  order: number;
  duration?: number | null;
  createdAt: string;
  media: Media;
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
  schedules: number;
}

export interface Playlist {
  id: string;
  name: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;

  items: PlaylistItem[];
  schedules?: PlaylistSchedule[];

  _count?: PlaylistCount;
}

export interface CreatePlaylistPayload {
  name: string;
}

export interface AddPlaylistItemPayload {
  mediaId: string;
  duration?: number;
}

export interface UpdatePlaylistItemPayload {
  duration: number;
}

export interface ReorderPlaylistItem {
  id: string;
  order: number;
}

export interface ReorderPlaylistPayload {
  items: ReorderPlaylistItem[];
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