import { Calendar, Folder, ImageIcon, Play, Trash2, Video } from "lucide-react";

import { resolveMediaUrl } from "../../../../lib/mediaUrl";

import type { Media } from "../types";

interface MediaCardProps {
  media: Media;
  onDelete: (media: Media) => void | Promise<void>;
}

export default function MediaCard({ media, onDelete }: MediaCardProps) {
  const isVideo = media.type === "VIDEO";
  const mediaUrl = resolveMediaUrl(media.fileUrl);
  const playlistCount = media._count?.playlistItems ?? 0;

  return (
    <article className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">
      <div className="relative aspect-[16/7] overflow-hidden bg-gray-950">
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

        <div className="pointer-events-none absolute left-2.5 top-2.5 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur">
          {isVideo ? (
            <span className="inline-flex items-center gap-1">
              <Video size={12} />
              {media.hasAudio === false ? "Vídeo · sem áudio" : "Vídeo"}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1">
              <ImageIcon size={12} />
              Imagem
            </span>
          )}
        </div>

        {isVideo && media.duration != null && (
          <div className="pointer-events-none absolute bottom-2.5 right-2.5 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur">
            {formatDuration(media.duration)}
          </div>
        )}
      </div>

      <div className="p-3">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <h3 title={media.name} className="truncate text-sm font-extrabold text-gray-900">
              {media.name}
            </h3>

            <div className="mt-1 flex min-w-0 items-center gap-1.5 text-[11px] text-gray-500">
              <span className="shrink-0">{formatFileSize(media.fileSize)}</span>
              <span className="text-gray-300">•</span>
              <Folder size={12} className="shrink-0" />
              <span className="truncate">{media.folder?.name ?? "Sem pasta"}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void onDelete(media)}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-red-100 bg-red-50 text-red-600 transition hover:border-red-200 hover:bg-red-100"
            aria-label={`Excluir ${media.name}`}
            title="Excluir mídia"
          >
            <Trash2 size={15} />
          </button>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-gray-100 pt-2 text-[11px] font-semibold text-gray-500">
          <span className="inline-flex items-center gap-1.5">
            <Play size={12} />
            {playlistCount} {playlistCount === 1 ? "playlist" : "playlists"}
          </span>

          <span className="inline-flex items-center gap-1.5">
            <Calendar size={12} />
            {formatDate(media.createdAt)}
          </span>
        </div>
      </div>
    </article>
  );
}

function formatFileSize(size?: number | null) {
  if (size == null || size <= 0) {
    return "Tamanho não informado";
  }

  const megabytes = size / 1024 / 1024;

  if (megabytes >= 1) {
    return `${megabytes.toFixed(2)} MB`;
  }

  return `${(size / 1024).toFixed(2)} KB`;
}

function formatDuration(totalSeconds: number) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  if (hours > 0) {
    return [hours, minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
  }

  return [minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  }).format(new Date(date));
}
