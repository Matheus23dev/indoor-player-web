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
