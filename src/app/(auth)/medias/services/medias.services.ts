import api from "../../../../services/axios";

import type {
  Media,
  RemoveMediaResponse,
} from "../types";

export async function getMedias(): Promise<Media[]> {
  const response =
    await api.get<Media[]>(
      "/medias",
    );

  return response.data;
}

<<<<<<< HEAD
export async function uploadMedia(file: File, folderId?: string | null) {
  const formData = new FormData();
  formData.append("file", file);
  
  if (folderId) {
    formData.append("folderId", folderId); 
  }

  const response = await instance.post("/medias/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
=======
export async function uploadMedia(
  file: File,
  folderId?: string | null,
): Promise<Media> {
  const formData =
    new FormData();

  formData.append(
    "file",
    file,
  );

  if (folderId) {
    formData.append(
      "folderId",
      folderId,
    );
  }

  const response =
    await api.post<Media>(
      "/medias/upload",
      formData,
    );

  return response.data;
}

export async function deleteMedia(
  id: string,
): Promise<RemoveMediaResponse> {
  const response =
    await api.delete<RemoveMediaResponse>(
      `/medias/${id}`,
    );
>>>>>>> feature/playlist

  return response.data;
}