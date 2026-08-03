import { useCallback, useEffect, useMemo, useState } from "react";

import Swal from "sweetalert2";

import {
  addPlaylistItem,
  deletePlaylistItem,
  getPlaylist,
  reorderPlaylist,
  updatePlaylistItem,
} from "../services/Playlists.services";

import type { Media } from "../../Medias/types";

import type { Playlist, PlaylistItem } from "../types";
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

          duration: duration ?? (media.type === "IMAGE" ? 5 : undefined),
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

  const updateDuration = useCallback(async (itemId: string, duration: number) => {
    try {
      setSaving(true);

      const updatedItem = await updatePlaylistItem(itemId, {
        duration,
      });

      setPlaylist((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,

          items: current.items.map((item) => (item.id === itemId ? updatedItem : item)),
        };
      });

      return updatedItem;
    } finally {
      setSaving(false);
    }
  }, []);

  const updateMuted = useCallback(async (itemId: string, muted: boolean) => {
    try {
      setSaving(true);

      const updatedItem = await updatePlaylistItem(itemId, {
        muted,
      });

      setPlaylist((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,

          items: current.items.map((item) => (item.id === itemId ? updatedItem : item)),

          updatedAt: new Date().toISOString(),
        };
      });

      return updatedItem;
    } catch (error: unknown) {
      const message = getApiErrorMessage(error, "Não foi possível atualizar o áudio.");

      await Swal.fire({
        icon: "error",
        title: "Erro ao atualizar áudio",
        text: message,
      });

      throw error;
    } finally {
      setSaving(false);
    }
  }, []);

  const removeItem = useCallback(async (item: PlaylistItem) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Remover mídia?",
      text: `"${item.media.name}" será removida desta playlist.`,
      showCancelButton: true,
      confirmButtonText: "Sim, remover",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setSaving(true);

      await deletePlaylistItem(item.id);

      setPlaylist((current) => {
        if (!current) {
          return current;
        }

        const remaining = current.items
          .filter((currentItem) => currentItem.id !== item.id)
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
    } catch (error: unknown) {
      const message = getApiErrorMessage(error, "Não foi possível remover o item.");

      await Swal.fire({
        icon: "error",
        title: "Erro ao remover",
        text: message,
      });
    } finally {
      setSaving(false);
    }
  }, []);

  const reorderItems = useCallback(
    async (activeItemId: string, overItemId: string) => {
      if (!playlist || activeItemId === overItemId || saving) {
        return;
      }

      const currentIndex = playlist.items.findIndex((item) => item.id === activeItemId);

      const targetIndex = playlist.items.findIndex((item) => item.id === overItemId);

      if (currentIndex < 0 || targetIndex < 0) {
        return;
      }

      const previousItems = playlist.items;

      const reorderedItems = [...previousItems];

      const [movedItem] = reorderedItems.splice(currentIndex, 1);

      if (!movedItem) {
        return;
      }

      reorderedItems.splice(targetIndex, 0, movedItem);

      const normalizedItems = reorderedItems.map((item, index) => ({
        ...item,

        order: index + 1,
      }));

      setPlaylist({
        ...playlist,
        items: normalizedItems,
      });

      try {
        setSaving(true);

        const updatedPlaylist = await reorderPlaylist(playlist.id, {
          items: normalizedItems.map((item) => ({
            id: item.id,

            order: item.order,
          })),
        });

        setPlaylist((current) =>
          current
            ? {
                ...current,
                ...updatedPlaylist,

                items: updatedPlaylist.items?.length > 0 ? updatedPlaylist.items : normalizedItems,
              }
            : current,
        );
      } catch (error: unknown) {
        setPlaylist((current) =>
          current
            ? {
                ...current,

                items: previousItems,
              }
            : current,
        );

        const message = getApiErrorMessage(error, "Não foi possível reordenar a playlist.");

        await Swal.fire({
          icon: "error",
          title: "Erro ao reordenar",
          text: message,
        });
      } finally {
        setSaving(false);
      }
    },
    [playlist, saving],
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
    updateDuration,
    updateMuted,
    removeItem,
    reorderItems,
  };
}
