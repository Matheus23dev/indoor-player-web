import { ScheduleStatusBadge } from "./SchedulesStatusBadge";
import type { Schedule } from "../types/schedules";

type Props = {
  schedule: Schedule;
};

export function ScheduleCard({ schedule }: Props) {
  return (
    <div className="bg-white border rounded-xl p-5">

      <div className="flex justify-between items-start">

        <div>
          <h3 className="font-semibold text-lg">
            {schedule.playlist?.name}
          </h3>

          <p className="text-gray-500 text-sm">
            Device: {schedule.device?.name}
          </p>
        </div>

        <ScheduleStatusBadge
          startDate={schedule.startDate}
          endDate={schedule.endDate}
        />
      </div>

      <div className="mt-4 text-sm text-gray-600">

        <p>Início: {new Date(schedule.startDate).toLocaleString()}</p>
        <p>Fim: {new Date(schedule.endDate).toLocaleString()}</p>

        <p className="mt-2">
          Dias: {schedule.daysOfWeek}
        </p>

        <p>
          Horário: {schedule.startTime} - {schedule.endTime}
        </p>

      </div>
    </div>
  );
}