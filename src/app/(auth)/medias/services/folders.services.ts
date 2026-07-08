import api from "../../../../services/axios";

import type {
  DeleteFolderResponse,
  Folder,
  FolderPayload,
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
): Promise<DeleteFolderResponse> {
  const response =
    await api.delete<DeleteFolderResponse>(
      `/folders/${id}`,
    );

  return response.data;
}