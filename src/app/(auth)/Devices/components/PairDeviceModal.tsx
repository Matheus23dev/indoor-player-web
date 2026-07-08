import {
  useEffect,
  useId,
  useState,
} from "react";

import type {
  FormEvent,
} from "react";

import {
  KeyRound,
  Link2,
  Loader2,
  MonitorSmartphone,
  Tv,
  X,
} from "lucide-react";

interface Props {
  open:
    boolean;

  loading?:
    boolean;

  onClose:
    () => void;

  onConfirm: (
    code: string,
    name: string,
  ) => Promise<void>;
}

export function PairDeviceModal({
  open,
  loading = false,
  onClose,
  onConfirm,
}: Props) {
  const codeId =
    useId();

  const nameId =
    useId();

  const [
    code,
    setCode,
  ] = useState("");

  const [
    name,
    setName,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow =
      document.body.style
        .overflow;

    document.body.style.overflow =
      "hidden";

    function handleKeyDown(
      event:
        KeyboardEvent,
    ) {
      if (
        event.key ===
          "Escape" &&
        !loading
      ) {
        onClose();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [
    open,
    loading,
    onClose,
  ]);

  function resetForm() {
    setCode("");
    setName("");
    setError(null);
  }

  function handleClose() {
    if (loading) {
      return;
    }

    resetForm();

    onClose();
  }

  async function handleSubmit(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const normalizedCode =
      code
        .trim()
        .toUpperCase();

    const normalizedName =
      name.trim();

    if (
      normalizedCode.length !==
      6
    ) {
      setError(
        "O código deve possuir 6 caracteres.",
      );

      return;
    }

    if (
      normalizedName.length <
      2
    ) {
      setError(
        "Informe um nome válido para o dispositivo.",
      );

      return;
    }

    try {
      setError(null);

      await onConfirm(
        normalizedCode,
        normalizedName,
      );

      resetForm();
    } catch {
      setError(
        "Não foi possível vincular o dispositivo. Confirme o código e tente novamente.",
      );
    }
  }

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      onMouseDown={
        event => {
          if (
            event.target ===
              event.currentTarget &&
            !loading
          ) {
            handleClose();
          }
        }
      }
    >
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-white/20 bg-white shadow-2xl">
        <header className="border-b border-slate-200 bg-slate-50 px-6 py-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white">
                <MonitorSmartphone
                  size={24}
                />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
                  Novo player
                </p>

                <h2 className="mt-1 text-xl font-black text-slate-900">
                  Vincular dispositivo
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Informe o código exibido na TV.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={
                handleClose
              }
              disabled={
                loading
              }
              className="rounded-xl p-2 text-slate-400 hover:bg-white hover:text-slate-700"
            >
              <X size={20} />
            </button>
          </div>
        </header>

        <form
          onSubmit={
            handleSubmit
          }
        >
          <div className="space-y-5 px-6 py-6">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor={
                  codeId
                }
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                Código do dispositivo
              </label>

              <div className="relative">
                <KeyRound
                  size={18}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id={codeId}
                  value={code}
                  onChange={
                    event => {
                      setCode(
                        event.target.value
                          .toUpperCase()
                          .replace(
                            /[^A-Z0-9]/g,
                            "",
                          )
                          .slice(
                            0,
                            6,
                          ),
                      );
                    }
                  }
                  disabled={
                    loading
                  }
                  autoFocus
                  placeholder="Ex.: J9AM5O"
                  className="h-12 w-full rounded-xl border border-slate-300 pl-11 pr-4 font-mono font-bold uppercase tracking-[0.18em] outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor={
                  nameId
                }
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                Nome do dispositivo
              </label>

              <div className="relative">
                <Tv
                  size={18}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id={nameId}
                  value={name}
                  onChange={
                    event =>
                      setName(
                        event.target.value.slice(
                          0,
                          80,
                        ),
                      )
                  }
                  disabled={
                    loading
                  }
                  placeholder="Ex.: TV da recepção"
                  className="h-12 w-full rounded-xl border border-slate-300 pl-11 pr-4 text-sm font-medium outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>
          </div>

          <footer className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-6 py-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={
                handleClose
              }
              disabled={
                loading
              }
              className="h-11 rounded-xl border border-slate-300 bg-white px-5 text-sm font-bold text-slate-700"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={
                loading
              }
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />

                  Vinculando...
                </>
              ) : (
                <>
                  <Link2
                    size={17}
                  />

                  Vincular dispositivo
                </>
              )}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}