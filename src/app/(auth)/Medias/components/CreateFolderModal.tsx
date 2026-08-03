import { useState } from "react";

interface CreateFolderModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string) => Promise<void>;
}

export function CreateFolderModal({ open, onClose, onCreate }: CreateFolderModalProps) {
  const [name, setName] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  if (!open) {
    return null;
  }

  async function handleCreate() {
    const normalizedName = name.trim();

    if (!normalizedName) {
      return;
    }

    try {
      setIsLoading(true);

      await onCreate(normalizedName);

      setName("");
      onClose();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl bg-white p-6">
        <h2 className="mb-4 text-xl font-bold">Nova Pasta</h2>

        <input
          type="text"
          placeholder="Nome da pasta"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="w-full rounded-lg border p-3 outline-none focus:border-blue-600"
          autoFocus
        />

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-lg border px-4 py-2 disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            disabled={!name.trim() || isLoading}
            onClick={() => {
              void handleCreate();
            }}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
          >
            {isLoading ? "Criando..." : "Criar"}
          </button>
        </div>
      </div>
    </div>
  );
}
