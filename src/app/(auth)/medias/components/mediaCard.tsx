import { useEffect } from "react";

type Media = {
  id: string;
  name: string;
  fileUrl: string;
  type?: string;
};

type Props = {
  media: Media;
  onDelete: (id: string) => void;
};

export function MediaCard({
  media,
  onDelete,
}: Props) {
  useEffect(() => {
    console.log("MEDIA:", media);
  }, [media]);

  const mediaUrl = media.fileUrl?.startsWith("http")
    ? media.fileUrl
    : `${import.meta.env.VITE_BASE_URL_API}${media.fileUrl}`;

  const isVideo =
    media?.type?.startsWith("video/") ||
    /\.(mp4|webm|ogg|mov)$/i.test(mediaUrl);

  return (
    <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
      <div className="bg-black min-h-[250px] flex items-center justify-center">
        {isVideo ? (
          <video
            src={mediaUrl}
            controls
            preload="metadata"
            className="w-full h-auto"
            onLoadedData={() =>
              console.log("Vídeo carregado com sucesso")
            }
            onError={(e) =>
              console.error(
                "Erro ao carregar vídeo:",
                e.currentTarget.error
              )
            }
          />
        ) : (
          <img
            src={mediaUrl}
            alt={media.name}
            className="w-full h-full object-cover"
            onError={() =>
              console.error(
                "Erro ao carregar imagem:",
                mediaUrl
              )
            }
          />
        )}
      </div>

      <div className="p-4">
        <h3 className="font-medium truncate">
          {media.name}
        </h3>

        <button
          onClick={() => onDelete(media.id)}
          className="mt-3 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg w-full transition-colors"
        >
          Excluir
        </button>
      </div>
    </div>
  );
}