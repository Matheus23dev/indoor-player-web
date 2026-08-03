import { createContext } from "react";
import type { SweetAlertOptions, SweetAlertResult } from "sweetalert2";

export type ToastType = "success" | "info" | "error" | "warn";

export interface AppContextValue {
  notifySuccess: (message: string) => void;
  notifyError: (message: string) => void;
  showToast: (text: string, type: ToastType) => void;
  SAlert: (config: SweetAlertOptions) => Promise<SweetAlertResult>;
  handleOverlay: (message: string, isLoading: boolean) => void;
}

export const AppContext = createContext<AppContextValue | null>(null);
