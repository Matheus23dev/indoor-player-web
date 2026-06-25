import { Search, X, Image as ImageIcon, Video, Check } from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import { getMedias } from "../../medias/services/medias.services";

interface Props {
  open: boolean;
  playlistId: string;
  onClose: () => void;
  onAdd: (mediaId: string, duration?: number) => Promise<void>;
}

export default function AddMediaModal({ open, onClose, onAdd }: Props) {
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [medias, setMedias] = useState<any[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<any>(null);
  const [duration, setDuration] = useState(5);

  useEffect(() => {
    if (!open) return;

    loadMedias();
  }, [open]);

  async function loadMedias() {
    try {
      setLoading(true);

      const data = await getMedias();

      setMedias(data);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit() {
    if (!selectedMedia) {
      return;
    }

    await onAdd(
      selectedMedia.id,
      selectedMedia.type === "IMAGE" ? duration : undefined,
    );

    setSelectedMedia(null);
    setDuration(5);
    onClose();
  }

  const filtered = useMemo(() => {
    return medias.filter((media) =>
      media.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [medias, search]);

  if (!open) {
    return null;
  }

  return (
    <div
      className=" fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4
      "
    >
      <div
        className="
          bg-white
          w-full
          max-w-5xl
          rounded-3xl
          overflow-hidden
          shadow-xl
        "
      >
        <div
          className="
            flex
            justify-between
            items-center
            p-6
            border-b
          "
        >
          <div>
            <h2
              className="
                text-xl
                font-semibold
              "
            >
              Adicionar mídia
            </h2>

            <p
              className="
                text-sm
                text-gray-500
              "
            >
              Escolha uma mídia
            </p>
          </div>

          <button
            onClick={onClose}
            className="
              h-10
              w-10
              rounded-xl
              hover:bg-gray-100
              flex
              items-center
              justify-center
            "
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          <div
            className="
              relative
              mb-6
            "
          >
            <Search
              size={18}
              className="
                absolute
                left-4
                top-3.5
                text-gray-400
              "
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar mídia..."
              className="
                w-full
                border
                rounded-xl
                pl-11
                pr-4
                py-3
              "
            />
          </div>

          {loading ? (
            <div
              className="
                flex
                justify-center
                py-16
              "
            >
              Carregando...
            </div>
          ) : (
            <div
              className="
                grid
                grid-cols-1
                md:grid-cols-2
                xl:grid-cols-3
                gap-4
                max-h-[500px]
                overflow-y-auto
              "
            >
              {filtered.map((media) => (
                <button
                  key={media.id}
                  onClick={() => setSelectedMedia(media)}
                  className={`
                      relative
                      border
                      rounded-2xl
                      overflow-hidden
                      text-left
                      transition-all
                      ${
                        selectedMedia?.id === media.id
                          ? "border-blue-600 ring-2 ring-blue-200"
                          : "hover:border-blue-300"
                      }
                    `}
                >
                  {selectedMedia?.id === media.id && (
                    <div
                      className="
                          absolute
                          top-3
                          right-3
                          h-8
                          w-8
                          rounded-full
                          bg-blue-600
                          text-white
                          flex
                          items-center
                          justify-center
                          z-10
                        "
                    >
                      <Check size={16} />
                    </div>
                  )}

                  <div
                    className="
                        h-44
                        bg-gray-100
                      "
                  >
                    {media.type === "IMAGE" ? (
                      <img
                        src={`${import.meta.env.VITE_BASE_URL_API}${media.fileUrl}`}
                        alt={media.name}
                        className="
                            h-full
                            w-full
                            object-cover
                          "
                      />
                    ) : (
                      <video
                        src={`${import.meta.env.VITE_BASE_URL_API}${media.fileUrl}`}
                        className="
                            h-full
                            w-full
                            object-cover
                          "
                      />
                    )}
                  </div>

                  <div className="p-4">
                    <h3
                      className="
                          font-medium
                          truncate
                        "
                    >
                      {media.name}
                    </h3>

                    <div
                      className="
                          flex
                          items-center
                          gap-2
                          mt-2
                        "
                    >
                      {media.type === "IMAGE" ? (
                        <>
                          <ImageIcon
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
                            Imagem
                          </span>
                        </>
                      ) : (
                        <>
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
                            Vídeo
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {selectedMedia?.type === "IMAGE" && (
            <div
              className="
                mt-6
                border-t
                pt-6
              "
            >
              <label
                className="
                  block
                  mb-2
                  font-medium
                "
              >
                Duração da imagem
              </label>

              <input
                type="number"
                min={1}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="
                  border
                  rounded-xl
                  px-4
                  py-3
                  w-40
                "
              />
            </div>
          )}
        </div>

        <div
          className="
            border-t
            p-6
            flex
            justify-end
            gap-3
          "
        >
          <button
            onClick={onClose}
            className="
              px-5
              py-3
              border
              rounded-xl
            "
          >
            Cancelar
          </button>

          <button
            disabled={!selectedMedia}
            onClick={handleSubmit}
            className="
              px-5
              py-3
              rounded-xl
              bg-blue-600
              text-white
              disabled:opacity-50
            "
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}
