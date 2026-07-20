import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  ReactNode,
} from "react";

import {
  AlertCircle,
  CheckCircle2,
  Link2,
  MonitorSmartphone,
  Plus,
  RefreshCw,
  Wifi,
  WifiOff,
  X,
} from "lucide-react";

import {
  DeviceCard,
} from "./components/DeviceCard";

import {
  DeviceLogsModal,
} from "./components/DeviceLogsModal";

import {
  PairDeviceModal,
} from "./components/PairDeviceModal";

import {
  useDevices,
} from "./hooks/useDevices";

import {
  getApiErrorMessage,
  pairDevice,
} from "./services/devices.services";

export default function Devices() {
  const {
    devices,
    loading,
    refreshing,
    error,
    lastUpdatedAt,
    loadDevices,
    clearError,
    setFeedback,
    feedback,
    handleUnlinkDevice,
    setSelectedDevice,
    selectedDevice,

  } = useDevices();

  const [
    modalOpen,
    setModalOpen,
  ] = useState(false);

  const [
    pairing,
    setPairing,
  ] = useState(false);


  const summary =
    useMemo(() => {
      const online =
        devices.filter(
          device =>
            device.status ===
            "ONLINE",
        ).length;

      return {
        total:
          devices.length,

        online,

        offline:
          devices.length -
          online,
      };
    }, [
      devices,
    ]);

  useEffect(() => {
    if (!feedback) {
      return;
    }

    const timeout =
      window.setTimeout(() => {
        setFeedback(null);
      }, 5000);

    return () => {
      window.clearTimeout(
        timeout,
      );
    };
  }, [
    feedback,
  ]);

  async function handlePair(
    code: string,
    name: string,
  ) {
    try {
      setPairing(true);

      setFeedback(null);

      await pairDevice(
        code,
        name,
      );

      await loadDevices({
        silent: true,
      });

      setModalOpen(false);

      setFeedback({
        type: "success",

        message:
          "Dispositivo vinculado com sucesso.",
      });
    } catch (pairError) {
      setFeedback({
        type: "error",

        message:
          getApiErrorMessage(
            pairError,
            "Não foi possível vincular o dispositivo.",
          ),
      });

      throw pairError;
    } finally {
      setPairing(false);
    }
  }



  return (
    <main className="min-h-full bg-slate-50">
      <div className="mx-auto w-full max-w-[1600px] space-y-8 p-4 sm:p-6 lg:p-8">
        <header className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="relative p-6 sm:p-8">
            <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 translate-x-24 -translate-y-24 rounded-full bg-blue-50" />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white sm:flex">
                  <MonitorSmartphone
                    size={28}
                  />
                </div>

                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-blue-600">
                    Gestão de players
                  </p>

                  <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                    Dispositivos
                  </h1>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                    Acompanhe em tempo real o conteúdo exibido em cada TV.
                  </p>

                  {lastUpdatedAt && (
                    <p className="mt-3 text-xs text-slate-400">
                      Atualizado às{" "}
                      {lastUpdatedAt.toLocaleTimeString(
                        "pt-BR",
                      )}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() =>
                    void loadDevices()
                  }
                  disabled={
                    loading ||
                    refreshing
                  }
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700"
                >
                  <RefreshCw
                    size={17}
                    className={
                      refreshing
                        ? "animate-spin"
                        : ""
                    }
                  />

                  Atualizar
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setModalOpen(
                      true,
                    )
                  }
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white"
                >
                  <Plus size={18} />

                  Vincular dispositivo
                </button>
              </div>
            </div>
          </div>
        </header>

        {feedback && (
          <div
            className={
              feedback.type ===
              "success"
                ? "flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800"
                : "flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-800"
            }
          >
            {feedback.type ===
            "success" ? (
              <CheckCircle2
                size={20}
              />
            ) : (
              <AlertCircle
                size={20}
              />
            )}

            <span className="flex-1 text-sm font-medium">
              {feedback.message}
            </span>

            <button
              type="button"
              onClick={() =>
                setFeedback(
                  null,
                )
              }
            >
              <X size={16} />
            </button>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-between gap-4 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
            <div className="flex items-center gap-3">
              <AlertCircle
                size={20}
                className="text-amber-600"
              />

              <span className="text-sm font-medium text-amber-900">
                {error}
              </span>
            </div>

            <button
              type="button"
              onClick={
                clearError
              }
              className="text-xs font-bold text-amber-800"
            >
              Fechar
            </button>
          </div>
        )}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <SummaryCard
            title="Total"
            value={
              summary.total
            }
            description="Players vinculados"
            icon={
              <MonitorSmartphone
                size={22}
              />
            }
            iconClassName="bg-blue-50 text-blue-600"
          />

          <SummaryCard
            title="Online"
            value={
              summary.online
            }
            description="Com comunicação recente"
            icon={
              <Wifi size={22} />
            }
            iconClassName="bg-emerald-50 text-emerald-600"
            valueClassName="text-emerald-600"
          />

          <SummaryCard
            title="Offline"
            value={
              summary.offline
            }
            description="Sem comunicação recente"
            icon={
              <WifiOff
                size={22}
              />
            }
            iconClassName="bg-red-50 text-red-600"
            valueClassName="text-red-600"
          />
        </section>

        {loading ? (
          <DeviceGridSkeleton />
        ) : devices.length ===
          0 ? (
          <EmptyDevices
            onPair={() =>
              setModalOpen(
                true,
              )
            }
          />
        ) : (
          <section className="grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
            {devices.map(
              device => (
                <DeviceCard
                  key={
                    device.id
                  }
                  device={
                    device
                  }
                  onLogs={
                    setSelectedDevice
                  }
                  onUnlink={
                    handleUnlinkDevice
                  }
                />
              ),
            )}
          </section>
        )}
      </div>

      <PairDeviceModal
        open={modalOpen}
        loading={pairing}
        onClose={() =>
          setModalOpen(
            false,
          )
        }
        onConfirm={
          handlePair
        }
      />

      <DeviceLogsModal
        device={
          selectedDevice
        }
        onClose={() =>
          setSelectedDevice(
            null,
          )
        }
      />
    </main>
  );
}

interface SummaryCardProps {
  title:
    string;

  value:
    number;

  description:
    string;

  icon:
    ReactNode;

  iconClassName:
    string;

  valueClassName?:
    string;
}

function SummaryCard({
  title,
  value,
  description,
  icon,
  iconClassName,
  valueClassName =
    "text-slate-900",
}: SummaryCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500">
            {title}
          </p>

          <strong
            className={`mt-3 block text-3xl font-black ${valueClassName}`}
          >
            {value}
          </strong>

          <p className="mt-2 text-xs text-slate-400">
            {description}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClassName}`}
        >
          {icon}
        </div>
      </div>
    </article>
  );
}

function EmptyDevices({
  onPair,
}: {
  onPair:
    () => void;
}) {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white px-6 text-center">
      <Link2
        size={34}
        className="text-blue-600"
      />

      <h2 className="mt-4 text-xl font-black text-slate-900">
        Nenhum dispositivo vinculado
      </h2>

      <button
        type="button"
        onClick={
          onPair
        }
        className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white"
      >
        Vincular primeiro dispositivo
      </button>
    </div>
  );
}

function DeviceGridSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
      {Array.from({
        length: 6,
      }).map(
        (
          _,
          index,
        ) => (
          <div
            key={index}
            className="h-[520px] animate-pulse rounded-3xl border border-slate-200 bg-white"
          />
        ),
      )}
    </div>
  );
}
