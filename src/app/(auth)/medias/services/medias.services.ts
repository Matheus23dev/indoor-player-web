import instance from "../../../../services/axios";

export async function getMedias() {
  const response =
    await instance.get("/medias");

  return response.data;
}

export async function deleteMedia(
  id: string,
) {
  const response =
    await instance.delete(
      `/medias/${id}`,
    );

  return response.data;
}

export async function uploadMedia(file: File, folderId?: string | null) {
  const formData = new FormData();
  formData.append("file", file);
  
  if (folderId) {
    formData.append("folderId", folderId); 
  }

  const response = await instance.post("/medias/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
}