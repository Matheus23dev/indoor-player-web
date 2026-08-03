import { useCallback, useMemo, useState, type ReactNode } from "react";
import Swal, { type SweetAlertOptions, type SweetAlertResult } from "sweetalert2";
import { HelmetProvider } from "react-helmet-async";
import { toast, Toaster } from "sonner";
import { Colors } from "../constants";
import Overlay from "../components/feedback/Overlay";
import { AppContext, type ToastType } from "./app-context";

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [overlay, setOverlay] = useState({ message: "", isLoading: false });

  const notifySuccess = useCallback(
    (message: string) => toast.success(message, { duration: 4000 }),
    [],
  );
  const notifyError = useCallback((message: string) => toast.error(message), []);

  const showToast = useCallback((text: string, type: ToastType) => {
    const toastColors: Record<ToastType, string> = {
      success: Colors.verde,
      info: Colors.azulSecundario,
      error: Colors.vermelho,
      warn: Colors.amarelo,
    };
    const color = toastColors[type];
    toast.custom((toastId) => (
      <div
        className="relative w-full animate-fade-in rounded-lg p-4 pr-10 text-white shadow-md"
        style={{ backgroundColor: color }}
      >
        <span className="text-sm text-white">{text}</span>
        <button
          type="button"
          aria-label="Fechar notificação"
          onClick={() => toast.dismiss(toastId)}
          className="absolute right-4 top-1 text-2xl font-bold text-white"
        >
          &times;
        </button>
      </div>
    ));
  }, []);

  const SAlert = useCallback((config: SweetAlertOptions): Promise<SweetAlertResult> => {
    return Swal.fire(config);
  }, []);

  const handleOverlay = useCallback((message: string, isLoading: boolean) => {
    setOverlay({ message, isLoading });
  }, []);

  const value = useMemo(
    () => ({ notifySuccess, notifyError, showToast, SAlert, handleOverlay }),
    [SAlert, handleOverlay, notifyError, notifySuccess, showToast],
  );

  return (
    <AppContext.Provider value={value}>
      <HelmetProvider>
        <title>Indoor Player</title>
      </HelmetProvider>
      <Toaster richColors position="top-right" />
      <Overlay message={overlay.message || "Carregando..."} isLoading={overlay.isLoading} />
      {children}
    </AppContext.Provider>
  );
};
