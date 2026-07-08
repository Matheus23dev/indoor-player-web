import type { ReactNode } from "react";

import {
  CalendarDays,
  Clock3,
  Monitor,
  Pencil,
  Power,
  Trash2,
  Tv,
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
  const days = formatDays(schedule.daysOfWeek);

  const busy = deleting || toggling;

  return (
    <article
      className={`rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md ${
        schedule.active
          ? "border-gray-200"
          : "border-gray-200 opacity-75"
      }`}
    >
      <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-start">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2
              title={schedule.name}
              className="truncate text-lg font-black text-gray-900"
            >
              {schedule.name}
            </h2>

            <span
              className={`rounded-full px-3 py-1 text-xs font-black ${
                schedule.active
                  ? "bg-green-50 text-green-700"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {schedule.active ? "Ativo" : "Inativo"}
            </span>

            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
              Prioridade {schedule.priority}
            </span>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <InfoItem
              icon={<Monitor size={16} />}
              label="Player"
              value={
                schedule.device?.name?.trim() ||
                schedule.device?.code ||
                "Não informado"
              }
            />

            <InfoItem
              icon={<Tv size={16} />}
              label="Playlist"
              value={
                schedule.playlist?.name ||
                "Não informada"
              }
            />

            <InfoItem
              icon={<CalendarDays size={16} />}
              label="Período"
              value={`${formatDate(
                schedule.startDate,
              )} até ${formatDate(
                schedule.endDate,
              )}`}
            />

            <InfoItem
              icon={<Clock3 size={16} />}
              label="Horário"
              value={`${schedule.startTime} - ${schedule.endTime}`}
            />
          </div>

          <div className="mt-3 rounded-xl bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-600">
            Dias:{" "}
            <span className="font-black text-gray-900">
              {days}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            type="button"
            onClick={() =>
              onToggleActive(schedule)
            }
            disabled={busy}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${
              schedule.active
                ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                : "bg-green-50 text-green-700 hover:bg-green-100"
            }`}
          >
            <Power size={17} />

            {toggling
              ? "Alterando..."
              : schedule.active
                ? "Desativar"
                : "Ativar"}
          </button>

          <button
            type="button"
            onClick={() => onEdit(schedule)}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Pencil size={17} />
            Editar
          </button>

          <button
            type="button"
            onClick={() =>
              onDelete(schedule)
            }
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-bold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 size={17} />

            {deleting
              ? "Excluindo..."
              : "Excluir"}
          </button>
        </div>
      </div>
    </article>
  );
}

interface InfoItemProps {
  icon: ReactNode;
  label: string;
  value: string;
}

function InfoItem({
  icon,
  label,
  value,
}: InfoItemProps) {
  return (
    <div className="min-w-0 rounded-xl bg-gray-50 p-3">
      <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
        {icon}
        {label}
      </div>

      <p
        title={value}
        className="mt-1 truncate text-sm font-black text-gray-900"
      >
        {value}
      </p>
    </div>
  );
}

function formatDays(value: string) {
  if (!value) {
    return "Nenhum";
  }

  const normalizedDays = value
    .split(",")
    .map((day) => day.trim())
    .filter(Boolean);

  if (
    normalizedDays.length === 7
  ) {
    return "Todos os dias";
  }

  if (
    normalizedDays.join(",") ===
    "1,2,3,4,5"
  ) {
    return "Segunda a sexta";
  }

  return normalizedDays
    .map(
      (day) =>
        WEEK_DAYS_LABELS[day] ??
        day,
    )
    .join(", ");
}

function formatDate(value: string) {
  if (!value) {
    return "Data inválida";
  }

  const normalizedValue =
    value.slice(0, 10);

  const parts =
    normalizedValue.split("-");

  if (parts.length === 3) {
    const [
      year,
      month,
      day,
    ] = parts;

    return `${day}/${month}/${year}`;
  }

  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "Data inválida";
  }

  return new Intl.DateTimeFormat(
    "pt-BR",
  ).format(date);
}