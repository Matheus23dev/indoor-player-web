import type { DeviceLog } from "../types/device";

export type DeviceLogCategory =
  | "SYSTEM"
  | "CONNECTION"
  | "SYNC"
  | "PROGRAMMING"
  | "DOWNLOAD"
  | "PLAYBACK"
  | "AUDIO"
  | "POWER"
  | "CACHE"
  | "SESSION"
  | "ADMINISTRATION";

export type DeviceLogLevel = "INFO" | "SUCCESS" | "WARNING" | "ERROR";

export interface ParsedDeviceLog extends DeviceLog {
  event: string;
  category: DeviceLogCategory;
  level: DeviceLogLevel;
  displayMessage: string;
  metadata: Record<string, string | number | boolean | null>;
  occurredAt: string;
  source: "PLAYER" | "SERVER" | "SYSTEM" | "ADMINISTRATION";
}

interface StoredPlayerLog {
  event?: unknown;
  category?: unknown;
  level?: unknown;
  message?: unknown;
  metadata?: unknown;
  occurredAt?: unknown;
  source?: unknown;
}

interface StoredAdminLog {
  action?: unknown;
  message?: unknown;
  metadata?: unknown;
  occurredAt?: unknown;
}

const PLAYER_LOG_PREFIX = "@PLAYER_EVENT:";
const ADMIN_LOG_PREFIX = "@ADMIN_EVENT:";
const SYSTEM_LOG_PREFIX = "@SYSTEM_EVENT:";

const categories = new Set<DeviceLogCategory>([
  "SYSTEM",
  "CONNECTION",
  "SYNC",
  "PROGRAMMING",
  "DOWNLOAD",
  "PLAYBACK",
  "AUDIO",
  "POWER",
  "CACHE",
  "SESSION",
]);

const levels = new Set<DeviceLogLevel>(["INFO", "SUCCESS", "WARNING", "ERROR"]);

export function parseDeviceLog(log: DeviceLog): ParsedDeviceLog {
  if (log.message.startsWith(ADMIN_LOG_PREFIX)) {
    return parseStructuredAdminLog(log);
  }

  if (log.message.startsWith(SYSTEM_LOG_PREFIX)) {
    return parseStructuredSystemLog(log);
  }

  if (!log.message.startsWith(PLAYER_LOG_PREFIX)) {
    return createAdministrativeLog(log);
  }

  try {
    const payload = JSON.parse(log.message.slice(PLAYER_LOG_PREFIX.length)) as StoredPlayerLog;

    const category = categories.has(payload.category as DeviceLogCategory)
      ? (payload.category as DeviceLogCategory)
      : "SYSTEM";

    const level = levels.has(payload.level as DeviceLogLevel)
      ? (payload.level as DeviceLogLevel)
      : "INFO";

    return {
      ...log,
      event: typeof payload.event === "string" ? payload.event : "PLAYER_EVENT",
      category,
      level,
      displayMessage:
        typeof payload.message === "string" ? payload.message : "Evento do Player registrado.",
      metadata: normalizeMetadata(payload.metadata),
      occurredAt: isValidDate(payload.occurredAt) ? String(payload.occurredAt) : log.createdAt,
      source: payload.source === "SERVER" ? "SERVER" : "PLAYER",
    };
  } catch {
    return createAdministrativeLog(log);
  }
}

function parseStructuredSystemLog(log: DeviceLog): ParsedDeviceLog {
  try {
    const payload = JSON.parse(log.message.slice(SYSTEM_LOG_PREFIX.length)) as StoredPlayerLog;
    const level = levels.has(payload.level as DeviceLogLevel)
      ? (payload.level as DeviceLogLevel)
      : "INFO";

    return {
      ...log,
      event: typeof payload.event === "string" ? payload.event : "SYSTEM_EVENT",
      category: "CONNECTION",
      level,
      displayMessage:
        typeof payload.message === "string" ? payload.message : "Estado da conexão alterado.",
      metadata: normalizeMetadata(payload.metadata),
      occurredAt: isValidDate(payload.occurredAt) ? String(payload.occurredAt) : log.createdAt,
      source: "SYSTEM",
    };
  } catch {
    return createAdministrativeLog(log);
  }
}

function parseStructuredAdminLog(log: DeviceLog): ParsedDeviceLog {
  try {
    const payload = JSON.parse(log.message.slice(ADMIN_LOG_PREFIX.length)) as StoredAdminLog;

    return {
      ...log,
      event: typeof payload.action === "string" ? payload.action : "ADMINISTRATIVE_EVENT",
      category: "ADMINISTRATION",
      level: "INFO",
      displayMessage:
        typeof payload.message === "string"
          ? payload.message
          : "Alteração administrativa registrada.",
      metadata: normalizeMetadata(payload.metadata),
      occurredAt: isValidDate(payload.occurredAt) ? String(payload.occurredAt) : log.createdAt,
      source: "ADMINISTRATION",
    };
  } catch {
    return createAdministrativeLog(log);
  }
}

function createAdministrativeLog(log: DeviceLog): ParsedDeviceLog {
  return {
    ...log,
    event: "ADMINISTRATIVE_EVENT",
    category: "ADMINISTRATION",
    level: "INFO",
    displayMessage: log.message,
    metadata: {},
    occurredAt: log.createdAt,
    source: "ADMINISTRATION",
  };
}

function normalizeMetadata(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  const metadata: Record<string, string | number | boolean | null> = {};

  for (const [key, item] of Object.entries(value)) {
    if (
      item === null ||
      typeof item === "string" ||
      typeof item === "number" ||
      typeof item === "boolean"
    ) {
      metadata[key] = item;
    }
  }

  return metadata;
}

function isValidDate(value: unknown) {
  return typeof value === "string" && Number.isFinite(new Date(value).getTime());
}
