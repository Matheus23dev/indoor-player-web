import {
  CircleCheck,
  CircleHelp,
  CircleX,
  Info,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";

import {
  settleAppAlert,
  subscribeToAppAlerts,
  type AppAlertDismissReason,
  type AppAlertIcon,
  type AppAlertSnapshot,
} from "@/lib/alert";

const alertIcons: Record<AppAlertIcon, LucideIcon> = {
  success: CircleCheck,
  error: CircleX,
  warning: TriangleAlert,
  info: Info,
  question: CircleHelp,
};

export default function AlertHost() {
  const titleId = useId();
  const descriptionId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const [alert, setAlert] = useState<AppAlertSnapshot | null>(null);

  useEffect(() => subscribeToAppAlerts(setAlert), []);

  useEffect(() => {
    if (!alert) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => {
      const danger = alert.options.customClass?.confirmButton === "indoor-swal-danger";
      const preferredButton = danger ? cancelButtonRef.current : confirmButtonRef.current;

      (preferredButton ?? panelRef.current)?.focus();
    }, 0);

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
    };
  }, [alert]);

  useEffect(() => {
    if (!alert?.options.timer) {
      return;
    }

    const timer = window.setTimeout(() => {
      dismiss(alert.id, "timer");
    }, alert.options.timer);

    return () => window.clearTimeout(timer);
  }, [alert]);

  if (!alert) {
    return null;
  }

  const { options } = alert;
  const icon = options.icon ?? "info";
  const Icon = alertIcons[icon];
  const showConfirmButton = options.showConfirmButton !== false;
  const isDanger = options.customClass?.confirmButton === "indoor-swal-danger";
  const hasDescription = Boolean(options.text || options.html);

  function confirm() {
    settleAppAlert(alert!.id, {
      isConfirmed: true,
      isDismissed: false,
    });
  }

  function dismiss(id: number, reason: AppAlertDismissReason) {
    settleAppAlert(id, {
      isConfirmed: false,
      isDismissed: true,
      dismiss: reason,
    });
  }

  function handleBackdropClick(event: React.MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget && options.allowOutsideClick !== false) {
      dismiss(alert!.id, "backdrop");
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape" && options.allowEscapeKey !== false) {
      event.preventDefault();
      dismiss(alert!.id, "escape");
      return;
    }

    if (event.key !== "Tab" || !panelRef.current) {
      return;
    }

    const focusableElements = Array.from(
      panelRef.current.querySelectorAll<HTMLElement>("button:not(:disabled)"),
    );

    if (focusableElements.length === 0) {
      event.preventDefault();
      panelRef.current.focus();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement?.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement?.focus();
    }
  }

  return createPortal(
    <div className="indoor-alert-backdrop" onMouseDown={handleBackdropClick}>
      <div
        ref={panelRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={options.title ? titleId : undefined}
        aria-describedby={hasDescription ? descriptionId : undefined}
        data-icon={icon}
        className="indoor-alert-panel"
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="indoor-alert-icon" aria-hidden="true">
          <Icon size={31} strokeWidth={2.2} />
        </div>

        {options.title && (
          <h2 id={titleId} className="indoor-alert-title">
            {options.title}
          </h2>
        )}

        {options.html ? (
          <div
            id={descriptionId}
            className="indoor-alert-message"
            dangerouslySetInnerHTML={{ __html: options.html }}
          />
        ) : options.text ? (
          <p id={descriptionId} className="indoor-alert-message">
            {options.text}
          </p>
        ) : null}

        {(showConfirmButton || options.showCancelButton) && (
          <div className="indoor-alert-actions">
            {options.showCancelButton && (
              <button
                ref={cancelButtonRef}
                type="button"
                className="indoor-alert-button indoor-alert-cancel"
                onClick={() => dismiss(alert.id, "cancel")}
              >
                {options.cancelButtonText ?? "Cancelar"}
              </button>
            )}

            {showConfirmButton && (
              <button
                ref={confirmButtonRef}
                type="button"
                className={`indoor-alert-button indoor-alert-confirm ${
                  isDanger ? "indoor-alert-danger" : ""
                }`}
                onClick={confirm}
              >
                {options.confirmButtonText ?? "Entendi"}
              </button>
            )}
          </div>
        )}

        {options.timer && (
          <div className="indoor-alert-timer" aria-hidden="true">
            <span style={{ animationDuration: `${options.timer}ms` }} />
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
