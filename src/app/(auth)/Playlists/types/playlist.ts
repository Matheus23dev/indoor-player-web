export type MediaType =
  | "IMAGE"
  | "VIDEO";

export interface Media {
  id: string;
  name: string;
  fileUrl: string;
  fileSize: number;
  type: MediaType;

  /**
   * Futuro:
   * duração real do vídeo
   */
  duration?: number;

  createdAt?: string;
}

export interface PlaylistItem {
  id: string;

  playlistId: string;

  mediaId: string;

  order: number;

  /**
   * duração personalizada
   * para imagens
   */
  duration?: number;

  media: Media;
}

export interface Playlist {
  id: string;

  companyId: string;

  name: string;

  createdAt: string;

  items: PlaylistItem[];
}

export interface CreatePlaylistPayload {
  name: string;
}

export interface AddPlaylistItemPayload {
  mediaId: string;
  duration?: number;
}

export interface ReorderPlaylistPayload {
  items: {
    id: string;
    order: number;
  }[];
}

export interface UpdatePlaylistItemPayload {
  duration: number;
}