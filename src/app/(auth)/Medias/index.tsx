import { useState, type ReactNode } from "react";

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

import { PageContainer, PageScrollArea } from "../../../components/layout/Page";

import FolderCard from "./components/FolderCard";
import FolderModal from "./components/FolderModal";
import MediaCard from "./components/mediaCard";
import UploadMediaModal from "./components/uploadMediaModal";

import { useMediaLibrary, type MediaFilter } from "./hooks/useMediaLibrary";

import type { Folder } from "./types";

export default function MediasPage() {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);

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

  function openEditFolder(folder: Folder) {
    setEditingFolder(folder);
    setFolderModalOpen(true);
  }

  function closeFolderModal() {
    setFolderModalOpen(false);
    setEditingFolder(null);
  }

  return (
    <>
      <PageContainer scrollable>
        <header
          data-help-tour="media-actions"
          className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] md:flex-row md:items-center"
        >
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-700">
              Gestão de conteúdo
            </p>
            <h1 className="mt-0.5 text-2xl font-bold tracking-tight text-slate-950">
              Biblioteca de mídias
            </h1>

            <p className="mt-1 text-sm text-gray-500">Organize suas imagens e vídeos em pastas.</p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              data-help-tour="media-folder-button"
              type="button"
              onClick={openCreateFolder}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
              <FolderPlus size={19} />
              Nova pasta
            </button>

            <button
              data-help-tour="media-upload-button"
              type="button"
              onClick={() => setUploadModalOpen(true)}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800"
            >
              <Upload size={19} />
              Enviar mídia
            </button>
          </div>
        </header>

        <nav className="flex items-center gap-2 overflow-hidden text-xs font-semibold text-gray-500">
          <button
            type="button"
            onClick={goToRoot}
            className={`shrink-0 transition hover:text-blue-600 ${
              !selectedFolderId ? "font-black text-gray-900" : ""
            }`}
          >
            Mídias
          </button>

          {selectedFolder && (
            <>
              <ChevronRight size={16} className="shrink-0" />

              <span className="truncate font-black text-gray-900">{selectedFolder.name}</span>
            </>
          )}
        </nav>

        <div className="grid gap-3 md:grid-cols-3">
          <SummaryCard title="Pastas" value={folders.length} icon={<FolderIcon size={22} />} />

          <SummaryCard title="Imagens" value={totalImages} icon={<ImageIcon size={22} />} />

          <SummaryCard title="Vídeos" value={totalVideos} icon={<FileVideo size={22} />} />
        </div>

        <div
          data-help-tour="media-library"
          className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-md">
              <Search
                size={19}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={
                  selectedFolder
                    ? `Buscar em ${selectedFolder.name}...`
                    : "Buscar mídias ou pastas..."
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm font-medium outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div className="flex overflow-x-auto rounded-xl bg-gray-100 p-1">
              <FilterButton filter="ALL" activeFilter={filterType} onChange={setFilterType}>
                Todas
              </FilterButton>

              <FilterButton filter="IMAGE" activeFilter={filterType} onChange={setFilterType}>
                Imagens
              </FilterButton>

              <FilterButton filter="VIDEO" activeFilter={filterType} onChange={setFilterType}>
                Vídeos
              </FilterButton>
            </div>
          </div>
        </div>

        <PageScrollArea ariaLabel="Conteúdo da biblioteca" className="space-y-4">
          {loading && (
            <div className="flex min-h-80 items-center justify-center rounded-2xl border border-gray-200 bg-white">
              <div className="flex flex-col items-center gap-3 text-gray-500">
                <Loader2 className="animate-spin" size={34} />

                <p className="text-sm font-bold">Carregando biblioteca...</p>
              </div>
            </div>
          )}

          {!loading && visibleFolders.length > 0 && (
            <section className="space-y-2">
              <h2 className="text-base font-extrabold text-gray-900">Pastas</h2>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {visibleFolders.map((folder) => (
                  <FolderCard
                    key={folder.id}
                    folder={folder}
                    onOpen={openFolder}
                    onEdit={openEditFolder}
                    onDelete={handleDeleteFolder}
                  />
                ))}
              </div>
            </section>
          )}

          {!loading && visibleMedias.length > 0 && (
            <section className="space-y-2">
              <h2 className="text-base font-extrabold text-gray-900">
                {selectedFolder ? `Mídias em ${selectedFolder.name}` : "Mídias sem pasta"}
              </h2>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {visibleMedias.map((media) => (
                  <MediaCard key={media.id} media={media} onDelete={handleDeleteMedia} />
                ))}
              </div>
            </section>
          )}

          {!loading && visibleFolders.length === 0 && visibleMedias.length === 0 && (
            <div className="flex min-h-80 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
              <div className="max-w-md">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <ImageIcon size={34} />
                </div>

                <h2 className="text-xl font-black text-gray-900">Nenhum conteúdo encontrado</h2>

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
        </PageScrollArea>
      </PageContainer>

      <UploadMediaModal
        open={uploadModalOpen}
        folders={folders}
        selectedFolderId={selectedFolderId}
        onClose={() => setUploadModalOpen(false)}
        onUploaded={loadLibrary}
      />

      <FolderModal
        open={folderModalOpen}
        folder={editingFolder}
        onClose={closeFolderModal}
        onSaved={loadLibrary}
      />
    </>
  );
}

interface SummaryCardProps {
  title: string;
  value: number;
  icon: ReactNode;
}

function SummaryCard({ title, value, icon }: SummaryCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-gray-500">{title}</p>

          <p className="mt-1 text-2xl font-black text-gray-900">{value}</p>
        </div>

        <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">{icon}</div>
      </div>
    </div>
  );
}

interface FilterButtonProps {
  filter: MediaFilter;
  activeFilter: MediaFilter;
  onChange: (filter: MediaFilter) => void;
  children: ReactNode;
}

function FilterButton({ filter, activeFilter, onChange, children }: FilterButtonProps) {
  const active = filter === activeFilter;

  return (
    <button
      type="button"
      onClick={() => onChange(filter)}
      className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-bold transition ${
        active ? "bg-white text-blue-700 shadow-sm" : "text-gray-500 hover:text-gray-900"
      }`}
    >
      {children}
    </button>
  );
}
