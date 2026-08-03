import {
  Clock3,
  GripVertical,
  ImageIcon,
  Minus,
  Plus,
  Save,
  Trash2,
  Video,
  Volume2,
  VolumeOff,
} from "lucide-react";

import { useEffect, useState, type CSSProperties } from "react";

import { useSortable } from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

import Swal from "sweetalert2";

import type { PlaylistItem } from "../types";
import { resolveMediaUrl } from "../../../../lib/mediaUrl";
import { getApiErrorMessage } from "../../../../lib/apiError";

interface PlaylistItemCardProps {
  item: PlaylistItem;
  index: number;
  saving: boolean;

  onUpdateDuration: (itemId: string, duration: number) => Promise<unknown>;

  onUpdateMuted: (itemId: string, muted: boolean) => Promise<unknown>;

  onDelete: (item: PlaylistItem) => Promise<void>;
}

export default function PlaylistItemCard({
  item,
  index,
  saving,
  onUpdateDuration,
  onUpdateMuted,
  onDelete,
}: PlaylistItemCardProps) {
  const isVideo = item.media.type === "VIDEO";

  const originalDuration = item.duration ?? item.media.duration ?? 5;

  const originalMuted = item.muted ?? false;

  const [duration, setDuration] = useState(originalDuration);

  const [muted, setMuted] = useState(originalMuted);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
    disabled: saving,
  });

  const sortableStyle: CSSProperties = {
    transform: CSS.Transform.toString(transform),

    transition,

    position: "relative",

    zIndex: isDragging ? 50 : undefined,
  };

  const durationChanged = duration !== originalDuration;

  const audioChanged = isVideo && muted !== originalMuted;

  const hasChanges = durationChanged || audioChanged;

  useEffect(() => {
    setDuration(item.duration ?? item.media.duration ?? 5);
  }, [item.duration, item.media.duration]);

  useEffect(() => {
    setMuted(item.muted ?? false);
  }, [item.muted]);

  function adjustDuration(amount: number) {
    setDuration((current) =>
      Math.max(1, Math.round(Number.isFinite(current) ? current : 1) + amount),
    );
  }

  async function saveChanges() {
    if (!Number.isInteger(duration) || duration < 1) {
      await Swal.fire({
        icon: "warning",

        title: "Duração inválida",

        text: "Informe um número inteiro maior que zero.",
      });

      return;
    }

    if (!hasChanges) {
      return;
    }

    try {
      if (durationChanged) {
        await onUpdateDuration(item.id, duration);
      }

      if (audioChanged) {
        await onUpdateMuted(item.id, muted);
      }

      await Swal.fire({
        icon: "success",

        title: "Alterações salvas",

        timer: 1000,

        showConfirmButton: false,
      });
    } catch (error: unknown) {
      const message = getApiErrorMessage(error, "Não foi possível salvar as alterações.");

      await Swal.fire({
        icon: "error",

        title: "Erro ao salvar",

        text: message,
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
      <div className="grid gap-0 md:grid-cols-[190px_1fr]">
        <div className="relative aspect-[16/7] bg-black md:aspect-auto md:min-h-32">
          {isVideo ? (
            <video
              src={resolveMediaUrl(item.media.fileUrl)}
              controls
              muted={muted}
              preload="metadata"
              className="h-full w-full object-cover"
            />
          ) : (
            <img
              src={resolveMediaUrl(item.media.fileUrl)}
              alt={item.media.name}
              className="h-full w-full object-cover"
            />
          )}

          <div className="absolute left-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-xs font-black text-white">
            {index + 1}
          </div>
        </div>

        <div className="flex flex-col justify-between gap-3 p-4">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
            <div className="min-w-0">
              <h3
                title={item.media.name}
                className="line-clamp-2 break-words text-base font-extrabold leading-5 text-gray-900"
              >
                {item.media.name}
              </h3>

              <p className="mt-0.5 inline-flex items-center gap-1 text-xs font-semibold text-gray-500">
                {isVideo ? <Video size={14} /> : <ImageIcon size={14} />}

                {isVideo ? "Vídeo" : "Imagem"}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                {...attributes}
                {...listeners}
                disabled={saving}
                className="touch-none rounded-lg border border-blue-200 bg-blue-50 p-1.5 text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-40 sm:cursor-grab sm:active:cursor-grabbing"
                aria-label={`Arrastar ${item.media.name} para alterar a posição`}
                title="Segure e arraste para reordenar"
              >
                <GripVertical size={18} />
              </button>

              <button
                type="button"
                onClick={() => onDelete(item)}
                disabled={saving}
                className="rounded-lg border border-red-200 bg-red-50 p-1.5 text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Remover mídia"
                title="Remover mídia"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2">
            {isVideo && (
              <button
                type="button"
                onClick={() => setMuted((current) => !current)}
                disabled={saving}
                aria-pressed={muted}
                title="Alternar áudio do vídeo"
                className={`inline-flex h-8 items-center gap-1.5 rounded-md border px-2.5 text-[10px] font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  muted
                    ? "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                    : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                }`}
              >
                {muted ? <VolumeOff size={14} /> : <Volume2 size={14} />}
                {muted ? "Sem áudio" : "Com áudio"}
              </button>
            )}

            <div className="flex h-8 items-center rounded-md border border-slate-200 bg-white">
              <label
                htmlFor={`duration-${item.id}`}
                className="flex h-full items-center gap-1.5 border-r border-slate-200 px-2 text-[10px] font-bold text-slate-500"
              >
                <Clock3 size={13} className="text-blue-600" />
                Exibição
              </label>

              <button
                type="button"
                onClick={() => adjustDuration(-1)}
                disabled={saving || duration <= 1}
                aria-label="Diminuir um segundo"
                className="flex h-full w-7 items-center justify-center text-slate-400 transition hover:bg-slate-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <Minus size={13} />
              </button>

              <input
                id={`duration-${item.id}`}
                type="number"
                min={1}
                value={duration}
                onChange={(event) => setDuration(Number(event.target.value))}
                disabled={saving}
                aria-label="Duração em segundos"
                className="h-full w-9 bg-transparent text-center text-xs font-extrabold text-slate-900 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none disabled:opacity-50"
              />

              <span className="px-1 text-[9px] font-bold text-slate-400">seg</span>

              <button
                type="button"
                onClick={() => adjustDuration(1)}
                disabled={saving}
                aria-label="Aumentar um segundo"
                className="flex h-full w-7 items-center justify-center border-l border-slate-200 text-slate-400 transition hover:bg-slate-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <Plus size={13} />
              </button>
            </div>

            <button
              type="button"
              onClick={saveChanges}
              disabled={saving || !hasChanges}
              className="ml-auto inline-flex h-8 items-center justify-center gap-1.5 rounded-md bg-blue-600 px-3 text-[10px] font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
              title={hasChanges ? "Salvar alterações" : "Nenhuma alteração pendente"}
            >
              <Save size={14} />
              {hasChanges ? "Salvar" : "Salvo"}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
