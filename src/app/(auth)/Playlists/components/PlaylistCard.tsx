import type { ReactNode } from "react";

import {
  CalendarClock,
  Clock3,
  Images,
  ListVideo,
  Trash2,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import type { Playlist } from "../types";

interface PlaylistCardProps {
  playlist: Playlist;
  onDelete: (playlist: Playlist) => void;
}

export default function PlaylistCard({
  playlist,
  onDelete,
}: PlaylistCardProps) {
  const navigate = useNavigate();

  const itemsCount =
    playlist._count?.items ??
    playlist.items?.length ??
    0;

  const schedulesCount =
    playlist._count?.schedules ?? 0;

  const totalDuration =
    playlist.items?.reduce((total, item) => {
      const duration =
        item.duration ??
        item.media.duration ??
        0;

      return total + duration;
    }, 0) ?? 0;

  function handleOpenPlaylist() {
    navigate(
      `/home/playlists/${playlist.id}`,
    );
  }

  function handleDelete(
    event: React.MouseEvent<HTMLButtonElement>,
  ) {
    event.stopPropagation();
    onDelete(playlist);
  }

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">
      <button
        type="button"
        onClick={handleOpenPlaylist}
        className="block w-full text-left"
      >
        <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
          <ListVideo size={62} />
        </div>

        <div className="space-y-4 p-5">
          <div>
            <h2
              title={playlist.name}
              className="truncate text-lg font-black text-gray-900"
            >
              {playlist.name}
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Atualizada em{" "}
              {formatDate(
                playlist.updatedAt,
              )}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <InfoItem
              icon={<Images size={15} />}
              label="Mídias"
              value={String(itemsCount)}
            />

            <InfoItem
              icon={<Clock3 size={15} />}
              label="Duração"
              value={formatDuration(
                totalDuration,
              )}
            />

            <InfoItem
              icon={
                <CalendarClock size={15} />
              }
              label="Agend."
              value={String(
                schedulesCount,
              )}
            />
          </div>
        </div>
      </button>

      <div className="border-t border-gray-100 p-4">
        <button
          type="button"
          onClick={handleDelete}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-bold text-red-700 transition hover:bg-red-100"
        >
          <Trash2 size={18} />
          Excluir playlist
        </button>
      </div>
    </article>
  );
}

interface InfoItemProps {
  icon: ReactNode;
  label: string;
  value: string;
}

function InfoItem({
  icon,
  label,
  value,
}: InfoItemProps) {
  return (
    <div className="min-w-0 rounded-xl bg-gray-50 p-3">
      <div className="flex items-center gap-1 text-[11px] font-semibold text-gray-500">
        {icon}
        <span className="truncate">
          {label}
        </span>
      </div>

      <p className="mt-1 truncate text-sm font-black text-gray-900">
        {value}
      </p>
    </div>
  );
}

function formatDate(date: string) {
  const parsedDate = new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime(),
    )
  ) {
    return "Data inválida";
  }

  return new Intl.DateTimeFormat(
    "pt-BR",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    },
  ).format(parsedDate);
}

function formatDuration(
  totalSeconds: number,
) {
  const safeSeconds = Math.max(
    0,
    Math.floor(totalSeconds),
  );

  const hours = Math.floor(
    safeSeconds / 3600,
  );

  const minutes = Math.floor(
    (safeSeconds % 3600) / 60,
  );

  const seconds =
    safeSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${String(
      minutes,
    ).padStart(2, "0")}m`;
  }

  return `${String(minutes).padStart(
    2,
    "0",
  )}:${String(seconds).padStart(
    2,
    "0",
  )}`;
}