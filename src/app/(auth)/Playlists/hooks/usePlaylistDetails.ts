import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import Swal from "sweetalert2";

import {
  addPlaylistItem,
  deletePlaylistItem,
  getPlaylist,
  reorderPlaylist,
  updatePlaylistItem,
} from "../services/Playlists.services";

import type {
  Media,
} from "../../medias/types";

import type {
  Playlist,
  PlaylistItem,
} from "../types";

export function usePlaylistDetails(
  playlistId?: string,
) {
  const [playlist, setPlaylist] =
    useState<Playlist | null>(
      null,
    );

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const totalDuration =
    useMemo(() => {
      if (!playlist) {
        return 0;
      }

      return playlist.items.reduce(
        (total, item) =>
          total +
          (
            item.duration ??
            item.media.duration ??
            0
          ),
        0,
      );
    }, [playlist]);

  const loadPlaylist =
    useCallback(async () => {
      if (!playlistId) {
        return null;
      }

      try {
        setLoading(true);

        const data =
          await getPlaylist(
            playlistId,
          );

        setPlaylist(data);

        return data;
      } catch (error: any) {
        const message =
          error?.response?.data
            ?.message ??
          "Não foi possível carregar a playlist.";

        await Swal.fire({
          icon: "error",
          title:
            "Erro ao carregar",
          text: Array.isArray(message)
            ? message[0]
            : message,
        });

        return null;
      } finally {
        setLoading(false);
      }
    }, [playlistId]);

  const addMedia =
    useCallback(
      async (
        media: Media,
        duration?: number,
      ) => {
        if (!playlistId) {
          return;
        }

        try {
          setSaving(true);

          const item =
            await addPlaylistItem(
              playlistId,
              {
                mediaId:
                  media.id,

                duration:
                  duration ??
                  (
                    media.type ===
                    "IMAGE"
                      ? 5
                      : undefined
                  ),
              },
            );

          setPlaylist(
            (current) => {
              if (!current) {
                return current;
              }

              return {
                ...current,

                items: [
                  ...current.items,
                  item,
                ],

                updatedAt:
                  new Date()
                    .toISOString(),
              };
            },
          );

          return item;
        } finally {
          setSaving(false);
        }
      },
      [playlistId],
    );

  const updateDuration =
    useCallback(
      async (
        itemId: string,
        duration: number,
      ) => {
        try {
          setSaving(true);

          const updatedItem =
            await updatePlaylistItem(
              itemId,
              {
                duration,
              },
            );

          setPlaylist(
            (current) => {
              if (!current) {
                return current;
              }

              return {
                ...current,

                items:
                  current.items.map(
                    (item) =>
                      item.id === itemId
                        ? updatedItem
                        : item,
                  ),
              };
            },
          );

          return updatedItem;
        } finally {
          setSaving(false);
        }
      },
      [],
    );

  const removeItem =
    useCallback(
      async (
        item: PlaylistItem,
      ) => {
        const result =
          await Swal.fire({
            icon: "warning",
            title:
              "Remover mídia?",
            text:
              `"${item.media.name}" será removida desta playlist.`,
            showCancelButton:
              true,
            confirmButtonText:
              "Sim, remover",
            cancelButtonText:
              "Cancelar",
            confirmButtonColor:
              "#dc2626",
          });

        if (!result.isConfirmed) {
          return;
        }

        try {
          setSaving(true);

          await deletePlaylistItem(
            item.id,
          );

          setPlaylist(
            (current) => {
              if (!current) {
                return current;
              }

              const remaining =
                current.items
                  .filter(
                    (currentItem) =>
                      currentItem.id !==
                      item.id,
                  )
                  .map(
                    (
                      currentItem,
                      index,
                    ) => ({
                      ...currentItem,
                      order:
                        index + 1,
                    }),
                  );

              return {
                ...current,
                items: remaining,
              };
            },
          );
        } catch (error: any) {
          const message =
            error?.response?.data
              ?.message ??
            "Não foi possível remover o item.";

          await Swal.fire({
            icon: "error",
            title:
              "Erro ao remover",
            text: Array.isArray(
              message,
            )
              ? message[0]
              : message,
          });
        } finally {
          setSaving(false);
        }
      },
      [],
    );

  const moveItem =
    useCallback(
      async (
        itemId: string,
        direction:
          | "UP"
          | "DOWN",
      ) => {
        if (!playlist) {
          return;
        }

        const currentIndex =
          playlist.items.findIndex(
            (item) =>
              item.id ===
              itemId,
          );

        if (currentIndex < 0) {
          return;
        }

        const targetIndex =
          direction === "UP"
            ? currentIndex - 1
            : currentIndex + 1;

        if (
          targetIndex < 0 ||
          targetIndex >=
            playlist.items.length
        ) {
          return;
        }

        const reorderedItems = [
          ...playlist.items,
        ];

        [
          reorderedItems[
            currentIndex
          ],
          reorderedItems[
            targetIndex
          ],
        ] = [
          reorderedItems[
            targetIndex
          ],
          reorderedItems[
            currentIndex
          ],
        ];

        const normalizedItems =
          reorderedItems.map(
            (item, index) => ({
              ...item,
              order: index + 1,
            }),
          );

        const previousItems =
          playlist.items;

        setPlaylist({
          ...playlist,
          items: normalizedItems,
        });

        try {
          setSaving(true);

          const updatedPlaylist =
            await reorderPlaylist(
              playlist.id,
              {
                items:
                  normalizedItems.map(
                    (item) => ({
                      id: item.id,
                      order:
                        item.order,
                    }),
                  ),
              },
            );

          setPlaylist(
            (current) =>
              current
                ? {
                    ...current,
                    items:
                      updatedPlaylist.items,
                    updatedAt:
                      updatedPlaylist.updatedAt,
                  }
                : current,
          );
        } catch (error: any) {
          setPlaylist(
            (current) =>
              current
                ? {
                    ...current,
                    items:
                      previousItems,
                  }
                : current,
          );

          const message =
            error?.response?.data
              ?.message ??
            "Não foi possível reordenar a playlist.";

          await Swal.fire({
            icon: "error",
            title:
              "Erro ao reordenar",
            text: Array.isArray(
              message,
            )
              ? message[0]
              : message,
          });
        } finally {
          setSaving(false);
        }
      },
      [playlist],
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
    removeItem,
    moveItem,
  };
}