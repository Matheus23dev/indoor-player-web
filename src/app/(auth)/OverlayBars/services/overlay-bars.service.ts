import api from "../../../../services/axios";

import type {
  DeleteOverlayBarResponse,
  OverlayBar,
  OverlayBarPayload,
  PlaylistOverlayBar,
} from "../types";

export async function getOverlayBars(): Promise<OverlayBar[]> {
  const response = await api.get<OverlayBar[]>("/overlay-bars");

  return response.data;
}

export async function createOverlayBar(data: OverlayBarPayload): Promise<OverlayBar> {
  const response = await api.post<OverlayBar>("/overlay-bars", data);

  return response.data;
}

export async function updateOverlayBar(id: string, data: OverlayBarPayload): Promise<OverlayBar> {
  const response = await api.patch<OverlayBar>(`/overlay-bars/${id}`, data);

  return response.data;
}

export async function deleteOverlayBar(id: string): Promise<DeleteOverlayBarResponse> {
  const response = await api.delete<DeleteOverlayBarResponse>(`/overlay-bars/${id}`);

  return response.data;
}

export async function attachOverlayBar(
  overlayBarId: string,
  playlistId: string,
): Promise<PlaylistOverlayBar> {
  const response = await api.post<PlaylistOverlayBar>(
    `/overlay-bars/${overlayBarId}/playlists/${playlistId}`,
  );

  return response.data;
}

export async function detachOverlayBar(overlayBarId: string, playlistId: string) {
  const response = await api.delete<{ success: boolean; message: string }>(
    `/overlay-bars/${overlayBarId}/playlists/${playlistId}`,
  );

  return response.data;
}
