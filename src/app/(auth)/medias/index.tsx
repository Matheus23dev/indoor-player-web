<<<<<<< HEAD
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
=======
import {
  useState,
  type ReactNode,
} from "react";

import {
  ChevronRight,
  FileVideo,
  Folder as FolderIcon,
  FolderPlus,
  ImageIcon,
  Loader2,
  Search,
  Upload,
} from "lucide-react";

import FolderCard from "./components/FolderCard";
import FolderModal from "./components/FolderModal";
import MediaCard from "./components/mediaCard";
import UploadMediaModal from "./components/uploadMediaModal";

import {
  useMediaLibrary,
  type MediaFilter,
} from "./hooks/useMediaLibrary";

import type {
  Folder,
} from "./types";

export default function MediasPage() {
  const [
    uploadModalOpen,
    setUploadModalOpen,
  ] = useState(false);

  const [
    folderModalOpen,
    setFolderModalOpen,
  ] = useState(false);

  const [
    editingFolder,
    setEditingFolder,
  ] = useState<Folder | null>(
    null,
  );

  const {
    folders,
    loading,

    search,
    setSearch,

    filterType,
    setFilterType,

    selectedFolderId,
    selectedFolder,

    visibleFolders,
    visibleMedias,

    totalImages,
    totalVideos,

    loadLibrary,
    openFolder,
    goToRoot,

    handleDeleteMedia,
    handleDeleteFolder,
  } = useMediaLibrary();

  function openCreateFolder() {
    setEditingFolder(null);
    setFolderModalOpen(true);
  }

  function openEditFolder(
    folder: Folder,
  ) {
    setEditingFolder(folder);
    setFolderModalOpen(true);
  }

  function closeFolderModal() {
    setFolderModalOpen(false);
    setEditingFolder(null);
>>>>>>> feature/playlist
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
<<<<<<< HEAD
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
=======
    <div className="min-h-full bg-gray-50 p-4 sm:p-6">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <header className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-gray-900">
              Biblioteca de mídias
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Organize suas imagens e vídeos em pastas.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={openCreateFolder}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
              <FolderPlus size={19} />
              Nova pasta
            </button>

            <button
              type="button"
              onClick={() =>
                setUploadModalOpen(
                  true,
                )
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
            >
              <Upload size={19} />
              Enviar mídia
            </button>
          </div>
        </header>

        <nav className="flex items-center gap-2 overflow-hidden text-sm font-semibold text-gray-500">
          <button
            type="button"
            onClick={goToRoot}
            className={`shrink-0 transition hover:text-blue-600 ${
              !selectedFolderId
                ? "font-black text-gray-900"
                : ""
            }`}
          >
            Mídias
          </button>

          {selectedFolder && (
            <>
              <ChevronRight
                size={16}
                className="shrink-0"
              />

              <span className="truncate font-black text-gray-900">
                {selectedFolder.name}
              </span>
            </>
          )}
        </nav>

        <div className="grid gap-4 md:grid-cols-3">
          <SummaryCard
            title="Pastas"
            value={folders.length}
            icon={
              <FolderIcon
                size={22}
              />
            }
          />

          <SummaryCard
            title="Imagens"
            value={totalImages}
            icon={
              <ImageIcon
                size={22}
              />
            }
          />

          <SummaryCard
            title="Vídeos"
            value={totalVideos}
            icon={
              <FileVideo
                size={22}
              />
            }
          />
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-md">
              <Search
                size={19}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value,
                  )
                }
                placeholder={
                  selectedFolder
                    ? `Buscar em ${selectedFolder.name}...`
                    : "Buscar mídias ou pastas..."
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm font-medium outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div className="flex overflow-x-auto rounded-xl bg-gray-100 p-1">
              <FilterButton
                filter="ALL"
                activeFilter={
                  filterType
                }
                onChange={
                  setFilterType
                }
              >
                Todas
              </FilterButton>

              <FilterButton
                filter="IMAGE"
                activeFilter={
                  filterType
                }
                onChange={
                  setFilterType
                }
              >
                Imagens
              </FilterButton>

              <FilterButton
                filter="VIDEO"
                activeFilter={
                  filterType
                }
                onChange={
                  setFilterType
                }
              >
                Vídeos
              </FilterButton>
            </div>
          </div>
        </div>

        {loading && (
          <div className="flex min-h-80 items-center justify-center rounded-2xl border border-gray-200 bg-white">
            <div className="flex flex-col items-center gap-3 text-gray-500">
              <Loader2
                className="animate-spin"
                size={34}
              />

              <p className="text-sm font-bold">
                Carregando biblioteca...
              </p>
            </div>
          </div>
        )}

        {!loading &&
          visibleFolders.length >
            0 && (
            <section className="space-y-3">
              <h2 className="text-lg font-black text-gray-900">
                Pastas
              </h2>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {visibleFolders.map(
                  (folder) => (
                    <FolderCard
                      key={
                        folder.id
                      }
                      folder={
                        folder
                      }
                      onOpen={
                        openFolder
                      }
                      onEdit={
                        openEditFolder
                      }
                      onDelete={
                        handleDeleteFolder
                      }
                    />
                  ),
                )}
              </div>
            </section>
          )}

        {!loading &&
          visibleMedias.length >
            0 && (
            <section className="space-y-3">
              <h2 className="text-lg font-black text-gray-900">
                {selectedFolder
                  ? `Mídias em ${selectedFolder.name}`
                  : "Mídias sem pasta"}
              </h2>

              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {visibleMedias.map(
                  (media) => (
                    <MediaCard
                      key={
                        media.id
                      }
                      media={
                        media
                      }
                      onDelete={
                        handleDeleteMedia
                      }
                    />
                  ),
                )}
              </div>
            </section>
          )}

        {!loading &&
          visibleFolders.length ===
            0 &&
          visibleMedias.length ===
            0 && (
            <div className="flex min-h-80 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
              <div className="max-w-md">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <ImageIcon size={34} />
                </div>

                <h2 className="text-xl font-black text-gray-900">
                  Nenhum conteúdo encontrado
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  {search.trim()
                    ? "Nenhuma mídia ou pasta corresponde à busca."
                    : selectedFolder
                      ? "Esta pasta ainda não possui mídias."
                      : "Crie uma pasta ou envie sua primeira mídia."}
                </p>
              </div>
            </div>
          )}
>>>>>>> feature/playlist
      </div>

      {/* Modais */}
      <UploadMediaModal
<<<<<<< HEAD
        open={openUpload}
        onClose={() => setOpenUpload(false)}
        onUpload={handleUpload}
      />

      <CreateFolderModal
        open={openFolderModal}
        onClose={() => setOpenFolderModal(false)}
        onCreate={handleCreateFolder}
=======
        open={
          uploadModalOpen
        }
        folders={
          folders
        }
        selectedFolderId={
          selectedFolderId
        }
        onClose={() =>
          setUploadModalOpen(
            false,
          )
        }
        onUploaded={
          loadLibrary
        }
      />

      <FolderModal
        open={
          folderModalOpen
        }
        folder={
          editingFolder
        }
        onClose={
          closeFolderModal
        }
        onSaved={
          loadLibrary
        }
>>>>>>> feature/playlist
      />
    </div>
  );
}

interface SummaryCardProps {
  title: string;
  value: number;
  icon: ReactNode;
}

function SummaryCard({
  title,
  value,
  icon,
}: SummaryCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-gray-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-black text-gray-900">
            {value}
          </p>
        </div>

        <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
          {icon}
        </div>
      </div>
    </div>
  );
}

interface FilterButtonProps {
  filter: MediaFilter;
  activeFilter: MediaFilter;
  onChange: (
    filter: MediaFilter,
  ) => void;
  children: ReactNode;
}

function FilterButton({
  filter,
  activeFilter,
  onChange,
  children,
}: FilterButtonProps) {
  const active =
    filter === activeFilter;

  return (
    <button
      type="button"
      onClick={() =>
        onChange(filter)
      }
      className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-bold transition ${
        active
          ? "bg-white text-blue-700 shadow-sm"
          : "text-gray-500 hover:text-gray-900"
      }`}
    >
      {children}
    </button>
  );
}