import { useEffect, useState, type FormEvent } from "react";

import { FolderPlus, Save, X } from "lucide-react";

import Swal from "sweetalert2";

import { createFolder, updateFolder } from "../services/folders.services";

import type { Folder } from "../types";

interface FolderModalProps {
  open: boolean;
  folder?: Folder | null;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
}

function getErrorMessage(error: unknown) {
  const apiError = error as {
    response?: {
      data?: {
        message?: string | string[];
      };
    };
  };

  const message = apiError.response?.data?.message;

  if (Array.isArray(message)) {
    return message[0];
  }

  return message ?? "Não foi possível salvar a pasta.";
}

export default function FolderModal({ open, folder, onClose, onSaved }: FolderModalProps) {
  const [name, setName] = useState("");

  const [saving, setSaving] = useState(false);

  const editing = Boolean(folder);

  useEffect(() => {
    if (!open) {
      return;
    }

    setName(folder?.name ?? "");
  }, [open, folder]);

  if (!open) {
    return null;
  }

  function handleClose() {
    if (saving) {
      return;
    }

    onClose();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedName = name.trim();

    if (!normalizedName) {
      await Swal.fire({
        icon: "warning",
        title: "Nome obrigatório",
        text: "Informe o nome da pasta.",
      });

      return;
    }

    try {
      setSaving(true);

      if (folder) {
        await updateFolder(folder.id, {
          name: normalizedName,
        });
      } else {
        await createFolder({
          name: normalizedName,
        });
      }

      await Swal.fire({
        icon: "success",
        title: editing ? "Pasta renomeada" : "Pasta criada",
        timer: 1500,
        showConfirmButton: false,
      });

      await onSaved();
      onClose();
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Erro",
        text: getErrorMessage(error),
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-xl font-black text-gray-900">
              {editing ? "Renomear pasta" : "Nova pasta"}
            </h2>

            <p className="text-sm text-gray-500">
              {editing ? "Altere o nome da pasta." : "Crie uma pasta para organizar suas mídias."}
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={saving}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 disabled:opacity-50"
            aria-label="Fechar"
          >
            <X size={22} />
          </button>
        </header>

        <div className="p-6">
          <label htmlFor="folder-name" className="mb-2 block text-sm font-bold text-gray-700">
            Nome da pasta
          </label>

          <div className="relative">
            <FolderPlus
              size={19}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              id="folder-name"
              autoFocus
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={100}
              placeholder="Ex.: Promoções"
              disabled={saving}
              className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm font-medium outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:opacity-50"
            />
          </div>

          <p className="mt-2 text-right text-xs text-gray-400">{name.length}/100</p>
        </div>

        <footer className="flex justify-end gap-3 border-t px-6 py-4">
          <button
            type="button"
            onClick={handleClose}
            disabled={saving}
            className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-bold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={saving || !name.trim()}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save size={18} />

            {saving ? "Salvando..." : editing ? "Salvar" : "Criar pasta"}
          </button>
        </footer>
      </form>
    </div>
  );
}
