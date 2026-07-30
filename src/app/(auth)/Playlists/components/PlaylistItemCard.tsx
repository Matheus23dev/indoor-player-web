import {
  Clock3,
  GripVertical,
  ImageIcon,
  Save,
  Trash2,
  Video,
  Volume2,
  VolumeOff,
} from "lucide-react";

import {
  useEffect,
  useState,
  type CSSProperties,
} from "react";

import {
  useSortable,
} from "@dnd-kit/sortable";

import {
  CSS,
} from "@dnd-kit/utilities";

import Swal from "sweetalert2";

import type {
  PlaylistItem,
} from "../types";

interface PlaylistItemCardProps {
  item: PlaylistItem;
  index: number;
  saving: boolean;

  onUpdateDuration: (
    itemId: string,
    duration: number,
  ) => Promise<unknown>;

  onUpdateMuted: (
    itemId: string,
    muted: boolean,
  ) => Promise<unknown>;

  onDelete: (
    item: PlaylistItem,
  ) => Promise<void>;
}

export default function PlaylistItemCard({
  item,
  index,
  saving,
  onUpdateDuration,
  onUpdateMuted,
  onDelete,
}: PlaylistItemCardProps) {
  const isVideo =
    item.media.type ===
    "VIDEO";

  const originalDuration =
    item.duration ??
    item.media.duration ??
    5;

  const originalMuted =
    item.muted ?? false;

  const [duration, setDuration] =
    useState(
      originalDuration,
    );

  const [muted, setMuted] =
    useState(
      originalMuted,
    );

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    disabled: saving,
  });

  const sortableStyle: CSSProperties = {
    transform:
      CSS.Transform.toString(
        transform,
      ),

    transition,

    position:
      "relative",

    zIndex:
      isDragging
        ? 50
        : undefined,
  };

  const durationChanged =
    duration !==
    originalDuration;

  const audioChanged =
    isVideo &&
    muted !== originalMuted;

  const hasChanges =
    durationChanged ||
    audioChanged;

  useEffect(() => {
    setDuration(
      item.duration ??
        item.media.duration ??
        5,
    );
  }, [
    item.duration,
    item.media.duration,
  ]);

  useEffect(() => {
    setMuted(
      item.muted ?? false,
    );
  }, [
    item.muted,
  ]);

  function getMediaUrl(
    fileUrl: string,
  ) {
    if (
      fileUrl.startsWith(
        "http://",
      ) ||
      fileUrl.startsWith(
        "https://",
      )
    ) {
      return fileUrl;
    }

    const baseURL =
      import.meta.env
        .VITE_BASE_URL_API_FILES;

    return `${baseURL}${fileUrl}`;
  }

  async function saveChanges() {
    if (
      !Number.isInteger(
        duration,
      ) ||
      duration < 1
    ) {
      await Swal.fire({
        icon:
          "warning",

        title:
          "Duração inválida",

        text:
          "Informe um número inteiro maior que zero.",
      });

      return;
    }

    if (!hasChanges) {
      return;
    }

    try {
      if (durationChanged) {
        await onUpdateDuration(
          item.id,
          duration,
        );
      }

      if (audioChanged) {
        await onUpdateMuted(
          item.id,
          muted,
        );
      }

      await Swal.fire({
        icon:
          "success",

        title:
          "Alterações salvas",

        timer:
          1000,

        showConfirmButton:
          false,
      });
    } catch (error: any) {
      const message =
        error?.response?.data
          ?.message ??
        "Não foi possível salvar as alterações.";

      await Swal.fire({
        icon:
          "error",

        title:
          "Erro ao salvar",

        text:
          Array.isArray(
            message,
          )
            ? message[0]
            : message,
      });
    }
  }

  return (
    <article
      ref={setNodeRef}
      style={sortableStyle}
      className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow ${
        isDragging
          ? "border-blue-400 opacity-80 shadow-2xl ring-4 ring-blue-100"
          : "border-gray-200"
      }`}
    >
      <div className="grid gap-0 md:grid-cols-[240px_1fr]">
        <div className="relative aspect-video bg-black md:aspect-auto md:min-h-44">
          {isVideo ? (
            <video
              src={getMediaUrl(
                item.media.fileUrl,
              )}
              controls
              muted={muted}
              preload="metadata"
              className="h-full w-full object-cover"
            />
          ) : (
            <img
              src={getMediaUrl(
                item.media.fileUrl,
              )}
              alt={
                item.media.name
              }
              className="h-full w-full object-cover"
            />
          )}

          <div className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-sm font-black text-white">
            {index + 1}
          </div>
        </div>

        <div className="flex flex-col justify-between gap-4 p-5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
            <div className="min-w-0">
              <h3
                title={
                  item.media.name
                }
                className="truncate text-lg font-black text-gray-900"
              >
                {item.media.name}
              </h3>

              <p className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-gray-500">
                {isVideo ? (
                  <Video
                    size={16}
                  />
                ) : (
                  <ImageIcon
                    size={16}
                  />
                )}

                {isVideo
                  ? "Vídeo"
                  : "Imagem"}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                {...attributes}
                {...listeners}
                disabled={saving}
                className="touch-none rounded-lg border border-blue-200 bg-blue-50 p-2 text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-40 sm:cursor-grab sm:active:cursor-grabbing"
                aria-label={`Arrastar ${item.media.name} para alterar a posição`}
                title="Segure e arraste para reordenar"
              >
                <GripVertical
                  size={20}
                />
              </button>

              <button
                type="button"
                onClick={() =>
                  onDelete(item)
                }
                disabled={saving}
                className="rounded-lg border border-red-200 bg-red-50 p-2 text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Remover mídia"
                title="Remover mídia"
              >
                <Trash2
                  size={18}
                />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-xl bg-gray-50 p-4 sm:flex-row sm:items-end">
            {isVideo && (
              <div>
              
                <button
                  type="button"
                  onClick={() =>
                    setMuted(
                      (current) =>
                        !current,
                    )
                  }
                  disabled={saving}
                  className={`flex h-10.5 w-10.5 items-center justify-center rounded-xl border transition disabled:cursor-not-allowed disabled:opacity-50 ${
                    muted
                      ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                      : "border-green-200 bg-green-50 text-green-600 hover:bg-green-100"
                  }`}
                  aria-label={
                    muted
                      ? "Áudio desativado"
                      : "Áudio ativado"
                  }
                  title={
                    muted
                      ? "Áudio desativado"
                      : "Áudio ativado"
                  }
                >
                  {muted ? (
                    <VolumeOff
                      size={19}
                    />
                  ) : (
                    <Volume2
                      size={19}
                    />
                  )}
                </button>
              </div>
            )}

            <div className="flex-1">
              <label
                htmlFor={`duration-${item.id}`}
                className="mb-2 flex items-center gap-1 text-xs font-bold text-gray-600"
              >
                <Clock3
                  size={14}
                />

                Duração da exibição
              </label>

              <div className="flex items-center gap-2">
                <input
                  id={`duration-${item.id}`}
                  type="number"
                 
                  min={1}
                  value={duration}
                  onChange={(
                    event,
                  ) =>
                    setDuration(
                      Number(
                        event
                          .target
                          .value,
                       ),
                    )
                  }
                  disabled={saving}
                  className="w-18 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-bold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:opacity-50"
                />

                <span className="text-sm font-semibold text-gray-500">
                  segundos
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={
                saveChanges
              }
              disabled={
                saving ||
                !hasChanges
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save
                size={17}
              />

              Salvar alterações
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}