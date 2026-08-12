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
  actor: { id: string; name: string } | null;
  entity: { type: string; id: string } | null;
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
  actor?: unknown;
  entity?: unknown;
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
      actor: null,
      entity: null,
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
      actor: null,
      entity: null,
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
      actor: normalizeActor(payload.actor),
      entity: normalizeEntity(payload.entity),
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
    actor: null,
    entity: null,
  };
}

function normalizeActor(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const actor = value as Record<string, unknown>;

  return typeof actor.id === "string" && typeof actor.name === "string"
    ? { id: actor.id, name: actor.name }
    : null;
}

function normalizeEntity(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const entity = value as Record<string, unknown>;

  return typeof entity.id === "string" && typeof entity.type === "string"
    ? { id: entity.id, type: entity.type }
    : null;
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
