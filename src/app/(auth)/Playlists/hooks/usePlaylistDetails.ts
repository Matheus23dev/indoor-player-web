import { useCallback, useEffect, useMemo, useState } from "react";

import { appAlert as Swal } from "@/lib/alert";

import {
  addPlaylistItem,
  deletePlaylistItems,
  getPlaylist,
  savePlaylistComposition,
} from "../services/Playlists.services";

import type { Media } from "../../Medias/types";
import type { PlaylistOverlayBar } from "../../OverlayBars/types";

import type { Playlist, PlaylistItem, PlaylistOrientation } from "../types";
import { getApiErrorMessage } from "../../../../lib/apiError";

export function usePlaylistDetails(playlistId?: string) {
  const [playlist, setPlaylist] = useState<Playlist | null>(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const totalDuration = useMemo(() => {
    if (!playlist) {
      return 0;
    }

    return playlist.items.reduce(
      (total, item) => total + (item.duration ?? item.media.duration ?? 0),
      0,
    );
  }, [playlist]);

  const loadPlaylist = useCallback(async () => {
    if (!playlistId) {
      setPlaylist(null);
      setLoading(false);

      return null;
    }

    try {
      setLoading(true);

      const data = await getPlaylist(playlistId);

      setPlaylist(data);

      return data;
    } catch (error: unknown) {
      const message = getApiErrorMessage(error, "Não foi possível carregar a playlist.");

      await Swal.fire({
        icon: "error",
        title: "Erro ao carregar",
        text: message,
      });

      return null;
    } finally {
      setLoading(false);
    }
  }, [playlistId]);

  const addMedia = useCallback(
    async (media: Media, duration?: number) => {
      if (!playlistId) {
        return;
      }

      try {
        setSaving(true);

        const item = await addPlaylistItem(playlistId, {
          mediaId: media.id,

          duration: media.type === "IMAGE" ? (duration ?? 5) : undefined,
        });

        setPlaylist((current) => {
          if (!current) {
            return current;
          }

          return {
            ...current,

            items: [...current.items, item],

            updatedAt: new Date().toISOString(),
          };
        });

        return item;
      } finally {
        setSaving(false);
      }
    },
    [playlistId],
  );

  const saveComposition = useCallback(
    async (
      items: PlaylistItem[],
      orientation: PlaylistOrientation,
      overlayBars: PlaylistOverlayBar[],
    ) => {
      if (!playlistId) {
        return false;
      }

      const invalidImage = items.find(
        (item) =>
          item.media.type === "IMAGE" &&
          (!Number.isInteger(item.duration) || (item.duration ?? 0) < 1),
      );

      if (invalidImage) {
        await Swal.fire({
          icon: "warning",
          title: "Duração inválida",
          text: `Informe uma duração válida para a imagem "${invalidImage.media.name}".`,
        });

        return false;
      }

      try {
        setSaving(true);

        const updatedPlaylist = await savePlaylistComposition(playlistId, {
          items: items.map((item, index) => ({
            ...(item.sourceItemId ? { sourceItemId: item.sourceItemId } : { id: item.id }),
            order: index + 1,
            ...(item.media.type === "IMAGE"
              ? { duration: item.duration ?? item.media.duration ?? 5 }
              : {}),
            ...(item.media.type === "VIDEO"
              ? { muted: item.media.hasAudio === false || Boolean(item.muted) }
              : {}),
          })),
          orientation,
          overlayBarIds: overlayBars.map((item) => item.overlayBarId),
        });

        setPlaylist((current) =>
          current
            ? {
                ...current,
                ...updatedPlaylist,
                items: updatedPlaylist.items,
                overlayBars: updatedPlaylist.overlayBars,
              }
            : updatedPlaylist,
        );

        await Swal.fire({
          icon: "success",
          title: "Composição salva",
          text: "Todas as alterações foram aplicadas com segurança.",
          timer: 1400,
          showConfirmButton: false,
        });

        return true;
      } catch (error: unknown) {
        await Swal.fire({
          icon: "error",
          title: "Erro ao salvar",
          text: getApiErrorMessage(error, "Não foi possível salvar a composição."),
        });

        return false;
      } finally {
        setSaving(false);
      }
    },
    [playlistId],
  );

  const removeItems = useCallback(
    async (items: PlaylistItem[]) => {
      if (!playlistId || items.length === 0) {
        return false;
      }

      const selectedNames = items
        .slice(0, 3)
        .map((item) => `“${item.media.name}”`)
        .join(", ");
      const remainingCount = Math.max(0, items.length - 3);

      const result = await Swal.fire({
        icon: "warning",
        title:
          items.length === 1 ? "Excluir mídia selecionada?" : `Excluir ${items.length} mídias?`,
        text: `${selectedNames}${remainingCount > 0 ? ` e mais ${remainingCount}` : ""} serão removidas da playlist.`,
        showCancelButton: true,
        confirmButtonText: items.length === 1 ? "Excluir mídia" : "Excluir mídias",
        cancelButtonText: "Cancelar",
        customClass: { confirmButton: "indoor-swal-danger" },
      });

      if (!result.isConfirmed) {
        return false;
      }

      try {
        setSaving(true);

        const persistedItemIds = new Set(
          items.filter((item) => !item.sourceItemId).map((item) => item.id),
        );

        if (persistedItemIds.size > 0) {
          await deletePlaylistItems(playlistId, [...persistedItemIds]);
        }

        setPlaylist((current) => {
          if (!current) {
            return current;
          }

          const remaining = current.items
            .filter((currentItem) => !persistedItemIds.has(currentItem.id))
            .map((currentItem, index) => ({
              ...currentItem,
              order: index + 1,
            }));

          return {
            ...current,
            items: remaining,

            updatedAt: new Date().toISOString(),
          };
        });

        await Swal.fire({
          icon: "success",
          title: items.length === 1 ? "Mídia excluída" : "Mídias excluídas",
          timer: 1300,
          showConfirmButton: false,
        });

        return true;
      } catch (error: unknown) {
        await Swal.fire({
          icon: "error",
          title: "Erro ao excluir",
          text: getApiErrorMessage(error, "Não foi possível excluir as mídias selecionadas."),
        });

        return false;
      } finally {
        setSaving(false);
      }
    },
    [playlistId],
  );

  useEffect(() => {
    void loadPlaylist();
  }, [loadPlaylist]);

  return {
    playlist,
    loading,
    saving,
    totalDuration,

    loadPlaylist,
    addMedia,
    saveComposition,
    removeItems,
  };
}
