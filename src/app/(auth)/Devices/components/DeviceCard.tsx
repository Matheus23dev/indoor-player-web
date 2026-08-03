import { useState } from "react";

import {
  Check,
  Clock3,
  Copy,
  FileText,
  LoaderCircle,
  MonitorSmartphone,
  TriangleAlert,
  Unlink2,
  X,
} from "lucide-react";

import type { Device } from "../types/device";

import { DevicePreview } from "./DevicePreview";

interface Props {
  device: Device;

  onLogs: (device: Device) => void;

  onUnlink: (device: Device) => Promise<void>;
}

export function DeviceCard({ device, onLogs, onUnlink }: Props) {
  const [codeCopied, setCodeCopied] = useState(false);

  const [unlinkModalOpen, setUnlinkModalOpen] = useState(false);

  const [unlinking, setUnlinking] = useState(false);

  const [unlinkError, setUnlinkError] = useState("");

  const deviceName = device.name?.trim() || "Dispositivo sem nome";

  async function handleCopyCode() {
    try {
      await navigator.clipboard.writeText(device.code);

      setCodeCopied(true);

      window.setTimeout(() => {
        setCodeCopied(false);
      }, 1800);
    } catch (error) {
      console.error("[DEVICE CARD] Erro ao copiar código:", error);
    }
  }

  function handleOpenUnlinkModal() {
    setUnlinkError("");

    setUnlinkModalOpen(true);
  }

  function handleCloseUnlinkModal() {
    if (unlinking) {
      return;
    }

    setUnlinkModalOpen(false);

    setUnlinkError("");
  }

  async function handleConfirmUnlink() {
    if (unlinking) {
      return;
    }

    try {
      setUnlinking(true);

      setUnlinkError("");

      await onUnlink(device);

      setUnlinkModalOpen(false);
    } catch (error) {
      console.error("[DEVICE CARD] Erro ao desvincular dispositivo:", error);

      setUnlinkError(getErrorMessage(error));
    } finally {
      setUnlinking(false);
    }
  }

  return (
    <>
      <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition duration-200 hover:border-blue-200 hover:shadow-lg">
        <div className="p-2.5">
          <DevicePreview preview={device.preview} status={device.status} />
        </div>

        <div className="border-t border-slate-100 p-3">
          <header className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                <MonitorSmartphone size={17} />
              </div>

              <div className="min-w-0">
                <h3 className="truncate text-sm font-extrabold text-slate-900">{deviceName}</h3>

                <div className="mt-0.5 flex items-center gap-2">
                  <code className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-wider text-slate-600">
                    {device.code}
                  </code>

                  <button
                    type="button"
                    onClick={handleCopyCode}
                    aria-label="Copiar código"
                    className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  >
                    {codeCopied ? (
                      <Check size={14} className="text-emerald-600" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                </div>

                <div className="mt-0.5 flex min-w-0 items-center gap-1 text-[10px] text-slate-500">
                  <Clock3 size={11} className="shrink-0 text-slate-400" />
                  <span className="truncate">{formatHeartbeat(device.lastHeartbeat)}</span>
                </div>
              </div>
            </div>

            <span
              className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-extrabold ${
                device.isLinked ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
              }`}
            >
              {device.isLinked ? "Vinculado" : "Não vinculado"}
            </span>
          </header>

          <div className={device.isLinked ? "mt-2 grid grid-cols-2 gap-2" : "mt-2 grid gap-2"}>
            <button
              type="button"
              onClick={() => onLogs(device)}
              className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              <FileText size={15} />
              Logs
            </button>

            {device.isLinked && (
              <button
                type="button"
                onClick={handleOpenUnlinkModal}
                className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 text-xs font-bold text-amber-700 transition hover:border-amber-300 hover:bg-amber-100"
              >
                <Unlink2 size={15} />
                Desvincular
              </button>
            )}
          </div>
        </div>
      </article>

      {unlinkModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="unlink-device-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              handleCloseUnlinkModal();
            }
          }}
        >
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                  <TriangleAlert size={24} />
                </div>

                <div>
                  <h2 id="unlink-device-title" className="text-lg font-extrabold text-slate-900">
                    Desvincular dispositivo
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Confirme a remoção deste dispositivo da sua empresa.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseUnlinkModal}
                disabled={unlinking}
                aria-label="Fechar"
                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="font-bold text-slate-900">{deviceName}</p>

                <p className="mt-1 font-mono text-sm font-bold tracking-wider text-slate-500">
                  Código: {device.code}
                </p>
              </div>

              <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                <p>A TV será desconectada da empresa e voltará para a tela de ativação.</p>

                <p className="mt-2">
                  O código será mantido, mas os agendamentos vinculados ao dispositivo serão
                  removidos.
                </p>
              </div>

              {unlinkError && (
                <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                  {unlinkError}
                </div>
              )}

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleCloseUnlinkModal}
                  disabled={unlinking}
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={handleConfirmUnlink}
                  disabled={unlinking}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 text-sm font-bold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {unlinking ? (
                    <>
                      <LoaderCircle size={18} className="animate-spin" />
                      Desvinculando...
                    </>
                  ) : (
                    <>
                      <Unlink2 size={18} />
                      Desvincular
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function formatHeartbeat(value: string | null) {
  if (!value) {
    return "Nunca se comunicou";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Última comunicação indisponível";
  }

  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) {
    return "Comunicou-se há poucos segundos";
  }

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `Comunicou-se há ${minutes} ${minutes === 1 ? "minuto" : "minutos"}`;
  }

  const hours = Math.floor(minutes / 60);

  return `Comunicou-se há ${hours} ${hours === 1 ? "hora" : "horas"}`;
}

function getErrorMessage(error: unknown) {
  if (typeof error === "object" && error !== null) {
    const axiosError = error as {
      response?: {
        data?: {
          message?: string;
        };
      };
    };

    const message = axiosError.response?.data?.message;

    if (message) {
      return message;
    }
  }

  return "Não foi possível desvincular o dispositivo.";
}
