export type DeviceStatus = "ONLINE" | "OFFLINE";

export type MediaType = "IMAGE" | "VIDEO";

export interface DevicePreviewSchedule {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  priority: number;
}

export interface DevicePreviewPlaylist {
  id: string;
  name: string;
}

export interface DevicePreviewItem {
  id: string;
  order: number;
}

export interface DevicePreviewMedia {
  id: string;
  name: string;
  type: MediaType;
  fileUrl: string;
  duration: number | null;
}

export interface DevicePreviewPlayback {
  currentTime: number | null;

  duration: number | null;

  progress: number | null;

  muted: boolean | null;

  startedAt: string | null;

  updatedAt: string | null;
}

export interface DevicePreview {
  schedule: DevicePreviewSchedule | null;

  playlist: DevicePreviewPlaylist | null;

  item: DevicePreviewItem | null;

  media: DevicePreviewMedia | null;

  playback: DevicePreviewPlayback;
}

export interface Device {
  id: string;
  name: string | null;
  code: string;
  isLinked: boolean;
  status: DeviceStatus;
  lastHeartbeat: string | null;
  companyId: string | null;
  createdAt: string;
  updatedAt: string;
  preview: DevicePreview;
}

export interface DeviceLog {
  id: string;
  deviceId: string;
  message: string;
  createdAt: string;
}

export interface PairDevicePayload {
  code: string;
  name: string;
}
