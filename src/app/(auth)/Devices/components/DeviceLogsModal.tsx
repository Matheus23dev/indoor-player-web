import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  AlertCircle,
  Clock3,
  FileText,
  Loader2,
  RefreshCw,
  X,
} from "lucide-react";

import {
  getDeviceLogs,
} from "../services/devices.services";

import type {
  Device,
  DeviceLog,
} from "../types/device";

interface Props {
  device:
    Device | null;

  onClose:
    () => void;
}

export function DeviceLogsModal({
  device,
  onClose,
}: Props) {
  const [
    logs,
    setLogs,
  ] = useState<DeviceLog[]>(
    [],
  );

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<string | null>(
    null,
  );

  const loadLogs =
    useCallback(async () => {
      if (!device) {
        return;
      }

      setLoading(true);

      try {
        const data =
          await getDeviceLogs(
            device.id,
          );

        setLogs(data);
        setError(null);
      } catch {
        setError(
          "Não foi possível carregar os logs.",
        );
      } finally {
        setLoading(false);
      }
    }, [
      device,
    ]);

  useEffect(() => {
    if (!device) {
      return;
    }

    void loadLogs();
  }, [
    device,
    loadLogs,
  ]);

  if (!device) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FileText
                size={22}
              />
            </div>

            <div>
              <h2 className="text-xl font-black text-slate-900">
                Logs do dispositivo
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {device.name ||
                  "Dispositivo sem nome"}{" "}
                · {device.code}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={
              onClose
            }
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </header>

        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-3">
          <span className="text-sm text-slate-500">
            {logs.length} registros
          </span>

          <button
            type="button"
            onClick={() =>
              void loadLogs()
            }
            disabled={
              loading
            }
            className="inline-flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-xs font-bold"
          >
            <RefreshCw
              size={14}
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />

            Atualizar
          </button>
        </div>

        <div className="min-h-64 flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex min-h-64 items-center justify-center">
              <Loader2
                size={30}
                className="animate-spin text-blue-600"
              />
            </div>
          ) : error ? (
            <div className="flex min-h-64 flex-col items-center justify-center text-center text-red-700">
              <AlertCircle
                size={32}
              />

              <p className="mt-3 font-bold">
                {error}
              </p>
            </div>
          ) : logs.length ===
            0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center text-center text-slate-500">
              <FileText
                size={34}
              />

              <p className="mt-3 font-bold">
                Nenhum log registrado
              </p>
            </div>
          ) : (
            <ol className="space-y-4">
              {logs.map(
                log => (
                  <li
                    key={log.id}
                    className="flex gap-3 rounded-2xl border border-slate-200 p-4"
                  >
                    <Clock3
                      size={17}
                      className="mt-0.5 shrink-0 text-blue-600"
                    />

                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {log.message}
                      </p>

                      <time className="mt-2 block text-xs text-slate-400">
                        {new Date(
                          log.createdAt,
                        ).toLocaleString(
                          "pt-BR",
                        )}
                      </time>
                    </div>
                  </li>
                ),
              )}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
}