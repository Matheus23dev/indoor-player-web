import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";

type TooltipPlacement = "top" | "bottom";

interface TooltipState {
  text: string;
  left: number;
  top: number;
  placement: TooltipPlacement;
  anchorLeft: number;
  arrowLeft: number;
}

const TOOLTIP_SELECTOR = "[title], [data-indoor-tooltip-text]";

export default function GlobalTooltip() {
  const tooltipId = useId();
  const tooltipRef = useRef<HTMLDivElement>(null);
  const activeTargetRef = useRef<HTMLElement | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const positionTooltip = useCallback((target: HTMLElement, text: string) => {
    const rect = target.getBoundingClientRect();
    const viewportWidth = Math.max(window.innerWidth, 1);
    const tooltipWidth = Math.min(280, viewportWidth - 24);
    const estimatedWidth = Math.min(tooltipWidth, Math.max(56, Math.ceil(text.length * 6.6 + 20)));
    const anchorLeft = rect.left + rect.width / 2;
    const left = Math.min(
      viewportWidth - estimatedWidth - 12,
      Math.max(12, anchorLeft - estimatedWidth / 2),
    );
    const placement: TooltipPlacement = rect.top >= 72 ? "top" : "bottom";

    setTooltip({
      text,
      left,
      top: placement === "top" ? rect.top - 10 : rect.bottom + 10,
      placement,
      anchorLeft,
      arrowLeft: anchorLeft - left,
    });
  }, []);

  useLayoutEffect(() => {
    const element = tooltipRef.current;

    if (!element || !tooltip) {
      return;
    }

    const width = element.offsetWidth;
    const viewportWidth = Math.max(window.innerWidth, 1);
    const correctedLeft = Math.min(
      viewportWidth - width - 12,
      Math.max(12, tooltip.anchorLeft - width / 2),
    );
    const correctedArrowLeft = Math.min(
      width - 12,
      Math.max(12, tooltip.anchorLeft - correctedLeft),
    );

    if (
      Math.abs(correctedLeft - tooltip.left) > 0.5 ||
      Math.abs(correctedArrowLeft - tooltip.arrowLeft) > 0.5
    ) {
      setTooltip((current) =>
        current
          ? {
              ...current,
              left: correctedLeft,
              arrowLeft: correctedArrowLeft,
            }
          : current,
      );
    }
  }, [tooltip]);

  const restoreTarget = useCallback((target: HTMLElement) => {
    const tooltipText = target.dataset.indoorTooltipText;

    if (tooltipText) {
      target.setAttribute("title", tooltipText);
    }

    delete target.dataset.indoorTooltipText;

    const previousDescribedBy = target.dataset.indoorTooltipDescribedBy;

    if (previousDescribedBy) {
      target.setAttribute("aria-describedby", previousDescribedBy);
    } else {
      target.removeAttribute("aria-describedby");
    }

    delete target.dataset.indoorTooltipDescribedBy;
  }, []);

  const deactivate = useCallback(
    (target = activeTargetRef.current) => {
      if (target) {
        restoreTarget(target);
      }

      if (!target || activeTargetRef.current === target) {
        activeTargetRef.current = null;
        setTooltip(null);
      }
    },
    [restoreTarget],
  );

  const activate = useCallback(
    (target: HTMLElement) => {
      const text = (target.getAttribute("title") ?? target.dataset.indoorTooltipText)?.trim();

      if (!text) {
        return;
      }

      if (activeTargetRef.current && activeTargetRef.current !== target) {
        deactivate(activeTargetRef.current);
      }

      if (!target.dataset.indoorTooltipText) {
        target.dataset.indoorTooltipText = text;
        target.dataset.indoorTooltipDescribedBy = target.getAttribute("aria-describedby") ?? "";
        target.removeAttribute("title");
      }

      const previousDescribedBy = target.dataset.indoorTooltipDescribedBy;
      target.setAttribute(
        "aria-describedby",
        [previousDescribedBy, tooltipId].filter(Boolean).join(" "),
      );

      activeTargetRef.current = target;
      positionTooltip(target, text);
    },
    [deactivate, positionTooltip, tooltipId],
  );

  useEffect(() => {
    function findTarget(event: Event) {
      if (!(event.target instanceof Element)) {
        return null;
      }

      const target = event.target.closest(TOOLTIP_SELECTOR);

      return target instanceof HTMLElement ? target : null;
    }

    function handlePointerOver(event: PointerEvent) {
      const target = findTarget(event);

      if (target) {
        activate(target);
      }
    }

    function handlePointerOut(event: PointerEvent) {
      const target = activeTargetRef.current;

      if (!target) {
        return;
      }

      if (event.relatedTarget instanceof Node && target.contains(event.relatedTarget)) {
        return;
      }

      if (document.activeElement !== target) {
        deactivate(target);
      }
    }

    function handleFocusIn(event: FocusEvent) {
      const target = findTarget(event);

      if (target) {
        activate(target);
      }
    }

    function handleFocusOut(event: FocusEvent) {
      const target = activeTargetRef.current;

      if (target && event.target === target) {
        deactivate(target);
      }
    }

    function handleClick() {
      deactivate();
    }

    function handleViewportChange() {
      const target = activeTargetRef.current;
      const text = target?.dataset.indoorTooltipText;

      if (target && text) {
        positionTooltip(target, text);
      }
    }

    document.addEventListener("pointerover", handlePointerOver);
    document.addEventListener("pointerout", handlePointerOut);
    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("focusout", handleFocusOut);
    document.addEventListener("click", handleClick);
    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange, true);

    return () => {
      document.removeEventListener("pointerover", handlePointerOver);
      document.removeEventListener("pointerout", handlePointerOut);
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("focusout", handleFocusOut);
      document.removeEventListener("click", handleClick);
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);
      deactivate();
    };
  }, [activate, deactivate, positionTooltip]);

  if (!tooltip) {
    return null;
  }

  return createPortal(
    <div
      ref={tooltipRef}
      id={tooltipId}
      role="tooltip"
      data-placement={tooltip.placement}
      className="indoor-tooltip"
      style={
        {
          left: tooltip.left,
          top: tooltip.top,
          "--indoor-tooltip-arrow-left": `${tooltip.arrowLeft}px`,
        } as CSSProperties
      }
    >
      {tooltip.text}
    </div>,
    document.body,
  );
}
