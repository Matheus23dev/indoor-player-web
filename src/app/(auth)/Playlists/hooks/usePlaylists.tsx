import { useCallback, useEffect, useState } from "react";

import { useApp } from "../../../../contexts";

import {
  createPlaylist,
  deletePlaylist,
  getPlaylists,
} from "../services/Playlists.services";

import type { Playlist } from "../types/playlist";

export function usePlaylists() {
  const {
    notifySuccess,
    notifyError,
    handleOverlay,
    SAlert,
  } = useApp();

  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPlaylists = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getPlaylists();

      setPlaylists(data);
    } catch (error) {
      notifyError(
        "Erro ao carregar playlists",
      );
    } finally {
      setLoading(false);
    }
  }, [notifyError]);

  async function handleCreate(
    name: string,
  ) {
    try {
      handleOverlay(
        "Criando playlist...",
        true,
      );

      await createPlaylist({
        name,
      });

      notifySuccess(
        "Playlist criada com sucesso",
      );

      await loadPlaylists();
    } catch (error) {
      notifyError(
        "Erro ao criar playlist",
      );
    } finally {
      handleOverlay("", false);
    }
  }

  async function handleDelete(
    id: string,
  ) {
    const result = await SAlert({
      title: "Excluir playlist?",
      text:
        "Todos os itens serão removidos.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Excluir",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      handleOverlay(
        "Removendo playlist...",
        true,
      );

      await deletePlaylist(id);

      notifySuccess(
        "Playlist removida com sucesso",
      );

      await loadPlaylists();
    } catch (error) {
      notifyError(
        "Erro ao remover playlist",
      );
    } finally {
      handleOverlay("", false);
    }
  }

  useEffect(() => {
    loadPlaylists();
  }, [loadPlaylists]);

  return {
    playlists,
    loading,

    createPlaylist:
      handleCreate,

    deletePlaylist:
      handleDelete,

    reload:
      loadPlaylists,
  };
}