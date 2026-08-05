import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";

import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import {
  ArrowLeft,
  Clock3,
  Images,
  Layers3,
  Loader2,
  Monitor,
  Plus,
  Smartphone,
} from "lucide-react";

import { useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { PageContainer, PageScrollArea } from "../../../../components/layout/Page";

import AddMediaModal from "../components/AddMediaModal";
import { PlaylistBarsModal } from "../components/PlaylistBarsModal";
import PlaylistItemCard from "../components/PlaylistItemCard";

import { usePlaylistDetails } from "../hooks/usePlaylistDetails";

export default function PlaylistDetails() {
  const { id } = useParams<{
    id: string;
  }>();

  const navigate = useNavigate();

  const [addMediaModalOpen, setAddMediaModalOpen] = useState(false);
  const [barsModalOpen, setBarsModalOpen] = useState(false);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),

    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 8,
      },
    }),

    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const {
    playlist,
    loading,
    saving,
    totalDuration,

    loadPlaylist,
    addMedia,
    updateDuration,
    removeItem,
    reorderItems,
    updateMuted,
    updateOrientation,
    attachOverlayBar,
    detachOverlayBar,
  } = usePlaylistDetails(id);

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    await reorderItems(String(active.id), String(over.id));
  }

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader2 size={38} className="animate-spin text-blue-600" />
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-black text-gray-900">Playlist não encontrada</h1>

        <button
          type="button"
          onClick={() => navigate("/home/playlists")}
          className="mt-4 font-bold text-blue-600"
        >
          Voltar às playlists
        </button>
      </div>
    );
  }

  return (
    <>
      <PageContainer scrollable>
        <header className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] md:flex-row md:items-center">
          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={() => navigate("/home/playlists")}
              className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border bg-white text-gray-600 hover:bg-gray-50"
            >
              <ArrowLeft size={20} />
            </button>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-700">
                Composição da playlist
              </p>
              <h1 className="mt-0.5 break-words text-2xl font-bold leading-tight tracking-tight text-slate-950">
                {playlist.name}
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Segure o ícone de arrastar e solte a mídia na posição desejada.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div
              className="flex h-10 items-center rounded-xl border border-slate-200 bg-slate-50 p-1"
              aria-label="Orientação da playlist"
            >
              <OrientationButton
                label="Horizontal"
                active={playlist.orientation === "LANDSCAPE"}
                disabled={saving}
                icon={<Monitor size={15} />}
                onClick={() => void updateOrientation("LANDSCAPE")}
              />
              <OrientationButton
                label="Vertical"
                active={playlist.orientation === "PORTRAIT"}
                disabled={saving}
                icon={<Smartphone size={15} />}
                onClick={() => void updateOrientation("PORTRAIT")}
              />
            </div>

            <button
              type="button"
              onClick={() => setBarsModalOpen(true)}
              disabled={saving}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 text-sm font-semibold text-blue-700 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Layers3 size={18} />
              Barras ({playlist.overlayBars?.length ?? 0})
            </button>

            <button
              type="button"
              onClick={() => setAddMediaModalOpen(true)}
              disabled={saving}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus size={19} />
              Adicionar mídia
            </button>
          </div>
        </header>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            icon={<Images size={21} />}
            label="Mídias"
            value={String(playlist.items.length)}
          />

          <SummaryCard
            icon={<Clock3 size={21} />}
            label="Duração total"
            value={formatDuration(totalDuration)}
          />

          <SummaryCard
            icon={<Clock3 size={21} />}
            label="Agendamentos"
            value={String(playlist.schedules?.length ?? 0)}
          />

          <SummaryCard
            icon={<Layers3 size={21} />}
            label="Barras fixas"
            value={String(playlist.overlayBars?.length ?? 0)}
          />
        </div>

        {saving && (
          <div className="flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700">
            <Loader2 size={17} className="animate-spin" />
            Salvando alterações...
          </div>
        )}

        <PageScrollArea ariaLabel="Mídias da playlist">
          {playlist.items.length > 0 ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(event: DragEndEvent) => {
                void handleDragEnd(event);
              }}
            >
              <SortableContext
                items={playlist.items.map((item) => item.id)}
                strategy={verticalListSortingStrategy}
              >
                <section className="space-y-3">
                  {playlist.items.map((item, index) => (
                    <PlaylistItemCard
                      key={item.id}
                      item={item}
                      onUpdateMuted={updateMuted}
                      index={index}
                      saving={saving}
                      onUpdateDuration={updateDuration}
                      onDelete={removeItem}
                    />
                  ))}
                </section>
              </SortableContext>
            </DndContext>
          ) : (
            <div className="flex min-h-80 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
              <div>
                <Images size={52} className="mx-auto text-gray-300" />

                <h2 className="mt-4 text-xl font-black text-gray-900">Playlist vazia</h2>

                <p className="mt-2 text-sm text-gray-500">
                  Adicione imagens e vídeos para começar.
                </p>

                <button
                  type="button"
                  onClick={() => setAddMediaModalOpen(true)}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800"
                >
                  <Plus size={18} />
                  Adicionar mídia
                </button>
              </div>
            </div>
          )}
        </PageScrollArea>
      </PageContainer>

      <AddMediaModal
        open={addMediaModalOpen}
        saving={saving}
        onClose={() => setAddMediaModalOpen(false)}
        onAdd={async (media, duration) => {
          await addMedia(media, duration);

          await loadPlaylist();
        }}
      />

      <PlaylistBarsModal
        open={barsModalOpen}
        saving={saving}
        currentBars={playlist.overlayBars ?? []}
        onClose={() => setBarsModalOpen(false)}
        onAttach={attachOverlayBar}
        onDetach={detachOverlayBar}
      />
    </>
  );
}

interface OrientationButtonProps {
  label: string;
  active: boolean;
  disabled: boolean;
  icon: React.ReactNode;
  onClick: () => void;
}

function OrientationButton({ label, active, disabled, icon, onClick }: OrientationButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-bold transition disabled:opacity-50 ${
        active ? "bg-white text-blue-700 shadow-sm ring-1 ring-slate-200" : "text-slate-500"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

interface SummaryCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function SummaryCard({ icon, label, value }: SummaryCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-3.5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">{icon}</div>

        <div>
          <p className="text-xs font-bold text-gray-500">{label}</p>

          <p className="mt-0.5 text-lg font-black text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600);

  const minutes = Math.floor((seconds % 3600) / 60);

  const remainingSeconds = seconds % 60;

  return [hours, minutes, remainingSeconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
}
