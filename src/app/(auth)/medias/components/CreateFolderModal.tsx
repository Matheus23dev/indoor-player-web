import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string) => Promise<void>;
};

export function CreateFolderModal({ open, onClose, onCreate }: Props) {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!open) return null;

  async function handleCreate() {
    if (!name.trim()) return;
    setIsLoading(true);
    try {
      await onCreate(name);
      setName("");
      onClose();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Nova Pasta</h2>
        
        <input
          type="text"
          placeholder="Nome da pasta"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded-lg p-3 outline-none focus:border-blue-600"
          autoFocus
        />

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="border px-4 py-2 rounded-lg">
            Cancelar
          </button>
          <button
            disabled={!name.trim() || isLoading}
            onClick={handleCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            {isLoading ? "Criando..." : "Criar"}
          </button>
        </div>
      </div>
    </div>
  );
}