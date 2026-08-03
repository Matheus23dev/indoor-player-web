import { useMemo, useState, type ReactNode } from "react";

import { CalendarClock, CheckCircle2, Loader2, PauseCircle, Plus, Search } from "lucide-react";

import { PageContainer, PageScrollArea } from "../../../components/layout/Page";

import ScheduleCard from "./components/ScheduleCard";
import ScheduleModal from "./components/ScheduleModal";

import { useSchedules } from "./hooks/useSchedules";

import type { CreateSchedulePayload, Schedule } from "./types";

type StatusFilter = "ALL" | "ACTIVE" | "INACTIVE";

export default function Schedules() {
  const {
    schedules,
    devices,
    playlists,

    loading,
    saving,

    deletingScheduleId,
    togglingScheduleId,

    addSchedule,
    editSchedule,
    toggleScheduleActive,
    removeSchedule,
  } = useSchedules();

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  const [modalOpen, setModalOpen] = useState(false);

  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);

  const filteredSchedules = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return schedules.filter((schedule) => {
      const scheduleName = schedule.name.toLowerCase();

      const deviceName = schedule.device?.name?.toLowerCase() ?? "";

      const deviceCode = schedule.device?.code?.toLowerCase() ?? "";

      const playlistName = schedule.playlist?.name?.toLowerCase() ?? "";

      const matchesSearch =
        scheduleName.includes(normalizedSearch) ||
        deviceName.includes(normalizedSearch) ||
        deviceCode.includes(normalizedSearch) ||
        playlistName.includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && schedule.active) ||
        (statusFilter === "INACTIVE" && !schedule.active);

      return matchesSearch && matchesStatus;
    });
  }, [schedules, search, statusFilter]);

  const totalActive = schedules.filter((schedule) => schedule.active).length;

  const totalInactive = schedules.length - totalActive;

  function openCreateModal() {
    setEditingSchedule(null);
    setModalOpen(true);
  }

  function openEditModal(schedule: Schedule) {
    setEditingSchedule(schedule);

    setModalOpen(true);
  }

  function closeModal() {
    if (saving) {
      return;
    }

    setModalOpen(false);
    setEditingSchedule(null);
  }

  async function handleSubmit(data: CreateSchedulePayload, scheduleId?: string) {
    if (scheduleId) {
      return editSchedule(scheduleId, data);
    }

    return addSchedule(data);
  }

  return (
    <>
      <PageContainer scrollable>
        <header className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] md:flex-row md:items-center">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-700">
              Grade de programação
            </p>
            <h1 className="mt-0.5 text-2xl font-bold tracking-tight text-slate-950">
              Agendamentos
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Defina quando cada playlist será exibida nos players.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800"
          >
            <Plus size={19} />
            Novo agendamento
          </button>
        </header>

        <div className="grid gap-3 md:grid-cols-3">
          <SummaryCard label="Total" value={schedules.length} icon={<CalendarClock size={22} />} />

          <SummaryCard label="Ativos" value={totalActive} icon={<CheckCircle2 size={22} />} />

          <SummaryCard label="Inativos" value={totalInactive} icon={<PauseCircle size={22} />} />
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-md">
              <Search
                size={19}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por agendamento, player ou playlist..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm font-medium outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div className="flex overflow-x-auto rounded-xl bg-gray-100 p-1">
              <FilterButton active={statusFilter === "ALL"} onClick={() => setStatusFilter("ALL")}>
                Todos
              </FilterButton>

              <FilterButton
                active={statusFilter === "ACTIVE"}
                onClick={() => setStatusFilter("ACTIVE")}
              >
                Ativos
              </FilterButton>

              <FilterButton
                active={statusFilter === "INACTIVE"}
                onClick={() => setStatusFilter("INACTIVE")}
              >
                Inativos
              </FilterButton>
            </div>
          </div>
        </div>

        <PageScrollArea ariaLabel="Lista de agendamentos">
          {loading && (
            <div className="flex min-h-80 items-center justify-center rounded-2xl border border-gray-200 bg-white">
              <div className="flex flex-col items-center gap-3 text-gray-500">
                <Loader2 className="animate-spin text-blue-600" size={36} />

                <p className="text-sm font-bold">Carregando agendamentos...</p>
              </div>
            </div>
          )}

          {!loading && filteredSchedules.length > 0 && (
            <section className="grid items-start gap-4 xl:grid-cols-2">
              {filteredSchedules.map((schedule) => (
                <ScheduleCard
                  key={schedule.id}
                  schedule={schedule}
                  deleting={deletingScheduleId === schedule.id}
                  toggling={togglingScheduleId === schedule.id}
                  onEdit={openEditModal}
                  onDelete={removeSchedule}
                  onToggleActive={toggleScheduleActive}
                />
              ))}
            </section>
          )}

          {!loading && filteredSchedules.length === 0 && (
            <div className="flex min-h-80 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
              <div className="max-w-md">
                <CalendarClock size={52} className="mx-auto text-gray-300" />

                <h2 className="mt-4 text-xl font-black text-gray-900">
                  Nenhum agendamento encontrado
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  {search.trim() || statusFilter !== "ALL"
                    ? "Nenhum agendamento corresponde aos filtros."
                    : "Crie um agendamento para definir a programação das telas."}
                </p>

                {!search.trim() && statusFilter === "ALL" && (
                  <button
                    type="button"
                    onClick={openCreateModal}
                    className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
                  >
                    <Plus size={18} />
                    Novo agendamento
                  </button>
                )}
              </div>
            </div>
          )}
        </PageScrollArea>
      </PageContainer>

      <ScheduleModal
        open={modalOpen}
        saving={saving}
        schedule={editingSchedule}
        devices={devices}
        playlists={playlists}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
    </>
  );
}

interface SummaryCardProps {
  label: string;
  value: number;
  icon: ReactNode;
}

function SummaryCard({ label, value, icon }: SummaryCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-gray-500">{label}</p>

          <p className="mt-1 text-2xl font-black text-gray-900">{value}</p>
        </div>

        <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">{icon}</div>
      </div>
    </div>
  );
}

interface FilterButtonProps {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}

function FilterButton({ active, onClick, children }: FilterButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-bold transition ${
        active ? "bg-white text-blue-700 shadow-sm" : "text-gray-500 hover:text-gray-900"
      }`}
    >
      {children}
    </button>
  );
}
