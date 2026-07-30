import api from "../../../../services/axios";

import type {
  AddPlaylistItemPayload,
  CreatePlaylistPayload,
  DeletePlaylistItemResponse,
  DeletePlaylistResponse,
  Playlist,
  PlaylistItem,
  ReorderPlaylistPayload,
  UpdatePlaylistItemPayload,
} from "../types";

export async function getPlaylists(): Promise<Playlist[]> {
  const response =
    await api.get<Playlist[]>(
      "/playlists",
    );

  return response.data;
}

export async function getPlaylist(
  id: string,
): Promise<Playlist> {
  console.log(
    "BUSCANDO PLAYLIST:",
    id,
  );

  const response =
    await api.get<Playlist>(
      `/playlists/${id}`,
      {
        timeout: 15_000,
      },
    );

  console.log(
    "PLAYLIST RECEBIDA:",
    response.data,
  );

  return response.data;
}

export async function createPlaylist(
  data: CreatePlaylistPayload,
): Promise<Playlist> {
  const response =
    await api.post<Playlist>(
      "/playlists",
      data,
    );

  return response.data;
}

export async function deletePlaylist(
  id: string,
): Promise<DeletePlaylistResponse> {
  const response =
    await api.delete<DeletePlaylistResponse>(
      `/playlists/${id}`,
    );

  return response.data;
}

export async function addPlaylistItem(
  playlistId: string,
  data: AddPlaylistItemPayload,
): Promise<PlaylistItem> {
  const response =
    await api.post<PlaylistItem>(
      `/playlists/${playlistId}/items`,
      data,
    );

  return response.data;
}

export async function updatePlaylistItem(
  itemId: string,
  data: UpdatePlaylistItemPayload,
): Promise<PlaylistItem> {
  const response =
    await api.patch<PlaylistItem>(
      `/playlists/items/${itemId}`,
      data,
    );

  return response.data;
}

export async function deletePlaylistItem(
  itemId: string,
): Promise<DeletePlaylistItemResponse> {
  const response =
    await api.delete<DeletePlaylistItemResponse>(
      `/playlists/items/${itemId}`,
    );

  return response.data;
}

export async function reorderPlaylist(
  playlistId: string,
  data: ReorderPlaylistPayload,
): Promise<Playlist> {
  const response =
    await api.patch<Playlist>(
      `/playlists/${playlistId}/reorder`,
      data,
    );

  return response.data;
}