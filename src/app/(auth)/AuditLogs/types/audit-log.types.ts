import type { DeviceLog } from "../../Devices/types/device";

export type AuditLogSourceFilter = "ALL" | "ADMINISTRATION" | "PLAYER" | "SYSTEM";

export interface AuditLogDevice {
  id: string;
  name: string | null;
  code: string;
}

export interface AuditLogEntry extends DeviceLog {
  device: AuditLogDevice;
}

export interface AuditLogsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AuditLogsResponse {
  items: AuditLogEntry[];
  pagination: AuditLogsPagination;
  filters: {
    devices: AuditLogDevice[];
  };
}

export interface AuditLogsQuery {
  page: number;
  limit: number;
  source: AuditLogSourceFilter;
  deviceId?: string;
  search?: string;
  from?: string;
  to?: string;
}
