import { useState } from "react";
import {
  Link,
  Tv,
  Loader2,
  X,
} from "lucide-react";

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

  const [loading, setLoading] =
    useState(false);

  async function handleSubmit() {
    if (!code.trim()) {
      alert(
        "Informe o código do dispositivo",
      );
      return;
    }

    if (!name.trim()) {
      alert(
        "Informe o nome da TV",
      );
      return;
    }

    try {
      setLoading(true);

      await onConfirm(
        code.toUpperCase(),
        name,
      );

      setCode("");
      setName("");

      onClose();
    } catch (error) {
      console.error(error);

      alert(
        "Erro ao vincular dispositivo",
      );
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden">

        <div className="flex items-center justify-between px-6 py-5 border-b">
          <div>
            <h2 className="text-xl font-bold">
              Vincular Dispositivo
            </h2>

            <p className="text-sm text-gray-500">
              Conecte uma TV Box ao sistema
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">

          <div>
            <label className="block text-sm font-medium mb-2">
              Código do dispositivo
            </label>

            <div className="relative">
              <Link
                size={18}
                className="absolute left-3 top-3 text-gray-400"
              />

              <input
                value={code}
                onChange={(e) =>
                  setCode(
                    e.target.value.toUpperCase(),
                  )
                }
                placeholder="Ex: VMTP6R"
                className="
                  w-full
                  border
                  rounded-lg
                  pl-10
                  pr-4
                  py-2.5
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Nome da TV
            </label>

            <div className="relative">
              <Tv
                size={18}
                className="absolute left-3 top-3 text-gray-400"
              />

              <input
                value={name}
                onChange={(e) =>
                  setName(
                    e.target.value,
                  )
                }
                placeholder="TV Recepção"
                className="
                  w-full
                  border
                  rounded-lg
                  pl-10
                  pr-4
                  py-2.5
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              />
            </div>
          </div>

        </div>

        <div className="flex justify-end gap-3 px-6 py-5 border-t bg-gray-50">

          <button
            onClick={onClose}
            disabled={loading}
            className="
              px-4
              py-2
              border
              rounded-lg
              hover:bg-white
              transition
            "
          >
            Cancelar
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="
              bg-blue-600
              hover:bg-blue-700
              text-white
              px-5
              py-2
              rounded-lg
              flex
              items-center
              gap-2
              transition
            "
          >
            {loading && (
              <Loader2
                size={16}
                className="animate-spin"
              />
            )}

            Vincular
          </button>

        </div>
      </div>
    </div>
  );
}