export type AppToastType = "success" | "error" | "warning" | "info";

export interface AppToastOptions {
  duration?: number;
}

export interface AppToastMessage {
  id: number;
  type: AppToastType;
  message: string;
  duration: number;
}

type ToastListener = (toasts: AppToastMessage[]) => void;

let nextToastId = 1;
let activeToasts: AppToastMessage[] = [];
const toastListeners = new Set<ToastListener>();

function publishToasts() {
  const snapshot = [...activeToasts];
  toastListeners.forEach((listener) => listener(snapshot));
}

function show(type: AppToastType, message: string, options: AppToastOptions = {}) {
  const toast: AppToastMessage = {
    id: nextToastId++,
    type,
    message,
    duration: options.duration ?? 4500,
  };

  activeToasts = [...activeToasts.slice(-3), toast];
  publishToasts();

  return toast.id;
}

export function dismissAppToast(id: number) {
  const nextToasts = activeToasts.filter((toast) => toast.id !== id);

  if (nextToasts.length === activeToasts.length) {
    return;
  }

  activeToasts = nextToasts;
  publishToasts();
}

export function subscribeToAppToasts(listener: ToastListener) {
  toastListeners.add(listener);
  listener([...activeToasts]);

  return () => {
    toastListeners.delete(listener);
  };
}

export const appToast = {
  success: (message: string, options?: AppToastOptions) => show("success", message, options),
  error: (message: string, options?: AppToastOptions) => show("error", message, options),
  warning: (message: string, options?: AppToastOptions) => show("warning", message, options),
  info: (message: string, options?: AppToastOptions) => show("info", message, options),
  dismiss: dismissAppToast,
};
