import type { ReactNode } from "react";

import { ArrowRight, CalendarClock, Clock3, Images, ListVideo, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import type { Playlist } from "../types";

interface PlaylistCardProps {
  playlist: Playlist;
  onDelete: (playlist: Playlist) => void;
}

export default function PlaylistCard({ playlist, onDelete }: PlaylistCardProps) {
  const navigate = useNavigate();
  const itemsCount = playlist._count?.items ?? playlist.items?.length ?? 0;
  const schedulesCount = playlist._count?.schedules ?? 0;
  const totalDuration =
    playlist.items?.reduce((total, item) => {
      const duration = item.duration ?? item.media.duration ?? 0;

      return total + duration;
    }, 0) ?? 0;

  function handleOpenPlaylist() {
    navigate(`/home/playlists/${playlist.id}`);
  }

  function handleDelete() {
    onDelete(playlist);
  }

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">
      <div className="h-1 bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-400" />

      <div className="p-4">
        <header className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 ring-1 ring-blue-100">
            <ListVideo size={21} />
          </div>

          <div className="min-w-0 flex-1">
            <h2
              title={playlist.name}
              className="line-clamp-2 min-h-10 break-words text-base font-extrabold leading-5 text-slate-950"
            >
              {playlist.name}
            </h2>

            <p className="mt-0.5 truncate text-[11px] text-slate-500">
              Atualizada em {formatDate(playlist.updatedAt)}
            </p>
          </div>

          <button
            type="button"
            onClick={handleDelete}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-red-100 bg-red-50 text-red-600 transition hover:border-red-200 hover:bg-red-100"
            aria-label={`Excluir ${playlist.name}`}
            title="Excluir playlist"
          >
            <Trash2 size={15} />
          </button>
        </header>

        <div className="mt-3 grid grid-cols-3 gap-2">
          <InfoItem icon={<Images size={13} />} label="Mídias" value={String(itemsCount)} />
          <InfoItem
            icon={<Clock3 size={13} />}
            label="Duração"
            value={formatDuration(totalDuration)}
          />
          <InfoItem
            icon={<CalendarClock size={13} />}
            label="Agend."
            value={String(schedulesCount)}
          />
        </div>

        <button
          type="button"
          onClick={handleOpenPlaylist}
          className="mt-3 inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
        >
          Abrir playlist
          <ArrowRight size={15} />
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

function InfoItem({ icon, label, value }: InfoItemProps) {
  return (
    <div className="min-w-0 rounded-lg border border-slate-100 bg-slate-50/80 px-2.5 py-2">
      <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wide text-slate-400">
        <span className="text-blue-600">{icon}</span>
        <span className="truncate">{label}</span>
      </div>

      <p className="mt-0.5 truncate text-xs font-extrabold text-slate-900">{value}</p>
    </div>
  );
}

function formatDate(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Data inválida";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(parsedDate);
}

function formatDuration(totalSeconds: number) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${String(minutes).padStart(2, "0")}m`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
