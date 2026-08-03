import { useEffect, useMemo, useState } from "react";

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
  MetricCard,
  PageContainer,
  PageHeader,
  PageScrollArea,
} from "../../../components/layout/Page";

import { DeviceCard } from "./components/DeviceCard";

import { DeviceLogsModal } from "./components/DeviceLogsModal";

import { PairDeviceModal } from "./components/PairDeviceModal";

import { useDevices } from "./hooks/useDevices";

import { getApiErrorMessage, pairDevice } from "./services/devices.services";

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

  const [modalOpen, setModalOpen] = useState(false);

  const [pairing, setPairing] = useState(false);

  const summary = useMemo(() => {
    const online = devices.filter((device) => device.status === "ONLINE").length;

    return {
      total: devices.length,

      online,

      offline: devices.length - online,
    };
  }, [devices]);

  useEffect(() => {
    if (!feedback) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setFeedback(null);
    }, 5000);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [feedback, setFeedback]);

  async function handlePair(code: string, name: string) {
    try {
      setPairing(true);

      setFeedback(null);

      await pairDevice(code, name);

      await loadDevices({
        silent: true,
      });

      setModalOpen(false);

      setFeedback({
        type: "success",

        message: "Dispositivo vinculado com sucesso.",
      });
    } catch (pairError) {
      setFeedback({
        type: "error",

        message: getApiErrorMessage(pairError, "Não foi possível vincular o dispositivo."),
      });

      throw pairError;
    } finally {
      setPairing(false);
    }
  }

  return (
    <>
      <PageContainer width="wide" scrollable>
        <PageHeader
          eyebrow="Gestão de players"
          title="Dispositivos"
          description="Monitore a conectividade e acompanhe o conteúdo exibido em cada ponto da operação."
          icon={MonitorSmartphone}
          meta={
            lastUpdatedAt
              ? `Dados atualizados às ${lastUpdatedAt.toLocaleTimeString("pt-BR")}`
              : "Sincronizando dados operacionais"
          }
          actions={
            <>
              <button
                type="button"
                onClick={() => void loadDevices()}
                disabled={loading || refreshing}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:opacity-60"
              >
                <RefreshCw size={17} className={refreshing ? "animate-spin" : ""} />
                Atualizar dados
              </button>

              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800"
              >
                <Plus size={18} />
                Vincular dispositivo
              </button>
            </>
          }
        />

        {feedback && (
          <div
            className={
              feedback.type === "success"
                ? "flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800"
                : "flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-800"
            }
          >
            {feedback.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}

            <span className="flex-1 text-sm font-medium">{feedback.message}</span>

            <button type="button" onClick={() => setFeedback(null)}>
              <X size={16} />
            </button>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-between gap-4 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
            <div className="flex items-center gap-3">
              <AlertCircle size={20} className="text-amber-600" />

              <span className="text-sm font-medium text-amber-900">{error}</span>
            </div>

            <button type="button" onClick={clearError} className="text-xs font-bold text-amber-800">
              Fechar
            </button>
          </div>
        )}

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <MetricCard
            label="Total"
            value={summary.total}
            description="Players vinculados"
            icon={MonitorSmartphone}
          />

          <MetricCard
            label="Online"
            value={summary.online}
            description="Com comunicação recente"
            icon={Wifi}
            tone="emerald"
          />

          <MetricCard
            label="Offline"
            value={summary.offline}
            description="Sem comunicação recente"
            icon={WifiOff}
            tone="slate"
          />
        </section>

        <PageScrollArea ariaLabel="Lista de dispositivos">
          {loading ? (
            <DeviceGridSkeleton />
          ) : devices.length === 0 ? (
            <EmptyDevices onPair={() => setModalOpen(true)} />
          ) : (
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {devices.map((device) => (
                <DeviceCard
                  key={device.id}
                  device={device}
                  onLogs={setSelectedDevice}
                  onUnlink={handleUnlinkDevice}
                />
              ))}
            </section>
          )}
        </PageScrollArea>
      </PageContainer>

      <PairDeviceModal
        open={modalOpen}
        loading={pairing}
        onClose={() => setModalOpen(false)}
        onConfirm={handlePair}
      />

      <DeviceLogsModal device={selectedDevice} onClose={() => setSelectedDevice(null)} />
    </>
  );
}

function EmptyDevices({ onPair }: { onPair: () => void }) {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 text-center">
      <Link2 size={34} className="text-blue-600" />

      <h2 className="mt-4 text-xl font-black text-slate-900">Nenhum dispositivo vinculado</h2>

      <button
        type="button"
        onClick={onPair}
        className="mt-6 rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
      >
        Vincular primeiro dispositivo
      </button>
    </div>
  );
}

function DeviceGridSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({
        length: 6,
      }).map((_, index) => (
        <div
          key={index}
          className="h-[360px] animate-pulse rounded-2xl border border-slate-200 bg-white"
        />
      ))}
    </div>
  );
}
