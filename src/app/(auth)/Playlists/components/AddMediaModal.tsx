import { useEffect, useMemo, useState } from "react";

import { Check, ChevronRight, Folder, ImageIcon, Loader2, Search, Video, X } from "lucide-react";

import Swal from "sweetalert2";
import { resolveMediaUrl } from "../../../../lib/mediaUrl";
import { getApiErrorMessage } from "../../../../lib/apiError";

import { getFolders } from "../../Medias/services/folders.services";

import { getMedias } from "../../Medias/services/medias.services";

import type { Folder as MediaFolder, Media } from "../../Medias/types";

interface AddMediaModalProps {
  open: boolean;
  saving: boolean;
  onClose: () => void;
  onAdd: (media: Media, duration?: number) => Promise<unknown>;
}

export default function AddMediaModal({ open, saving, onClose, onAdd }: AddMediaModalProps) {
  const [medias, setMedias] = useState<Media[]>([]);

  const [folders, setFolders] = useState<MediaFolder[]>([]);

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);

  const [duration, setDuration] = useState(5);

  const selectedFolder = folders.find((folder) => folder.id === selectedFolderId);

  const visibleFolders = useMemo(() => {
    if (selectedFolderId) {
      return [];
    }

    return folders.filter((folder) => folder.name.toLowerCase().includes(search.toLowerCase()));
  }, [folders, selectedFolderId, search]);

  const visibleMedias = useMemo(() => {
    return medias.filter((media) => {
      const matchesFolder = selectedFolderId
        ? media.folderId === selectedFolderId
        : media.folderId == null;

      const matchesSearch = media.name.toLowerCase().includes(search.toLowerCase());

      return matchesFolder && matchesSearch;
    });
  }, [medias, selectedFolderId, search]);

  useEffect(() => {
    if (!open) {
      setSelectedMedia(null);
      setSelectedFolderId(null);
      setSearch("");
      setDuration(5);
      return;
    }

    async function loadData() {
      try {
        setLoading(true);

        const [mediasData, foldersData] = await Promise.all([getMedias(), getFolders()]);

        setMedias(mediasData);
        setFolders(foldersData);
      } catch (error: unknown) {
        const message = getApiErrorMessage(error, "Não foi possível carregar as mídias.");

        await Swal.fire({
          icon: "error",
          title: "Erro ao carregar mídias",
          text: message,
        });
      } finally {
        setLoading(false);
      }
    }

    void loadData();
  }, [open]);

  if (!open) {
    return null;
  }

  async function handleAdd() {
    if (!selectedMedia) {
      return;
    }

    if (selectedMedia.type === "IMAGE" && (!Number.isInteger(duration) || duration < 1)) {
      await Swal.fire({
        icon: "warning",
        title: "Duração inválida",
        text: "A duração deve ser maior que zero.",
      });

      return;
    }

    try {
      await onAdd(
        selectedMedia,
        selectedMedia.type === "IMAGE" ? duration : (selectedMedia.duration ?? undefined),
      );

      await Swal.fire({
        icon: "success",
        title: "Mídia adicionada",
        timer: 1200,
        showConfirmButton: false,
      });

      setSelectedMedia(null);
      onClose();
    } catch (error: unknown) {
      const message = getApiErrorMessage(error, "Não foi possível adicionar a mídia.");

      await Swal.fire({
        icon: "error",
        title: "Erro ao adicionar",
        text: message,
      });
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[92dvh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b px-5 py-3">
          <div>
            <h2 className="text-lg font-black text-gray-900">Adicionar mídia</h2>

            <p className="text-sm text-gray-500">Escolha uma mídia da biblioteca.</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
          >
            <X size={22} />
          </button>
        </header>

        <div className="space-y-4 overflow-y-auto p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
            <button
              type="button"
              onClick={() => {
                setSelectedFolderId(null);

                setSelectedMedia(null);
              }}
              className={!selectedFolderId ? "font-black text-gray-900" : "hover:text-blue-600"}
            >
              Mídias
            </button>

            {selectedFolder && (
              <>
                <ChevronRight size={16} />

                <span className="font-black text-gray-900">{selectedFolder.name}</span>
              </>
            )}
          </div>

          <div className="relative">
            <Search size={19} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar mídia ou pasta..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </div>

          {loading && (
            <div className="flex min-h-72 items-center justify-center">
              <Loader2 className="animate-spin text-blue-600" size={34} />
            </div>
          )}

          {!loading && visibleFolders.length > 0 && (
            <section className="space-y-2">
              <h3 className="font-black text-gray-900">Pastas</h3>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {visibleFolders.map((folder) => (
                  <button
                    key={folder.id}
                    type="button"
                    onClick={() => {
                      setSelectedFolderId(folder.id);

                      setSelectedMedia(null);

                      setSearch("");
                    }}
                    className="flex items-center gap-3 rounded-xl border border-gray-200 p-3 text-left hover:border-blue-400 hover:bg-blue-50"
                  >
                    <Folder className="text-amber-500" fill="currentColor" />

                    <div className="min-w-0">
                      <p className="line-clamp-2 break-words text-sm font-black text-gray-900">
                        {folder.name}
                      </p>

                      <p className="text-xs text-gray-500">{folder._count?.medias ?? 0} mídia(s)</p>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}

          {!loading && visibleMedias.length > 0 && (
            <section className="space-y-2">
              <h3 className="font-black text-gray-900">Mídias</h3>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {visibleMedias.map((media) => {
                  const selected = selectedMedia?.id === media.id;

                  const mediaUrl = resolveMediaUrl(media.fileUrl);

                  return (
                    <button
                      key={media.id}
                      type="button"
                      onClick={() => {
                        setSelectedMedia(media);

                        setDuration(media.duration ?? 5);
                      }}
                      className={`overflow-hidden rounded-xl border text-left transition ${
                        selected
                          ? "border-blue-600 ring-4 ring-blue-100"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      <div className="relative aspect-[16/7] bg-black">
                        {media.type === "VIDEO" ? (
                          <video
                            src={mediaUrl}
                            muted
                            preload="metadata"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <img
                            src={mediaUrl}
                            alt={media.name}
                            className="h-full w-full object-cover"
                          />
                        )}

                        {selected && (
                          <div className="absolute right-2 top-2 rounded-full bg-blue-600 p-1 text-white">
                            <Check size={17} />
                          </div>
                        )}
                      </div>

                      <div className="p-2.5">
                        <p className="line-clamp-2 min-h-10 break-words text-sm font-black leading-5 text-gray-900">
                          {media.name}
                        </p>

                        <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-gray-500">
                          {media.type === "VIDEO" ? <Video size={13} /> : <ImageIcon size={13} />}

                          {media.type === "VIDEO"
                            ? media.hasAudio === false
                              ? "Vídeo · sem áudio"
                              : "Vídeo"
                            : "Imagem"}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {!loading && visibleFolders.length === 0 && visibleMedias.length === 0 && (
            <div className="py-16 text-center">
              <ImageIcon size={46} className="mx-auto text-gray-300" />

              <p className="mt-3 font-bold text-gray-700">Nenhuma mídia encontrada</p>
            </div>
          )}

          {selectedMedia?.type === "IMAGE" && (
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-3">
              <label htmlFor="image-duration" className="block text-sm font-black text-blue-950">
                Duração da imagem
              </label>

              <div className="mt-2 flex items-center gap-3">
                <input
                  id="image-duration"
                  type="number"
                  min={1}
                  value={duration}
                  onChange={(event) => setDuration(Number(event.target.value))}
                  className="w-28 rounded-xl border border-blue-200 px-4 py-2.5 font-bold outline-none focus:border-blue-500"
                />

                <span className="text-sm font-semibold text-blue-900">segundos</span>
              </div>
            </div>
          )}
        </div>

        <footer className="flex justify-end gap-3 border-t px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="h-9 rounded-xl border px-4 text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleAdd}
            disabled={saving || !selectedMedia}
            className="inline-flex h-9 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            <Check size={18} />

            {saving ? "Adicionando..." : "Adicionar mídia"}
          </button>
        </footer>
      </div>
    </div>
  );
}
