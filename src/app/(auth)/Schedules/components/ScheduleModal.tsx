import { useEffect, useMemo, useState, type FormEvent } from "react";

import { CalendarDays, Clock3, ListVideo, Monitor, Save, X } from "lucide-react";

import Swal from "sweetalert2";

import type { CreateSchedulePayload, Schedule, ScheduleDevice, SchedulePlaylist } from "../types";
import { getApiErrorMessage } from "../../../../lib/apiError";

interface ScheduleModalProps {
  open: boolean;
  saving: boolean;
  schedule?: Schedule | null;
  devices: ScheduleDevice[];
  playlists: SchedulePlaylist[];
  onClose: () => void;
  onSubmit: (data: CreateSchedulePayload, scheduleId?: string) => Promise<unknown>;
}

interface WeekDay {
  value: number;
  label: string;
  fullLabel: string;
}

const WEEK_DAYS: WeekDay[] = [
  {
    value: 0,
    label: "Dom",
    fullLabel: "Domingo",
  },
  {
    value: 1,
    label: "Seg",
    fullLabel: "Segunda",
  },
  {
    value: 2,
    label: "Ter",
    fullLabel: "Terça",
  },
  {
    value: 3,
    label: "Qua",
    fullLabel: "Quarta",
  },
  {
    value: 4,
    label: "Qui",
    fullLabel: "Quinta",
  },
  {
    value: 5,
    label: "Sex",
    fullLabel: "Sexta",
  },
  {
    value: 6,
    label: "Sáb",
    fullLabel: "Sábado",
  },
];

export default function ScheduleModal({
  open,
  saving,
  schedule,
  devices,
  playlists,
  onClose,
  onSubmit,
}: ScheduleModalProps) {
  const editing = Boolean(schedule);

  const [name, setName] = useState("");

  const [deviceId, setDeviceId] = useState("");

  const [playlistId, setPlaylistId] = useState("");

  const [startDate, setStartDate] = useState("");

  const [endDate, setEndDate] = useState("");

  const [startTime, setStartTime] = useState("08:00");

  const [endTime, setEndTime] = useState("18:00");

  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]);

  const [priority, setPriority] = useState(1);

  const [active, setActive] = useState(true);

  const linkedDevices = useMemo(() => devices.filter((device) => device.isLinked), [devices]);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (schedule) {
      setName(schedule.name);

      setDeviceId(schedule.deviceId);

      setPlaylistId(schedule.playlistId);

      setStartDate(formatInputDate(schedule.startDate));

      setEndDate(formatInputDate(schedule.endDate));

      setStartTime(schedule.startTime);

      setEndTime(schedule.endTime);

      setSelectedDays(parseDays(schedule.daysOfWeek));

      setPriority(schedule.priority);

      setActive(schedule.active);

      return;
    }

    const today = new Date();

    const nextMonth = new Date(today);

    nextMonth.setMonth(nextMonth.getMonth() + 1);

    setName("");
    setDeviceId("");
    setPlaylistId("");

    setStartDate(toDateInputValue(today));

    setEndDate(toDateInputValue(nextMonth));

    setStartTime("08:00");
    setEndTime("18:00");

    setSelectedDays([1, 2, 3, 4, 5]);

    setPriority(1);
    setActive(true);
  }, [open, schedule]);

  if (!open) {
    return null;
  }

  function handleClose() {
    if (saving) {
      return;
    }

    onClose();
  }

  function toggleDay(day: number) {
    setSelectedDays((currentDays) => {
      if (currentDays.includes(day)) {
        return currentDays.filter((currentDay) => currentDay !== day);
      }

      return [...currentDays, day].sort((first, second) => first - second);
    });
  }

  function selectEveryDay() {
    setSelectedDays([0, 1, 2, 3, 4, 5, 6]);
  }

  function selectBusinessDays() {
    setSelectedDays([1, 2, 3, 4, 5]);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedName = name.trim();

    if (!normalizedName) {
      await Swal.fire({
        icon: "warning",
        title: "Nome obrigatório",
        text: "Informe o nome do agendamento.",
      });

      return;
    }

    if (!deviceId) {
      await Swal.fire({
        icon: "warning",
        title: "Player obrigatório",
        text: "Selecione o player que receberá o agendamento.",
      });

      return;
    }

    if (!playlistId) {
      await Swal.fire({
        icon: "warning",
        title: "Playlist obrigatória",
        text: "Selecione uma playlist.",
      });

      return;
    }

    if (!startDate || !endDate) {
      await Swal.fire({
        icon: "warning",
        title: "Datas obrigatórias",
        text: "Informe a data inicial e a data final.",
      });

      return;
    }

    if (endDate < startDate) {
      await Swal.fire({
        icon: "warning",
        title: "Período inválido",
        text: "A data final não pode ser anterior à data inicial.",
      });

      return;
    }

    if (!startTime || !endTime) {
      await Swal.fire({
        icon: "warning",
        title: "Horários obrigatórios",
        text: "Informe o horário inicial e o horário final.",
      });

      return;
    }

    if (selectedDays.length === 0) {
      await Swal.fire({
        icon: "warning",
        title: "Dias obrigatórios",
        text: "Selecione pelo menos um dia da semana.",
      });

      return;
    }

    if (!Number.isInteger(priority) || priority < 1) {
      await Swal.fire({
        icon: "warning",
        title: "Prioridade inválida",
        text: "A prioridade deve ser um número inteiro maior ou igual a 1.",
      });

      return;
    }

    const payload: CreateSchedulePayload = {
      name: normalizedName,
      deviceId,
      playlistId,
      startDate,
      endDate,
      startTime,
      endTime,

      daysOfWeek: selectedDays.sort((first, second) => first - second).join(","),

      priority,
      active,
    };

    try {
      await onSubmit(payload, schedule?.id);

      await Swal.fire({
        icon: "success",

        title: editing ? "Agendamento atualizado" : "Agendamento criado",

        timer: 1500,
        showConfirmButton: false,
      });

      onClose();
    } catch (error: unknown) {
      const message = getApiErrorMessage(error, "Não foi possível salvar o agendamento.");

      await Swal.fire({
        icon: "error",
        title: "Erro ao salvar",
        text: message,
      });
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
      <form
        onSubmit={handleSubmit}
        className="flex max-h-[95vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <header className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-xl font-black text-gray-900">
              {editing ? "Editar agendamento" : "Novo agendamento"}
            </h2>

            <p className="text-sm text-gray-500">
              Defina quando uma playlist será exibida em um player.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={saving}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 disabled:opacity-50"
            aria-label="Fechar"
          >
            <X size={22} />
          </button>
        </header>

        <div className="space-y-6 overflow-y-auto p-6">
          <section className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label htmlFor="schedule-name" className="mb-2 block text-sm font-bold text-gray-700">
                Nome do agendamento
              </label>

              <input
                id="schedule-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                disabled={saving}
                maxLength={100}
                placeholder="Ex.: Programação da recepção"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:opacity-50"
              />
            </div>

            <div>
              <label
                htmlFor="schedule-device"
                className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-700"
              >
                <Monitor size={16} />
                Player
              </label>

              <select
                id="schedule-device"
                value={deviceId}
                onChange={(event) => setDeviceId(event.target.value)}
                disabled={saving}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:opacity-50"
              >
                <option value="">Selecione um player</option>

                {linkedDevices.map((device) => (
                  <option key={device.id} value={device.id}>
                    {getDeviceLabel(device)}
                  </option>
                ))}
              </select>

              {linkedDevices.length === 0 && (
                <p className="mt-2 text-xs font-semibold text-red-600">
                  Nenhum player vinculado encontrado.
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="schedule-playlist"
                className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-700"
              >
                <ListVideo size={16} />
                Playlist
              </label>

              <select
                id="schedule-playlist"
                value={playlistId}
                onChange={(event) => setPlaylistId(event.target.value)}
                disabled={saving}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:opacity-50"
              >
                <option value="">Selecione uma playlist</option>

                {playlists.map((playlist) => (
                  <option key={playlist.id} value={playlist.id}>
                    {playlist.name}
                  </option>
                ))}
              </select>

              {playlists.length === 0 && (
                <p className="mt-2 text-xs font-semibold text-red-600">
                  Nenhuma playlist cadastrada.
                </p>
              )}
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="schedule-start-date"
                className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-700"
              >
                <CalendarDays size={16} />
                Data inicial
              </label>

              <input
                id="schedule-start-date"
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                disabled={saving}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:opacity-50"
              />
            </div>

            <div>
              <label
                htmlFor="schedule-end-date"
                className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-700"
              >
                <CalendarDays size={16} />
                Data final
              </label>

              <input
                id="schedule-end-date"
                type="date"
                value={endDate}
                min={startDate}
                onChange={(event) => setEndDate(event.target.value)}
                disabled={saving}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:opacity-50"
              />
            </div>

            <div>
              <label
                htmlFor="schedule-start-time"
                className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-700"
              >
                <Clock3 size={16} />
                Horário inicial
              </label>

              <input
                id="schedule-start-time"
                type="time"
                value={startTime}
                onChange={(event) => setStartTime(event.target.value)}
                disabled={saving}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:opacity-50"
              />
            </div>

            <div>
              <label
                htmlFor="schedule-end-time"
                className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-700"
              >
                <Clock3 size={16} />
                Horário final
              </label>

              <input
                id="schedule-end-time"
                type="time"
                value={endTime}
                onChange={(event) => setEndTime(event.target.value)}
                disabled={saving}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:opacity-50"
              />
            </div>
          </section>

          <section>
            <div className="mb-3 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-sm font-black text-gray-900">Dias da semana</h3>

                <p className="text-xs text-gray-500">
                  Escolha em quais dias o agendamento será executado.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={selectBusinessDays}
                  disabled={saving}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-bold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Segunda a sexta
                </button>

                <button
                  type="button"
                  onClick={selectEveryDay}
                  disabled={saving}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-bold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Todos os dias
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
              {WEEK_DAYS.map((day) => {
                const selected = selectedDays.includes(day.value);

                return (
                  <button
                    key={day.value}
                    type="button"
                    title={day.fullLabel}
                    onClick={() => toggleDay(day.value)}
                    disabled={saving}
                    className={`rounded-xl border px-3 py-3 text-sm font-black transition disabled:opacity-50 ${
                      selected
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:bg-blue-50"
                    }`}
                  >
                    {day.label}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="schedule-priority"
                className="mb-2 block text-sm font-bold text-gray-700"
              >
                Prioridade
              </label>

              <input
                id="schedule-priority"
                type="number"
                min={1}
                step={1}
                value={priority}
                onChange={(event) => setPriority(Number(event.target.value))}
                disabled={saving}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-bold outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:opacity-50"
              />

              <p className="mt-2 text-xs text-gray-500">
                Em caso de disputa, agendamentos com maior prioridade têm preferência.
              </p>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <div>
                <p className="text-sm font-black text-gray-900">Agendamento ativo</p>

                <p className="text-xs text-gray-500">Desative para pausar sem excluir.</p>
              </div>

              <button
                type="button"
                onClick={() => setActive((current) => !current)}
                disabled={saving}
                aria-label={active ? "Desativar agendamento" : "Ativar agendamento"}
                className={`relative h-7 w-12 shrink-0 rounded-full transition disabled:opacity-50 ${
                  active ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
                    active ? "left-6" : "left-1"
                  }`}
                />
              </button>
            </div>
          </section>
        </div>

        <footer className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
          <button
            type="button"
            onClick={handleClose}
            disabled={saving}
            className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-bold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save size={18} />

            {saving ? "Salvando..." : editing ? "Salvar alterações" : "Criar agendamento"}
          </button>
        </footer>
      </form>
    </div>
  );
}

function getDeviceLabel(device: ScheduleDevice) {
  const name = device.name?.trim() || `Player ${device.code}`;

  const status = device.status === "ONLINE" ? "Online" : "Offline";

  return `${name} — ${status}`;
}

function parseDays(value: string) {
  return value
    .split(",")
    .map((day) => Number(day.trim()))
    .filter((day) => Number.isInteger(day) && day >= 0 && day <= 6)
    .filter((day, index, array) => array.indexOf(day) === index)
    .sort((first, second) => first - second);
}

function formatInputDate(value: string) {
  if (!value) {
    return "";
  }

  return value.slice(0, 10);
}

function toDateInputValue(date: Date) {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
