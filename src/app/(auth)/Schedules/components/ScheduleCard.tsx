import type { ReactNode } from "react";

import {
  CalendarDays,
  Clock3,
  ListVideo,
  MonitorSmartphone,
  Pencil,
  Power,
  Trash2,
} from "lucide-react";

import type { Schedule } from "../types";

interface ScheduleCardProps {
  schedule: Schedule;
  deleting: boolean;
  toggling: boolean;
  onEdit: (schedule: Schedule) => void;
  onDelete: (schedule: Schedule) => void;
  onToggleActive: (schedule: Schedule) => void;
}

const WEEK_DAYS_LABELS: Record<string, string> = {
  "0": "Dom",
  "1": "Seg",
  "2": "Ter",
  "3": "Qua",
  "4": "Qui",
  "5": "Sex",
  "6": "Sáb",
};

export default function ScheduleCard({
  schedule,
  deleting,
  toggling,
  onEdit,
  onDelete,
  onToggleActive,
}: ScheduleCardProps) {
  const scheduleDays = getScheduleDays(schedule.daysOfWeek);
  const busy = deleting || toggling;
  const deviceName = schedule.device?.name?.trim() || "Dispositivo sem nome";
  const deviceCode = schedule.device?.code ? `Código ${schedule.device.code}` : undefined;
  const playlistName = schedule.playlist?.name?.trim() || "Playlist não informada";
  const playlistItems = schedule.playlist?._count?.items;

  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-[0_1px_2px_rgba(15,23,42,0.05)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)] ${
        schedule.active ? "border-slate-200 hover:border-blue-200" : "border-slate-200"
      }`}
    >
      <div className={`h-1 w-full ${schedule.active ? "bg-blue-600" : "bg-slate-300"}`} />

      <div className="flex-1 p-4 sm:p-5">
        <header className="flex min-w-0 items-start gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ${
              schedule.active
                ? "bg-blue-50 text-blue-700 ring-blue-100"
                : "bg-slate-100 text-slate-500 ring-slate-200"
            }`}
          >
            <CalendarDays size={20} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2
                title={schedule.name}
                className="truncate text-base font-extrabold text-slate-950"
              >
                {schedule.name}
              </h2>

              <StatusBadge active={schedule.active} />
            </div>

            <p className="mt-1 text-xs font-semibold text-slate-500">
              Programação recorrente
              <span aria-hidden="true" className="mx-1.5 text-slate-300">
                •
              </span>
              <span className="text-blue-700">Prioridade {schedule.priority}</span>
            </p>
          </div>
        </header>

        <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
          <InfoItem
            icon={<MonitorSmartphone size={17} />}
            label="Dispositivo"
            value={deviceName}
            secondary={deviceCode}
          />

          <InfoItem
            icon={<ListVideo size={17} />}
            label="Playlist"
            value={playlistName}
            secondary={
              typeof playlistItems === "number"
                ? `${playlistItems} ${playlistItems === 1 ? "mídia" : "mídias"}`
                : undefined
            }
          />
        </div>

        <div className="mt-2.5 grid gap-2.5 sm:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-xl bg-slate-950 px-4 py-3.5 text-white">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
              <Clock3 size={14} />
              Exibição
            </div>

            <p className="mt-1.5 text-xl font-extrabold tracking-tight">
              {schedule.startTime}
              <span className="mx-1.5 text-sm font-medium text-slate-500">—</span>
              {schedule.endTime}
            </p>

            <p className="mt-0.5 text-[11px] font-semibold text-slate-400">
              {formatDate(schedule.startDate)} a {formatDate(schedule.endDate)}
            </p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3.5">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
              <CalendarDays size={14} />
              Dias
            </div>

            <div className="mt-2 flex flex-wrap gap-1" aria-label={formatDays(schedule.daysOfWeek)}>
              {scheduleDays.map((day) => (
                <span
                  key={day}
                  className="inline-flex h-6 min-w-8 items-center justify-center rounded-md border border-slate-200 bg-white px-1.5 text-[10px] font-extrabold text-slate-700"
                >
                  {day}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <footer className="grid grid-cols-[1fr_1fr_auto] gap-2 border-t border-slate-100 bg-slate-50/60 px-4 py-3 sm:px-5">
        <button
          type="button"
          onClick={() => onEdit(schedule)}
          disabled={busy}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Pencil size={15} />
          Editar
        </button>

        <button
          type="button"
          onClick={() => onToggleActive(schedule)}
          disabled={busy}
          className={`inline-flex h-9 items-center justify-center gap-2 rounded-lg px-3 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${
            schedule.active
              ? "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
              : "bg-emerald-600 text-white hover:bg-emerald-700"
          }`}
        >
          <Power size={15} />
          {toggling ? "Alterando..." : schedule.active ? "Desativar" : "Ativar"}
        </button>

        <button
          type="button"
          onClick={() => onDelete(schedule)}
          disabled={busy}
          aria-label={`Excluir ${schedule.name}`}
          title="Excluir agendamento"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Trash2 size={16} />
        </button>
      </footer>
    </article>
  );
}

interface StatusBadgeProps {
  active: boolean;
}

function StatusBadge({ active }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
        active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-emerald-500" : "bg-slate-400"}`} />
      {active ? "Ativo" : "Inativo"}
    </span>
  );
}

interface InfoItemProps {
  icon: ReactNode;
  label: string;
  value: string;
  secondary?: string;
}

function InfoItem({ icon, label, value, secondary }: InfoItemProps) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-blue-700 ring-1 ring-slate-200">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.11em] text-slate-400">{label}</p>
        <p title={value} className="mt-0.5 truncate text-sm font-extrabold text-slate-900">
          {value}
        </p>
        {secondary && (
          <p title={secondary} className="truncate text-[11px] font-medium text-slate-500">
            {secondary}
          </p>
        )}
      </div>
    </div>
  );
}

function getScheduleDays(value: string) {
  if (!value) {
    return ["Nenhum"];
  }

  return value
    .split(",")
    .map((day) => day.trim())
    .filter(Boolean)
    .map((day) => WEEK_DAYS_LABELS[day] ?? day);
}

function formatDays(value: string) {
  const normalizedDays = value
    .split(",")
    .map((day) => day.trim())
    .filter(Boolean);

  if (normalizedDays.length === 0) {
    return "Nenhum dia selecionado";
  }

  if (normalizedDays.length === 7) {
    return "Todos os dias";
  }

  if (normalizedDays.join(",") === "1,2,3,4,5") {
    return "Segunda a sexta";
  }

  return normalizedDays.map((day) => WEEK_DAYS_LABELS[day] ?? day).join(", ");
}

function formatDate(value: string) {
  if (!value) {
    return "Data inválida";
  }

  const normalizedValue = value.slice(0, 10);
  const parts = normalizedValue.split("-");

  if (parts.length === 3) {
    const [year, month, day] = parts;

    return `${day}/${month}/${year}`;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Data inválida";
  }

  return new Intl.DateTimeFormat("pt-BR").format(date);
}
