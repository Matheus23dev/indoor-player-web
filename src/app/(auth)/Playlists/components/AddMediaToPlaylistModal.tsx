import { useEffect, useState } from "react";
import { addMediaToPlaylist, getMedias } from "../services/Playlists.services";
import { getFolders } from "../../medias/services/folders.services";

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
  const [folders, setFolders] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    loadData();
  }, [open]);

  async function loadData() {
    try {
      const [mediasData, foldersData] = await Promise.all([
        getMedias(),
        getFolders()
      ]);
      setMedias(mediasData);
      setFolders(foldersData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  }

  async function handleSave() {
    if (!playlistId) return;

    setIsSaving(true);

    try {
      for (const mediaId of selected) {
        await addMediaToPlaylist(playlistId, mediaId, 10);
      }

      handleCloseModal();
    } catch (error) {
      console.error("Erro ao salvar mídias:", error);
      alert("Ocorreu um erro ao adicionar algumas mídias.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleCloseModal() {
    setSelected([]);
    setCurrentFolderId(null); 
    onClose();
  }

  if (!open) {
    return null;
  }

  const visibleMedias = medias.filter(
    (media) => (media.folderId || null) === currentFolderId
  );

  const currentFolderName = folders.find((f) => f.id === currentFolderId)?.name;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-xl p-6">
        
        {/* Cabeçalho com Navegação */}
        <div className="flex items-center gap-3 mb-4">
          {currentFolderId && (
            <button
              onClick={() => setCurrentFolderId(null)}
              className="text-gray-500 hover:text-black font-medium text-xl"
              title="Voltar"
            >
              ⬅️
            </button>
          )}
          <h2 className="font-bold text-xl">
            {currentFolderId ? `Adicionar mídias / ${currentFolderName}` : "Adicionar mídias"}
          </h2>
        </div>

        <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
          
          {!currentFolderId && folders.map((folder) => (
            <div
              key={folder.id}
              onClick={() => setCurrentFolderId(folder.id)}
              className="flex items-center gap-3 border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div className="text-blue-500 text-xl">📁</div>
              <span className="font-medium text-gray-700">{folder.name}</span>
            </div>
          ))}

          {currentFolderId && visibleMedias.length === 0 && (
            <div className="text-center py-6 text-gray-400">
              Esta pasta está vazia.
            </div>
          )}

          {visibleMedias.map((media) => (
            <label
              key={media.id}
              className={`flex gap-3 border rounded-lg p-3 cursor-pointer transition-colors items-center ${
                selected.includes(media.id) ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50"
              }`}
            >
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600"
                checked={selected.includes(media.id)}
                onChange={() => {
                  if (selected.includes(media.id)) {
                    setSelected(selected.filter((id) => id !== media.id));
                  } else {
                    setSelected([...selected, media.id]);
                  }
                }}
              />
              <span className="truncate">{media.name}</span>
            </label>
          ))}
        </div>

        <div className="flex justify-between items-center mt-6 pt-4 border-t">
          <span className="text-sm text-gray-500 font-medium">
            {selected.length} selecionada(s)
          </span>

          <div className="flex gap-3">
            <button
              onClick={handleCloseModal}
              disabled={isSaving}
              className="border px-4 py-2 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>

            <button
              onClick={handleSave}
              disabled={isSaving || selected.length === 0}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50 flex items-center gap-2 hover:bg-blue-700 transition-colors"
            >
              {isSaving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}