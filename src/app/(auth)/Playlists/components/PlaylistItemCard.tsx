import {
  GripVertical,
  Image as ImageIcon,
  Trash2,
  Video,
  Clock3,
} from "lucide-react";

import type { PlaylistItem } from "../types/playlist";

interface Props {
  item: PlaylistItem;
  apiUrl: string;

  onRemove: (
    itemId: string,
  ) => void;

  onUpdateDuration: (
    itemId: string,
    duration: number,
  ) => void;
}

export default function PlaylistItemCard({
  item,
  apiUrl,
  onRemove,
  onUpdateDuration,
}: Props) {
  const isVideo =
    item.media.type ===
    "VIDEO";

  const duration =
    item.duration || 5;

  return (
    <div
      className="
        bg-white
        border
        rounded-2xl
        p-4
        shadow-sm
        hover:shadow-lg
        hover:border-blue-200
        transition-all
      "
    >
      <div className="flex items-center gap-4">

        <div
          className="
            cursor-grab
            text-gray-400
            hover:text-blue-600
            transition
          "
        >
          <GripVertical size={22} />
        </div>

        <div
          className="
            h-20
            w-32
            overflow-hidden
            rounded-xl
            border
            bg-gray-100
            shrink-0
          "
        >
          {isVideo ? (
            <video
              src={`${apiUrl}${item.media.fileUrl}`}
              className="
                h-full
                w-full
                object-cover
              "
              muted
            />
          ) : (
            <img
              src={`${apiUrl}${item.media.fileUrl}`}
              alt={item.media.name}
              className="
                h-full
                w-full
                object-cover
              "
            />
          )}
        </div>

        <div className="flex-1 min-w-0">

          <div className="flex items-center gap-2 mb-1">

            <span
              className="
                text-xs
                bg-gray-100
                text-gray-600
                px-2
                py-1
                rounded-lg
                font-medium
              "
            >
              #{item.order}
            </span>

            <span
              className={`
                text-xs
                px-2
                py-1
                rounded-lg
                font-medium
                flex
                items-center
                gap-1
                ${
                  isVideo
                    ? "bg-purple-100 text-purple-700"
                    : "bg-blue-100 text-blue-700"
                }
              `}
            >
              {isVideo ? (
                <Video size={12} />
              ) : (
                <ImageIcon size={12} />
              )}

              {isVideo
                ? "Vídeo"
                : "Imagem"}
            </span>

          </div>

          <h3
            className="
              font-semibold
              text-gray-800
              truncate
            "
          >
            {item.media.name}
          </h3>

          <div className="mt-3">

            {isVideo ? (
              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-sm
                  text-gray-500
                "
              >
                <Clock3 size={14} />
                Duração automática
              </div>
            ) : (
              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                <Clock3
                  size={15}
                  className="
                    text-gray-500
                  "
                />

                <span
                  className="
                    text-sm
                    text-gray-500
                  "
                >
                  Exibir por
                </span>

                <input
                  type="number"
                  min={1}
                  value={duration}
                  onChange={(e) =>
                    onUpdateDuration(
                      item.id,
                      Number(
                        e.target.value,
                      ),
                    )
                  }
                  className="
                    w-20
                    border
                    rounded-lg
                    px-3
                    py-1.5
                    text-sm
                    text-center
                    focus:outline-none
                    focus:ring-2
                    focus:ring-blue-500
                  "
                />

                <span
                  className="
                    text-sm
                    text-gray-500
                  "
                >
                  segundos
                </span>
              </div>
            )}

          </div>

        </div>

        <button
          onClick={() =>
            onRemove(item.id)
          }
          className="
            h-10
            w-10
            rounded-xl
            border
            border-red-200
            hover:bg-red-50
            hover:border-red-500
            flex
            items-center
            justify-center
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