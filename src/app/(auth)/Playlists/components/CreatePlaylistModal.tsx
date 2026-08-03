import { useEffect, useState, type FormEvent } from "react";

import { ListVideo, Save, X } from "lucide-react";

import Swal from "sweetalert2";
import { getApiErrorMessage } from "../../../../lib/apiError";

interface CreatePlaylistModalProps {
  open: boolean;
  saving: boolean;
  onClose: () => void;
  onCreate: (name: string) => Promise<unknown>;
}

export default function CreatePlaylistModal({
  open,
  saving,
  onClose,
  onCreate,
}: CreatePlaylistModalProps) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (!open) {
      setName("");
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
      await onCreate(normalizedName);

      await Swal.fire({
        icon: "success",
        title: "Playlist criada",
        timer: 1500,
        showConfirmButton: false,
      });

      setName("");
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
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-xl font-black text-gray-900">Nova playlist</h2>

            <p className="text-sm text-gray-500">Crie uma sequência de mídias.</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
          >
            <X size={22} />
          </button>
        </header>

        <div className="p-6">
          <label htmlFor="playlist-name" className="mb-2 block text-sm font-bold text-gray-700">
            Nome da playlist
          </label>

          <div className="relative">
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
        </div>

        <footer className="flex justify-end gap-3 border-t px-6 py-4">
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
