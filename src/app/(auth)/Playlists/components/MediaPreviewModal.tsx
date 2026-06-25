import {
  X,
  Image as ImageIcon,
  Video,
} from "lucide-react";

import {
  useEffect,
} from "react";

interface Props {
  open: boolean;

  onClose: () => void;

  media: {
    name: string;
    type: "IMAGE" | "VIDEO";
    fileUrl: string;
  } | null;
}

export default function MediaPreviewModal({
  open,
  onClose,
  media,
}: Props) {
  useEffect(() => {
    function handleEsc(
      event: KeyboardEvent,
    ) {
      if (
        event.key === "Escape"
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

  if (
    !open ||
    !media
  ) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        bg-black/80
        backdrop-blur-sm
        flex
        items-center
        justify-center
        p-6
      "
      onClick={onClose}
    >
      <div
        onClick={(e) =>
          e.stopPropagation()
        }
        className="
          bg-white
          rounded-3xl
          w-full
          max-w-6xl
          overflow-hidden
          shadow-2xl
        "
      >
        <div
          className="
            px-6
            py-4
            border-b
            flex
            items-center
            justify-between
          "
        >
          <div>
            <h2
              className="
                text-xl
                font-bold
                text-gray-900
              "
            >
              {media.name}
            </h2>

            <div
              className="
                flex
                items-center
                gap-2
                mt-2
              "
            >
              {media.type ===
              "IMAGE" ? (
                <span
                  className="
                    bg-blue-100
                    text-blue-700
                    px-3
                    py-1
                    rounded-lg
                    text-xs
                    font-medium
                    flex
                    items-center
                    gap-1
                  "
                >
                  <ImageIcon
                    size={12}
                  />
                  Imagem
                </span>
              ) : (
                <span
                  className="
                    bg-purple-100
                    text-purple-700
                    px-3
                    py-1
                    rounded-lg
                    text-xs
                    font-medium
                    flex
                    items-center
                    gap-1
                  "
                >
                  <Video
                    size={12}
                  />
                  Vídeo
                </span>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="
              h-10
              w-10
              rounded-xl
              border
              hover:bg-gray-100
              transition
              flex
              items-center
              justify-center
            "
          >
            <X size={18} />
          </button>
        </div>

        <div
          className="
            bg-gray-100
            p-4
            flex
            items-center
            justify-center
          "
        >
          {media.type ===
          "IMAGE" ? (
            <img
              src={`${import.meta.env.VITE_BASE_URL_API}${media.fileUrl}`}
              alt={
                media.name
              }
              className="
                max-h-[75vh]
                w-auto
                object-contain
                rounded-xl
              "
            />
          ) : (
            <video
              controls
              autoPlay
              className="
                max-h-[75vh]
                w-full
                rounded-xl
              "
            >
              <source
                src={`${import.meta.env.VITE_BASE_URL_API}${media.fileUrl}`}
              />
            </video>
          )}
        </div>
      </div>
    </div>
  );
}