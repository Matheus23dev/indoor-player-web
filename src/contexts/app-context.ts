import { createContext } from "react";
import type { AppAlertOptions, AppAlertResult } from "../lib/alert";

export type ToastType = "success" | "info" | "error" | "warn";

export interface AppContextValue {
  notifySuccess: (message: string) => void;
  notifyError: (message: string) => void;
  showToast: (text: string, type: ToastType) => void;
  SAlert: (config: AppAlertOptions) => Promise<AppAlertResult>;
  handleOverlay: (message: string, isLoading: boolean) => void;
}

export const AppContext = createContext<AppContextValue | null>(null);
