import { useState } from "react";

import { Plus } from "lucide-react";

import { useDevices } from "./hooks/useDevices";

import { DeviceCard } from "./components/DeviceCard";

import { PairDeviceModal } from "./components/PairDeviceModal";

import { pairDevice } from "./services/devices.services";

export default function Devices() {
  const {
    devices,
    loading,
    loadDevices,
  } = useDevices();

  const [
    modalOpen,
    setModalOpen,
  ] = useState(false);

  async function handlePair(
    code: string,
    name: string,
  ) {
    await pairDevice(
      code,
      name,
    );

    setModalOpen(false);

    loadDevices();
  }

  function openLogs(
    deviceId: string,
  ) {
    console.log(deviceId);
  }

  const online =
    devices.filter(
      (device) =>
        device.status ===
        "ONLINE",
    ).length;

  const offline =
    devices.filter(
      (device) =>
        device.status ===
        "OFFLINE",
    ).length;

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            Dispositivos
          </h1>

          <p className="text-gray-500">
            TVs conectadas ao sistema
          </p>
        </div>

        <button
          onClick={() =>
            setModalOpen(true)
          }
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={18} />
          Vincular
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white border rounded-xl p-5">
          <p className="text-gray-500">
            Total
          </p>

          <h2 className="text-3xl font-bold">
            {devices.length}
          </h2>
        </div>

        <div className="bg-white border rounded-xl p-5">
          <p className="text-gray-500">
            Online
          </p>

          <h2 className="text-3xl font-bold text-green-600">
            {online}
          </h2>
        </div>

        <div className="bg-white border rounded-xl p-5">
          <p className="text-gray-500">
            Offline
          </p>

          <h2 className="text-3xl font-bold text-red-600">
            {offline}
          </h2>
        </div>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {devices.map(
            (device) => (
              <DeviceCard
                key={device.id}
                device={device}
                onLogs={
                  openLogs
                }
              />
            ),
          )}
        </div>
      )}

      <PairDeviceModal
        open={modalOpen}
        onClose={() =>
          setModalOpen(false)
        }
        onConfirm={
          handlePair
        }
      />
    </div>
  );
}