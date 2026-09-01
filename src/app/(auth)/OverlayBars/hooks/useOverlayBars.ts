import { useCallback, useEffect, useMemo, useState } from "react";
import { appAlert as Swal } from "@/lib/alert";

import { getApiErrorMessage } from "../../../../lib/apiError";
import { getMedias } from "../../Medias/services/medias.services";
import type { Media } from "../../Medias/types";
import {
  createOverlayBar,
  deleteOverlayBar,
  getOverlayBars,
  updateOverlayBar,
} from "../services/overlay-bars.service";
import type { OverlayBar, OverlayBarPayload } from "../types";

export function useOverlayBars() {
  const [bars, setBars] = useState<OverlayBar[]>([]);
  const [images, setImages] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);

      const [barsData, mediasData] = await Promise.all([getOverlayBars(), getMedias()]);

      setBars(barsData);
      setImages(mediasData.filter((media) => media.type === "IMAGE"));
    } catch (error: unknown) {
      await Swal.fire({
        icon: "error",
        title: "Erro ao carregar",
        text: getApiErrorMessage(error, "Não foi possível carregar as barras."),
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const createBar = useCallback(async (payload: OverlayBarPayload) => {
    try {
      setSaving(true);

      const created = await createOverlayBar(payload);

      setBars((current) => [created, ...current]);

      await Swal.fire({
        icon: "success",
        title: "Barra criada",
        text: "Ela já pode ser usada em várias playlists.",
        timer: 1700,
        showConfirmButton: false,
      });

      return created;
    } catch (error: unknown) {
      await Swal.fire({
        icon: "error",
        title: "Erro ao criar",
        text: getApiErrorMessage(error, "Não foi possível criar a barra."),
      });
      throw error;
    } finally {
      setSaving(false);
    }
  }, []);

  const updateBar = useCallback(async (id: string, payload: OverlayBarPayload) => {
    try {
      setSaving(true);

      const updated = await updateOverlayBar(id, payload);

      setBars((current) => current.map((bar) => (bar.id === id ? updated : bar)));

      await Swal.fire({
        icon: "success",
        title: "Barra atualizada",
        text: "A mudança será sincronizada com todas as playlists vinculadas.",
        timer: 1900,
        showConfirmButton: false,
      });

      return updated;
    } catch (error: unknown) {
      await Swal.fire({
        icon: "error",
        title: "Erro ao atualizar",
        text: getApiErrorMessage(error, "Não foi possível atualizar a barra."),
      });
      throw error;
    } finally {
      setSaving(false);
    }
  }, []);

  const removeBar = useCallback(async (bar: OverlayBar) => {
    const playlistsCount = bar._count?.playlists ?? bar.playlists?.length ?? 0;
    const result = await Swal.fire({
      icon: "warning",
      title: "Excluir barra?",
      text:
        playlistsCount > 0
          ? `Ela será removida de ${playlistsCount} playlist(s).`
          : "Esta ação não poderá ser desfeita.",
      showCancelButton: true,
      confirmButtonText: "Sim, excluir",
      cancelButtonText: "Cancelar",
      customClass: { confirmButton: "indoor-swal-danger" },
    });

    if (!result.isConfirmed) return;

    try {
      setSaving(true);
      await deleteOverlayBar(bar.id);
      setBars((current) => current.filter((item) => item.id !== bar.id));
    } catch (error: unknown) {
      await Swal.fire({
        icon: "error",
        title: "Erro ao excluir",
        text: getApiErrorMessage(error, "Não foi possível excluir a barra."),
      });
    } finally {
      setSaving(false);
    }
  }, []);

  const totalPlaylistLinks = useMemo(
    () => bars.reduce((total, bar) => total + (bar._count?.playlists ?? 0), 0),
    [bars],
  );

  useEffect(() => {
    void load();
  }, [load]);

  return {
    bars,
    images,
    loading,
    saving,
    totalPlaylistLinks,
    createBar,
    updateBar,
    removeBar,
  };
}
