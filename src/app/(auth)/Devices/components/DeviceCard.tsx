import {
  MonitorSmartphone,
  Clock3,
  Calendar,
  FileText,
} from "lucide-react";

import type { Device } from "../types/device";

import { DeviceStatusBadge } from "./DeviceStatusBadge";

type Props = {
  device: Device;
  onLogs: (id: string) => void;
};

export function DeviceCard({
  device,
  onLogs,
}: Props) {
  const createdAt =
    new Date(
      device.createdAt,
    ).toLocaleDateString(
      "pt-BR",
    );

  const lastHeartbeat =
    device.lastHeartbeat
      ? new Date(
          device.lastHeartbeat,
        ).toLocaleString(
          "pt-BR",
        )
      : "Sem comunicação";

  return (
    <div className="bg-white rounded-2xl border shadow-sm hover:shadow-lg transition p-5">
      <div className="flex justify-between items-start">
        <div className="flex gap-3">
          <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center">
            <MonitorSmartphone
              size={24}
              className="text-blue-600"
            />
          </div>

          <div>
            <h3 className="font-semibold text-lg">
              {device.name}
            </h3>

            <p className="text-sm text-gray-500">
              Código: {device.code}
            </p>
          </div>
        </div>

        <DeviceStatusBadge
          status={device.status}
        />
      </div>

      <div className="mt-6 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">
            Vinculado
          </span>

          <span
            className={
              device.isLinked
                ? "text-green-600 font-medium"
                : "text-red-600 font-medium"
            }
          >
            {device.isLinked
              ? "Sim"
              : "Não"}
          </span>
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <Calendar size={16} />
          <span>
            Criado em {createdAt}
          </span>
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <Clock3 size={16} />
          <span>
            {lastHeartbeat}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-6">
        <button
          onClick={() =>
            onLogs(device.id)
          }
          className="border rounded-lg py-2 flex justify-center items-center gap-2 hover:bg-gray-50"
        >
          <FileText size={16} />
          Logs
        </button>

        <button
          className="bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700"
        >
          Playlist
        </button>
      </div>
    </div>
  );
}