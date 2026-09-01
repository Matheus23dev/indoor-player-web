import api from "../../../../services/axios";
import { normalizeNamedRecord } from "../../../../lib/textEncoding";

import type {
  AddPlaylistItemPayload,
  CreatePlaylistPayload,
  DeletePlaylistItemResponse,
  DeletePlaylistItemsResponse,
  DeletePlaylistResponse,
  Playlist,
  PlaylistItem,
  ReorderPlaylistPayload,
  SavePlaylistCompositionPayload,
  UpdatePlaylistItemPayload,
  UpdatePlaylistPayload,
} from "../types";

export async function getPlaylists(): Promise<Playlist[]> {
  const response = await api.get<Playlist[]>("/playlists");

  return response.data.map(normalizePlaylistMediaNames);
}

export async function getPlaylist(id: string): Promise<Playlist> {
  const response = await api.get<Playlist>(`/playlists/${id}`, {
    timeout: 15_000,
  });

  return normalizePlaylistMediaNames(response.data);
}

export async function createPlaylist(data: CreatePlaylistPayload): Promise<Playlist> {
  const response = await api.post<Playlist>("/playlists", data);

  return normalizePlaylistMediaNames(response.data);
}

export async function updatePlaylist(id: string, data: UpdatePlaylistPayload): Promise<Playlist> {
  const response = await api.patch<Playlist>(`/playlists/${id}`, data);

  return normalizePlaylistMediaNames(response.data);
}

export async function deletePlaylist(id: string): Promise<DeletePlaylistResponse> {
  const response = await api.delete<DeletePlaylistResponse>(`/playlists/${id}`);

  return response.data;
}

export async function addPlaylistItem(
  playlistId: string,
  data: AddPlaylistItemPayload,
): Promise<PlaylistItem> {
  const response = await api.post<PlaylistItem>(`/playlists/${playlistId}/items`, data);

  return normalizePlaylistItemMediaName(response.data);
}

export async function duplicatePlaylistItem(itemId: string): Promise<PlaylistItem> {
  const response = await api.post<PlaylistItem>(`/playlists/items/${itemId}/duplicate`);

  return normalizePlaylistItemMediaName(response.data);
}

export async function updatePlaylistItem(
  itemId: string,
  data: UpdatePlaylistItemPayload,
): Promise<PlaylistItem> {
  const response = await api.patch<PlaylistItem>(`/playlists/items/${itemId}`, data);

  return normalizePlaylistItemMediaName(response.data);
}

export async function deletePlaylistItem(itemId: string): Promise<DeletePlaylistItemResponse> {
  const response = await api.delete<DeletePlaylistItemResponse>(`/playlists/items/${itemId}`);

  return response.data;
}

export async function reorderPlaylist(
  playlistId: string,
  data: ReorderPlaylistPayload,
): Promise<Playlist> {
  const response = await api.patch<Playlist>(`/playlists/${playlistId}/reorder`, data);

  return normalizePlaylistMediaNames(response.data);
}

export async function savePlaylistComposition(
  playlistId: string,
  data: SavePlaylistCompositionPayload,
): Promise<Playlist> {
  const response = await api.patch<Playlist>(`/playlists/${playlistId}/composition`, data);

  return normalizePlaylistMediaNames(response.data);
}

export async function deletePlaylistItems(
  playlistId: string,
  itemIds: string[],
): Promise<DeletePlaylistItemsResponse> {
  const response = await api.delete<DeletePlaylistItemsResponse>(`/playlists/${playlistId}/items`, {
    data: { itemIds },
  });

  return response.data;
}

function normalizePlaylistMediaNames(playlist: Playlist): Playlist {
  return {
    ...playlist,
    items: (playlist.items ?? []).map(normalizePlaylistItemMediaName),
  };
}

function normalizePlaylistItemMediaName(item: PlaylistItem): PlaylistItem {
  return { ...item, media: normalizeNamedRecord(item.media) };
}
