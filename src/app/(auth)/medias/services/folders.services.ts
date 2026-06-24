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
