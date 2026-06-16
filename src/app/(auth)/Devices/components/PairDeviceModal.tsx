import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: (
    code: string,
    name: string,
  ) => Promise<void>;
};

export function PairDeviceModal({
  open,
  onClose,
  onConfirm,
}: Props) {
  const [code, setCode] =
    useState("");

  const [name, setName] =
    useState("");

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-xl p-6">
        <h2 className="font-bold text-xl mb-4">
          Vincular dispositivo
        </h2>

        <div className="space-y-3">
          <input
            value={code}
            onChange={(e) =>
              setCode(
                e.target.value,
              )
            }
            placeholder="Código"
            className="border rounded-lg px-4 py-2 w-full"
          />

          <input
            value={name}
            onChange={(e) =>
              setName(
                e.target.value,
              )
            }
            placeholder="Nome da TV"
            className="border rounded-lg px-4 py-2 w-full"
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg"
          >
            Cancelar
          </button>

          <button
            onClick={() =>
              onConfirm(
                code,
                name,
              )
            }
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Vincular
          </button>
        </div>
      </div>
    </div>
  );
}