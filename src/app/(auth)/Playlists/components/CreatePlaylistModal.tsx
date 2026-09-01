import { useEffect, useState, type FormEvent } from "react";

import { Check, ListVideo, Monitor, Save, Smartphone, X } from "lucide-react";

import { appAlert as Swal } from "@/lib/alert";
import { getApiErrorMessage } from "../../../../lib/apiError";
import type { PlaylistOrientation } from "../types";

interface CreatePlaylistModalProps {
  open: boolean;
  saving: boolean;
  onClose: () => void;
  onCreate: (name: string, orientation: PlaylistOrientation) => Promise<unknown>;
}

export default function CreatePlaylistModal({
  open,
  saving,
  onClose,
  onCreate,
}: CreatePlaylistModalProps) {
  const [name, setName] = useState("");
  const [orientation, setOrientation] = useState<PlaylistOrientation>("LANDSCAPE");

  useEffect(() => {
    if (!open) {
      setName("");
      setOrientation("LANDSCAPE");
    }
  }, [open]);

  if (!open) {
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedName = name.trim();

    if (!normalizedName) {
      await Swal.fire({
        icon: "warning",
        title: "Nome obrigatório",
        text: "Informe o nome da playlist.",
      });

      return;
    }

    try {
      await onCreate(normalizedName, orientation);

      await Swal.fire({
        icon: "success",
        title: "Playlist criada",
        timer: 1500,
        showConfirmButton: false,
      });

      setName("");
      setOrientation("LANDSCAPE");
      onClose();
    } catch (error: unknown) {
      const message = getApiErrorMessage(error, "Não foi possível criar a playlist.");

      await Swal.fire({
        icon: "error",
        title: "Erro ao criar",
        text: message,
      });
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-xl font-black text-gray-900">Nova playlist</h2>

            <p className="text-sm text-gray-500">Crie uma sequência de mídias.</p>
          </div>

          <button
            data-help-tour="playlist-create-close"
            type="button"
            aria-label="Fechar criação da playlist"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
          >
            <X size={22} />
          </button>
        </header>

        <div className="space-y-5 p-6">
          <label htmlFor="playlist-name" className="mb-2 block text-sm font-bold text-gray-700">
            Nome da playlist
          </label>

          <div data-help-tour="playlist-modal-name" className="relative">
            <ListVideo
              size={19}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              id="playlist-name"
              autoFocus
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={100}
              disabled={saving}
              placeholder="Ex.: Promoções da semana"
              className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm font-medium outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:opacity-50"
            />
          </div>

          <fieldset data-help-tour="playlist-modal-orientation">
            <legend className="text-sm font-bold text-gray-700">Orientação da tela</legend>
            <p className="mt-1 text-xs leading-5 text-gray-500">
              O player ajustará a tela automaticamente quando esta playlist entrar em exibição.
            </p>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <OrientationOption
                orientation="LANDSCAPE"
                selected={orientation === "LANDSCAPE"}
                icon={<Monitor size={22} />}
                title="Horizontal"
                description="Formato 16:9"
                disabled={saving}
                onSelect={setOrientation}
              />
              <OrientationOption
                orientation="PORTRAIT"
                selected={orientation === "PORTRAIT"}
                icon={<Smartphone size={22} />}
                title="Vertical"
                description="Formato 9:16"
                disabled={saving}
                onSelect={setOrientation}
              />
            </div>
          </fieldset>
        </div>

        <footer
          data-help-tour="playlist-modal-actions"
          className="flex justify-end gap-3 border-t px-6 py-4"
        >
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={saving || !name.trim()}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            <Save size={18} />

            {saving ? "Criando..." : "Criar playlist"}
          </button>
        </footer>
      </form>
    </div>
  );
}

interface OrientationOptionProps {
  orientation: PlaylistOrientation;
  selected: boolean;
  icon: React.ReactNode;
  title: string;
  description: string;
  disabled: boolean;
  onSelect: (orientation: PlaylistOrientation) => void;
}

function OrientationOption({
  orientation,
  selected,
  icon,
  title,
  description,
  disabled,
  onSelect,
}: OrientationOptionProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      onClick={() => onSelect(orientation)}
      className={`relative flex items-center gap-3 rounded-xl border p-3 text-left transition disabled:opacity-50 ${
        selected
          ? "border-blue-500 bg-blue-50 text-blue-800 ring-2 ring-blue-100"
          : "border-gray-200 bg-white text-gray-700 hover:border-blue-200 hover:bg-blue-50/50"
      }`}
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
          selected ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500"
        }`}
      >
        {icon}
      </span>
      <span className="min-w-0">
        <strong className="block text-sm">{title}</strong>
        <span className={`block text-[11px] ${selected ? "text-blue-700" : "text-gray-500"}`}>
          {description}
        </span>
      </span>
      {selected && (
        <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-white">
          <Check size={11} />
        </span>
      )}
    </button>
  );
}
