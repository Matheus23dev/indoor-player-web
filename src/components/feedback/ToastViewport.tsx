import { CircleCheck, CircleX, Info, TriangleAlert, X, type LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import {
  dismissAppToast,
  subscribeToAppToasts,
  type AppToastMessage,
  type AppToastType,
} from "@/lib/toast";

const toastIcons: Record<AppToastType, LucideIcon> = {
  success: CircleCheck,
  error: CircleX,
  warning: TriangleAlert,
  info: Info,
};

export default function ToastViewport() {
  const [toasts, setToasts] = useState<AppToastMessage[]>([]);

  useEffect(() => subscribeToAppToasts(setToasts), []);

  if (toasts.length === 0) {
    return null;
  }

  return createPortal(
    <section
      className="indoor-toast-viewport"
      aria-label="Notificações do sistema"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </section>,
    document.body,
  );
}

function ToastItem({ toast }: { toast: AppToastMessage }) {
  const Icon = toastIcons[toast.type];

  useEffect(() => {
    const timer = window.setTimeout(() => dismissAppToast(toast.id), toast.duration);

    return () => window.clearTimeout(timer);
  }, [toast.duration, toast.id]);

  return (
    <article
      role={toast.type === "error" ? "alert" : "status"}
      data-type={toast.type}
      className="indoor-toast"
    >
      <span className="indoor-toast-icon" aria-hidden="true">
        <Icon size={19} strokeWidth={2.2} />
      </span>

      <p className="indoor-toast-message">{toast.message}</p>

      <button
        type="button"
        className="indoor-toast-close"
        aria-label="Fechar notificação"
        onClick={() => dismissAppToast(toast.id)}
      >
        <X size={15} />
      </button>

      <span
        className="indoor-toast-timer"
        aria-hidden="true"
        style={{ animationDuration: `${toast.duration}ms` }}
      />
    </article>
  );
}
