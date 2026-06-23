import { useState } from "react";

import {
  usePlaylists,
} from "./hooks/usePlaylists";

import {
  createPlaylist,
  removePlaylist,
} from "./services/Playlists.services";

import {
  PlaylistCard,
} from "./components/PlaylistCard";

import {
  CreatePlaylistModal,
} from "./components/CreatePlaylistModal";

import {
  AddMediaToPlaylistModal,
} from "./components/AddMediaToPlaylistModal";

export default function PlaylistsPage() {
  const {
    playlists,
    loadPlaylists,
  } = usePlaylists();

  const [createOpen,
    setCreateOpen] =
    useState(false);

  const [mediaOpen,
    setMediaOpen] =
    useState(false);

  const [playlistId,
    setPlaylistId] =
    useState<string | null>(
      null,
    );

  async function handleCreate(
    name: string,
  ) {
    const playlist =
      await createPlaylist(
        name,
      );

    setCreateOpen(false);

    setPlaylistId(
      playlist.id,
    );

    setMediaOpen(true);

    loadPlaylists();
  }

  async function handleDelete(
    id: string,
  ) {
    await removePlaylist(id);

    loadPlaylists();
  }

  return (
    <div className="p-6">

      <div className="flex justify-between mb-6">

        <h1 className="text-3xl font-bold">
          Playlists
        </h1>

        <button
          onClick={() =>
            setCreateOpen(true)
          }
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Nova Playlist
        </button>

      </div>

      <div className="grid gap-4">

        {playlists.map(
          (playlist: any) => (
            <PlaylistCard
              key={playlist.id}
              playlist={
                playlist
              }
              onDelete={
                handleDelete
              }
            />
          ),
        )}

      </div>

      <CreatePlaylistModal
        open={createOpen}
        onClose={() =>
          setCreateOpen(false)
        }
        onConfirm={
          handleCreate
        }
      />

      <AddMediaToPlaylistModal
        open={mediaOpen}
        playlistId={playlistId}
        onClose={() =>
          setMediaOpen(false)
        }
      />

    </div>
  );
}