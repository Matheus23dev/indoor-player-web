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
  Save,
  Smartphone,
  Trash2,
  Undo2,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { PageContainer, PageScrollArea } from "../../../../components/layout/Page";
import { appAlert as Swal } from "@/lib/alert";

import AddMediaModal from "../components/AddMediaModal";
import { PlaylistBarsModal } from "../components/PlaylistBarsModal";
import { PlaylistChangesModal } from "../components/PlaylistChangesModal";
import PlaylistItemCard from "../components/PlaylistItemCard";
import type { PlaylistItemDraftChanges } from "../components/PlaylistItemCard";

import { usePlaylistDetails } from "../hooks/usePlaylistDetails";
import type { OverlayBar, PlaylistOverlayBar } from "../../OverlayBars/types";
import type { PlaylistItem, PlaylistOrientation } from "../types";
import {
  buildPlaylistChangeSummary,
  buildPlaylistSettingsChangeSummary,
  countPlaylistChanges,
} from "../utils/playlistChangeSummary";

export default function PlaylistDetails() {
  const { id } = useParams<{
    id: string;
  }>();

  const navigate = useNavigate();

  const [addMediaModalOpen, setAddMediaModalOpen] = useState(false);
  const [barsModalOpen, setBarsModalOpen] = useState(false);
  const [changesModalOpen, setChangesModalOpen] = useState(false);
  const [draftItems, setDraftItems] = useState<PlaylistItem[]>([]);
  const [draftOrientation, setDraftOrientation] = useState<PlaylistOrientation>("LANDSCAPE");
  const [draftBars, setDraftBars] = useState<PlaylistOverlayBar[]>([]);
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(() => new Set());

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

    loadPlaylist,
    addMedia,
    saveComposition,
    removeItems,
  } = usePlaylistDetails(id);

  const playlistItems = playlist?.items;

  useEffect(() => {
    if (!playlistItems) {
      setDraftItems([]);
      setSelectedItemIds(new Set());
      return;
    }

    setDraftItems(normalizeItemOrder(playlistItems));
    setSelectedItemIds(new Set());
  }, [playlistItems]);

  useEffect(() => {
    if (playlist?.orientation) {
      setDraftOrientation(playlist.orientation);
    }
  }, [playlist?.orientation]);

  useEffect(() => {
    setDraftBars(playlist?.overlayBars ?? []);
  }, [playlist?.overlayBars]);

  const changeSummary = useMemo(
    () => [
      ...buildPlaylistChangeSummary(playlist?.items ?? [], draftItems),
      ...buildPlaylistSettingsChangeSummary(
        playlist?.orientation ?? "LANDSCAPE",
        draftOrientation,
        playlist?.overlayBars ?? [],
        draftBars,
      ),
    ],
    [
      draftBars,
      draftItems,
      draftOrientation,
      playlist?.items,
      playlist?.orientation,
      playlist?.overlayBars,
    ],
  );

  const dirtyItemIds = useMemo(
    () => new Set(changeSummary.map((change) => change.id)),
    [changeSummary],
  );

  const hasDraftChanges = dirtyItemIds.size > 0;
  const pendingChangeCount = countPlaylistChanges(changeSummary);

  const totalDuration = useMemo(
    () =>
      draftItems.reduce((total, item) => total + (item.duration ?? item.media.duration ?? 0), 0),
    [draftItems],
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const activeItemId = String(active.id);
    const overItemId = String(over.id);

    setDraftItems((currentItems) => {
      const currentIndex = currentItems.findIndex((item) => item.id === activeItemId);
      const targetIndex = currentItems.findIndex((item) => item.id === overItemId);

      if (currentIndex < 0 || targetIndex < 0) {
        return currentItems;
      }

      const reorderedItems = [...currentItems];
      const [movedItem] = reorderedItems.splice(currentIndex, 1);

      if (!movedItem) {
        return currentItems;
      }

      reorderedItems.splice(targetIndex, 0, movedItem);

      return normalizeItemOrder(reorderedItems);
    });
  }

  function handleDraftChange(itemId: string, changes: PlaylistItemDraftChanges) {
    setDraftItems((currentItems) =>
      currentItems.map((item) => (item.id === itemId ? { ...item, ...changes } : item)),
    );
  }

  function handleDuplicateDraft(item: PlaylistItem) {
    setDraftItems((currentItems) => {
      const sourceIndex = currentItems.findIndex((currentItem) => currentItem.id === item.id);

      if (sourceIndex < 0) {
        return currentItems;
      }

      const duplicatedItem: PlaylistItem = {
        ...item,
        id: `draft-duplicate-${crypto.randomUUID()}`,
        sourceItemId: item.sourceItemId ?? item.id,
        createdAt: new Date().toISOString(),
      };
      const updatedItems = [...currentItems];

      updatedItems.splice(sourceIndex + 1, 0, duplicatedItem);

      return normalizeItemOrder(updatedItems);
    });
  }

  function handleAttachOverlayBar(overlayBar: OverlayBar) {
    setDraftBars((currentBars) => {
      if (currentBars.some((item) => item.overlayBarId === overlayBar.id)) {
        return currentBars;
      }

      return [
        ...currentBars,
        {
          playlistId: playlist?.id ?? "",
          overlayBarId: overlayBar.id,
          order: currentBars.length + 1,
          createdAt: new Date().toISOString(),
          overlayBar,
        },
      ];
    });
  }

  function handleDetachOverlayBar(overlayBarId: string) {
    setDraftBars((currentBars) =>
      currentBars
        .filter((item) => item.overlayBarId !== overlayBarId)
        .map((item, index) => ({ ...item, order: index + 1 })),
    );
  }

  function handleSelectedChange(itemId: string, selected: boolean) {
    setSelectedItemIds((currentIds) => {
      const nextIds = new Set(currentIds);

      if (selected) {
        nextIds.add(itemId);
      } else {
        nextIds.delete(itemId);
      }

      return nextIds;
    });
  }

  function toggleSelectAll() {
    setSelectedItemIds((currentIds) =>
      currentIds.size === draftItems.length
        ? new Set()
        : new Set(draftItems.map((item) => item.id)),
    );
  }

  async function handleSaveComposition() {
    if (hasDraftChanges) {
      setChangesModalOpen(true);
    }
  }

  async function handleConfirmSaveComposition() {
    const saved = await saveComposition(draftItems, draftOrientation, draftBars);

    if (saved) {
      setChangesModalOpen(false);
    }
  }

  async function handleDiscardChanges() {
    if (!playlist || !hasDraftChanges) {
      return;
    }

    const result = await Swal.fire({
      icon: "warning",
      title: "Descartar alterações?",
      text: "Mídias, orientação e barras voltarão aos últimos valores salvos.",
      showCancelButton: true,
      confirmButtonText: "Descartar alterações",
      cancelButtonText: "Continuar editando",
      customClass: { confirmButton: "indoor-swal-danger" },
    });

    if (result.isConfirmed) {
      setDraftItems(normalizeItemOrder(playlist.items));
      setDraftOrientation(playlist.orientation);
      setDraftBars(playlist.overlayBars ?? []);
      const persistedItemIds = new Set(playlist.items.map((item) => item.id));

      setSelectedItemIds(
        (currentIds) => new Set([...currentIds].filter((itemId) => persistedItemIds.has(itemId))),
      );
    }
  }

  async function handleDeleteSelected() {
    const selectedItems = draftItems.filter((item) => selectedItemIds.has(item.id));
    const remainingDraftItems = normalizeItemOrder(
      draftItems.filter((item) => !selectedItemIds.has(item.id)),
    );
    const removed = await removeItems(selectedItems);

    if (removed) {
      setDraftItems(remainingDraftItems);
      setSelectedItemIds(new Set());
    }
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
        <header
          data-help-tour="composition-actions"
          className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] md:flex-row md:items-center"
        >
          <div className="flex items-start gap-3">
            <button
              data-help-tour="composition-bars"
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
                active={draftOrientation === "LANDSCAPE"}
                disabled={saving}
                icon={<Monitor size={15} />}
                onClick={() => setDraftOrientation("LANDSCAPE")}
              />
              <OrientationButton
                label="Vertical"
                active={draftOrientation === "PORTRAIT"}
                disabled={saving}
                icon={<Smartphone size={15} />}
                onClick={() => setDraftOrientation("PORTRAIT")}
              />
            </div>

            <button
              type="button"
              onClick={() => setBarsModalOpen(true)}
              disabled={saving}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 text-sm font-semibold text-blue-700 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Layers3 size={18} />
              Barras ({draftBars.length})
            </button>

            <button
              type="button"
              onClick={() => setAddMediaModalOpen(true)}
              disabled={saving || hasDraftChanges}
              title={
                hasDraftChanges
                  ? "Salve as alterações pendentes antes de adicionar uma mídia"
                  : "Adicionar mídia"
              }
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
            value={String(draftItems.length)}
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
            value={String(draftBars.length)}
          />
        </div>

        {saving && (
          <div className="flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700">
            <Loader2 size={17} className="animate-spin" />
            Salvando alterações...
          </div>
        )}

        {(draftItems.length > 0 || hasDraftChanges) && (
          <section className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              {draftItems.length > 0 && (
                <label className="relative flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center">
                  <input
                    type="checkbox"
                    checked={selectedItemIds.size === draftItems.length}
                    onChange={toggleSelectAll}
                    disabled={saving}
                    aria-label="Selecionar todas as mídias"
                    className="h-5 w-5 cursor-pointer rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </label>
              )}

              <div className="min-w-0">
                <p className="text-sm font-extrabold text-slate-900">
                  {selectedItemIds.size > 0
                    ? `${selectedItemIds.size} ${selectedItemIds.size === 1 ? "mídia selecionada" : "mídias selecionadas"}`
                    : draftItems.length > 0
                      ? "Selecione as mídias que deseja excluir"
                      : "Configurações da playlist"}
                </p>
                <p className="text-xs text-slate-500">
                  {hasDraftChanges
                    ? `${pendingChangeCount} ${pendingChangeCount === 1 ? "alteração pendente" : "alterações pendentes"}. Nada mudou no player ainda.`
                    : "Edite e reorganize à vontade. As mudanças só serão aplicadas ao salvar."}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => void handleDeleteSelected()}
                disabled={saving || selectedItemIds.size === 0}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 text-sm font-bold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
              >
                <Trash2 size={17} />
                Excluir selecionadas
              </button>

              <button
                type="button"
                onClick={() => void handleDiscardChanges()}
                disabled={saving || !hasDraftChanges}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-bold text-slate-700 transition hover:border-amber-300 hover:bg-amber-50 hover:text-amber-800 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
              >
                <Undo2 size={17} />
                Descartar alterações
              </button>

              <button
                type="button"
                onClick={() => void handleSaveComposition()}
                disabled={saving || !hasDraftChanges}
                title={
                  hasDraftChanges
                    ? `${pendingChangeCount} ${pendingChangeCount === 1 ? "alteração pendente" : "alterações pendentes"}. Clique para ver o resumo e confirmar.`
                    : "Nenhuma alteração pendente para salvar"
                }
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 text-sm font-bold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
              >
                {saving ? <Loader2 size={17} className="animate-spin" /> : <Save size={17} />}
                Salvar alterações
                {hasDraftChanges && (
                  <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-white/20 px-1.5 py-0.5 text-[10px] font-black leading-none text-white">
                    {pendingChangeCount}
                  </span>
                )}
              </button>
            </div>
          </section>
        )}

        <PageScrollArea ariaLabel="Mídias da playlist">
          {draftItems.length > 0 ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(event: DragEndEvent) => {
                void handleDragEnd(event);
              }}
            >
              <SortableContext
                items={draftItems.map((item) => item.id)}
                strategy={verticalListSortingStrategy}
              >
                <section className="space-y-3">
                  {draftItems.map((item, index) => (
                    <PlaylistItemCard
                      key={item.id}
                      item={item}
                      index={index}
                      saving={saving}
                      selected={selectedItemIds.has(item.id)}
                      dirty={dirtyItemIds.has(item.id)}
                      onSelectedChange={handleSelectedChange}
                      onChange={handleDraftChange}
                      onDuplicate={handleDuplicateDraft}
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
        currentBars={draftBars}
        onClose={() => setBarsModalOpen(false)}
        onAttach={handleAttachOverlayBar}
        onDetach={handleDetachOverlayBar}
      />

      <PlaylistChangesModal
        open={changesModalOpen}
        saving={saving}
        changes={changeSummary}
        onClose={() => setChangesModalOpen(false)}
        onConfirm={handleConfirmSaveComposition}
      />
    </>
  );
}

function normalizeItemOrder(items: PlaylistItem[]) {
  return items.map((item, index) => ({
    ...item,
    order: index + 1,
  }));
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
