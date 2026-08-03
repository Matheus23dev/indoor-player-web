import api from "@/services/axios";

import type { SchedulePlaylist } from "../types";

export async function getPlaylists(): Promise<SchedulePlaylist[]> {
  const response = await api.get<SchedulePlaylist[]>("/playlists");

  return response.data;
}
