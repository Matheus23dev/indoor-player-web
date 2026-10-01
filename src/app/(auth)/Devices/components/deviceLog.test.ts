import { describe, expect, it } from "vitest";

import { formatElapsedDuration, parseDeviceLog } from "./deviceLog";

describe("parseDeviceLog", () => {
  it.each([
    [42, "42s"],
    [492, "8min 12s"],
    [12_000, "3h 20min"],
    [187_200, "2 dias 4h"],
  ])("formata %i segundos usando unidades proporcionais", (seconds, expected) => {
    expect(formatElapsedDuration(seconds)).toBe(expected);
  });

  it("atualiza a mensagem de reconexão usando o tempo inativo completo", () => {
    const parsed = parseDeviceLog({
      id: "log-offline",
      deviceId: "device-1",
      message: `@SYSTEM_EVENT:${JSON.stringify({
        event: "PLAYER_CONNECTION_RESTORED",
        message: "Mensagem antiga em minutos.",
        metadata: { offlineSeconds: 90_061 },
        occurredAt: "2026-08-12T12:00:00.000Z",
      })}`,
      createdAt: "2026-08-12T12:00:01.000Z",
    });

    expect(parsed.displayMessage).toContain("1 dia 1h 1min 1s");
  });

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
