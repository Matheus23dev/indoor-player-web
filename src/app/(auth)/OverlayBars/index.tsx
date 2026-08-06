import { useMemo, useState } from "react";
import {
  AlignHorizontalSpaceAround,
  AlignVerticalSpaceAround,
  Layers3,
  Loader2,
  Plus,
  Search,
} from "lucide-react";

import {
  MetricCard,
  PageContainer,
  PageHeader,
  PageScrollArea,
  PageToolbar,
} from "../../../components/layout/Page";
import { OverlayBarCard } from "./components/OverlayBarCard";
import { OverlayBarFormModal } from "./components/OverlayBarFormModal";
import { useOverlayBars } from "./hooks/useOverlayBars";
import type { OverlayBar, OverlayBarPayload } from "./types";

export default function OverlayBars() {
  const { bars, images, loading, saving, totalPlaylistLinks, createBar, updateBar, removeBar } =
    useOverlayBars();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBar, setEditingBar] = useState<OverlayBar | null>(null);

  const filteredBars = useMemo(() => {
    const term = search.trim().toLowerCase();
    return bars.filter((bar) => bar.name.toLowerCase().includes(term));
  }, [bars, search]);

  const horizontalCount = bars.filter(
    (bar) => bar.position === "TOP" || bar.position === "BOTTOM",
  ).length;
  const verticalCount = bars.length - horizontalCount;

  function openCreate() {
    setEditingBar(null);
    setModalOpen(true);
  }

  function openEdit(bar: OverlayBar) {
    setEditingBar(bar);
    setModalOpen(true);
  }

  async function save(payload: OverlayBarPayload) {
    if (editingBar) {
      await updateBar(editingBar.id, payload);
    } else {
      await createBar(payload);
    }
    setModalOpen(false);
    setEditingBar(null);
  }

  return (
    <>
      <PageContainer scrollable>
        <PageHeader
          eyebrow="Composição da tela"
          title="Barras fixas"
          description="Crie barras com cor, imagem ou logo e reutilize a mesma configuração em várias playlists."
          icon={Layers3}
          actions={
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 text-sm font-semibold text-white shadow-sm hover:bg-blue-800"
            >
              <Plus size={18} />
              Nova barra
            </button>
          }
        />

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Barras" value={bars.length} icon={Layers3} />
          <MetricCard
            label="Horizontais"
            value={horizontalCount}
            icon={AlignHorizontalSpaceAround}
            tone="blue"
          />
          <MetricCard
            label="Verticais"
            value={verticalCount}
            icon={AlignVerticalSpaceAround}
            tone="slate"
          />
          <MetricCard
            label="Usos em playlists"
            value={totalPlaylistLinks}
            icon={Layers3}
            tone="emerald"
          />
        </div>

        <PageToolbar>
          <div className="relative max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar barra..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </div>
        </PageToolbar>

        <PageScrollArea ariaLabel="Lista de barras fixas">
          {loading && (
            <div className="flex min-h-80 items-center justify-center rounded-2xl border border-slate-200 bg-white">
              <Loader2 size={36} className="animate-spin text-blue-700" />
            </div>
          )}

          {!loading && filteredBars.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredBars.map((bar) => (
                <OverlayBarCard
                  key={bar.id}
                  bar={bar}
                  images={images}
                  disabled={saving}
                  onEdit={openEdit}
                  onDelete={(item) => void removeBar(item)}
                />
              ))}
            </div>
          )}

          {!loading && filteredBars.length === 0 && (
            <div className="flex min-h-80 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
              <div>
                <Layers3 size={48} className="mx-auto text-slate-300" />
                <h2 className="mt-4 text-xl font-bold text-slate-950">Nenhuma barra encontrada</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Crie uma barra reutilizável para começar.
                </p>
              </div>
            </div>
          )}
        </PageScrollArea>
      </PageContainer>

      <OverlayBarFormModal
        open={modalOpen}
        saving={saving}
        images={images}
        initialBar={editingBar}
        onClose={() => {
          if (saving) return;
          setModalOpen(false);
          setEditingBar(null);
        }}
        onSave={save}
      />
    </>
  );
}
