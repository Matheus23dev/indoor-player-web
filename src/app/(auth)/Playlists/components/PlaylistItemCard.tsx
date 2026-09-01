import {
  Check,
  Clock3,
  CopyPlus,
  GripVertical,
  ImageIcon,
  Minus,
  Plus,
  Video,
  Volume2,
  VolumeOff,
} from "lucide-react";

import type { CSSProperties } from "react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import type { PlaylistItem } from "../types";
import { resolveMediaUrl } from "../../../../lib/mediaUrl";

export interface PlaylistItemDraftChanges {
  duration?: number;
  muted?: boolean;
}

interface PlaylistItemCardProps {
  item: PlaylistItem;
  index: number;
  saving: boolean;
  selected: boolean;
  dirty: boolean;
  onSelectedChange: (itemId: string, selected: boolean) => void;
  onChange: (itemId: string, changes: PlaylistItemDraftChanges) => void;
  onDuplicate: (item: PlaylistItem) => void;
}

export default function PlaylistItemCard({
  item,
  index,
  saving,
  selected,
  dirty,
  onSelectedChange,
  onChange,
  onDuplicate,
}: PlaylistItemCardProps) {
  const isVideo = item.media.type === "VIDEO";
  const hasNoAudioTrack = isVideo && item.media.hasAudio === false;
  const duration = item.duration ?? item.media.duration ?? 5;
  const muted = hasNoAudioTrack || Boolean(item.muted);

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

  function adjustDuration(amount: number) {
    onChange(item.id, {
      duration: Math.max(1, Math.round(Number.isFinite(duration) ? duration : 1) + amount),
    });
  }

  return (
    <article
      data-help-tour={isVideo ? "composition-video-settings" : "composition-image-settings"}
      ref={setNodeRef}
      style={sortableStyle}
      className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition-all ${
        isDragging
          ? "border-blue-400 opacity-80 shadow-2xl ring-4 ring-blue-100"
          : selected
            ? "border-blue-300 ring-2 ring-blue-100"
            : "border-gray-200"
      }`}
    >
      <div className="grid grid-cols-[46px_minmax(0,1fr)]">
        <div
          data-testid="playlist-item-drag-rail"
          className="flex flex-col items-center justify-center gap-3 border-r border-slate-200 bg-slate-50/80 py-3"
        >
          <label
            className="relative flex h-5 w-5 cursor-pointer items-center justify-center"
            title={`Selecionar ${item.media.name}`}
          >
            <input
              type="checkbox"
              checked={selected}
              disabled={saving}
              onChange={(event) => onSelectedChange(item.id, event.target.checked)}
              aria-label={`Selecionar ${item.media.name}`}
              className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-slate-300 bg-white transition checked:border-blue-600 checked:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <Check
              size={14}
              strokeWidth={3}
              className="pointer-events-none absolute text-white opacity-0 peer-checked:opacity-100"
            />
          </label>

          <button
            type="button"
            {...attributes}
            {...listeners}
            disabled={saving}
            className="touch-none rounded-lg border border-transparent p-1.5 text-slate-400 transition hover:border-slate-200 hover:bg-white hover:text-blue-700 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-40 sm:cursor-grab sm:active:cursor-grabbing"
            aria-label={`Arrastar ${item.media.name} para alterar a posição`}
            title="Segure e arraste para reordenar"
          >
            <GripVertical size={19} />
          </button>
        </div>

        <div className="grid min-w-0 gap-0 md:grid-cols-[190px_1fr]">
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

          <div className="flex min-w-0 flex-col justify-between gap-3 p-4">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3
                    title={item.media.name}
                    className="line-clamp-2 break-words text-base font-extrabold leading-5 text-gray-900"
                  >
                    {item.media.name}
                  </h3>

                  {dirty && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-amber-800">
                      Alteração pendente
                    </span>
                  )}
                </div>

                <p className="mt-0.5 inline-flex items-center gap-1 text-xs font-semibold text-gray-500">
                  {isVideo ? <Video size={14} /> : <ImageIcon size={14} />}
                  {isVideo ? "Vídeo" : "Imagem"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => void onDuplicate(item)}
                disabled={saving}
                className="self-start rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label={`Duplicar ${item.media.name}`}
                title="Duplicar mídia"
              >
                <CopyPlus size={16} />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2">
              {isVideo && (
                <button
                  type="button"
                  onClick={() => onChange(item.id, { muted: !muted })}
                  disabled={saving || hasNoAudioTrack}
                  aria-pressed={muted}
                  aria-label={
                    hasNoAudioTrack
                      ? "Sem áudio: o vídeo não possui faixa de áudio"
                      : "Alternar áudio do vídeo"
                  }
                  title={
                    hasNoAudioTrack
                      ? "Este vídeo não possui faixa de áudio"
                      : "A alteração será aplicada ao salvar"
                  }
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

              {isVideo ? (
                <div
                  className="flex h-8 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 text-[10px] font-bold text-slate-500"
                  title="A duração do vídeo é definida automaticamente pelo arquivo"
                >
                  <Clock3 size={13} className="text-blue-600" />
                  Duração do vídeo
                  <strong className="text-slate-800">{formatDuration(duration)}</strong>
                </div>
              ) : (
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
                    onChange={(event) =>
                      onChange(item.id, { duration: Number(event.target.value) })
                    }
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
              )}

              {dirty && (
                <p className="ml-auto text-[10px] font-semibold text-amber-700">
                  Clique em Salvar alterações para aplicar
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function formatDuration(totalSeconds: number) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
