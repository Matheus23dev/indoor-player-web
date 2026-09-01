import { describe, expect, it } from "vitest";

import type { PlaylistOverlayBar } from "../../OverlayBars/types";
import type { PlaylistItem } from "../types";
import {
  buildPlaylistChangeSummary,
  buildPlaylistSettingsChangeSummary,
  countPlaylistChanges,
} from "../utils/playlistChangeSummary";

const originalItems: PlaylistItem[] = [
  {
    id: "image-item",
    playlistId: "playlist-1",
    mediaId: "image-1",
    order: 1,
    duration: 5,
    muted: false,
    createdAt: "2026-08-27T10:00:00.000Z",
    media: {
      id: "image-1",
      name: "Oferta.png",
      type: "IMAGE",
      fileUrl: "/files/oferta.png",
      duration: null,
      createdAt: "2026-08-27T10:00:00.000Z",
      updatedAt: "2026-08-27T10:00:00.000Z",
    },
  },
  {
    id: "video-item",
    playlistId: "playlist-1",
    mediaId: "video-1",
    order: 2,
    duration: 20,
    muted: false,
    createdAt: "2026-08-27T10:00:00.000Z",
    media: {
      id: "video-1",
      name: "Institucional.mp4",
      type: "VIDEO",
      fileUrl: "/files/institucional.mp4",
      duration: 20,
      hasAudio: true,
      createdAt: "2026-08-27T10:00:00.000Z",
      updatedAt: "2026-08-27T10:00:00.000Z",
    },
  },
];

describe("buildPlaylistChangeSummary", () => {
  it("resume duplicação, posição, duração e áudio antes do salvamento", () => {
    const draftItems: PlaylistItem[] = [
      { ...originalItems[1]!, order: 1, muted: true },
      {
        ...originalItems[0]!,
        id: "draft-copy",
        sourceItemId: originalItems[0]!.id,
        order: 2,
        duration: 8,
      },
      { ...originalItems[0]!, order: 3, duration: 10 },
    ];

    const summary = buildPlaylistChangeSummary(originalItems, draftItems);

    expect(summary).toHaveLength(3);
    expect(summary[0]?.details).toEqual([
      "Alterar posição de 2 para 1.",
      "Silenciar o áudio do vídeo.",
    ]);
    expect(summary[1]).toEqual(
      expect.objectContaining({
        kind: "DUPLICATE",
        details: ["Criar uma cópia na posição 2, com exibição de 8s."],
      }),
    );
    expect(summary[2]?.details).toEqual([
      "Alterar posição de 1 para 3.",
      "Alterar tempo de exibição de 5s para 10s.",
    ]);
    expect(countPlaylistChanges(summary)).toBe(5);
  });

  it("não apresenta alterações quando o rascunho corresponde ao estado salvo", () => {
    expect(buildPlaylistChangeSummary(originalItems, originalItems)).toEqual([]);
  });

  it("inclui orientação e vínculos de barras no resumo", () => {
    const originalBar = {
      overlayBarId: "bar-1",
      overlayBar: { name: "Rodapé" },
    } as PlaylistOverlayBar;
    const draftBar = {
      overlayBarId: "bar-2",
      overlayBar: { name: "Lateral" },
    } as PlaylistOverlayBar;

    const summary = buildPlaylistSettingsChangeSummary(
      "LANDSCAPE",
      "PORTRAIT",
      [originalBar],
      [draftBar],
    );

    expect(summary).toEqual([
      expect.objectContaining({
        kind: "ORIENTATION",
        details: ["Alterar de horizontal para vertical."],
      }),
      expect.objectContaining({
        kind: "OVERLAY_BARS",
        details: ["Adicionar a barra “Lateral”.", "Remover a barra “Rodapé”."],
      }),
    ]);
    expect(countPlaylistChanges(summary)).toBe(3);
  });
});
