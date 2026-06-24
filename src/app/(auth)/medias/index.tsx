import { useState } from "react";
import { useMedias } from "./hooks/useMedias";
import { deleteMedia, uploadMedia } from "./services/medias.services";

import { MediaCard } from "./components/mediaCard";
import { UploadMediaModal } from "./components/uploadMediaModal";
import { FolderCard } from "./components/FolderCard";
import { CreateFolderModal } from "./components/CreateFolderModal";
import { useFolders } from "./hooks/useFolders";
import { createFolder, deleteFolder } from "./services/folders.services";

export default function MediasPage() {
  const { medias, loadMedias } = useMedias();
  const { folders, loadFolders } = useFolders();

  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);

  const [openUpload, setOpenUpload] = useState(false);
  const [openFolderModal, setOpenFolderModal] = useState(false);

  async function handleUpload(file: File) {
    await uploadMedia(file, currentFolderId); 
    setOpenUpload(false);
    loadMedias();
  }

  async function handleDeleteMedia(id: string) {
    await deleteMedia(id);
    loadMedias();
  }

  async function handleCreateFolder(name: string) {
    await createFolder(name);
    loadFolders();
  }

  async function handleDeleteFolder(id: string) {
    if (confirm("Tem certeza que deseja excluir esta pasta? As mídias nela voltarão para a raiz.")) {
      await deleteFolder(id);
      loadFolders();
      loadMedias();
    }
  }

  const currentFolderName = folders?.find((f: any) => f.id === currentFolderId)?.name;
  
  const visibleMedias = medias.filter((m: any) => m.folderId === currentFolderId);

  return (
    <div className="p-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          {currentFolderId && (
            <button 
              onClick={() => setCurrentFolderId(null)}
              className="text-gray-500 hover:text-black font-medium"
            >
              ⬅️ Voltar
            </button>
          )}
          <h1 className="text-3xl font-bold">
            {currentFolderId ? `Mídias / ${currentFolderName}` : "Mídias"}
          </h1>
        </div>

        <div className="flex gap-3">
          {!currentFolderId && (
            <button
              onClick={() => setOpenFolderModal(true)}
              className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50"
            >
              Nova Pasta
            </button>
          )}
          <button
            onClick={() => setOpenUpload(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Upload
          </button>
        </div>
      </div>

      {!currentFolderId && folders?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-gray-500 font-medium mb-3">Pastas</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-5">
            {folders.map((folder: any) => (
              <FolderCard 
                key={folder.id} 
                folder={folder} 
                onClick={setCurrentFolderId} 
                onDelete={handleDeleteFolder}
              />
            ))}
          </div>
        </div>
      )}

      {/* Grid de Mídias */}
      <div>
        {!currentFolderId && visibleMedias.length > 0 && (
          <h2 className="text-gray-500 font-medium mb-3">Arquivos</h2>
        )}
        
        {visibleMedias.length === 0 && currentFolderId && (
          <p className="text-gray-400 text-center py-10">Esta pasta está vazia.</p>
        )}

        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-5">
          {visibleMedias.map((media: any) => (
            <MediaCard
              key={media.id}
              media={media}
              onDelete={handleDeleteMedia}
            />
          ))}
        </div>
      </div>

      {/* Modais */}
      <UploadMediaModal
        open={openUpload}
        onClose={() => setOpenUpload(false)}
        onUpload={handleUpload}
      />

      <CreateFolderModal
        open={openFolderModal}
        onClose={() => setOpenFolderModal(false)}
        onCreate={handleCreateFolder}
      />
    </div>
  );
}