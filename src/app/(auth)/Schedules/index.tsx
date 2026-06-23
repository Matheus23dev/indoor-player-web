import { useState } from "react";

import { useSchedules } from "./hooks/useSchedules";
import { createSchedule } from "./services/schedules.services";

import { ScheduleCard } from "./components/ScheduleCard";
import { CreateScheduleModal } from "./components/createScheduleModal";

export default function Schedules() {
  const { schedules, loadSchedules, loading } = useSchedules();

  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  async function handleCreate(data: any) {
    try {
      setCreating(true);

      await createSchedule(data);

      setOpen(false);
      await loadSchedules();
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="p-6">

      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">
          Agendamentos
        </h1>

        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Novo
        </button>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="grid gap-4">
          {schedules.map((s) => (
            <ScheduleCard key={s.id} schedule={s} />
          ))}
        </div>
      )}

      <CreateScheduleModal
        open={open}
        onClose={() => setOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  );
}