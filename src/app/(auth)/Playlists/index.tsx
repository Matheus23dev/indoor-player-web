import { useState } from "react";
import { Plus, ListVideo } from "lucide-react";
import { useNavigate } from "react-router-dom";

import PlaylistCard from "./components/PlaylistCard";
import CreatePlaylistModal from "./components/CreatePlaylistModal";

import { usePlaylists } from "./hooks/usePlaylists";

export default function Playlists() {
  const navigate = useNavigate();

  const {
    playlists,
    loading,
    createPlaylist,
    deletePlaylist,
  } = usePlaylists();

  const [openCreateModal, setOpenCreateModal] =
    useState(false);

  async function handleCreatePlaylist(
    name: string,
  ) {
    await createPlaylist(name);
    setOpenCreateModal(false);
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Playlists
          </h1>

          <p className="text-slate-500 mt-1">
            Gerencie playlists de exibição
          </p>
        </div>

        <button
          onClick={() =>
            setOpenCreateModal(true)
          }
          className="
            flex
            items-center
            gap-2
            bg-blue-600
            hover:bg-blue-700
            text-white
            px-5
            py-3
            rounded-xl
            transition
          "
        >
          <Plus size={18} />
          Nova Playlist
        </button>
      </div>

      {loading && (
        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-4
            gap-6
          "
        >
          {Array.from({
            length: 8,
          }).map((_, index) => (
            <div
              key={index}
              className="
                h-52
                bg-slate-200
                rounded-2xl
                animate-pulse
              "
            />
          ))}
        </div>
      )}

      {!loading &&
        playlists.length === 0 && (
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
                mb-4
              "
            >
              <ListVideo
                size={32}
                className="text-blue-600"
              />
            </div>

            <h2 className="text-xl font-semibold">
              Nenhuma playlist criada
            </h2>

            <p className="text-slate-500 mt-2">
              Crie sua primeira playlist
            </p>

            <button
              onClick={() =>
                setOpenCreateModal(true)
              }
              className="
                mt-6
                bg-blue-600
                hover:bg-blue-700
                text-white
                px-5
                py-3
                rounded-xl
              "
            >
              Criar Playlist
            </button>
          </div>
        )}

      {!loading &&
        playlists.length > 0 && (
          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              xl:grid-cols-4
              gap-6
            "
          >
            {playlists.map(
              (playlist) => (
                <PlaylistCard
                  key={playlist.id}
                  playlist={playlist}
                  onOpen={() =>
                    navigate(
                      `/home/playlists/${playlist.id}`,
                    )
                  }
                  onDelete={
                    deletePlaylist
                  }
                />
              ),
            )}
          </div>
        )}

      <CreatePlaylistModal
        open={openCreateModal}
        onClose={() =>
          setOpenCreateModal(false)
        }
        onCreate={
          handleCreatePlaylist
        }
      />
    </div>
  );
}