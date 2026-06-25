import instance from "../../../../services/axios";

import type {
  AddPlaylistItemPayload,
  CreatePlaylistPayload,
  ReorderPlaylistPayload,
  UpdatePlaylistItemPayload,
} from "../types/playlist";

export async function getPlaylists() {
  const response =
    await instance.get(
      "/playlists",
    );

  return response.data;
}

export async function getPlaylist(
  id: string,
) {
  const response =
    await instance.get(
      `/playlists/${id}`,
    );

  return response.data;
}

export async function createPlaylist(
  payload: CreatePlaylistPayload,
) {
  const response =
    await instance.post(
      "/playlists",
      payload,
    );

  return response.data;
}

export async function deletePlaylist(
  id: string,
) {
  const response =
    await instance.delete(
      `/playlists/${id}`,
    );

  return response.data;
}

export async function addPlaylistItem(
  playlistId: string,
  payload: AddPlaylistItemPayload,
) {
  const response =
    await instance.post(
      `/playlists/${playlistId}/items`,
      payload,
    );

  return response.data;
}

export async function removePlaylistItem(
  itemId: string,
) {
  const response =
    await instance.delete(
      `/playlists/items/${itemId}`,
    );

  return response.data;
}

export async function updatePlaylistItem(
  itemId: string,
  payload: UpdatePlaylistItemPayload,
) {
  const response =
    await instance.patch(
      `/playlists/items/${itemId}`,
      payload,
    );

  return response.data;
}

export async function reorderPlaylist(
  playlistId: string,
  payload: ReorderPlaylistPayload,
) {
  const response =
    await instance.patch(
      `/playlists/${playlistId}/reorder`,
      payload,
    );

  return response.data;
}