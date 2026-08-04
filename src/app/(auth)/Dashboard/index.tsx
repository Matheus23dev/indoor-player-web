import { useMemo, type ElementType, type ReactNode } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CalendarCheck2,
  CalendarPlus,
  CheckCircle2,
  CloudUpload,
  Image as ImageIcon,
  LayoutDashboard,
  ListVideo,
  MonitorSmartphone,
  PlayCircle,
  Radio,
  RefreshCw,
  Sparkles,
  Wifi,
  WifiOff,
} from "lucide-react";
import { Link } from "react-router-dom";

import { PageContainer, PageHeader, PageScrollArea } from "../../../components/layout/Page";
import { useAuth } from "../../../contexts/useAuth";
import type { Device } from "../Devices/types/device";
import type { Playlist } from "../Playlists/types";
import type { Schedule } from "../Schedules/types";
import { useDashboard } from "./hooks/useDashboard";

type Accent = "blue" | "emerald" | "violet" | "amber";

const accentClasses: Record<Accent, { icon: string; bar: string; soft: string }> = {
  blue: {
    icon: "border-blue-100 bg-blue-50 text-blue-700",
    bar: "bg-blue-600",
    soft: "text-blue-700",
  },
  emerald: {
    icon: "border-emerald-100 bg-emerald-50 text-emerald-700",
    bar: "bg-emerald-500",
    soft: "text-emerald-700",
  },
  violet: {
    icon: "border-violet-100 bg-violet-50 text-violet-700",
    bar: "bg-violet-500",
    soft: "text-violet-700",
  },
  amber: {
    icon: "border-amber-100 bg-amber-50 text-amber-700",
    bar: "bg-amber-500",
    soft: "text-amber-700",
  },
};

export default function Dashboard() {
  const { user } = useAuth();
  const {
    devices,
    medias,
    playlists,
    schedules,
    loading,
    refreshing,
    error,
    lastUpdatedAt,
    loadDashboard,
  } = useDashboard();

  const summary = useMemo(() => {
    const onlineDevices = devices.filter((device) => device.status === "ONLINE").length;
    const activeSchedules = schedules.filter((schedule) => schedule.active).length;
    const readyPlaylists = playlists.filter(
      (playlist) => getPlaylistItemsCount(playlist) > 0,
    ).length;
    const imageCount = medias.filter((media) => media.type === "IMAGE").length;

    return {
      onlineDevices,
      offlineDevices: devices.length - onlineDevices,
      activeSchedules,
      readyPlaylists,
      imageCount,
      videoCount: medias.length - imageCount,
    };
  }, [devices, medias, playlists, schedules]);

  const todaySchedules = useMemo(
    () => schedules.filter(isScheduleToday).sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [schedules],
  );

  const sortedDevices = useMemo(
    () =>
      [...devices].sort((a, b) => {
        if (a.status !== b.status) {
          return a.status === "OFFLINE" ? -1 : 1;
        }

        return (a.name || a.code).localeCompare(b.name || b.code, "pt-BR");
      }),
    [devices],
  );

  const firstName = user?.name?.trim().split(" ")[0] || "operador";

  return (
    <PageContainer width="wide" scrollable>
      <PageHeader
        eyebrow="Central de operação"
        title={`${getGreeting()}, ${firstName}`}
        description="Acompanhe a saúde dos players, o acervo e a programação da sua rede em um só lugar."
        icon={LayoutDashboard}
        meta={
          lastUpdatedAt
            ? `Última atualização às ${lastUpdatedAt.toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}`
            : "Sincronizando indicadores operacionais"
        }
        actions={
          <>
            <button
              type="button"
              onClick={() => void loadDashboard()}
              disabled={loading || refreshing}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw size={17} className={refreshing ? "animate-spin" : ""} />
              {refreshing ? "Atualizando" : "Atualizar"}
            </button>

            <Link
              to="/home/medias"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800"
            >
              <CloudUpload size={17} />
              Adicionar mídia
            </Link>
          </>
        }
      />

      <PageScrollArea
        ariaLabel="Conteúdo do dashboard"
        className={error ? "pb-2" : "pb-2 xl:!overflow-hidden xl:!pr-0"}
      >
        {error && (
          <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 sm:flex-row sm:items-center">
            <div className="flex flex-1 items-center gap-3 text-amber-900">
              <AlertTriangle size={19} className="shrink-0 text-amber-600" />
              <p className="text-sm font-medium">{error}</p>
            </div>
            <button
              type="button"
              onClick={() => void loadDashboard()}
              className="text-left text-xs font-bold text-amber-800 hover:text-amber-950"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {loading ? (
          <DashboardSkeleton />
        ) : (
          <div className="space-y-4 xl:flex xl:h-full xl:min-h-0 xl:flex-col xl:gap-4 xl:space-y-0">
            <section
              aria-label="Indicadores principais"
              className="grid shrink-0 gap-3 sm:grid-cols-2 xl:grid-cols-4"
            >
              <DashboardMetric
                label="Players online"
                value={`${summary.onlineDevices}/${devices.length}`}
                description={
                  devices.length === 0
                    ? "Nenhum player vinculado"
                    : summary.offlineDevices === 0
                      ? "Toda a rede conectada"
                      : `${summary.offlineDevices} ${summary.offlineDevices === 1 ? "player requer" : "players requerem"} atenção`
                }
                icon={Wifi}
                accent="emerald"
                progress={percentage(summary.onlineDevices, devices.length)}
              />

              <DashboardMetric
                label="Biblioteca de mídia"
                value={medias.length}
                description={`${summary.imageCount} imagens e ${summary.videoCount} vídeos`}
                icon={ImageIcon}
                accent="blue"
              />

              <DashboardMetric
                label="Playlists prontas"
                value={`${summary.readyPlaylists}/${playlists.length}`}
                description="Com conteúdo para exibição"
                icon={ListVideo}
                accent="violet"
                progress={percentage(summary.readyPlaylists, playlists.length)}
              />

              <DashboardMetric
                label="Agendamentos ativos"
                value={summary.activeSchedules}
                description={`${todaySchedules.length} ${todaySchedules.length === 1 ? "programação hoje" : "programações hoje"}`}
                icon={CalendarCheck2}
                accent="amber"
              />
            </section>

            <section className="grid gap-4 xl:min-h-0 xl:flex-1 xl:grid-cols-[minmax(0,1.3fr)_minmax(340px,0.7fr)]">
              <FleetPanel devices={sortedDevices} />
              <TodayPanel schedules={todaySchedules} />
            </section>

            <QuickActions />
          </div>
        )}
      </PageScrollArea>
    </PageContainer>
  );
}

interface DashboardMetricProps {
  label: string;
  value: string | number;
  description: string;
  icon: ElementType;
  accent: Accent;
  progress?: number;
}

function DashboardMetric({
  label,
  value,
  description,
  icon: Icon,
  accent,
  progress,
}: DashboardMetricProps) {
  const classes = accentClasses[accent];

  return (
    <article className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
            {label}
          </p>
          <strong className="mt-1 block text-[1.75rem] font-bold leading-none tracking-tight text-slate-950">
            {value}
          </strong>
        </div>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${classes.icon}`}
        >
          <Icon size={19} strokeWidth={1.8} />
        </div>
      </div>

      <p className={`mt-2 truncate text-[11px] font-semibold ${classes.soft}`}>{description}</p>

      {typeof progress === "number" && (
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full transition-[width] duration-500 ${classes.bar}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </article>
  );
}

function FleetPanel({ devices }: { devices: Device[] }) {
  const visibleDevices = devices.slice(0, 3);
  const offlineCount = devices.filter((device) => device.status === "OFFLINE").length;

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] xl:flex xl:h-full xl:min-h-0 xl:flex-col">
      <PanelHeader
        icon={<Radio size={18} />}
        title="Status dos players"
        description="Conectividade e conteúdo em exibição"
        action={
          <Link
            to="/home/devices"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900"
          >
            Ver todos
            <ArrowRight size={14} />
          </Link>
        }
      />

      {devices.length === 0 ? (
        <EmptyPanel
          icon={<MonitorSmartphone size={24} />}
          title="Nenhum player vinculado"
          description="Vincule seu primeiro dispositivo para acompanhar a operação."
          href="/home/devices"
          action="Vincular player"
        />
      ) : (
        <>
          <div className="divide-y divide-slate-100 px-4 xl:min-h-0 xl:flex-1 xl:overflow-y-auto">
            {visibleDevices.map((device) => (
              <DeviceRow key={device.id} device={device} />
            ))}
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-slate-100 bg-slate-50/70 px-5 py-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              {offlineCount > 0 ? (
                <>
                  <WifiOff size={15} className="text-amber-600" />
                  {offlineCount} {offlineCount === 1 ? "player offline" : "players offline"}
                </>
              ) : (
                <>
                  <CheckCircle2 size={15} className="text-emerald-600" />
                  Rede operando normalmente
                </>
              )}
            </div>
            {devices.length > visibleDevices.length && (
              <span className="text-[11px] font-medium text-slate-400">
                +{devices.length - visibleDevices.length} na rede
              </span>
            )}
          </div>
        </>
      )}
    </section>
  );
}

function DeviceRow({ device }: { device: Device }) {
  const online = device.status === "ONLINE";
  const currentContent = device.preview?.media?.name;
  const currentPlaylist = device.preview?.playlist?.name;

  return (
    <div className="flex min-w-0 items-center gap-3 py-3">
      <div
        className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
          online
            ? "border-emerald-100 bg-emerald-50 text-emerald-700"
            : "border-slate-200 bg-slate-100 text-slate-500"
        }`}
      >
        <MonitorSmartphone size={18} />
        <span
          className={`absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white ${
            online ? "bg-emerald-500" : "bg-slate-400"
          }`}
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-2">
          <h3 className="truncate text-sm font-bold text-slate-900">
            {device.name?.trim() || `Player ${device.code}`}
          </h3>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide ${
              online ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
            }`}
          >
            {online ? "Online" : "Offline"}
          </span>
        </div>
        <p className="mt-0.5 truncate text-[11px] text-slate-500">
          {currentContent
            ? `${currentContent}${currentPlaylist ? ` · ${currentPlaylist}` : ""}`
            : online
              ? "Aguardando conteúdo"
              : `Último sinal ${formatRelativeTime(device.lastHeartbeat)}`}
        </p>
      </div>

      <div className="hidden shrink-0 text-right sm:block">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Código</p>
        <p className="mt-0.5 font-mono text-xs font-semibold text-slate-600">{device.code}</p>
      </div>
    </div>
  );
}

function TodayPanel({ schedules }: { schedules: Schedule[] }) {
  const visibleSchedules = schedules.slice(0, 3);

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] xl:flex xl:h-full xl:min-h-0 xl:flex-col">
      <PanelHeader
        icon={<CalendarCheck2 size={18} />}
        title="Programação de hoje"
        description={formatLongDate(new Date())}
        action={
          <Link
            to="/home/schedules"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900"
          >
            Ver agenda
            <ArrowRight size={14} />
          </Link>
        }
      />

      {schedules.length === 0 ? (
        <EmptyPanel
          icon={<CalendarPlus size={24} />}
          title="Agenda livre hoje"
          description="Não há programações ativas para esta data."
          href="/home/schedules"
          action="Criar agendamento"
        />
      ) : (
        <>
          <div className="divide-y divide-slate-100 px-4 xl:min-h-0 xl:flex-1 xl:overflow-y-auto">
            {visibleSchedules.map((schedule) => (
              <ScheduleRow key={schedule.id} schedule={schedule} />
            ))}
          </div>

          {schedules.length > visibleSchedules.length && (
            <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-3 text-[11px] font-medium text-slate-500">
              +{schedules.length - visibleSchedules.length} na programação de hoje
            </div>
          )}
        </>
      )}
    </section>
  );
}

function ScheduleRow({ schedule }: { schedule: Schedule }) {
  const state = getScheduleState(schedule);

  return (
    <div className="flex min-w-0 items-center gap-3 py-3">
      <div className="w-12 shrink-0 text-center">
        <p className="text-xs font-extrabold text-slate-900">{schedule.startTime.slice(0, 5)}</p>
        <p className="mt-0.5 text-[10px] font-medium text-slate-400">
          {schedule.endTime.slice(0, 5)}
        </p>
      </div>

      <div className={`h-9 w-1 shrink-0 rounded-full ${state.bar}`} />

      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-2">
          <h3 className="truncate text-sm font-bold text-slate-900">{schedule.name}</h3>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-extrabold ${state.badge}`}
          >
            {state.label}
          </span>
        </div>
        <p className="mt-0.5 truncate text-[11px] text-slate-500">
          {schedule.device?.name?.trim() || schedule.device?.code || "Player não informado"}
          <span className="mx-1.5 text-slate-300">·</span>
          {schedule.playlist?.name || "Playlist não informada"}
        </p>
      </div>
    </div>
  );
}

function QuickActions() {
  const actions = [
    {
      title: "Enviar mídia",
      description: "Adicione imagens ou vídeos ao acervo",
      href: "/home/medias",
      icon: CloudUpload,
      iconClass: "bg-blue-50 text-blue-700 ring-blue-100",
    },
    {
      title: "Montar playlist",
      description: "Organize o conteúdo na ordem de exibição",
      href: "/home/playlists",
      icon: PlayCircle,
      iconClass: "bg-violet-50 text-violet-700 ring-violet-100",
    },
    {
      title: "Programar exibição",
      description: "Defina datas, horários e players",
      href: "/home/schedules",
      icon: CalendarPlus,
      iconClass: "bg-amber-50 text-amber-700 ring-amber-100",
    },
  ];

  return (
    <section className="shrink-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="mb-3 flex items-center gap-2">
        <Sparkles size={16} className="text-blue-700" />
        <h2 className="text-sm font-bold text-slate-900">Ações rápidas</h2>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              to={action.href}
              className="group flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3 transition hover:border-blue-200 hover:bg-blue-50/60"
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ${action.iconClass}`}
              >
                <Icon size={18} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-slate-900">{action.title}</span>
                <span className="mt-0.5 block truncate text-[11px] text-slate-500">
                  {action.description}
                </span>
              </span>
              <ArrowRight
                size={16}
                className="shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-blue-700"
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
}

interface PanelHeaderProps {
  icon: ReactNode;
  title: string;
  description: string;
  action: ReactNode;
}

function PanelHeader({ icon, title, description, action }: PanelHeaderProps) {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 ring-1 ring-blue-100">
          {icon}
        </span>
        <div className="min-w-0">
          <h2 className="truncate text-sm font-bold text-slate-950">{title}</h2>
          <p className="mt-0.5 truncate text-[11px] text-slate-500">{description}</p>
        </div>
      </div>
      <div className="shrink-0">{action}</div>
    </header>
  );
}

interface EmptyPanelProps {
  icon: ReactNode;
  title: string;
  description: string;
  href: string;
  action: string;
}

function EmptyPanel({ icon, title, description, href, action }: EmptyPanelProps) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center px-6 py-8 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
        {icon}
      </div>
      <h3 className="mt-3 text-sm font-bold text-slate-900">{title}</h3>
      <p className="mt-1 max-w-xs text-xs leading-5 text-slate-500">{description}</p>
      <Link
        to={href}
        className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900"
      >
        {action}
        <ArrowRight size={14} />
      </Link>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-4" aria-label="Carregando dashboard">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-[124px] animate-pulse rounded-2xl border border-slate-200 bg-white"
          />
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(340px,0.7fr)]">
        <div className="h-[380px] animate-pulse rounded-2xl border border-slate-200 bg-white" />
        <div className="h-[380px] animate-pulse rounded-2xl border border-slate-200 bg-white" />
      </div>
      <div className="h-[112px] animate-pulse rounded-2xl border border-slate-200 bg-white" />
    </div>
  );
}

function getPlaylistItemsCount(playlist: Playlist) {
  return playlist._count?.items ?? playlist.items?.length ?? 0;
}

function percentage(value: number, total: number) {
  if (total <= 0) {
    return 0;
  }

  return Math.min(100, Math.round((value / total) * 100));
}

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

function isScheduleToday(schedule: Schedule) {
  if (!schedule.active) {
    return false;
  }

  const today = new Date();
  const todayKey = toDateKey(today);
  const startDate = schedule.startDate.slice(0, 10);
  const endDate = schedule.endDate.slice(0, 10);
  const allowedDays = schedule.daysOfWeek
    .split(",")
    .map((day) => day.trim())
    .filter(Boolean);

  return (
    todayKey >= startDate && todayKey <= endDate && allowedDays.includes(String(today.getDay()))
  );
}

function getScheduleState(schedule: Schedule) {
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  const startTime = schedule.startTime.slice(0, 5);
  const endTime = schedule.endTime.slice(0, 5);

  if (currentTime < startTime) {
    return {
      label: "Próximo",
      badge: "bg-blue-50 text-blue-700",
      bar: "bg-blue-500",
    };
  }

  if (currentTime <= endTime) {
    return {
      label: "Em exibição",
      badge: "bg-emerald-50 text-emerald-700",
      bar: "bg-emerald-500",
    };
  }

  return {
    label: "Concluído",
    badge: "bg-slate-100 text-slate-600",
    bar: "bg-slate-300",
  };
}

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatLongDate(date: Date) {
  const formatted = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  }).format(date);

  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

function formatRelativeTime(value: string | null) {
  if (!value) {
    return "não registrado";
  }

  const date = new Date(value);
  const diffInMinutes = Math.max(0, Math.floor((Date.now() - date.getTime()) / 60_000));

  if (Number.isNaN(date.getTime())) return "não registrado";
  if (diffInMinutes < 1) return "agora";
  if (diffInMinutes < 60) return `há ${diffInMinutes} min`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `há ${diffInHours} h`;

  const diffInDays = Math.floor(diffInHours / 24);
  return `há ${diffInDays} ${diffInDays === 1 ? "dia" : "dias"}`;
}
