import {
  Copy,
  Layers3,
  ListChecks,
  Loader2,
  MonitorSmartphone,
  Save,
  Settings2,
  X,
} from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";

import { countPlaylistChanges, type PlaylistChangeSummary } from "../utils/playlistChangeSummary";

interface PlaylistChangesModalProps {
  open: boolean;
  saving: boolean;
  changes: PlaylistChangeSummary[];
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function PlaylistChangesModal({
  open,
  saving,
  changes,
  onClose,
  onConfirm,
}: PlaylistChangesModalProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !saving) {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open, saving]);

  if (!open) {
    return null;
  }

  const totalChanges = countPlaylistChanges(changes);

  return createPortal(
    <div
      className="fixed inset-0 z-[120] flex items-end justify-center bg-slate-950/55 p-0 backdrop-blur-[2px] sm:items-center sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="playlist-changes-title"
        className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl border border-slate-200 bg-white shadow-2xl sm:rounded-3xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 sm:px-6">
          <div className="flex min-w-0 gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <ListChecks size={21} />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 id="playlist-changes-title" className="text-lg font-black text-slate-950">
                  Resumo das alterações
                </h2>
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-black text-blue-800">
                  {totalChanges}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                Confira tudo antes de atualizar a playlist e os players.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Fechar resumo das alterações"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto bg-slate-50/70 px-4 py-4 sm:px-6">
          <div className="space-y-3">
            {changes.map((change, index) => {
              const Icon =
                change.kind === "DUPLICATE"
                  ? Copy
                  : change.kind === "ORIENTATION"
                    ? MonitorSmartphone
                    : change.kind === "OVERLAY_BARS"
                      ? Layers3
                      : Settings2;
              const highlighted = change.kind !== "MEDIA";

              return (
                <article
                  key={change.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                        highlighted ? "bg-violet-50 text-violet-700" : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      <Icon size={18} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <h3 className="break-words text-sm font-extrabold text-slate-900">
                          {change.mediaName}
                        </h3>
                        {change.kind === "DUPLICATE" && (
                          <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-violet-800">
                            Nova cópia
                          </span>
                        )}
                      </div>

                      <ul className="mt-2 space-y-1.5">
                        {change.details.map((detail) => (
                          <li
                            key={detail}
                            className="flex items-start gap-2 text-xs leading-5 text-slate-600"
                          >
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <footer className="flex flex-col-reverse gap-2 border-t border-slate-200 bg-white px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continuar editando
          </button>
          <button
            type="button"
            onClick={() => void onConfirm()}
            disabled={saving || changes.length === 0}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 text-sm font-bold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {saving ? <Loader2 size={17} className="animate-spin" /> : <Save size={17} />}
            {saving ? "Salvando..." : "Confirmar e salvar"}
          </button>
        </footer>
      </section>
    </div>,
    document.body,
  );
}
