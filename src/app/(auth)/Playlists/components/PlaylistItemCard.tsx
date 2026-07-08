import {
  ArrowDown,
  ArrowUp,
  Clock3,
  ImageIcon,
  Save,
  Trash2,
  Video,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import Swal from "sweetalert2";

import type {
  PlaylistItem,
} from "../types";

interface PlaylistItemCardProps {
  item: PlaylistItem;
  index: number;
  totalItems: number;
  saving: boolean;
  onMove: (
    itemId: string,
    direction:
      | "UP"
      | "DOWN",
  ) => Promise<void>;
  onUpdateDuration: (
    itemId: string,
    duration: number,
  ) => Promise<unknown>;
  onDelete: (
    item: PlaylistItem,
  ) => Promise<void>;
}

export default function PlaylistItemCard({
  item,
  index,
  totalItems,
  saving,
  onMove,
  onUpdateDuration,
  onDelete,
}: PlaylistItemCardProps) {
  const isVideo =
    item.media.type ===
    "VIDEO";

  const [duration, setDuration] =
    useState(
      item.duration ??
        item.media.duration ??
        5,
    );

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

  const mediaUrl =
    getMediaUrl(
      item.media.fileUrl,
    );

  async function saveDuration() {
    if (
      !Number.isInteger(
        duration,
      ) ||
      duration < 1
    ) {
      await Swal.fire({
        icon: "warning",
        title:
          "Duração inválida",
        text:
          "Informe um número inteiro maior que zero.",
      });

      return;
    }

    try {
      await onUpdateDuration(
        item.id,
        duration,
      );

      await Swal.fire({
        icon: "success",
        title:
          "Duração atualizada",
        timer: 1000,
        showConfirmButton: false,
      });
    } catch (error: any) {
      const message =
        error?.response?.data
          ?.message ??
        "Não foi possível atualizar a duração.";

      await Swal.fire({
        icon: "error",
        title:
          "Erro ao atualizar",
        text: Array.isArray(message)
          ? message[0]
          : message,
      });
    }
  }

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="grid gap-0 md:grid-cols-[240px_1fr]">
        <div className="relative aspect-video bg-black md:aspect-auto md:min-h-44">
          {isVideo ? (
            <video
              src={mediaUrl}
              controls
              muted
              preload="metadata"
              className="h-full w-full object-cover"
            />
          ) : (
            <img
              src={mediaUrl}
              alt={item.media.name}
              className="h-full w-full object-cover"
            />
          )}

          <div className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-sm font-black text-white">
            {index + 1}
          </div>
        </div>

        <div className="flex flex-col justify-between gap-4 p-5">
          <div>
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
                  onClick={() =>
                    onMove(
                      item.id,
                      "UP",
                    )
                  }
                  disabled={
                    saving ||
                    index === 0
                  }
                  className="rounded-lg border p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-30"
                  aria-label="Mover para cima"
                >
                  <ArrowUp
                    size={18}
                  />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onMove(
                      item.id,
                      "DOWN",
                    )
                  }
                  disabled={
                    saving ||
                    index ===
                      totalItems -
                        1
                  }
                  className="rounded-lg border p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-30"
                  aria-label="Mover para baixo"
                >
                  <ArrowDown
                    size={18}
                  />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onDelete(item)
                  }
                  disabled={saving}
                  className="rounded-lg border border-red-200 bg-red-50 p-2 text-red-600 hover:bg-red-100 disabled:opacity-50"
                  aria-label="Remover mídia"
                >
                  <Trash2
                    size={18}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-xl bg-gray-50 p-4 sm:flex-row sm:items-end">
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
                  onChange={(event) =>
                    setDuration(
                      Number(
                        event.target
                          .value,
                      ),
                    )
                  }
                  disabled={saving}
                  className="w-28 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-bold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />

                <span className="text-sm font-semibold text-gray-500">
                  segundos
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={saveDuration}
              disabled={
                saving ||
                duration ===
                  (
                    item.duration ??
                    item.media
                      .duration ??
                    5
                  )
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              <Save size={17} />
              Salvar duração
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

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

  return `${
    import.meta.env
      .VITE_BASE_URL_API ?? ""
  }${fileUrl}`;
}