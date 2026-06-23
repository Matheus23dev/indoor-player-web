import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: (
    name: string,
  ) => Promise<void>;
};

export function CreatePlaylistModal({
  open,
  onClose,
  onConfirm,
}: Props) {
  const [name, setName] =
    useState("");

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

      <div className="bg-white w-full max-w-md rounded-xl p-6">

        <h2 className="font-bold text-xl mb-4">
          Nova Playlist
        </h2>

        <input
          value={name}
          onChange={(e) =>
            setName(
              e.target.value,
            )
          }
          placeholder="Nome da playlist"
          className="border rounded-lg px-4 py-2 w-full"
        />

        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={onClose}
            className="border px-4 py-2 rounded-lg"
          >
            Cancelar
          </button>

          <button
            onClick={() =>
              onConfirm(name)
            }
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Criar
          </button>

        </div>

      </div>

    </div>
  );
}