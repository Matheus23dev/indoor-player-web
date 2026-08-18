export type MediaType = "IMAGE" | "VIDEO";

export interface MediaFolder {
  id: string;
  name: string;
}

export interface MediaPlaylistCount {
  playlistItems: number;
}

export interface Media {
  id: string;
  name: string;
  type: MediaType;
  fileUrl: string;

  fileSize?: number | null;
  duration?: number | null;
  hasAudio?: boolean | null;

  companyId?: string;

  folderId?: string | null;
  folder?: MediaFolder | null;

  createdAt: string;
  updatedAt: string;

  _count?: MediaPlaylistCount;
}

export interface RemoveMediaResponse {
  success: boolean;
  message: string;
  affectedPlaylists: number;
  fileRemoved: boolean;
}

export interface UploadMediaOptions {
  file: File;
  folderId?: string | null;
}
