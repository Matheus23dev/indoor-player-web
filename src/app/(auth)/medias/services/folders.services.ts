<<<<<<< HEAD
import instance from "../../../../services/axios";

export async function getFolders() {
  const response = await instance.get("/folders");
  return response.data;
}

export async function createFolder(name: string) {
  const response = await instance.post("/folders", {
    name,
  });
  return response.data;
}

export async function deleteFolder(id: string) {
  const response = await instance.delete(`/folders/${id}`);
  return response.data;
}

export async function updateFolder(id: string, name: string) {
  const response = await instance.patch(`/folders/${id}`, {
    name,
  });
  return response.data;
}
=======
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
>>>>>>> feature/playlist
