import api from "@/services/axios";

import type {
  CreateSchedulePayload,
  DeleteScheduleResponse,
  Schedule,
  UpdateSchedulePayload,
} from "../types";

export async function getSchedules(): Promise<Schedule[]> {
  const response = await api.get<Schedule[]>("/schedules");

  return response.data;
}

export async function getSchedule(id: string): Promise<Schedule> {
  const response = await api.get<Schedule>(`/schedules/${id}`);

  return response.data;
}

export async function createSchedule(data: CreateSchedulePayload): Promise<Schedule> {
  const response = await api.post<Schedule>("/schedules", data);

  return response.data;
}

export async function updateSchedule(id: string, data: UpdateSchedulePayload): Promise<Schedule> {
  const response = await api.patch<Schedule>(`/schedules/${id}`, data);

  return response.data;
}

export async function deleteSchedule(id: string): Promise<DeleteScheduleResponse> {
  const response = await api.delete<DeleteScheduleResponse>(`/schedules/${id}`);

  return response.data;
}
