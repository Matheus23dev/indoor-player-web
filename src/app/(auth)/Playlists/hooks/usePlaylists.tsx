import {
  useCallback,
  useEffect,
  useState,
} from "react";

import Swal from "sweetalert2";

import {
  createPlaylist,
  deletePlaylist,
  getPlaylists,
} from "../services/Playlists.services";

import type {
  Playlist,
} from "../types";

export function usePlaylists() {
  const [playlists, setPlaylists] =
    useState<Playlist[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const loadPlaylists =
    useCallback(async () => {
      try {
        setLoading(true);

        const data =
          await getPlaylists();

        setPlaylists(data);

        return data;
      } catch (error: any) {
        const message =
          error?.response?.data?.message ??
          "Não foi possível carregar as playlists.";

        await Swal.fire({
          icon: "error",
          title:
            "Erro ao carregar playlists",
          text: Array.isArray(message)
            ? message[0]
            : message,
        });

        return [];
      } finally {
        setLoading(false);
      }
    }, []);

  const addPlaylist =
    useCallback(
      async (
        name: string,
      ) => {
        try {
          setSaving(true);

          const playlist =
            await createPlaylist({
              name,
            });

          setPlaylists(
            (current) => [
              playlist,
              ...current,
            ],
          );

          return playlist;
        } finally {
          setSaving(false);
        }
      },
      [],
    );

  const removePlaylist =
    useCallback(
      async (
        playlist: Playlist,
      ) => {
        const itemsCount =
          playlist._count?.items ??
          playlist.items?.length ??
          0;

        const schedulesCount =
          playlist._count?.schedules ??
          0;

        const result =
          await Swal.fire({
            icon: "warning",
            title:
              "Excluir playlist?",
            html: `
              <p>A playlist <strong>${escapeHtml(
                playlist.name,
              )}</strong> será excluída.</p>

              <p style="margin-top: 8px; font-size: 13px;">
                ${itemsCount} item(ns) e ${schedulesCount}
                agendamento(s) também serão removidos.
              </p>
            `,
            showCancelButton:
              true,
            confirmButtonText:
              "Sim, excluir",
            cancelButtonText:
              "Cancelar",
            confirmButtonColor:
              "#dc2626",
          });

        if (!result.isConfirmed) {
          return;
        }

        try {
          const response =
            await deletePlaylist(
              playlist.id,
            );

          setPlaylists(
            (current) =>
              current.filter(
                (item) =>
                  item.id !==
                  playlist.id,
              ),
          );

          await Swal.fire({
            icon: "success",
            title:
              "Playlist excluída",
            text:
              response.removedSchedules >
              0
                ? `${response.removedSchedules} agendamento(s) também foram removidos.`
                : response.message,
          });
        } catch (error: any) {
          const message =
            error?.response?.data
              ?.message ??
            "Não foi possível excluir a playlist.";

          await Swal.fire({
            icon: "error",
            title:
              "Erro ao excluir",
            text: Array.isArray(
              message,
            )
              ? message[0]
              : message,
          });
        }
      },
      [],
    );

  useEffect(() => {
    void loadPlaylists();
  }, [loadPlaylists]);

  return {
    playlists,
    loading,
    saving,

    loadPlaylists,
    addPlaylist,
    removePlaylist,
  };
}

function escapeHtml(
  value: string,
) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}