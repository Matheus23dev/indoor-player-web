export type AppAlertIcon = "success" | "error" | "warning" | "info" | "question";
export type AppAlertDismissReason = "cancel" | "backdrop" | "escape" | "timer";

export interface AppAlertOptions {
  icon?: AppAlertIcon;
  title?: string;
  text?: string;
  html?: string;
  showCancelButton?: boolean;
  showConfirmButton?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  timer?: number;
  allowOutsideClick?: boolean;
  allowEscapeKey?: boolean;
  customClass?: {
    confirmButton?: string;
  };
}

export interface AppAlertResult {
  isConfirmed: boolean;
  isDismissed: boolean;
  dismiss?: AppAlertDismissReason;
}

export interface AppAlertSnapshot {
  id: number;
  options: AppAlertOptions;
}

interface PendingAlert extends AppAlertSnapshot {
  resolve: (result: AppAlertResult) => void;
}

type AlertListener = (alert: AppAlertSnapshot | null) => void;

let nextAlertId = 1;
let activeAlert: PendingAlert | null = null;
const alertQueue: PendingAlert[] = [];
const alertListeners = new Set<AlertListener>();

function publishAlert() {
  const snapshot = activeAlert ? { id: activeAlert.id, options: activeAlert.options } : null;

  alertListeners.forEach((listener) => listener(snapshot));
}

function showNextAlert() {
  if (activeAlert || alertQueue.length === 0) {
    return;
  }

  activeAlert = alertQueue.shift() ?? null;
  publishAlert();
}

function fire(options: AppAlertOptions): Promise<AppAlertResult> {
  return new Promise((resolve) => {
    alertQueue.push({
      id: nextAlertId++,
      options,
      resolve,
    });

    showNextAlert();
  });
}

export const appAlert = { fire };

export function subscribeToAppAlerts(listener: AlertListener) {
  alertListeners.add(listener);
  listener(activeAlert ? { id: activeAlert.id, options: activeAlert.options } : null);

  return () => {
    alertListeners.delete(listener);
  };
}

export function settleAppAlert(id: number, result: AppAlertResult) {
  if (!activeAlert || activeAlert.id !== id) {
    return;
  }

  const settledAlert = activeAlert;
  activeAlert = null;
  settledAlert.resolve(result);
  publishAlert();
  queueMicrotask(showNextAlert);
}
