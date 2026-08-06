import { useEffect, useMemo, useState } from "react";
import { Check, Layers3, Loader2, Plus, X } from "lucide-react";

import { getMedias } from "../../Medias/services/medias.services";
import type { Media } from "../../Medias/types";
import { getOverlayBars } from "../../OverlayBars/services/overlay-bars.service";
import type { OverlayBar, PlaylistOverlayBar } from "../../OverlayBars/types";
import {
  OverlayBarPreview,
  OverlayBarsPreview,
} from "../../OverlayBars/components/OverlayBarPreview";

interface PlaylistBarsModalProps {
  open: boolean;
  saving: boolean;
  currentBars: PlaylistOverlayBar[];
  onClose: () => void;
  onAttach: (overlayBarId: string) => Promise<unknown>;
  onDetach: (overlayBarId: string) => Promise<unknown>;
}

export function PlaylistBarsModal({
  open,
  saving,
  currentBars,
  onClose,
  onAttach,
  onDetach,
}: PlaylistBarsModalProps) {
  const [bars, setBars] = useState<OverlayBar[]>([]);
  const [images, setImages] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    setLoading(true);
    Promise.all([getOverlayBars(), getMedias()])
      .then(([availableBars, medias]) => {
        setBars(availableBars);
        setImages(medias.filter((media) => media.type === "IMAGE"));
      })
      .catch(() => {
        setBars([]);
        setImages([]);
      })
      .finally(() => setLoading(false));
  }, [open]);

  const selectedIds = useMemo(
    () => new Set(currentBars.map((item) => item.overlayBarId)),
    [currentBars],
  );
  const selectedBars = useMemo(
    () =>
      [...currentBars]
        .sort((first, second) => first.order - second.order)
        .map((item) => item.overlayBar),
    [currentBars],
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 px-4 py-6 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <header className="flex items-start justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-700">
              Elementos sobre o conteúdo
            </p>
            <h2 className="mt-0.5 text-xl font-bold text-slate-950">Barras fixas da playlist</h2>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Selecione barras já criadas. A mesma barra pode ser usada em outras playlists.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Fechar"
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
          >
            <X size={21} />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
          {selectedBars.length > 0 && (
            <div className="mb-5 rounded-2xl border border-blue-100 bg-blue-50 p-3">
              <div className="mb-2 flex items-center justify-between gap-3 px-1">
                <strong className="text-xs text-blue-950">Prévia conjunta da playlist</strong>
                <span className="text-[10px] font-semibold text-blue-700">
                  O vídeo ocupa somente a área livre
                </span>
              </div>
              <OverlayBarsPreview bars={selectedBars} images={images} className="shadow-sm" />
            </div>
          )}

          {loading && (
            <div className="flex min-h-48 items-center justify-center">
              <Loader2 size={32} className="animate-spin text-blue-700" />
            </div>
          )}

          {!loading && bars.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {bars.map((bar) => {
                const selected = selectedIds.has(bar.id);

                return (
                  <button
                    key={bar.id}
                    type="button"
                    aria-pressed={selected}
                    disabled={saving}
                    onClick={() => void (selected ? onDetach(bar.id) : onAttach(bar.id))}
                    className={`overflow-hidden rounded-2xl border p-2 text-left transition disabled:opacity-60 ${
                      selected
                        ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                        : "border-slate-200 bg-white hover:border-blue-200"
                    }`}
                  >
                    <OverlayBarPreview bar={bar} images={images} />
                    <div className="flex items-center justify-between gap-3 px-2 pb-1 pt-2.5">
                      <div className="min-w-0">
                        <strong className="block truncate text-sm text-slate-900">
                          {bar.name}
                        </strong>
                        <span className="text-[11px] text-slate-500">
                          {bar.sizePercent}% · {bar.media?.name ?? "Somente cor"}
                        </span>
                      </div>
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                          selected ? "bg-blue-700 text-white" : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {selected ? <Check size={16} /> : <Plus size={16} />}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {!loading && bars.length === 0 && (
            <div className="flex min-h-56 items-center justify-center rounded-2xl border border-dashed border-slate-300 text-center">
              <div>
                <Layers3 size={42} className="mx-auto text-slate-300" />
                <h3 className="mt-3 font-bold text-slate-900">Nenhuma barra criada</h3>
                <p className="mt-1 text-sm text-slate-500">Crie uma no módulo Barras fixas.</p>
              </div>
            </div>
          )}
        </div>

        <footer className="flex items-center justify-between gap-3 border-t border-slate-200 px-5 py-4 sm:px-6">
          <span className="text-xs font-semibold text-slate-500">
            {currentBars.length}{" "}
            {currentBars.length === 1 ? "barra vinculada" : "barras vinculadas"}
          </span>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-50"
          >
            Concluir
          </button>
        </footer>
      </div>
    </div>
  );
}
