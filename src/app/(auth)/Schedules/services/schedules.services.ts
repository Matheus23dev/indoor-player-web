import instance from "../../../../services/axios";
import type { CreateScheduleDTO, Schedule } from "../types/schedules";

export async function getSchedules(): Promise<Schedule[]> {
  const response = await instance.get("/schedules");
  return response.data;
}

export async function createSchedule(data: CreateScheduleDTO) {
  const response = await instance.post("/schedules", data);
  return response.data;
}

export async function updateSchedule(
  id: string,
  data: Partial<CreateScheduleDTO>
) {
  const response = await instance.patch(`/schedules/${id}`, data);
  return response.data;
}   