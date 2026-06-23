import { useEffect, useState } from "react";
import instance from "../../../../services/axios";
import type { CreateScheduleDTO } from "../types/schedules";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (data: CreateScheduleDTO) => Promise<void>;
};

export function CreateScheduleModal({ open, onClose, onCreate }: Props) {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]);

  const [name, setName] = useState("");
  const [playlistId, setPlaylistId] = useState("");
  const [deviceId, setDeviceId] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("23:59");

  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([]);
  const [priority, setPriority] = useState(1);

  useEffect(() => {
    if (!open) return;

    async function load() {
      const [p, d] = await Promise.all([
        instance.get("/playlists"),
        instance.get("/devices"),
      ]);

      setPlaylists(p.data);
      setDevices(d.data);
    }

    load();
  }, [open]);

  if (!open) return null;

  function toggleDay(day: number) {
    setDaysOfWeek((prev) =>
      prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day]
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

      <div className="bg-white p-6 rounded-xl w-full max-w-lg">

        <h2 className="text-xl font-bold mb-4">
          Novo Agendamento
        </h2>

        <div className="space-y-3">

          <input
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-2 rounded"
          />

          <select
            value={playlistId}
            onChange={(e) => setPlaylistId(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">Playlist</option>
            {playlists.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <select
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">Device</option>
            {devices.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border p-2 rounded"
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full border p-2 rounded"
          />

          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full border p-2 rounded"
          />

          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full border p-2 rounded"
          />

          {/* DAYS */}
          <div className="flex gap-2 flex-wrap">
            {["D","S","T","Q","Q","S","S"].map((d, i) => (
              <button
                key={i}
                type="button"
                onClick={() => toggleDay(i)}
                className={`px-3 py-1 rounded ${
                  daysOfWeek.includes(i)
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          {/* PRIORITY */}
          <input
            type="number"
            value={priority}
            onChange={(e) => setPriority(Number(e.target.value))}
            className="w-full border p-2 rounded"
            placeholder="Prioridade"
          />

        </div>

        <div className="flex justify-end gap-2 mt-4">

          <button onClick={onClose}>
            Cancelar
          </button>

          <button
            onClick={() =>
              onCreate({
                name,
                playlistId,
                deviceId,
                startDate,
                endDate,
                startTime,
                endTime,
                daysOfWeek: daysOfWeek.join(","),
                priority,
              })
            }
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Criar
          </button>

        </div>

      </div>
    </div>
  );
}