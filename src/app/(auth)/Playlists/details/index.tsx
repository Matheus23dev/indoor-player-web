import { useState } from "react";

import {
  ArrowLeft,
  Clock3,
  Plus,
  Image,
  Video,
  ListVideo,
} from "lucide-react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

import PlaylistItemCard from "../components/PlaylistItemCard";
import AddMediaModal from "../components/AddMediaToPlaylistModal";

import { usePlaylistDetails } from "../hooks/usePlaylistDetail";

import { formatDuration } from "../utils/FormatDuration";

import type {
  PlaylistItem,
} from "../types/playlist";

export default function PlaylistDetails() {
  const navigate =
    useNavigate();

  const { id } =
    useParams();

  const [openModal, setOpenModal] =
    useState(false);

  const {
    playlist,
    loading,
    totalDuration,
    addMedia,
    removeMedia,
    updateDuration,
    reorderItems,
  } =
    usePlaylistDetails(
      id || "",
    );

  function handleDragEnd(
    result: any,
  ) {
    if (
      !result.destination ||
      !playlist
    ) {
      return;
    }

    const reordered =
      Array.from(
        playlist.items,
      );

    const [removed] =
      reordered.splice(
        result.source.index,
        1,
      );

    reordered.splice(
      result.destination.index,
      0,
      removed,
    );

    reorderItems(
      reordered,
    );
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div
          className="
            h-40
            rounded-3xl
            bg-gray-200
            animate-pulse
          "
        />

        <div
          className="
            h-28
            rounded-2xl
            bg-gray-200
            animate-pulse
          "
        />

        <div
          className="
            h-28
            rounded-2xl
            bg-gray-200
            animate-pulse
          "
        />
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="p-6">
        <div
          className="
            bg-white
            rounded-3xl
            border
            p-10
            text-center
          "
        >
          Playlist não encontrada
        </div>
      </div>
    );
  }

  const imageCount =
    playlist.items.filter(
      (
        item,
      ) =>
        item.media?.type ===
        "IMAGE",
    ).length;

  const videoCount =
    playlist.items.filter(
      (
        item,
      ) =>
        item.media?.type ===
        "VIDEO",
    ).length;

  return (
    <div className="p-6">

      <button
        onClick={() =>
          navigate(
            "/home/playlists",
          )
        }
        className="
          flex
          items-center
          gap-2
          text-gray-600
          hover:text-black
          mb-6
        "
      >
        <ArrowLeft size={18} />
        Voltar
      </button>

      <div className="grid lg:grid-cols-4 gap-6 mb-6">

        <div
          className="
            lg:col-span-2
            bg-white
            border
            rounded-3xl
            p-6
          "
        >
          <h1
            className="
              text-3xl
              font-bold
            "
          >
            {playlist.name}
          </h1>

          <p
            className="
              text-gray-500
              mt-2
            "
          >
            Playlist de exibição
          </p>
        </div>

        <div
          className="
            bg-white
            border
            rounded-3xl
            p-6
          "
        >
          <p
            className="
              text-sm
              text-gray-500
            "
          >
            Total de mídias
          </p>

          <h2
            className="
              text-3xl
              font-bold
              mt-2
            "
          >
            {
              playlist.items
                .length
            }
          </h2>
        </div>

        <div
          className="
            bg-white
            border
            rounded-3xl
            p-6
          "
        >
          <p
            className="
              text-sm
              text-gray-500
            "
          >
            Duração total
          </p>

          <h2
            className="
              text-2xl
              font-bold
              mt-2
            "
          >
            {formatDuration(
              totalDuration,
            )}
          </h2>
        </div>

      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">

        <div
          className="
            bg-white
            border
            rounded-3xl
            p-5
          "
        >
          <div className="flex items-center gap-3">
            <Image
              className="
                text-blue-600
              "
            />

            <div>
              <p
                className="
                  text-gray-500
                  text-sm
                "
              >
                Imagens
              </p>

              <h3
                className="
                  text-2xl
                  font-bold
                "
              >
                {imageCount}
              </h3>
            </div>
          </div>
        </div>

        <div
          className="
            bg-white
            border
            rounded-3xl
            p-5
          "
        >
          <div className="flex items-center gap-3">
            <Video
              className="
                text-purple-600
              "
            />

            <div>
              <p
                className="
                  text-gray-500
                  text-sm
                "
              >
                Vídeos
              </p>

              <h3
                className="
                  text-2xl
                  font-bold
                "
              >
                {videoCount}
              </h3>
            </div>
          </div>
        </div>

      </div>

      <div
        className="
          flex
          justify-end
          mb-6
        "
      >
        <button
          onClick={() =>
            setOpenModal(
              true,
            )
          }
          className="
            bg-blue-600
            hover:bg-blue-700
            text-white
            px-5
            py-3
            rounded-xl
            flex
            items-center
            gap-2
          "
        >
          <Plus size={18} />
          Adicionar mídia
        </button>
      </div>

      {playlist.items
        .length === 0 ? (
        <div
          className="
            bg-white
            border
            rounded-3xl
            py-24
            flex
            flex-col
            items-center
            justify-center
          "
        >
          <div
            className="
              h-20
              w-20
              rounded-full
              bg-blue-100
              flex
              items-center
              justify-center
              mb-5
            "
          >
            <ListVideo
              size={32}
              className="
                text-blue-600
              "
            />
          </div>

          <h2
            className="
              text-xl
              font-semibold
            "
          >
            Playlist vazia
          </h2>

          <p
            className="
              text-gray-500
              mt-2
            "
          >
            Adicione imagens ou vídeos
            para começar
          </p>

          <button
            onClick={() =>
              setOpenModal(
                true,
              )
            }
            className="
              mt-6
              bg-blue-600
              text-white
              px-5
              py-3
              rounded-xl
            "
          >
            Adicionar mídia
          </button>
        </div>
      ) : (
        <DragDropContext
          onDragEnd={
            handleDragEnd
          }
        >
          <Droppable
            droppableId="playlist"
          >
            {(
              provided,
            ) => (
              <div
                ref={
                  provided.innerRef
                }
                {
                  ...provided.droppableProps
                }
                className="
                  flex
                  flex-col
                  gap-4
                "
              >
                {playlist.items.map(
                  (
                    item: PlaylistItem,
                    index: number,
                  ) => (
                    <Draggable
                      key={
                        item.id
                      }
                      draggableId={
                        item.id
                      }
                      index={
                        index
                      }
                    >
                      {(
                        provided,
                        snapshot,
                      ) => (
                        <div
                          ref={
                            provided.innerRef
                          }
                          {
                            ...provided.draggableProps
                          }
                          {
                            ...provided.dragHandleProps
                          }
                          style={{
                            ...provided
                              .draggableProps
                              .style,
                            opacity:
                              snapshot.isDragging
                                ? 0.8
                                : 1,
                          }}
                        >
                          <PlaylistItemCard
                            item={
                              item
                            }
                            apiUrl={
                              import.meta.env
                                .VITE_BASE_URL_API
                            }
                            onRemove={
                              removeMedia
                            }
                            onUpdateDuration={
                              updateDuration
                            }
                          />
                        </div>
                      )}
                    </Draggable>
                  ),
                )}

                {
                  provided.placeholder
                }
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      <AddMediaModal
        open={
          openModal
        }
        playlistId={
          playlist.id
        }
        onClose={() =>
          setOpenModal(
            false,
          )
        }
        onAdd={
          addMedia
        }
      />
    </div>
  );
}