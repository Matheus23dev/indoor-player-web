import { describe, expect, it } from "vitest";

import { parseDeviceLog } from "./deviceLog";

describe("parseDeviceLog", () => {
  it("interpreta perda e retorno da conexão do Player", () => {
    const parsed = parseDeviceLog({
      id: "log-connection",
      deviceId: "device-1",
      message: `@SYSTEM_EVENT:${JSON.stringify({
        version: 1,
        source: "SYSTEM",
        event: "PLAYER_CONNECTION_RESTORED",
        category: "CONNECTION",
        level: "SUCCESS",
        message: "A conexão do Player foi restabelecida após 30s.",
        metadata: { offlineSeconds: 30 },
        occurredAt: "2026-07-30T15:00:00.000Z",
      })}`,
      createdAt: "2026-07-30T15:00:01.000Z",
    });

    expect(parsed).toMatchObject({
      event: "PLAYER_CONNECTION_RESTORED",
      category: "CONNECTION",
      level: "SUCCESS",
      source: "SYSTEM",
      metadata: { offlineSeconds: 30 },
    });
  });

  it("interpreta auditoria administrativa com autor e ação", () => {
    const payload = {
      version: 1,
      source: "ADMINISTRATION",
      action: "SCHEDULE_DEACTIVATED",
      message: 'Maria desativou o agendamento "Almoço" da playlist "Institucional".',
      actor: { id: "admin-1", name: "Maria" },
      metadata: {
        scheduleName: "Almoço",
        playlistName: "Institucional",
        active: false,
      },
      occurredAt: "2026-07-30T15:00:00.000Z",
    };

    const parsed = parseDeviceLog({
      id: "log-admin",
      deviceId: "device-1",
      message: `@ADMIN_EVENT:${JSON.stringify(payload)}`,
      createdAt: "2026-07-30T15:00:01.000Z",
    });

    expect(parsed).toMatchObject({
      event: "SCHEDULE_DEACTIVATED",
      category: "ADMINISTRATION",
      source: "ADMINISTRATION",
      displayMessage: 'Maria desativou o agendamento "Almoço" da playlist "Institucional".',
      metadata: {
        scheduleName: "Almoço",
        playlistName: "Institucional",
        active: false,
      },
    });
  });

  it("interpreta eventos estruturados enviados pelo Player", () => {
    const payload = {
      version: 1,
      source: "PLAYER",
      event: "VIDEO_AUDIO_CHANGED",
      category: "AUDIO",
      level: "SUCCESS",
      message: "O \u00e1udio do v\u00eddeo atual foi silenciado.",
      metadata: {
        media: "institucional.mp4",
        muted: true,
      },
      occurredAt: "2026-07-30T15:00:00.000Z",
    };

    const parsed = parseDeviceLog({
      id: "log-1",
      deviceId: "device-1",
      message: `@PLAYER_EVENT:${JSON.stringify(payload)}`,
      createdAt: "2026-07-30T15:00:01.000Z",
    });

    expect(parsed).toMatchObject({
      category: "AUDIO",
      level: "SUCCESS",
      displayMessage: "O \u00e1udio do v\u00eddeo atual foi silenciado.",
      metadata: {
        media: "institucional.mp4",
        muted: true,
      },
      occurredAt: "2026-07-30T15:00:00.000Z",
      source: "PLAYER",
    });
  });

  it("preserva logs administrativos antigos", () => {
    const parsed = parseDeviceLog({
      id: "log-2",
      deviceId: "device-1",
      message: "Dispositivo vinculado \u00e0 empresa com sucesso.",
      createdAt: "2026-07-30T15:00:00.000Z",
    });

    expect(parsed).toMatchObject({
      category: "ADMINISTRATION",
      level: "INFO",
      source: "ADMINISTRATION",
      displayMessage: "Dispositivo vinculado \u00e0 empresa com sucesso.",
    });
  });
});
