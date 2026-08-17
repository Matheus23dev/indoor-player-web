import type { OverlayBar, OverlayBarFit } from "../types";

export interface OverlayBarInsets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export function getOverlayBarInsets(
  bars: Array<Pick<OverlayBar, "position" | "sizePercent">>,
): OverlayBarInsets {
  return bars.reduce<OverlayBarInsets>(
    (insets, bar) => {
      const size = Math.min(40, Math.max(0, bar.sizePercent));
      const edge = bar.position.toLowerCase() as keyof OverlayBarInsets;

      return {
        ...insets,
        [edge]: Math.max(insets[edge], size),
      };
    },
    { top: 0, right: 0, bottom: 0, left: 0 },
  );
}

export function shouldAllowLateralImageOverflow(
  position: OverlayBar["position"],
  fit: OverlayBarFit,
  sizePercent: number,
) {
  return (position === "LEFT" || position === "RIGHT") && fit === "CONTAIN" && sizePercent > 100;
}
