<<<<<<< HEAD
import { Folder as FolderIcon, Trash2 } from "lucide-react";

type Folder = {
  id: string;
  name: string;
};

type Props = {
  folder: Folder;
  onClick: (id: string) => void;
  onDelete: (id: string) => void;
};

export function FolderCard({ folder, onClick, onDelete }: Props) {
  return (
    <div className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group cursor-pointer">
      <div
        className="flex items-center gap-3 flex-1"
        onClick={() => onClick(folder.id)}
      >
        <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
          <FolderIcon size={24} />
        </div>
        <h3 className="font-semibold text-lg truncate">{folder.name}</h3>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(folder.id);
        }}
        className="text-gray-400 hover:text-red-600 p-2 hidden group-hover:block transition-colors"
        title="Excluir Pasta"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
}
=======
import {
  useState,
} from "react";

import {
  Folder as FolderIcon,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";

import type {
  Folder,
} from "../types";

interface FolderCardProps {
  folder: Folder;
  onOpen: (folder: Folder) => void;
  onEdit: (folder: Folder) => void;
  onDelete: (folder: Folder) => void;
}

export default function FolderCard({
  folder,
  onOpen,
  onEdit,
  onDelete,
}: FolderCardProps) {
  const [menuOpen, setMenuOpen] =
    useState(false);

  const mediasCount =
    folder._count?.medias ?? 0;

  return (
    <article className="relative rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-blue-300 hover:shadow-md">
      <button
        type="button"
        onClick={() =>
          onOpen(folder)
        }
        className="flex w-full items-center gap-4 pr-10 text-left"
      >
        <div className="rounded-2xl bg-amber-50 p-3 text-amber-500">
          <FolderIcon
            size={30}
            fill="currentColor"
          />
        </div>

        <div className="min-w-0 flex-1">
          <h3
            title={folder.name}
            className="truncate text-base font-black text-gray-900"
          >
            {folder.name}
          </h3>

          <p className="mt-1 text-xs font-medium text-gray-500">
            {mediasCount}{" "}
            {mediasCount === 1
              ? "mídia"
              : "mídias"}
          </p>
        </div>
      </button>

      <div className="absolute right-3 top-3">
        <button
          type="button"
          onClick={() =>
            setMenuOpen(
              (current) => !current,
            )
          }
          className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100"
          aria-label="Opções da pasta"
        >
          <MoreVertical size={18} />
        </button>

        {menuOpen && (
          <>
            <button
              type="button"
              aria-label="Fechar menu"
              onClick={() =>
                setMenuOpen(false)
              }
              className="fixed inset-0 z-10 cursor-default"
            />

            <div className="absolute right-0 top-10 z-20 w-44 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-xl">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onEdit(folder);
                }}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                <Pencil size={16} />
                Renomear
              </button>

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onDelete(folder);
                }}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
              >
                <Trash2 size={16} />
                Excluir pasta
              </button>
            </div>
          </>
        )}
      </div>
    </article>
  );
}
>>>>>>> feature/playlist
