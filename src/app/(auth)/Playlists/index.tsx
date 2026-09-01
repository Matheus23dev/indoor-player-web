import { useMemo, useState } from "react";

import { ListVideo, Loader2, Plus, Search } from "lucide-react";

import { PageContainer, PageScrollArea } from "../../../components/layout/Page";

import CreatePlaylistModal from "./components/CreatePlaylistModal";
import PlaylistCard from "./components/PlaylistCard";

import { usePlaylists } from "./hooks/usePlaylists";

export default function Playlists() {
  const { playlists, loading, saving, addPlaylist, removePlaylist } = usePlaylists();

  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);

  const filteredPlaylists = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return playlists.filter((playlist) => playlist.name.toLowerCase().includes(normalizedSearch));
  }, [playlists, search]);

  return (
    <>
      <PageContainer scrollable>
        <header
          data-help-tour="playlist-create"
          className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] md:flex-row md:items-center"
        >
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-700">
              Organização e sequência
            </p>
            <h1 className="mt-0.5 text-2xl font-bold tracking-tight text-slate-950">Playlists</h1>

            <p className="mt-1 text-sm text-gray-500">
              Crie sequências de imagens e vídeos para suas telas.
            </p>
          </div>

          <button
            data-help-tour="playlist-create-button"
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 text-sm font-semibold text-white shadow-sm hover:bg-blue-800"
          >
            <Plus size={19} />
            Nova playlist
          </button>
        </header>

        <div className="grid gap-3 md:grid-cols-3">
          <SummaryCard label="Playlists" value={playlists.length} />

          <SummaryCard
            label="Total de mídias"
            value={playlists.reduce(
              (total, playlist) => total + (playlist._count?.items ?? playlist.items?.length ?? 0),
              0,
            )}
          />

          <SummaryCard
            label="Agendamentos"
            value={playlists.reduce(
              (total, playlist) => total + (playlist._count?.schedules ?? 0),
              0,
            )}
          />
        </div>

        <div
          data-help-tour="playlist-library"
          className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm"
        >
          <div className="relative max-w-md">
            <Search size={19} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar playlist..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </div>
        </div>

        <PageScrollArea ariaLabel="Lista de playlists">
          {loading && (
            <div className="flex min-h-80 items-center justify-center rounded-2xl border bg-white">
              <Loader2 size={36} className="animate-spin text-blue-600" />
            </div>
          )}

          {!loading && filteredPlaylists.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredPlaylists.map((playlist) => (
                <PlaylistCard key={playlist.id} playlist={playlist} onDelete={removePlaylist} />
              ))}
            </div>
          )}

          {!loading && filteredPlaylists.length === 0 && (
            <div className="flex min-h-80 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
              <div>
                <ListVideo size={50} className="mx-auto text-gray-300" />

                <h2 className="mt-4 text-xl font-black text-gray-900">
                  Nenhuma playlist encontrada
                </h2>

                <p className="mt-2 text-sm text-gray-500">Crie uma playlist para começar.</p>
              </div>
            </div>
          )}
        </PageScrollArea>
      </PageContainer>

      <CreatePlaylistModal
        open={modalOpen}
        saving={saving}
        onClose={() => setModalOpen(false)}
        onCreate={addPlaylist}
      />
    </>
  );
}

interface SummaryCardProps {
  label: string;
  value: number;
}

function SummaryCard({ label, value }: SummaryCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <p className="text-xs font-bold text-gray-500">{label}</p>

      <p className="mt-1 text-2xl font-black text-gray-900">{value}</p>
    </div>
  );
}
