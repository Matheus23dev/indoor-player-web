import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";

import {
  ImagePlus,
  Info,
  Trash2,
  Upload,
  Video,
  X,
} from "lucide-react";

import Swal from "sweetalert2";

import {
  uploadMedia,
} from "../services/medias.services";

import type {
  Folder,
} from "../types";

interface UploadMediaModalProps {
  open: boolean;
  folders: Folder[];
  selectedFolderId?: string | null;
  onClose: () => void;
  onUploaded: () => Promise<void> | void;
}

const MAX_FILES = 20;

const MAX_FILE_SIZE =
  80 * 1024 * 1024;

const ALLOWED_EXTENSIONS = [
  "png",
  "jpg",
  "jpeg",
  "mp4",
];

export default function UploadMediaModal({
  open,
  folders,
  selectedFolderId,
  onClose,
  onUploaded,
}: UploadMediaModalProps) {
  const inputRef =
    useRef<HTMLInputElement | null>(
      null,
    );

  const [files, setFiles] =
    useState<File[]>([]);

  const [folderId, setFolderId] =
    useState("");

  const [uploading, setUploading] =
    useState(false);

  const [
    currentUpload,
    setCurrentUpload,
  ] = useState(0);

  useEffect(() => {
    if (open) {
      setFolderId(
        selectedFolderId ?? "",
      );

      return;
    }

    setFiles([]);
    setCurrentUpload(0);
    setUploading(false);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, [
    open,
    selectedFolderId,
  ]);

  if (!open) {
    return null;
  }

  function getExtension(
    fileName: string,
  ) {
    return (
      fileName
        .split(".")
        .pop()
        ?.toLowerCase() ?? ""
    );
  }

  function isDuplicate(
    newFile: File,
    currentFiles: File[],
  ) {
    return currentFiles.some(
      (file) =>
        file.name === newFile.name &&
        file.size === newFile.size &&
        file.lastModified ===
          newFile.lastModified,
    );
  }

  function validateFiles(
    selectedFiles: File[],
  ) {
    if (
      files.length +
        selectedFiles.length >
      MAX_FILES
    ) {
      Swal.fire({
        icon: "warning",
        title:
          "Limite de arquivos excedido",
        text:
          "É permitido selecionar no máximo 20 mídias por upload.",
      });

      return false;
    }

    const invalidType =
      selectedFiles.find(
        (file) =>
          !ALLOWED_EXTENSIONS.includes(
            getExtension(
              file.name,
            ),
          ),
      );

    if (invalidType) {
      Swal.fire({
        icon: "error",
        title: "Formato inválido",
        text: `O arquivo "${invalidType.name}" não é permitido. Use PNG, JPG, JPEG ou MP4.`,
      });

      return false;
    }

    const oversizedFile =
      selectedFiles.find(
        (file) =>
          file.size >
          MAX_FILE_SIZE,
      );

    if (oversizedFile) {
      Swal.fire({
        icon: "error",
        title:
          "Arquivo muito grande",
        text: `O arquivo "${oversizedFile.name}" ultrapassa o limite de 80 MB.`,
      });

      return false;
    }

    return true;
  }

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const selectedFiles =
      Array.from(
        event.target.files ?? [],
      );

    if (
      selectedFiles.length === 0
    ) {
      return;
    }

    if (
      !validateFiles(
        selectedFiles,
      )
    ) {
      event.target.value = "";
      return;
    }

    const newFiles =
      selectedFiles.filter(
        (selectedFile) =>
          !isDuplicate(
            selectedFile,
            files,
          ),
      );

    if (
      newFiles.length === 0
    ) {
      Swal.fire({
        icon: "info",
        title:
          "Arquivos já selecionados",
        text:
          "Os arquivos escolhidos já estão na lista.",
      });

      event.target.value = "";
      return;
    }

    setFiles(
      (currentFiles) => [
        ...currentFiles,
        ...newFiles,
      ],
    );

    event.target.value = "";
  }

  function removeFile(
    index: number,
  ) {
    setFiles(
      (currentFiles) =>
        currentFiles.filter(
          (_, fileIndex) =>
            fileIndex !== index,
        ),
    );
  }

  function clearFiles() {
    setFiles([]);
    setCurrentUpload(0);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function handleClose() {
    if (uploading) {
      return;
    }

    clearFiles();
    onClose();
  }

  async function handleUpload() {
    if (
      files.length === 0
    ) {
      await Swal.fire({
        icon: "warning",
        title:
          "Selecione uma mídia",
        text:
          "Escolha pelo menos um arquivo.",
      });

      return;
    }

    let uploadedCount = 0;

    try {
      setUploading(true);
      setCurrentUpload(0);

      /*
       * O backend atual recebe somente um arquivo
       * no campo "file". Portanto, o frontend faz
       * uma requisição por mídia.
       */
      for (
        let index = 0;
        index < files.length;
        index += 1
      ) {
        setCurrentUpload(
          index + 1,
        );

        await uploadMedia(
          files[index],
          folderId || null,
        );

        uploadedCount += 1;
      }

      await Swal.fire({
        icon: "success",
        title:
          "Upload concluído",
        text: `${uploadedCount} mídia(s) enviada(s) com sucesso.`,
        timer: 1800,
        showConfirmButton: false,
      });

      clearFiles();
      await onUploaded();
      onClose();
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        "Não foi possível enviar as mídias.";

      await onUploaded();

      await Swal.fire({
        icon: "error",
        title:
          "Erro no upload",
        text:
          uploadedCount > 0
            ? `${uploadedCount} mídia(s) foram enviadas antes do erro. ${
                Array.isArray(message)
                  ? message[0]
                  : message
              }`
            : Array.isArray(message)
              ? message[0]
              : message,
      });
    } finally {
      setUploading(false);
      setCurrentUpload(0);
    }
  }

  const progress =
    files.length > 0
      ? Math.min(
          100,
          (currentUpload /
            files.length) *
            100,
        )
      : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
      <div className="flex max-h-[95vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-xl font-black text-gray-900">
              Enviar mídias
            </h2>

            <p className="text-sm text-gray-500">
              Selecione até 20 arquivos por envio.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={uploading}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 disabled:opacity-50"
            aria-label="Fechar"
          >
            <X size={22} />
          </button>
        </header>

        <div className="space-y-5 overflow-y-auto p-6">
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-start gap-3">
              <Info
                size={22}
                className="mt-0.5 shrink-0 text-blue-600"
              />

              <div>
                <h3 className="font-black text-blue-950">
                  Recomendações para envio de arquivos
                </h3>

                <div className="mt-2 space-y-1 text-sm text-blue-900">
                  <p>
                    <strong>
                      Tipos aceitos:
                    </strong>{" "}
                    PNG, JPG, JPEG e MP4.
                  </p>

                  <p>
                    <strong>
                      Dimensões recomendadas:
                    </strong>{" "}
                    1920×1080, 1080×1920,
                    1280×720 ou 720×1280.
                  </p>

                  <p>
                    <strong>
                      Tamanho máximo:
                    </strong>{" "}
                    80 MB por arquivo.
                  </p>

                  <p>
                    <strong>
                      Limite:
                    </strong>{" "}
                    no máximo 20 mídias por upload.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="media-folder"
              className="mb-2 block text-sm font-bold text-gray-700"
            >
              Pasta
            </label>

            <select
              id="media-folder"
              value={folderId}
              onChange={(event) =>
                setFolderId(
                  event.target.value,
                )
              }
              disabled={uploading}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:opacity-50"
            >
              <option value="">
                Sem pasta
              </option>

              {folders.map(
                (folder) => (
                  <option
                    key={folder.id}
                    value={folder.id}
                  >
                    {folder.name}
                  </option>
                ),
              )}
            </select>
          </div>

          <label
            htmlFor="media-files"
            className={`flex min-h-48 flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition ${
              uploading
                ? "cursor-not-allowed border-gray-200 bg-gray-100 opacity-70"
                : "cursor-pointer border-gray-300 bg-gray-50 hover:border-blue-500 hover:bg-blue-50"
            }`}
          >
            <div className="mb-4 rounded-full bg-white p-4 shadow-sm">
              <ImagePlus
                className="text-blue-600"
                size={36}
              />
            </div>

            <p className="font-black text-gray-900">
              Clique para selecionar arquivos
            </p>

            <p className="mt-1 text-sm text-gray-500">
              PNG, JPG, JPEG e MP4
            </p>

            <p className="mt-1 text-xs font-bold text-gray-400">
              {files.length}/20 selecionados
            </p>

            <input
              ref={inputRef}
              id="media-files"
              type="file"
              multiple
              accept=".png,.jpg,.jpeg,.mp4,image/png,image/jpeg,video/mp4"
              onChange={handleFileChange}
              disabled={
                uploading ||
                files.length >=
                  MAX_FILES
              }
              className="hidden"
            />
          </label>

          {files.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-black text-gray-900">
                  Arquivos selecionados
                </h3>

                <button
                  type="button"
                  onClick={clearFiles}
                  disabled={uploading}
                  className="text-sm font-bold text-red-600 transition hover:text-red-700 disabled:opacity-50"
                >
                  Remover todos
                </button>
              </div>

              <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
                {files.map(
                  (
                    file,
                    index,
                  ) => (
                    <FileItem
                      key={`${file.name}-${file.size}-${file.lastModified}`}
                      file={file}
                      onRemove={() =>
                        removeFile(
                          index,
                        )
                      }
                      disabled={
                        uploading
                      }
                    />
                  ),
                )}
              </div>
            </div>
          )}

          {uploading && (
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-bold text-blue-900">
                  Enviando mídia{" "}
                  {currentUpload} de{" "}
                  {files.length}
                </p>

                <span className="text-xs font-black text-blue-700">
                  {Math.round(
                    progress,
                  )}
                  %
                </span>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-blue-100">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all duration-300"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <footer className="flex justify-end gap-3 border-t px-6 py-4">
          <button
            type="button"
            onClick={handleClose}
            disabled={uploading}
            className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-bold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleUpload}
            disabled={
              uploading ||
              files.length === 0
            }
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Upload size={18} />

            {uploading
              ? `Enviando ${currentUpload}/${files.length}`
              : `Enviar ${files.length} mídia(s)`}
          </button>
        </footer>
      </div>
    </div>
  );
}

interface FileItemProps {
  file: File;
  onRemove: () => void;
  disabled: boolean;
}

function FileItem({
  file,
  onRemove,
  disabled,
}: FileItemProps) {
  const extension =
    file.name
      .split(".")
      .pop()
      ?.toLowerCase();

  const isVideo =
    extension === "mp4";

  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3">
      <div className="rounded-lg bg-white p-2 shadow-sm">
        {isVideo ? (
          <Video
            size={22}
            className="text-purple-600"
          />
        ) : (
          <ImagePlus
            size={22}
            className="text-blue-600"
          />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p
          title={file.name}
          className="truncate text-sm font-bold text-gray-900"
        >
          {file.name}
        </p>

        <p className="text-xs text-gray-500">
          {formatFileSize(
            file.size,
          )}
        </p>
      </div>

      <button
        type="button"
        onClick={onRemove}
        disabled={disabled}
        className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
        aria-label={`Remover ${file.name}`}
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}

function formatFileSize(
  size: number,
) {
  const megabytes =
    size / 1024 / 1024;

  if (megabytes >= 1) {
    return `${megabytes.toFixed(2)} MB`;
  }

  return `${(
    size / 1024
  ).toFixed(2)} KB`;
}