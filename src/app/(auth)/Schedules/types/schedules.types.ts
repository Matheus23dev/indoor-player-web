export type DeviceStatus =
  | "ONLINE"
  | "OFFLINE";

export interface ScheduleDevice {
  id: string;
  name?: string | null;
  code: string;
  isLinked: boolean;
  status: DeviceStatus;
  companyId?: string | null;
  lastHeartbeat?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SchedulePlaylist {
  id: string;
  name: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;

  _count?: {
    items?: number;
    schedules?: number;
  };
}

export interface Schedule {
  id: string;
  name: string;
  companyId: string;

  deviceId: string;
  playlistId: string;

  startDate: string;
  endDate: string;

  startTime: string;
  endTime: string;

  daysOfWeek: string;

  priority: number;
  active: boolean;

  createdAt: string;
  updatedAt: string;

  device?: ScheduleDevice;
  playlist?: SchedulePlaylist;
}

export interface CreateSchedulePayload {
  name: string;
  deviceId: string;
  playlistId: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  daysOfWeek: string;
  priority?: number;
  active?: boolean;
}

export type UpdateSchedulePayload =
  Partial<CreateSchedulePayload>;

export interface DeleteScheduleResponse {
  success: boolean;
  message: string;
}