import { useCallback, useMemo, useState, type ReactNode } from "react";
import { HelmetProvider } from "react-helmet-async";
import Overlay from "../components/feedback/Overlay";
import GlobalTooltip from "../components/feedback/GlobalTooltip";
import AlertHost from "../components/feedback/AlertHost";
import ToastViewport from "../components/feedback/ToastViewport";
import { appAlert, type AppAlertOptions, type AppAlertResult } from "../lib/alert";
import { appToast } from "../lib/toast";
import { AppContext, type ToastType } from "./app-context";

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [overlay, setOverlay] = useState({ message: "", isLoading: false });

  const notifySuccess = useCallback(
    (message: string) => appToast.success(message, { duration: 4000 }),
    [],
  );
  const notifyError = useCallback(
    (message: string) => appToast.error(message, { duration: 5000 }),
    [],
  );

  const showToast = useCallback((text: string, type: ToastType) => {
    if (type === "success") {
      appToast.success(text);
      return;
    }

    if (type === "error") {
      appToast.error(text);
      return;
    }

    if (type === "warn") {
      appToast.warning(text);
      return;
    }

    appToast.info(text);
  }, []);

  const SAlert = useCallback((config: AppAlertOptions): Promise<AppAlertResult> => {
    return appAlert.fire(config);
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
      <AlertHost />
      <ToastViewport />
      <GlobalTooltip />
      <Overlay message={overlay.message || "Carregando..."} isLoading={overlay.isLoading} />
      {children}
    </AppContext.Provider>
  );
};
