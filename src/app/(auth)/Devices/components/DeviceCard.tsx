import {
    MonitorSmartphone,
  } from "lucide-react";
  
  import { DeviceStatusBadge } from "./DeviceStatusBadge";
  
  type Props = {
    device: any;
    onLogs: (id: string) => void;
  };
  
  export function DeviceCard({
    device,
    onLogs,
  }: Props) {
    return (
      <div className="bg-white rounded-xl border shadow-sm p-5">
        <div className="flex justify-between items-start">
          <div className="flex gap-3">
            <MonitorSmartphone
              size={28}
            />
  
            <div>
              <h3 className="font-semibold">
                {device.name ||
                  "Sem nome"}
              </h3>
  
              <p className="text-sm text-gray-500">
                {device.code}
              </p>
            </div>
          </div>
  
          <DeviceStatusBadge
            status={device.status}
          />
        </div>
  
        <div className="mt-5 space-y-2 text-sm">
          <p>
            Vinculado:
            <strong>
              {device.isLinked
                ? " Sim"
                : " Não"}
            </strong>
          </p>
  
          <p>
            Criado em:
            <strong>
              {" "}
              {new Date(
                device.createdAt,
              ).toLocaleDateString()}
            </strong>
          </p>
        </div>
  
        <button
          onClick={() =>
            onLogs(device.id)
          }
          className="mt-4 w-full border rounded-lg py-2 hover:bg-gray-50"
        >
          Ver logs
        </button>
      </div>
    );
  }