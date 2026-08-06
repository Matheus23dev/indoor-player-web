import { ImageIcon, Layers3, Pencil, Trash2 } from "lucide-react";

import type { Media } from "../../Medias/types";
import type { OverlayBar } from "../types";
import { OverlayBarPreview } from "./OverlayBarPreview";

interface OverlayBarCardProps {
  bar: OverlayBar;
  images: Media[];
  disabled: boolean;
  onEdit: (bar: OverlayBar) => void;
  onDelete: (bar: OverlayBar) => void;
}

const positionLabels: Record<OverlayBar["position"], string> = {
  TOP: "Horizontal · topo",
  BOTTOM: "Horizontal · rodapé",
  LEFT: "Vertical · esquerda",
  RIGHT: "Vertical · direita",
};

export function OverlayBarCard({ bar, images, disabled, onEdit, onDelete }: OverlayBarCardProps) {
  const playlistsCount = bar._count?.playlists ?? bar.playlists?.length ?? 0;
  const imagesCount =
    (bar.contentItems?.filter((item) => item.type === "IMAGE").length ?? 0) + (bar.media ? 1 : 0);

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="p-3">
        <OverlayBarPreview bar={bar} images={images} />
      </div>

      <div className="border-t border-slate-100 px-4 py-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-base font-bold text-slate-950" title={bar.name}>
              {bar.name}
            </h2>
            <p className="mt-0.5 text-xs font-medium text-slate-500">
              {positionLabels[bar.position]} · {bar.sizePercent}%
            </p>
          </div>
          <span
            className="h-7 w-7 shrink-0 rounded-lg border border-slate-200"
            style={{ backgroundColor: bar.backgroundColor }}
            title={bar.backgroundColor}
          />
        </div>

        <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-semibold text-slate-600">
          <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1">
            <Layers3 size={13} />
            {playlistsCount} {playlistsCount === 1 ? "playlist" : "playlists"}
          </span>
          <span className="inline-flex min-w-0 items-center gap-1 rounded-lg bg-slate-100 px-2 py-1">
            <ImageIcon size={13} />
            <span className="max-w-36 truncate">
              {imagesCount > 0
                ? `${imagesCount} ${imagesCount === 1 ? "imagem" : "imagens"}`
                : "Somente cor"}
            </span>
          </span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={disabled}
            onClick={() => onEdit(bar)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:opacity-50"
          >
            <Pencil size={15} />
            Editar
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={() => onDelete(bar)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
          >
            <Trash2 size={15} />
            Excluir
          </button>
        </div>
      </div>
    </article>
  );
}
