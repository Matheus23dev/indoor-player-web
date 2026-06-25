import { useCallback, useEffect, useMemo, useState } from "react";

import { useApp } from "../../../../contexts";

import {
  addPlaylistItem,
  getPlaylist,
  removePlaylistItem,
  reorderPlaylist,
  updatePlaylistItem,
} from "../services/Playlists.services";

import type {
    Playlist,
    PlaylistItem,
} from "../types/playlist";

export function usePlaylistDetails(
  playlistId: string,
) {
  const {
    notifySuccess,
    notifyError,
    handleOverlay,
    SAlert,
  } = useApp();

  const [playlist, setPlaylist] =
    useState<Playlist | null>(null);

  const [loading, setLoading] =
    useState(true);

  const loadPlaylist =
    useCallback(async () => {
      try {
        setLoading(true);

        const data =
          await getPlaylist(
            playlistId,
          );

        setPlaylist(data);
      } catch (error) {
        notifyError(
          "Erro ao carregar playlist",
        );
      } finally {
        setLoading(false);
      }
    }, [
      playlistId,
      notifyError,
    ]);

  async function addMedia(
    mediaId: string,
    duration?: number,
  ) {
    try {
      handleOverlay(
        "Adicionando mídia...",
        true,
      );

      await addPlaylistItem(
        playlistId,
        {
          mediaId,
          duration,
        },
      );

      notifySuccess(
        "Mídia adicionada",
      );

      await loadPlaylist();
    } catch {
      notifyError(
        "Erro ao adicionar mídia",
      );
    } finally {
      handleOverlay("", false);
    }
  }

  async function removeMedia(
    itemId: string,
  ) {
    const result =
      await SAlert({
        title:
          "Remover mídia?",
        text:
          "Esta ação não pode ser desfeita.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText:
          "Remover",
        cancelButtonText:
          "Cancelar",
      });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await removePlaylistItem(
        itemId,
      );

      notifySuccess(
        "Mídia removida",
      );

      await loadPlaylist();
    } catch {
      notifyError(
        "Erro ao remover mídia",
      );
    }
  }

  async function updateDuration(
    itemId: string,
    duration: number,
  ) {
    try {
      await updatePlaylistItem(
        itemId,
        {
          duration,
        },
      );

      setPlaylist(
        (oldPlaylist) => {
          if (!oldPlaylist)
            return oldPlaylist;

          return {
            ...oldPlaylist,
            items:
              oldPlaylist.items.map(
                (item) =>
                  item.id ===
                  itemId
                    ? {
                        ...item,
                        duration,
                      }
                    : item,
              ),
          };
        },
      );

      notifySuccess(
        "Duração atualizada",
      );
    } catch {
      notifyError(
        "Erro ao atualizar duração",
      );
    }
  }

  async function reorderItems(
    items: PlaylistItem[],
  ) {
    if (!playlist) return;

    const previous =
      playlist.items;

    setPlaylist({
      ...playlist,
      items,
    });

    try {
      await reorderPlaylist(
        playlist.id,
        {
          items:
            items.map(
              (
                item,
                index,
              ) => ({
                id: item.id,
                order:
                  index + 1,
              }),
            ),
        },
      );
    } catch {
      setPlaylist({
        ...playlist,
        items: previous,
      });

      notifyError(
        "Erro ao reordenar playlist",
      );
    }
  }

  const totalDuration =
    useMemo(() => {
      if (!playlist)
        return 0;

      return playlist.items.reduce(
        (total, item) => {
          if (
            item.media.type ===
            "VIDEO"
          ) {
            return (
              total +
              (item.media
                .duration ||
                0)
            );
          }

          return (
            total +
            (item.duration ||
              5)
          );
        },
        0,
      );
    }, [playlist]);

  useEffect(() => {
    if (!playlistId)
      return;

    loadPlaylist();
  }, [
    playlistId,
    loadPlaylist,
  ]);

  return {
    playlist,

    loading,

    totalDuration,

    addMedia,

    removeMedia,

    updateDuration,

    reorderItems,

    reload:
      loadPlaylist,
  };
}