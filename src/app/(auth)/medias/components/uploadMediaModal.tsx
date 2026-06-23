import {
  useState,
} from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onUpload: (
    file: File,
  ) => Promise<void>;
};

export function UploadMediaModal({
  open,
  onClose,
  onUpload,
}: Props) {
  const [file, setFile] =
    useState<File>();

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

      <div className="bg-white rounded-xl p-6 w-full max-w-md">

        <h2 className="text-xl font-bold mb-4">
          Upload de mídia
        </h2>

        <input
          type="file"
          onChange={(e) =>
            setFile(
              e.target.files?.[0],
            )
          }
          className="w-full"
        />

        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={onClose}
            className="border px-4 py-2 rounded-lg"
          >
            Cancelar
          </button>

          <button
            disabled={!file}
            onClick={() =>
              file &&
              onUpload(file)
            }
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Enviar
          </button>

        </div>

      </div>

    </div>
  );
}