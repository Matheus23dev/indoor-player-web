import {
  Calendar,
  Folder,
  ImageIcon,
  Play,
  Trash2,
  Video,
} from "lucide-react";

import type {
  Media,
} from "../types";

interface MediaCardProps {
  media: Media;
  onDelete: (media: Media) => void;
}

export default function MediaCard({
  media,
  onDelete,
}: MediaCardProps) {
  const isVideo =
    media.type === "VIDEO";

  const mediaUrl =
    getMediaUrl(
      media.fileUrl,
    );

  return (
    <article className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-video overflow-hidden bg-gray-950">
        {isVideo ? (
          <video
            src={mediaUrl}
            className="h-full w-full object-cover"
            controls
            muted
            preload="metadata"
          />
        ) : (
          <img
            src={mediaUrl}
            alt={media.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        )}

        <div className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-bold text-white backdrop-blur">
          {isVideo ? (
            <span className="inline-flex items-center gap-1">
              <Video size={14} />
              Vídeo
            </span>
          ) : (
            <span className="inline-flex items-center gap-1">
              <ImageIcon size={14} />
              Imagem
            </span>
          )}
        </div>

        {isVideo &&
          media.duration != null && (
            <div className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-black/70 px-3 py-1 text-xs font-bold text-white backdrop-blur">
              {formatDuration(
                media.duration,
              )}
            </div>
          )}
      </div>

      <div className="space-y-4 p-4">
        <div>
          <h3
            title={media.name}
            className="truncate text-base font-black text-gray-900"
          >
            {media.name}
          </h3>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
            <span>
              {formatFileSize(
                media.fileSize,
              )}
            </span>

            <span>•</span>

            <span className="inline-flex min-w-0 items-center gap-1">
              <Folder
                size={13}
                className="shrink-0"
              />

              <span className="truncate">
                {media.folder?.name ??
                  "Sem pasta"}
              </span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-gray-50 p-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
              <Play size={14} />
              Playlists
            </div>

            <p className="mt-1 text-lg font-black text-gray-900">
              {media._count
                ?.playlistItems ?? 0}
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 p-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
              <Calendar size={14} />
              Criado em
            </div>

            <p className="mt-1 text-sm font-black text-gray-900">
              {formatDate(
                media.createdAt,
              )}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            onDelete(media)
          }
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-bold text-red-700 transition hover:bg-red-100"
        >
          <Trash2 size={18} />
          Excluir mídia
        </button>
      </div>
    </article>
  );
}

function getMediaUrl(
  fileUrl: string,
) {
  if (
    fileUrl.startsWith("http://") ||
    fileUrl.startsWith("https://")
  ) {
    return fileUrl;
  }

  const baseURL =
    import.meta.env
      .VITE_BASE_URL_API ?? "";

  return `${baseURL}${fileUrl}`;
}

function formatFileSize(
  size?: number | null,
) {
  if (
    size == null ||
    size <= 0
  ) {
    return "Tamanho não informado";
  }

  const megabytes =
    size / 1024 / 1024;

  if (megabytes >= 1) {
    return `${megabytes.toFixed(2)} MB`;
  }

  return `${(
    size / 1024
  ).toFixed(2)} KB`;
}

function formatDuration(
  totalSeconds: number,
) {
  const safeSeconds =
    Math.max(
      0,
      Math.floor(totalSeconds),
    );

  const hours =
    Math.floor(
      safeSeconds / 3600,
    );

  const minutes =
    Math.floor(
      (safeSeconds % 3600) /
        60,
    );

  const seconds =
    safeSeconds % 60;

  if (hours > 0) {
    return [
      hours,
      minutes,
      seconds,
    ]
      .map((value) =>
        String(value).padStart(
          2,
          "0",
        ),
      )
      .join(":");
  }

  return [
    minutes,
    seconds,
  ]
    .map((value) =>
      String(value).padStart(
        2,
        "0",
      ),
    )
    .join(":");
}

function formatDate(
  date: string,
) {
  return new Intl.DateTimeFormat(
    "pt-BR",
    {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    },
  ).format(
    new Date(date),
  )};
