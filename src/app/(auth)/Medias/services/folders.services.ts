import api from "../../../../services/axios";

import type {
  Folder,
  FolderPayload,
  RemoveFolderResponse,
} from "../types";

export async function getFolders(): Promise<Folder[]> {
  const response =
    await api.get<Folder[]>(
      "/folders",
    );

  return response.data;
}

export async function createFolder(
  data: FolderPayload,
): Promise<Folder> {
  const response =
    await api.post<Folder>(
      "/folders",
      data,
    );

  return response.data;
}

export async function updateFolder(
  id: string,
  data: FolderPayload,
): Promise<Folder> {
  const response =
    await api.patch<Folder>(
      `/folders/${id}`,
      data,
    );

  return response.data;
}

export async function deleteFolder(
  id: string,
): Promise<RemoveFolderResponse> {
  const response =
    await api.delete<RemoveFolderResponse>(
      `/folders/${id}`,
    );

  return response.data;
}
