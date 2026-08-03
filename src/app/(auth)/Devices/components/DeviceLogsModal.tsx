import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";

import {
  AlertCircle,
  CircleAlert,
  Clock3,
  Cloud,
  FileText,
  HardDriveDownload,
  Info,
  Loader2,
  MonitorPlay,
  Power,
  RefreshCw,
  Settings2,
  Volume2,
  Wifi,
  X,
} from "lucide-react";

import { getDeviceLogs } from "../services/devices.services";

import type { Device, DeviceLog } from "../types/device";

import {
  parseDeviceLog,
  type DeviceLogCategory,
  type DeviceLogLevel,
  type ParsedDeviceLog,
} from "./deviceLog";

interface Props {
  device: Device | null;

  onClose: () => void;
}

type LoadingMode = "initial" | "manual" | "silent";

const categoryLabels: Record<DeviceLogCategory, string> = {
  SYSTEM: "Sistema",
  CONNECTION: "Conexão",
  SYNC: "Sincronização",
  PROGRAMMING: "Programação",
  DOWNLOAD: "Download",
  PLAYBACK: "Reprodução",
  AUDIO: "Áudio",
  POWER: "Energia",
  CACHE: "Cache",
  SESSION: "Sessão",
  ADMINISTRATION: "Administração",
};

const metadataLabels: Record<string, string> = {
  error: "Erro",
  status: "Status",
  reason: "Motivo",
  media: "Mídia",
  mediaName: "Mídia",
  mediaId: "ID da mídia",
  mediaType: "Tipo",
  position: "Posição",
  duration: "Duração",
  muted: "Silenciado",
  playlist: "Playlist",
  playlistName: "Playlist",
  playlistId: "ID da playlist",
  schedule: "Agendamento",
  scheduleName: "Agendamento",
  scheduleId: "ID do agendamento",
  occurrenceId: "Ocorrência",
  occurrences: "Ocorrências",
  playlists: "Playlists",
  items: "Itens",
  mediaCount: "Mídias",
  forced: "Forçada",
  keepCode: "Manter código",
  requestedState: "Estado solicitado",
  fileSize: "Tamanho",
  entityId: "Entidade",
  deviceName: "Dispositivo",
  deviceCode: "Código",
  active: "Ativo",
  offlineSeconds: "Tempo desconectado",
};

export function DeviceLogsModal({ device, onClose }: Props) {
  const [logs, setLogs] = useState<DeviceLog[]>([]);
  const [initialLoading, setInitialLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parsedLogs = useMemo(() => logs.map(parseDeviceLog), [logs]);

  const loadLogs = useCallback(
    async (mode: LoadingMode = "silent") => {
      if (!device) {
        return;
      }

      if (mode === "initial") {
        setInitialLoading(true);
      }

      if (mode === "manual") {
        setRefreshing(true);
      }

      try {
        const data = await getDeviceLogs(device.id);

        setLogs(data);
        setError(null);
      } catch {
        setError("Não foi possível carregar os logs.");
      } finally {
        setInitialLoading(false);
        setRefreshing(false);
      }
    },
    [device],
  );

  useEffect(() => {
    if (!device) {
      return;
    }

    setLogs([]);
    setError(null);
    void loadLogs("initial");

    const refreshInterval = window.setInterval(() => {
      void loadLogs("silent");
    }, 5_000);

    return () => {
      window.clearInterval(refreshInterval);
    };
  }, [device, loadLogs]);

  if (!device) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FileText size={20} />
            </div>

            <div className="min-w-0">
              <h2 className="text-lg font-black text-slate-900">Histórico do dispositivo</h2>

              <p className="mt-0.5 truncate text-sm text-slate-500">
                {device.name || "Dispositivo sem nome"} · {device.code}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar logs"
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </header>

        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50 px-5 py-2.5">
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="font-bold text-slate-700">{logs.length} registros</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Atualização automática a cada 5s
            </span>
          </div>

          <button
            type="button"
            onClick={() => void loadLogs("manual")}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:border-blue-200 hover:text-blue-700 disabled:opacity-60"
          >
            <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
            Atualizar
          </button>
        </div>

        <div className="min-h-64 flex-1 overflow-y-auto p-4">
          {initialLoading ? (
            <EmptyState icon={<Loader2 size={28} className="animate-spin text-blue-600" />}>
              Carregando atividade...
            </EmptyState>
          ) : error && logs.length === 0 ? (
            <EmptyState icon={<AlertCircle size={30} className="text-red-600" />}>
              {error}
            </EmptyState>
          ) : parsedLogs.length === 0 ? (
            <EmptyState icon={<FileText size={30} className="text-slate-400" />}>
              Nenhum registro disponível
            </EmptyState>
          ) : (
            <ol className="space-y-2.5">
              {parsedLogs.map((log) => (
                <DeviceLogItem key={log.id} log={log} />
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
}

function DeviceLogItem({ log }: { log: ParsedDeviceLog }) {
  const metadata = Object.entries(log.metadata).filter(([, value]) => value !== "");

  return (
    <li className={`rounded-xl border p-3.5 ${getLevelContainerClass(log.level)}`}>
      <div className="flex gap-3">
        <div
          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${getCategoryIconClass(log.category)}`}
        >
          <CategoryIcon category={log.category} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-wide text-slate-600">
              {categoryLabels[log.category]}
            </span>

            <LevelBadge level={log.level} />

            <span className="text-[11px] text-slate-400">
              {log.source === "SERVER"
                ? "API"
                : log.source === "PLAYER"
                  ? "Player"
                  : log.source === "SYSTEM"
                    ? "Sistema"
                    : "Painel"}
            </span>
          </div>

          <p className="mt-1 text-sm font-semibold leading-5 text-slate-800">
            {log.displayMessage}
          </p>

          {metadata.length > 0 ? (
            <dl className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
              {metadata.map(([key, value]) => (
                <div key={key} className="flex min-w-0 items-baseline gap-1">
                  <dt className="font-semibold text-slate-400">{metadataLabels[key] ?? key}:</dt>
                  <dd
                    className="max-w-72 truncate font-medium text-slate-600"
                    title={formatMetadataValue(key, value)}
                  >
                    {formatMetadataValue(key, value)}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}

          <time className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
            <Clock3 size={12} />
            {new Date(log.occurredAt).toLocaleString("pt-BR")}
          </time>
        </div>
      </div>
    </li>
  );
}

function LevelBadge({ level }: { level: DeviceLogLevel }) {
  const labels: Record<DeviceLogLevel, string> = {
    INFO: "Informação",
    SUCCESS: "Sucesso",
    WARNING: "Atenção",
    ERROR: "Erro",
  };

  return (
    <span
      className={`rounded-md px-1.5 py-0.5 text-[10px] font-black uppercase ${getLevelBadgeClass(level)}`}
    >
      {labels[level]}
    </span>
  );
}

function CategoryIcon({ category }: { category: DeviceLogCategory }) {
  const size = 16;

  switch (category) {
    case "CONNECTION":
      return <Wifi size={size} />;
    case "SYNC":
      return <RefreshCw size={size} />;
    case "PROGRAMMING":
      return <Cloud size={size} />;
    case "DOWNLOAD":
      return <HardDriveDownload size={size} />;
    case "PLAYBACK":
      return <MonitorPlay size={size} />;
    case "AUDIO":
      return <Volume2 size={size} />;
    case "POWER":
      return <Power size={size} />;
    case "SESSION":
      return <CircleAlert size={size} />;
    case "ADMINISTRATION":
      return <Settings2 size={size} />;
    case "CACHE":
      return <HardDriveDownload size={size} />;
    default:
      return <Info size={size} />;
  }
}

function EmptyState({ children, icon }: { children: string; icon: ReactNode }) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center text-center text-slate-500">
      {icon}
      <p className="mt-3 text-sm font-bold">{children}</p>
    </div>
  );
}

function getLevelContainerClass(level: DeviceLogLevel) {
  if (level === "ERROR") {
    return "border-red-200 bg-red-50/60";
  }

  if (level === "WARNING") {
    return "border-amber-200 bg-amber-50/60";
  }

  return "border-slate-200 bg-white";
}

function getLevelBadgeClass(level: DeviceLogLevel) {
  if (level === "SUCCESS") {
    return "bg-emerald-100 text-emerald-700";
  }

  if (level === "WARNING") {
    return "bg-amber-100 text-amber-700";
  }

  if (level === "ERROR") {
    return "bg-red-100 text-red-700";
  }

  return "bg-blue-100 text-blue-700";
}

function getCategoryIconClass(category: DeviceLogCategory) {
  if (category === "PLAYBACK" || category === "AUDIO") {
    return "bg-violet-100 text-violet-700";
  }

  if (category === "POWER") {
    return "bg-amber-100 text-amber-700";
  }

  if (category === "CONNECTION" || category === "SYNC") {
    return "bg-cyan-100 text-cyan-700";
  }

  if (category === "DOWNLOAD" || category === "CACHE") {
    return "bg-emerald-100 text-emerald-700";
  }

  return "bg-blue-100 text-blue-700";
}

function formatMetadataValue(key: string, value: string | number | boolean | null) {
  if (value === null) {
    return "—";
  }

  if (typeof value === "boolean") {
    if (key === "muted") {
      return value ? "Sim" : "Não";
    }

    return value ? "Sim" : "Não";
  }

  if (key === "duration" && typeof value === "number") {
    return `${value}s`;
  }

  if (key === "offlineSeconds" && typeof value === "number") {
    const minutes = Math.floor(value / 60);
    const seconds = value % 60;

    return minutes > 0 ? `${minutes}min ${seconds}s` : `${seconds}s`;
  }

  if (key === "fileSize" && typeof value === "number") {
    return formatFileSize(value);
  }

  return String(value);
}

function formatFileSize(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "—";
  }

  const megabytes = bytes / 1024 / 1024;

  return `${megabytes.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} MB`;
}
