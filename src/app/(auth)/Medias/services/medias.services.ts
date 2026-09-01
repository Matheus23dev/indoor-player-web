import api from "../../../../services/axios";
import { normalizeNamedRecord } from "../../../../lib/textEncoding";

import type { Media, RemoveMediaResponse } from "../types";

export async function getMedias(): Promise<Media[]> {
  const response = await api.get<Media[]>("/medias");

  return response.data.map(normalizeNamedRecord);
}

export async function uploadMedia(file: File, folderId?: string | null): Promise<Media> {
  const formData = new FormData();

  formData.append("file", file);

  if (folderId) {
    formData.append("folderId", folderId);
  }

  const response = await api.post<Media>("/medias/upload", formData);

  return normalizeNamedRecord(response.data);
}

export async function deleteMedia(id: string): Promise<RemoveMediaResponse> {
  const response = await api.delete<RemoveMediaResponse>(`/medias/${id}`);

  return response.data;
}
