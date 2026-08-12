import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
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

      <PageToolbar>
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

      <PageScrollArea ariaLabel="Tabela de auditoria">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1080px] border-collapse text-left">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">
                  <TableHeader className="w-44">Data e hora</TableHeader>
                  <TableHeader>Evento</TableHeader>
                  <TableHeader className="w-44">Origem</TableHeader>
                  <TableHeader className="w-52">Usuário</TableHeader>
                  <TableHeader className="w-56">Dispositivo</TableHeader>
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
  return (
    <tr className="align-top transition hover:bg-slate-50/80">
      <td className="px-4 py-3.5">
        <time className="text-sm font-semibold text-slate-700">
          {new Date(parsed.occurredAt).toLocaleDateString("pt-BR")}
        </time>
        <span className="mt-0.5 block text-xs text-slate-400">
          {new Date(parsed.occurredAt).toLocaleTimeString("pt-BR")}
        </span>
      </td>
      <td className="px-4 py-3.5">
        <span className="text-[10px] font-black uppercase tracking-wide text-slate-400">
          {formatEvent(parsed.event)}
        </span>
        <p className="mt-1 max-w-2xl text-sm font-semibold leading-5 text-slate-800">
          {parsed.displayMessage}
        </p>
      </td>
      <td className="px-4 py-3.5">
        <SourceBadge parsed={parsed} />
      </td>
      <td className="px-4 py-3.5">
        <p className="text-sm font-semibold text-slate-700">
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
    PLAYER_CONNECTION_LOST: "Conexão perdida",
    PLAYER_CONNECTION_RESTORED: "Conexão restabelecida",
    PLAYLIST_PLAYBACK_STARTED: "Playlist iniciada",
    PLAYLIST_PLAYBACK_FINISHED: "Playlist finalizada",
  };

  return labels[event] ?? event.replace(/_/g, " ");
}

function toIsoDate(value: string, endOfDay: boolean) {
  return new Date(`${value}T${endOfDay ? "23:59:59.999" : "00:00:00"}`).toISOString();
}
