import { useEffect, useState } from "react";

import {
  addMediaToPlaylist,
  getMedias,
} from "../services/Playlists.services";

type Props = {
  open: boolean;
  playlistId: string | null;
  onClose: () => void;
};

export function AddMediaToPlaylistModal({
  open,
  playlistId,
  onClose,
}: Props) {
  const [medias, setMedias] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  
  // Novo estado para controlar o carregamento do botão
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    loadMedias();
  }, [open]);

  async function loadMedias() {
    const data = await getMedias();
    setMedias(data);
  }

  async function handleSave() {
    if (!playlistId) return;

    setIsSaving(true); // Bloqueia o botão

    try {
      // 🚀 CORREÇÃO: Usando for...of para enviar uma mídia por vez (Sequencial)
      for (const mediaId of selected) {
        await addMediaToPlaylist(playlistId, mediaId, 10);
      }

      // Limpa a seleção para a próxima vez que o modal for aberto
      setSelected([]);
      onClose();
    } catch (error) {
      console.error("Erro ao salvar mídias:", error);
      alert("Ocorreu um erro ao adicionar algumas mídias.");
    } finally {
      setIsSaving(false); // Libera o botão
    }
  }

  // Função auxiliar para garantir que limpamos a seleção ao cancelar
  function handleCloseModal() {
    setSelected([]);
    onClose();
  }

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-lg rounded-xl p-6">
        <h2 className="font-bold text-xl mb-4">
          Adicionar mídias
        </h2>

        <div className="space-y-3 max-h-80 overflow-y-auto">
          {medias.map((media) => (
            <label
              key={media.id}
              className={`flex gap-3 border rounded-lg p-3 cursor-pointer transition-colors ${
                selected.includes(media.id) ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50"
              }`}
            >
              <input
                type="checkbox"
                checked={selected.includes(media.id)}
                onChange={() => {
                  if (selected.includes(media.id)) {
                    setSelected(selected.filter((id) => id !== media.id));
                  } else {
                    setSelected([...selected, media.id]);
                  }
                }}
              />
              <span>{media.name}</span>
            </label>
          ))}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={handleCloseModal}
            disabled={isSaving}
            className="border px-4 py-2 rounded-lg disabled:opacity-50"
          >
            Depois
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50 flex items-center gap-2"
          >
            {isSaving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}