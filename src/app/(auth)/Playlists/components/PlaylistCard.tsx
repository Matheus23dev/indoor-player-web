import {
  Trash2,
  PlaySquare,
  Image,
  Video,
  Clock3,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import type { Playlist } from "../types/playlist";

import { formatDuration } from "../utils/FormatDuration";

interface Props {
  playlist: Playlist;
   onOpen: () => void;

  onDelete: (
    id: string,
  ) => void;
}

export default function PlaylistCard({
  playlist,
    onOpen,
  onDelete,
}: Props) {
  const navigate =
    useNavigate();

  const totalDuration =
    playlist.items.reduce(
      (total, item) => {
        if (
          item.media?.type ===
          "VIDEO"
        ) {
          return (
            total +
            (item.media
              ?.duration || 0)
          );
        }

        return (
          total +
          (item.duration || 5)
        );
      },
      0,
    );

  const imageCount =
    playlist.items.filter(
      (item) =>
        item.media?.type ===
        "IMAGE",
    ).length;

  const videoCount =
    playlist.items.filter(
      (item) =>
        item.media?.type ===
        "VIDEO",
    ).length;

  const handleDelete =
    () => {
      const confirmDelete =
        window.confirm(
          `Deseja realmente excluir a playlist "${playlist.name}"?`,
        );

      if (
        confirmDelete
      ) {
        onDelete(
          playlist.id,
        );
      }
    };

  return (
    <div
     onClick={onOpen}
      className="
        bg-white
        border
        rounded-3xl
        p-5
        shadow-sm
        hover:shadow-xl
        hover:-translate-y-1
        transition-all
        duration-300
      "
    >
      <div className="flex justify-between items-start">

        <div>

          <div
            className="
              h-12
              w-12
              rounded-2xl
              bg-blue-100
              flex
              items-center
              justify-center
              mb-4
            "
          >
            <PlaySquare
              size={24}
              className="
                text-blue-600
              "
            />
          </div>

          <h3
            className="
              text-lg
              font-bold
              text-gray-900
              line-clamp-1
            "
          >
            {playlist.name}
          </h3>

          <p
            className="
              text-sm
              text-gray-500
              mt-1
            "
          >
            {playlist.items.length} mídias
          </p>

        </div>

      </div>

      <div
        className="
          mt-5
          flex
          items-center
          gap-2
          text-sm
          text-gray-600
        "
      >
        <Clock3 size={14} />

        <span>
          {formatDuration(
            totalDuration,
          )}
        </span>
      </div>

      <div
        className="
          grid
          grid-cols-2
          gap-3
          mt-5
        "
      >
        <div
          className="
            bg-gray-50
            rounded-xl
            p-3
          "
        >
          <div className="flex items-center gap-2">
            <Image
              size={16}
              className="
                text-blue-600
              "
            />

            <span
              className="
                text-sm
                text-gray-500
              "
            >
              Imagens
            </span>
          </div>

          <p
            className="
              text-xl
              font-bold
              mt-2
            "
          >
            {imageCount}
          </p>
        </div>

        <div
          className="
            bg-gray-50
            rounded-xl
            p-3
          "
        >
          <div className="flex items-center gap-2">
            <Video
              size={16}
              className="
                text-purple-600
              "
            />

            <span
              className="
                text-sm
                text-gray-500
              "
            >
              Vídeos
            </span>
          </div>

          <p
            className="
              text-xl
              font-bold
              mt-2
            "
          >
            {videoCount}
          </p>
        </div>
      </div>

      <div
        className="
          mt-6
          flex
          gap-2
        "
      >
        <button
          onClick={() =>
            navigate(
              `/home/playlists/${playlist.id}`,
            )
          }
          className="
            flex-1
            bg-blue-600
            hover:bg-blue-700
            transition
            text-white
            rounded-xl
            py-2.5
            font-medium
          "
        >
          Abrir Playlist
        </button>

        <button
          onClick={
            handleDelete
          }
          className="
            w-11
            border
            rounded-xl
            flex
            items-center
            justify-center
            hover:bg-red-50
            hover:border-red-500
            transition
          "
        >
          <Trash2
            size={18}
            className="
              text-red-600
            "
          />
        </button>
      </div>
    </div>
  );
}