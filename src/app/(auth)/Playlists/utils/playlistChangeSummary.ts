import type { PlaylistItem } from "../types";
import type { PlaylistOrientation } from "../types";
import type { PlaylistOverlayBar } from "../../OverlayBars/types";

export type PlaylistChangeKind = "MEDIA" | "DUPLICATE" | "ORIENTATION" | "OVERLAY_BARS";

export interface PlaylistChangeSummary {
  id: string;
  mediaName: string;
  kind: PlaylistChangeKind;
  details: string[];
}

export function buildPlaylistChangeSummary(
  originalItems: PlaylistItem[],
  draftItems: PlaylistItem[],
): PlaylistChangeSummary[] {
  const originalItemsById = new Map(originalItems.map((item) => [item.id, item]));

  return draftItems.flatMap<PlaylistChangeSummary>((item, index) => {
    const newOrder = index + 1;

    if (item.sourceItemId) {
      const configuration =
        item.media.type === "IMAGE"
          ? `exibição de ${item.duration ?? item.media.duration ?? 5}s`
          : item.media.hasAudio === false || item.muted
            ? "sem áudio"
            : "com áudio";

      return [
        {
          id: item.id,
          mediaName: item.media.name,
          kind: "DUPLICATE",
          details: [`Criar uma cópia na posição ${newOrder}, com ${configuration}.`],
        },
      ];
    }

    const original = originalItemsById.get(item.id);

    if (!original) {
      return [];
    }

    const details: string[] = [];

    if (original.order !== newOrder) {
      details.push(`Alterar posição de ${original.order} para ${newOrder}.`);
    }

    if (item.media.type === "IMAGE") {
      const originalDuration = original.duration ?? original.media.duration ?? 5;
      const draftDuration = item.duration ?? item.media.duration ?? 5;

      if (originalDuration !== draftDuration) {
        details.push(`Alterar tempo de exibição de ${originalDuration}s para ${draftDuration}s.`);
      }
    }

    if (item.media.type === "VIDEO" && item.media.hasAudio !== false) {
      const originalMuted = Boolean(original.muted);
      const draftMuted = Boolean(item.muted);

      if (originalMuted !== draftMuted) {
        details.push(draftMuted ? "Silenciar o áudio do vídeo." : "Ativar o áudio do vídeo.");
      }
    }

    return details.length > 0
      ? [
          {
            id: item.id,
            mediaName: item.media.name,
            kind: "MEDIA",
            details,
          },
        ]
      : [];
  });
}

export function buildPlaylistSettingsChangeSummary(
  originalOrientation: PlaylistOrientation,
  draftOrientation: PlaylistOrientation,
  originalBars: PlaylistOverlayBar[],
  draftBars: PlaylistOverlayBar[],
): PlaylistChangeSummary[] {
  const changes: PlaylistChangeSummary[] = [];

  if (originalOrientation !== draftOrientation) {
    changes.push({
      id: "playlist-orientation",
      mediaName: "Orientação da playlist",
      kind: "ORIENTATION",
      details: [
        `Alterar de ${formatOrientation(originalOrientation)} para ${formatOrientation(draftOrientation)}.`,
      ],
    });
  }

  const originalBarIds = new Set(originalBars.map((item) => item.overlayBarId));
  const draftBarIds = new Set(draftBars.map((item) => item.overlayBarId));
  const barDetails = [
    ...draftBars
      .filter((item) => !originalBarIds.has(item.overlayBarId))
      .map((item) => `Adicionar a barra “${item.overlayBar.name}”.`),
    ...originalBars
      .filter((item) => !draftBarIds.has(item.overlayBarId))
      .map((item) => `Remover a barra “${item.overlayBar.name}”.`),
  ];

  if (barDetails.length > 0) {
    changes.push({
      id: "playlist-overlay-bars",
      mediaName: "Barras fixas",
      kind: "OVERLAY_BARS",
      details: barDetails,
    });
  }

  return changes;
}

export function countPlaylistChanges(changes: PlaylistChangeSummary[]) {
  return changes.reduce((total, change) => total + change.details.length, 0);
}

function formatOrientation(orientation: PlaylistOrientation) {
  return orientation === "PORTRAIT" ? "vertical" : "horizontal";
}
