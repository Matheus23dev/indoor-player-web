import { describe, expect, it } from "vitest";

import { parseDeviceLog } from "./deviceLog";

describe("parseDeviceLog", () => {
  it("preserva autor e entidade de um evento administrativo", () => {
    const payload = {
      action: "PLAYLIST_UPDATED",
      message: "Maria atualizou a playlist Institucional.",
      actor: { id: "user-1", name: "Maria" },
      entity: { id: "playlist-1", type: "PLAYLIST" },
      occurredAt: "2026-08-12T12:00:00.000Z",
    };
    const parsed = parseDeviceLog({
      id: "log-1",
      deviceId: "device-1",
      message: `@ADMIN_EVENT:${JSON.stringify(payload)}`,
      createdAt: "2026-08-12T12:00:01.000Z",
    });

    expect(parsed.actor).toEqual({ id: "user-1", name: "Maria" });
    expect(parsed.entity).toEqual({ id: "playlist-1", type: "PLAYLIST" });
    expect(parsed.displayMessage).toBe(payload.message);
  });
});
