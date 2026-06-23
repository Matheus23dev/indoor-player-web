type Props = {
  playlist: any;
  onDelete: (
    id: string,
  ) => void;
};

export function PlaylistCard({
  playlist,
  onDelete,
}: Props) {
  return (
    <div className="bg-white rounded-xl border p-5 flex justify-between items-center">

      <div>
        <h3 className="font-semibold text-lg">
          {playlist.name}
        </h3>

        <p className="text-sm text-gray-500">
          {playlist.id}
        </p>
      </div>

      <button
        onClick={() =>
          onDelete(
            playlist.id,
          )
        }
        className="bg-red-600 text-white px-4 py-2 rounded-lg"
      >
        Excluir
      </button>
    </div>
  );
}