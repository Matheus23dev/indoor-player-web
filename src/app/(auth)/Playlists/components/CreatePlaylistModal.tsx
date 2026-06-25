import { useEffect, useState } from "react";
import { X, FolderPlus } from "lucide-react";

interface Props {
  open: boolean;
  loading?: boolean;
  onClose: () => void;
  onCreate: (name: string) => Promise<void>;
}

export default function CreatePlaylistModal({
  open,
  loading = false,
  onClose,
  onCreate,
}: Props) {
  const [name, setName] =
    useState("");

  useEffect(() => {
    if (open) {
      setName("");
    }
  }, [open]);

  async function handleSubmit() {
    if (!name.trim()) return;

    await onCreate(
      name.trim(),
    );

    onClose();
  }

  useEffect(() => {
    function handleEsc(
      e: KeyboardEvent,
    ) {
      if (
        e.key === "Escape"
      ) {
        onClose();
      }
    }

    window.addEventListener(
      "keydown",
      handleEsc,
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleEsc,
      );
  }, [onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className=" fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className=" bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden">
        <div className=" flex items-center justify-between px-6 py-5 border-b" >
          <div className=" flex items-center gap-3">
            <div className=" h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <FolderPlus size={20} className=" text-blue-600"/>
            </div>

            <div>
              <h2 className=" text-lg font-semibold" >
                Nova Playlist
              </h2>

              <p className=" text-sm text-gray-500">
                Crie uma playlist
              </p>
            </div>
          </div>

          <button
            onClick={
              onClose
            }
            className="
              h-10
              w-10
              rounded-lg
              hover:bg-gray-100
              flex
              items-center
              justify-center
            "
          >
            <X
              size={18}
            />
          </button>
        </div>

        <div className="p-6">
          <label
            className="
              block
              text-sm
              font-medium
              mb-2
            "
          >
            Nome da Playlist
          </label>

          <input
            value={name}
            onChange={(e) =>
              setName(
                e.target
                  .value,
              )
            }
            placeholder="Ex: Promoções Junho"
            className="
              w-full
              border
              rounded-xl
              px-4
              py-3
              outline-none
              focus:border-blue-500
            "
          />
        </div>

        <div
          className="
            border-t
            px-6
            py-4
            flex
            justify-end
            gap-3
          "
        >
          <button
            onClick={
              onClose
            }
            className="
              px-5
              py-2.5
              border
              rounded-xl
              hover:bg-gray-50
            "
          >
            Cancelar
          </button>

          <button
            disabled={
              !name.trim() ||
              loading
            }
            onClick={
              handleSubmit
            }
            className="
              px-5
              py-2.5
              rounded-xl
              bg-blue-600
              text-white
              hover:bg-blue-700
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            Criar Playlist
          </button>
        </div>
      </div>
    </div>
  );
}