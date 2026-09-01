import { useEffect, useRef } from "react";
import { driver, type Driver } from "driver.js";
import "driver.js/dist/driver.css";
import { useLocation, useNavigate } from "react-router-dom";

import type { UserRole } from "../../../../contexts/auth-context";
import { getOnboardingSteps } from "../content";
import { markOnboardingCompleted } from "../onboarding-storage";

interface OnboardingTourProps {
  open: boolean;
  userId: string;
  userRole: UserRole;
  onOpenChange: (open: boolean) => void;
  onTargetChange: (target: string | null) => void;
  onStepChange?: (stepId: string | null) => void;
}

const TARGET_WAIT_ATTEMPTS = 50;
const TARGET_WAIT_INTERVAL = 80;
const COMPACT_VIEWPORT_WIDTH = 640;
const COMPACT_VIEWPORT_HEIGHT = 680;
const TOUR_MODAL_CLOSE_TARGETS = [
  "media-folder-close",
  "media-upload-close",
  "playlist-create-close",
  "bar-modal-close",
  "device-pair-close",
  "schedule-modal-close",
  "user-modal-close",
];

function targetSelector(target: string) {
  return `[data-help-tour="${target}"]`;
}

function clickTourTarget(target: string) {
  document.querySelector<HTMLElement>(targetSelector(target))?.click();
}

function dismissOpenTourModal() {
  TOUR_MODAL_CLOSE_TARGETS.forEach(clickTourTarget);
}

function isCompactViewport() {
  return (
    window.innerWidth <= COMPACT_VIEWPORT_WIDTH || window.innerHeight <= COMPACT_VIEWPORT_HEIGHT
  );
}

export function OnboardingTour({
  open,
  userId,
  userRole,
  onOpenChange,
  onTargetChange,
  onStepChange,
}: OnboardingTourProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const driverRef = useRef<Driver | null>(null);
  const navigateRef = useRef(navigate);
  const locationRef = useRef(location.pathname);
  const openRef = useRef(open);
  const navigationTimerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    navigateRef.current = navigate;
  }, [navigate]);

  useEffect(() => {
    locationRef.current = location.pathname;
  }, [location.pathname]);

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  useEffect(() => {
    if (!open) {
      onTargetChange(null);
      onStepChange?.(null);
      return;
    }

    const steps = getOnboardingSteps(userRole);
    const compactViewport = isCompactViewport();
    let disposed = false;

    function stopDriver(instance: Driver) {
      instance.setConfig({ ...instance.getConfig(), onDestroyStarted: undefined });
      if (instance.isActive()) instance.destroy();
    }

    function closeTour(instance: Driver) {
      if (disposed) return;

      if (navigationTimerRef.current) window.clearTimeout(navigationTimerRef.current);
      dismissOpenTourModal();
      markOnboardingCompleted(userId);
      stopDriver(instance);
      onTargetChange(null);
      onStepChange?.(null);
      onOpenChange(false);
    }

    function moveToStep(instance: Driver, index: number) {
      const nextStep = steps[index];
      if (!nextStep || disposed || !openRef.current) return;

      onTargetChange(nextStep.menuTarget ?? null);
      onStepChange?.(nextStep.id);

      if (nextStep.route && locationRef.current !== nextStep.route) {
        void navigateRef.current(nextStep.route);
      }

      let attempts = 0;
      let prepared = false;
      const showWhenReady = () => {
        if (disposed || !openRef.current) return;

        if (!prepared) {
          const currentIndex = instance.getActiveIndex() ?? 0;
          const currentStep = steps[currentIndex];
          const changesModal = currentStep?.activateTarget !== nextStep.activateTarget;

          if (changesModal || !nextStep.activateTarget) dismissOpenTourModal();

          if (nextStep.activateTarget) {
            const activator = document.querySelector<HTMLElement>(
              targetSelector(nextStep.activateTarget),
            );

            if (!activator) {
              attempts += 1;
              navigationTimerRef.current = window.setTimeout(showWhenReady, TARGET_WAIT_INTERVAL);
              return;
            }

            const targetAlreadyVisible = nextStep.target
              ? document.querySelector(targetSelector(nextStep.target))
              : null;
            if (!targetAlreadyVisible) activator.click();
          }

          prepared = true;
        }

        const targetElement = nextStep.target
          ? document.querySelector<HTMLElement>(targetSelector(nextStep.target))
          : null;
        const targetReady = !nextStep.target || targetElement;
        if (targetReady || attempts >= TARGET_WAIT_ATTEMPTS) {
          if (targetElement && typeof targetElement.scrollIntoView === "function") {
            targetElement.scrollIntoView({ block: "center", inline: "nearest", behavior: "auto" });
          }

          navigationTimerRef.current = window.setTimeout(() => {
            if (disposed || !openRef.current) return;

            instance.moveTo(index);
            navigationTimerRef.current = window.setTimeout(
              () => instance.isActive() && instance.refresh(),
              260,
            );
          }, 80);
          return;
        }

        attempts += 1;
        navigationTimerRef.current = window.setTimeout(showWhenReady, TARGET_WAIT_INTERVAL);
      };

      navigationTimerRef.current = window.setTimeout(showWhenReady, TARGET_WAIT_INTERVAL);
    }

    const tour = driver({
      animate: true,
      duration: 220,
      smoothScroll: false,
      allowClose: false,
      allowScroll: false,
      overlayColor: "#0f172a",
      overlayOpacity: 0.58,
      overlayClickBehavior: () => undefined,
      stagePadding: compactViewport ? 6 : 10,
      stageRadius: compactViewport ? 12 : 18,
      disableActiveInteraction: true,
      popoverClass: "indoor-driver-popover",
      popoverOffset: compactViewport ? 10 : 18,
      showButtons: ["previous", "next"],
      showProgress: true,
      progressText: "{{current}} de {{total}}",
      nextBtnText: "Próximo",
      prevBtnText: "Voltar",
      doneBtnText: "Concluir",
      onNextClick: (_element, _step, { driver: instance }) => {
        const index = instance.getActiveIndex() ?? 0;
        if (index >= steps.length - 1) closeTour(instance);
        else moveToStep(instance, index + 1);
      },
      onPrevClick: (_element, _step, { driver: instance }) => {
        const index = instance.getActiveIndex() ?? 0;
        if (index > 0) moveToStep(instance, index - 1);
      },
      onCloseClick: (_element, _step, { driver: instance }) => closeTour(instance),
      onDoneClick: (_element, _step, { driver: instance }) => closeTour(instance),
      onDestroyStarted: (_element, _step, { driver: instance }) => closeTour(instance),
      onHighlighted: (_element, _step, options) => {
        const index = options.index ?? options.driver.getActiveIndex() ?? 0;
        const currentStep = steps[index];
        onTargetChange(currentStep.menuTarget ?? null);
        onStepChange?.(currentStep.id);
      },
      onPopoverRender: (popover, { driver: instance, index }) => {
        const currentIndex = index ?? instance.getActiveIndex() ?? 0;
        const currentStep = steps[currentIndex];

        popover.closeButton.setAttribute("aria-label", "Fechar apresentação");
        popover.closeButton.setAttribute("title", "Fechar apresentação");

        popover.title.replaceChildren();
        const eyebrow = document.createElement("span");
        eyebrow.className = "indoor-driver-eyebrow";
        eyebrow.textContent = currentStep.eyebrow;
        const title = document.createElement("span");
        title.className = "indoor-driver-title";
        title.textContent = currentStep.title;
        popover.title.append(eyebrow, title);

        popover.progress.style.display = "none";
        popover.wrapper.querySelector(".indoor-driver-progress")?.remove();
        const progress = document.createElement("div");
        progress.className = "indoor-driver-progress";
        progress.innerHTML = `
          <div class="indoor-driver-progress-label">
            <span>Etapa ${currentIndex + 1} de ${steps.length}</span>
            <span>${Math.round(((currentIndex + 1) / steps.length) * 100)}%</span>
          </div>
          <div class="indoor-driver-progress-track">
            <span style="width: ${((currentIndex + 1) / steps.length) * 100}%"></span>
          </div>
        `;
        popover.footer.before(progress);

        if (!popover.footer.querySelector(".indoor-driver-skip-btn")) {
          const skipButton = document.createElement("button");
          skipButton.type = "button";
          skipButton.className = "indoor-driver-skip-btn";
          skipButton.textContent = "Pular apresentação";
          skipButton.addEventListener("click", () => closeTour(instance));
          popover.footer.prepend(skipButton);
        }
      },
      steps: steps.map((step) => ({
        ...(step.target ? { element: targetSelector(step.target), waitForElement: 4000 } : {}),
        popover: {
          title: step.title,
          description: step.description,
          side: compactViewport || step.id === "welcome" ? "bottom" : "right",
          align: "start",
        },
      })),
    });

    driverRef.current = tour;
    const refreshForViewport = () => {
      if (!tour.isActive()) return;

      const compact = isCompactViewport();
      tour.setConfig({
        ...tour.getConfig(),
        stagePadding: compact ? 6 : 10,
        stageRadius: compact ? 12 : 18,
        popoverOffset: compact ? 10 : 18,
      });
      tour.refresh();
    };

    window.addEventListener("resize", refreshForViewport);
    window.visualViewport?.addEventListener("resize", refreshForViewport);
    tour.drive(0);

    return () => {
      disposed = true;
      window.removeEventListener("resize", refreshForViewport);
      window.visualViewport?.removeEventListener("resize", refreshForViewport);
      if (navigationTimerRef.current) window.clearTimeout(navigationTimerRef.current);
      dismissOpenTourModal();
      stopDriver(tour);
      if (driverRef.current === tour) driverRef.current = null;
    };
  }, [onOpenChange, onStepChange, onTargetChange, open, userId, userRole]);

  return null;
}
