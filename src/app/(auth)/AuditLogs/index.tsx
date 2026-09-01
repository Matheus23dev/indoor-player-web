import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  FilterX,
  Loader2,
  RefreshCw,
  Search,
  ShieldCheck,
} from "lucide-react";

import {
  PageContainer,
  PageHeader,
  PageScrollArea,
  PageToolbar,
} from "../../../components/layout/Page";
import { parseDeviceLog, type ParsedDeviceLog } from "../Devices/components/deviceLog";
import { getAuditLogs } from "./services/audit-logs.service";
import type {
  AuditLogEntry,
  AuditLogsResponse,
  AuditLogSourceFilter,
} from "./types/audit-log.types";

const initialData: AuditLogsResponse = {
  items: [],
  pagination: { page: 1, limit: 25, total: 0, totalPages: 1 },
  filters: { devices: [] },
};

export default function AuditLogs() {
  const [data, setData] = useState<AuditLogsResponse>(initialData);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [source, setSource] = useState<AuditLogSourceFilter>("ALL");
  const [deviceId, setDeviceId] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setPage(1);
      setSearch(searchInput.trim());
    }, 350);

    return () => window.clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);

      try {
        const response = await getAuditLogs({
          page,
          limit,
          source,
          ...(deviceId ? { deviceId } : {}),
          ...(search ? { search } : {}),
          ...(from ? { from: toIsoDate(from, false) } : {}),
          ...(to ? { to: toIsoDate(to, true) } : {}),
        });

        if (active) {
          setData(response);
          setError(null);
        }
      } catch {
        if (active) {
          setError("Não foi possível carregar o histórico de auditoria.");
        }
      } finally {
        if (active) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, [deviceId, from, limit, page, refreshKey, search, source, to]);

  const rows = useMemo(
    () => data.items.map((entry) => ({ entry, parsed: parseDeviceLog(entry) })),
    [data.items],
  );

  const hasFilters = Boolean(searchInput || deviceId || from || to || source !== "ALL");

  function refresh() {
    setRefreshing(true);
    setRefreshKey((current) => current + 1);
  }

  function clearFilters() {
    setSearchInput("");
    setSearch("");
    setSource("ALL");
    setDeviceId("");
    setFrom("");
    setTo("");
    setPage(1);
  }

  return (
    <PageContainer width="wide" scrollable>
      <PageHeader
        tourId="audit-summary"
        eyebrow="Segurança e governança"
        title="Auditoria geral"
        description="Consulte as atividades administrativas e operacionais registradas nos players."
        icon={ShieldCheck}
        meta={`${data.pagination.total.toLocaleString("pt-BR")} registros encontrados`}
        actions={
          <button
            type="button"
            onClick={refresh}
            disabled={loading || refreshing}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:opacity-60"
          >
            <RefreshCw size={17} className={refreshing ? "animate-spin" : ""} />
            Atualizar
          </button>
        }
      />

      <PageToolbar tourId="audit-filters">
        <div className="grid gap-3 lg:grid-cols-[minmax(220px,1.4fr)_repeat(4,minmax(150px,0.7fr))_auto]">
          <label className="relative block">
            <span className="sr-only">Buscar nos logs</span>
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Buscar evento, mensagem ou player"
              className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </label>

          <FilterSelect
            label="Origem"
            value={source}
            onChange={(value) => {
              setSource(value as AuditLogSourceFilter);
              setPage(1);
            }}
          >
            <option value="ALL">Todas as origens</option>
            <option value="ADMINISTRATION">Painel administrativo</option>
            <option value="SYSTEM">Sistema e conexão</option>
            <option value="PLAYER">Player</option>
          </FilterSelect>

          <FilterSelect
            label="Dispositivo"
            value={deviceId}
            onChange={(value) => {
              setDeviceId(value);
              setPage(1);
            }}
          >
            <option value="">Todos os players</option>
            {data.filters.devices.map((device) => (
              <option key={device.id} value={device.id}>
                {device.name || "Sem nome"} · {device.code}
              </option>
            ))}
          </FilterSelect>

          <DateFilter
            label="Data inicial"
            value={from}
            onChange={(value) => {
              setFrom(value);
              setPage(1);
            }}
          />

          <DateFilter
            label="Data final"
            value={to}
            onChange={(value) => {
              setTo(value);
              setPage(1);
            }}
          />

          <button
            type="button"
            onClick={clearFilters}
            disabled={!hasFilters}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FilterX size={16} />
            Limpar
          </button>
        </div>
      </PageToolbar>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      ) : null}

      <PageScrollArea ariaLabel="Tabela de auditoria" tourId="audit-table">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1080px] table-fixed border-collapse text-left">
              <colgroup>
                <col className="w-44" />
                <col />
                <col className="w-40" />
                <col className="w-48" />
                <col className="w-56" />
              </colgroup>
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">
                  <TableHeader>Data e hora</TableHeader>
                  <TableHeader>Evento</TableHeader>
                  <TableHeader>Origem</TableHeader>
                  <TableHeader>Usuário</TableHeader>
                  <TableHeader>Dispositivo</TableHeader>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="h-72 text-center">
                      <Loader2 className="mx-auto animate-spin text-blue-600" size={28} />
                      <p className="mt-3 text-sm font-semibold text-slate-500">
                        Carregando registros...
                      </p>
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="h-72 text-center text-sm font-semibold text-slate-500"
                    >
                      Nenhum registro encontrado com os filtros selecionados.
                    </td>
                  </tr>
                ) : (
                  rows.map(({ entry, parsed }) => (
                    <AuditTableRow key={entry.id} entry={entry} parsed={parsed} />
                  ))
                )}
              </tbody>
            </table>
          </div>

          <footer className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
              <span>
                Página {data.pagination.page} de {data.pagination.totalPages}
              </span>
              <label className="flex items-center gap-2">
                Exibir
                <select
                  value={limit}
                  onChange={(event) => {
                    setLimit(Number(event.target.value));
                    setPage(1);
                  }}
                  className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-700"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                por página
              </label>
            </div>

            <div className="flex items-center gap-2">
              <PaginationButton
                label="Página anterior"
                disabled={page <= 1 || loading}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
              >
                <ChevronLeft size={16} />
                Anterior
              </PaginationButton>
              <PaginationButton
                label="Próxima página"
                disabled={page >= data.pagination.totalPages || loading}
                onClick={() => setPage((current) => current + 1)}
              >
                Próxima
                <ChevronRight size={16} />
              </PaginationButton>
            </div>
          </footer>
        </section>
      </PageScrollArea>
    </PageContainer>
  );
}

function AuditTableRow({ entry, parsed }: { entry: AuditLogEntry; parsed: ParsedDeviceLog }) {
  const [messageExpanded, setMessageExpanded] = useState(false);
  const hasLongMessage = parsed.displayMessage.length > 160;

  return (
    <tr className="align-top transition hover:bg-slate-50/80">
      <td className="whitespace-nowrap px-4 py-3.5">
        <time className="text-sm font-semibold text-slate-700">
          {new Date(parsed.occurredAt).toLocaleDateString("pt-BR")}
        </time>
        <span className="mt-0.5 block text-xs text-slate-400">
          {new Date(parsed.occurredAt).toLocaleTimeString("pt-BR")}
        </span>
      </td>
      <td className="min-w-0 px-4 py-3.5">
        <span className="text-[10px] font-black uppercase tracking-wide text-slate-400">
          {formatEvent(parsed.event)}
        </span>
        <p
          title={parsed.displayMessage}
          className={`mt-1 break-words text-sm font-semibold leading-5 text-slate-800 [overflow-wrap:anywhere] ${
            hasLongMessage && !messageExpanded ? "line-clamp-3" : ""
          }`}
        >
          {parsed.displayMessage}
        </p>
        {hasLongMessage ? (
          <button
            type="button"
            aria-expanded={messageExpanded}
            onClick={() => setMessageExpanded((current) => !current)}
            className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 transition hover:text-blue-900"
          >
            {messageExpanded ? (
              <>
                <ChevronUp size={13} />
                Recolher mensagem
              </>
            ) : (
              <>
                <ChevronDown size={13} />
                Ver mensagem completa
              </>
            )}
          </button>
        ) : null}
      </td>
      <td className="px-4 py-3.5">
        <SourceBadge parsed={parsed} />
      </td>
      <td className="px-4 py-3.5">
        <p className="break-words text-sm font-semibold text-slate-700 [overflow-wrap:anywhere]">
          {parsed.actor?.name ?? getAutomatedActor(parsed)}
        </p>
        <span className="mt-0.5 block text-xs text-slate-400">
          {parsed.actor ? "Usuário autenticado" : "Evento automático"}
        </span>
      </td>
      <td className="px-4 py-3.5">
        <p className="truncate text-sm font-semibold text-slate-700">
          {entry.device.name || "Dispositivo sem nome"}
        </p>
        <span className="mt-0.5 block font-mono text-xs text-slate-400">{entry.device.code}</span>
      </td>
    </tr>
  );
}

function SourceBadge({ parsed }: { parsed: ParsedDeviceLog }) {
  const styles = {
    ADMINISTRATION: "bg-blue-50 text-blue-700 ring-blue-600/10",
    SYSTEM: "bg-amber-50 text-amber-700 ring-amber-600/10",
    PLAYER: "bg-violet-50 text-violet-700 ring-violet-600/10",
    SERVER: "bg-emerald-50 text-emerald-700 ring-emerald-600/10",
  }[parsed.source];

  const label = {
    ADMINISTRATION: "Painel",
    SYSTEM: "Sistema",
    PLAYER: "Player",
    SERVER: "API",
  }[parsed.source];

  return (
    <span
      className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${styles}`}
    >
      {label}
    </span>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label>
      <span className="sr-only">{label}</span>
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      >
        {children}
      </select>
    </label>
  );
}

function DateFilter({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <span className="sr-only">{label}</span>
      <input
        type="date"
        aria-label={label}
        title={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}

function TableHeader({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <th className={`px-4 py-3 ${className}`}>{children}</th>;
}

function PaginationButton({
  children,
  label,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 transition hover:border-blue-200 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function getAutomatedActor(parsed: ParsedDeviceLog) {
  if (parsed.source === "PLAYER") return "Player";
  if (parsed.source === "SERVER") return "API";
  if (parsed.source === "SYSTEM") return "Sistema";
  return "Painel administrativo";
}

function formatEvent(event: string) {
  const labels: Record<string, string> = {
    ACTIVE_SCHEDULE_APPLIED: "Agendamento ativo aplicado",
    ACTIVE_SCHEDULE_MEDIA_NOT_READY: "Mídia do agendamento indisponível",
    ACTIVE_SCHEDULE_NO_CONTENT: "Agendamento sem conteúdo",
    CACHE_CLEARED: "Cache limpo",
    CACHE_CLEANUP_FAILED: "Falha ao limpar cache antigo",
    CACHE_CLEAR_FAILED: "Falha ao limpar cache",
    DEVICE_LINKED: "Dispositivo vinculado",
    DEVICE_UPDATED: "Dispositivo atualizado",
    DEVICE_SESSION_ENDED: "Sessão do dispositivo encerrada",
    DEVICE_SESSION_INVALID: "Sessão do dispositivo inválida",
    DEVICE_UNLINKED: "Dispositivo desvinculado",
    ENGINE_STARTED: "Player iniciado",
    ENGINE_STARTING: "Player iniciando",
    ENGINE_START_FAILED: "Falha ao iniciar o player",
    ENGINE_STOPPED: "Player interrompido",
    HEARTBEAT_FAILED: "Falha na comunicação com o servidor",
    HEARTBEAT_RESTORED: "Comunicação com o servidor restabelecida",
    MEDIA_DOWNLOAD_COMPLETED: "Download da mídia concluído",
    MEDIA_DOWNLOAD_FAILED: "Falha no download da mídia",
    MEDIA_DOWNLOAD_STARTED: "Download da mídia iniciado",
    MEDIA_STARTED: "Reprodução da mídia iniciada",
    MEDIA_DELETED: "Mídia excluída",
    MEDIA_UPLOADED: "Mídia enviada",
    NO_ACTIVE_SCHEDULE: "Nenhum agendamento ativo",
    PLAYBACK_STOPPED: "Reprodução interrompida",
    PLAYER_CONNECTION_LOST: "Conexão perdida",
    PLAYER_CONNECTION_RESTORED: "Conexão restabelecida",
    PLAYLIST_DELETED: "Playlist excluída",
    PLAYLIST_CREATED: "Playlist criada",
    PLAYLIST_MEDIA_ADDED: "Mídia adicionada à playlist",
    PLAYLIST_MEDIA_DUPLICATED: "Mídia duplicada na playlist",
    PLAYLIST_MEDIA_REMOVED: "Mídia removida da playlist",
    PLAYLIST_MEDIA_UPDATED: "Mídia da playlist atualizada",
    PLAYLIST_ORIENTATION_UPDATED: "Orientação da playlist atualizada",
    PLAYLIST_PLAYBACK_STARTED: "Playlist iniciada",
    PLAYLIST_PLAYBACK_FINISHED: "Playlist finalizada",
    PLAYLIST_REORDERED: "Playlist reordenada",
    PLAYLIST_RESTORED_FROM_CACHE: "Playlist restaurada do cache",
    PLAYLIST_UPDATED: "Playlist atualizada",
    PROGRAMMING_CHANGE_RECEIVED: "Alteração de programação recebida",
    PROGRAMMING_SYNCED: "Programação sincronizada",
    PROGRAMMING_SYNC_FAILED: "Falha ao sincronizar a programação",
    REALTIME_SYNC_FAILED: "Falha na sincronização em tempo real",
    SCHEDULE_ACTIVATED: "Agendamento ativado",
    SCHEDULE_CREATED: "Agendamento criado",
    SCHEDULE_DEACTIVATED: "Agendamento desativado",
    SCHEDULE_DELETED: "Agendamento excluído",
    SCHEDULE_MOVED_FROM_DEVICE: "Agendamento removido do dispositivo",
    SCHEDULE_MOVED_TO_DEVICE: "Agendamento adicionado ao dispositivo",
    SCHEDULE_UPDATED: "Agendamento atualizado",
    SESSION_VERIFICATION_FAILED: "Falha ao verificar a sessão",
    SOCKET_CONNECTION_ERROR: "Erro na conexão em tempo real",
    SOCKET_DISCONNECTED: "Conexão em tempo real encerrada",
    SYNC_CONNECTION_RESTORED: "Conexão de sincronização restabelecida",
    TV_POWER_COMMAND_FAILED: "Falha no comando de energia da TV",
    TV_POWER_ON: "TV ligada",
    TV_STANDBY: "TV em modo de espera",
    VIDEO_AUDIO_CHANGED: "Áudio do vídeo alterado",
    VIDEO_PLAYBACK_FAILED: "Falha ao reproduzir o vídeo",
  };

  return labels[event] ?? event.replace(/_/g, " ");
}

function toIsoDate(value: string, endOfDay: boolean) {
  return new Date(`${value}T${endOfDay ? "23:59:59.999" : "00:00:00"}`).toISOString();
}
