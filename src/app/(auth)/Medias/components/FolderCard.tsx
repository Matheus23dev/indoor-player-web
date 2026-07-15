import type {
  KeyboardEvent,
  MouseEvent,
} from "react";

import {
  Folder,
  Pencil,
  Trash2,
} from "lucide-react";

import type {
  Folder as FolderType,
} from "../types";

interface FolderCardProps {
  folder: FolderType;
  onOpen: (folder: FolderType) => void;
  onEdit: (folder: FolderType) => void;
  onDelete: (folder: FolderType) => void | Promise<void>;
}

export default function FolderCard({
  folder,
  onOpen,
  onEdit,
  onDelete,
}: FolderCardProps) {
  const mediaCount =
    folder._count?.medias ?? 0;

  const mediaLabel =
    mediaCount === 1
      ? "1 mídia"
      : `${mediaCount} mídias`;

  function handleOpen() {
    onOpen(folder);
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLDivElement>,
  ) {
    if (
      event.key !== "Enter" &&
      event.key !== " "
    ) {
      return;
    }

    event.preventDefault();
    handleOpen();
  }

  function handleEdit(
    event: MouseEvent<HTMLButtonElement>,
  ) {
    event.stopPropagation();
    onEdit(folder);
  }

  function handleDelete(
    event: MouseEvent<HTMLButtonElement>,
  ) {
    event.stopPropagation();
    void onDelete(folder);
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleOpen}
      onKeyDown={handleKeyDown}
      className="group cursor-pointer rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
            <Folder size={30} />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-base font-black text-gray-900">
              {folder.name}
            </h3>

            <p className="mt-1 text-sm font-medium text-gray-500">
              {mediaLabel}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={handleEdit}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-blue-50 hover:text-blue-600"
            aria-label="Editar pasta"
            title="Editar pasta"
          >
            <Pencil size={18} />
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
            aria-label="Excluir pasta"
            title="Excluir pasta"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
