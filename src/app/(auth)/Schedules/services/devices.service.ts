import api from "../../../../services/axios";

import type {
  ScheduleDevice,
} from "../types";

export async function getDevices(): Promise<ScheduleDevice[]> {
  const response =
    await api.get<ScheduleDevice[]>(
      "/devices",
    );

  return response.data;
}