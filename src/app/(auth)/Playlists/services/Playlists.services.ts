import instance from "../../../../services/axios";

export async function getPlaylists() {
  const response = await instance.get("/playlists");
  return response.data;
}

export async function createPlaylist(name: string) {
  const response = await instance.post("/playlists", {
    name,
  });
  return response.data;
}

export async function removePlaylist(id: string) {
  const response = await instance.delete(`/playlists/${id}`);
  return response.data;
}

export async function addMediaToPlaylist(
  playlistId: string,
  mediaId: string,
  duration = 10,
) {
  const response = await instance.post(
    `/playlists/${playlistId}/items`,
    {
      mediaId,
      duration,
    },
  );
  return response.data;
}

export async function addMultipleMediasToPlaylist(
  playlistId: string,
  mediaIds: string[],
  duration = 10,
) {
  const results = [];
  
  for (const mediaId of mediaIds) {
    const result = await addMediaToPlaylist(playlistId, mediaId, duration);
    results.push(result);
  }
  
  return results;
}

export async function getMedias() {
  const response = await instance.get("/medias");
  return response.data;
}