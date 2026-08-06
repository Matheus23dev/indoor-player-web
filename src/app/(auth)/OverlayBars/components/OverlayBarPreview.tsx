import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { ImageIcon } from "lucide-react";

import { resolveMediaUrl } from "../../../../lib/mediaUrl";
import type { Media } from "../../Medias/types";
import type { OverlayBar, OverlayBarContentItem } from "../types";

const REFERENCE_PLAYER_WIDTH = 960;
const REFERENCE_PLAYER_HEIGHT = 540;
const FALLBACK_PREVIEW_SCALE = 1 / 3;
const REFERENCE_TV_SAFE_INSET = 16;
const REFERENCE_TV_LATERAL_SAFE_INSET = 12;
const MAX_BLOCK_CROSS_PADDING_SHARE = 0.15;

export type OverlayBarPreviewData = Pick<
  OverlayBar,
  | "position"
  | "sizePercent"
  | "backgroundColor"
  | "opacity"
  | "fit"
  | "media"
  | "contentPosition"
  | "contentAlignment"
  | "imageSizePercent"
  | "contentPadding"
  | "contentGap"
  | "contentItems"
  | "textContent"
  | "textColor"
  | "fontSize"
  | "widgetType"
  | "weatherLocation"
>;

interface OverlayBarPreviewProps {
  bar: OverlayBarPreviewData;
  images?: Media[];
  className?: string;
  showEmptyState?: boolean;
}

interface OverlayBarsPreviewProps {
  bars: OverlayBarPreviewData[];
  images?: Media[];
  className?: string;
  showEmptyState?: boolean;
}

export interface OverlayBarInsets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export function OverlayBarPreview({
  bar,
  images = [],
  className = "",
  showEmptyState = false,
}: OverlayBarPreviewProps) {
  return (
    <OverlayBarsPreview
      bars={[bar]}
      images={images}
      className={className}
      showEmptyState={showEmptyState}
    />
  );
}

export function OverlayBarsPreview({
  bars,
  images = [],
  className = "",
  showEmptyState = false,
}: OverlayBarsPreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null);
  const previewScale = usePreviewScale(previewRef);
  const barInsets = getOverlayBarInsets(bars);
  const mediaInsets = getMediaFrameInsets(bars);

  return (
    <div
      ref={previewRef}
      className={`relative aspect-video overflow-hidden rounded-xl bg-slate-950 ${className}`}
      aria-label="Prévia das barras no player"
    >
      <div
        data-testid="overlay-bars-preview-media"
        className="absolute overflow-hidden bg-slate-950"
        style={getMediaFrameStyle(mediaInsets)}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#334155_0,_#0f172a_66%)]" />
        <div className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          Conteúdo da playlist
        </div>
      </div>

      {bars.map((bar, index) => (
        <PreviewBar
          key={`${bar.position}-${index}`}
          bar={bar}
          images={images}
          insets={barInsets}
          previewScale={previewScale}
          showEmptyState={showEmptyState}
        />
      ))}
    </div>
  );
}

interface PreviewBarProps {
  bar: OverlayBarPreviewData;
  images: Media[];
  insets: OverlayBarInsets;
  previewScale: number;
  showEmptyState: boolean;
}

function PreviewBar({ bar, images, insets, previewScale, showEmptyState }: PreviewBarProps) {
  const isHorizontal = bar.position === "TOP" || bar.position === "BOTTOM";
  const imageUrl = bar.media?.fileUrl ? resolveMediaUrl(bar.media.fileUrl) : "";
  const dynamicText = resolvePreviewText(bar.textContent ?? "", bar.weatherLocation);
  const widgetText = getWidgetPreview(bar.widgetType, bar.weatherLocation);
  const contentItems = bar.contentItems ?? [];
  const barStyle: CSSProperties = {
    ...getOverlayBarStyle(bar, insets),
    boxSizing: "border-box",
    overflow: "hidden",
    backgroundColor: toRgba(bar.backgroundColor, bar.opacity),
  };
  const contentStyle: CSSProperties = {
    width: "100%",
    height: "100%",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: isHorizontal ? "row" : "column",
    alignItems: toAlignItems(bar.contentAlignment),
    justifyContent: toJustifyContent(bar.contentPosition),
    gap: `${scalePreviewValue(bar.contentGap, previewScale)}px`,
    ...(isHorizontal
      ? {
          paddingLeft: `${scalePreviewValue(bar.contentPadding, previewScale)}px`,
          paddingRight: `${scalePreviewValue(bar.contentPadding, previewScale)}px`,
        }
      : {
          paddingTop: `${scalePreviewValue(bar.contentPadding, previewScale)}px`,
          paddingBottom: `${scalePreviewValue(bar.contentPadding, previewScale)}px`,
        }),
    ...getTvSafeContentStyle(bar.position, previewScale),
  };

  return (
    <div data-testid="overlay-bar-preview-bar" style={barStyle} className="z-10">
      <div data-testid="overlay-bar-preview-content" style={contentStyle}>
        {imageUrl && (
          <img
            src={imageUrl}
            alt={bar.media?.name ?? "Imagem da barra"}
            style={{
              objectFit: fitToObjectFit(bar.fit),
              flex: "0 0 auto",
              aspectRatio: getPreviewImageAspectRatio(bar.fit),
              ...(isHorizontal
                ? {
                    height: `${bar.imageSizePercent}%`,
                    maxWidth: "100%",
                  }
                : {
                    width: `${bar.imageSizePercent}%`,
                    maxHeight: "100%",
                  }),
            }}
          />
        )}

        {!imageUrl &&
          contentItems.length === 0 &&
          !dynamicText &&
          !widgetText &&
          showEmptyState && (
            <div className="flex items-center justify-center text-white/60">
              <ImageIcon size={isHorizontal ? 16 : 13} />
            </div>
          )}

        {contentItems.map((item) => (
          <PreviewContentItem
            key={item.id}
            item={item}
            bar={bar}
            images={images}
            isHorizontal={isHorizontal}
            previewScale={previewScale}
          />
        ))}

        {contentItems.length === 0 && (dynamicText || widgetText) && (
          <span
            className="min-w-0 overflow-hidden font-bold leading-tight"
            style={{
              color: bar.textColor,
              fontSize: `${scalePreviewValue(bar.fontSize, previewScale)}px`,
              lineHeight: 1.2,
              writingMode: "horizontal-tb",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: isHorizontal ? 2 : 6,
              whiteSpace: "normal",
              overflowWrap: "anywhere",
              textAlign: "center",
              flexShrink: 1,
              maxWidth: "100%",
              maxHeight: "100%",
            }}
          >
            {[dynamicText, widgetText].filter(Boolean).join(" · ")}
          </span>
        )}
      </div>
    </div>
  );
}

interface PreviewContentItemProps {
  item: OverlayBarContentItem;
  bar: OverlayBarPreviewData;
  images: Media[];
  isHorizontal: boolean;
  previewScale: number;
}

function PreviewContentItem({
  item,
  bar,
  images,
  isHorizontal,
  previewScale,
}: PreviewContentItemProps) {
  if (item.type === "SPACER") {
    return (
      <span
        aria-hidden="true"
        style={
          isHorizontal
            ? {
                flex: `0 0 ${scalePreviewValue(item.spacerSize, previewScale)}px`,
                height: 1,
              }
            : {
                flex: `0 0 ${scalePreviewValue(item.spacerSize, previewScale)}px`,
                width: 1,
              }
        }
      />
    );
  }

  const transform = `translate(${scaleSignedPreviewValue(item.offsetX ?? 0, previewScale)}px, ${scaleSignedPreviewValue(item.offsetY ?? 0, previewScale)}px)`;

  if (item.type === "IMAGE") {
    const media = images.find((image) => image.id === item.mediaId);

    if (!media) {
      return null;
    }

    return (
      <img
        src={resolveMediaUrl(media.fileUrl)}
        alt={media.name}
        data-testid="overlay-bar-preview-content-image"
        style={{
          objectFit: fitToObjectFit(item.fit ?? "CONTAIN"),
          flex: "0 0 auto",
          aspectRatio: getPreviewImageAspectRatio(item.fit ?? "CONTAIN"),
          transform,
          ...(isHorizontal
            ? {
                height: `${item.imageSizePercent ?? 80}%`,
                maxWidth: "100%",
              }
            : {
                width: `${item.imageSizePercent ?? 80}%`,
                maxHeight: "100%",
              }),
        }}
      />
    );
  }

  const blockPadding = getTextBlockPadding(
    bar.position,
    bar.sizePercent,
    item.paddingHorizontal ?? item.padding,
    item.paddingVertical ?? 0,
    previewScale,
  );

  return (
    <span
      className="min-w-0 overflow-hidden leading-tight"
      style={{
        boxSizing: "border-box",
        color: item.textColor,
        fontSize: `${scalePreviewValue(item.fontSize, previewScale)}px`,
        lineHeight: 1.2,
        fontWeight: toFontWeight(item.fontWeight),
        fontFamily: toFontFamily(item.fontFamily),
        fontStyle: item.italic ? "italic" : "normal",
        backgroundColor: item.backgroundColor,
        paddingLeft: `${blockPadding.paddingHorizontal}px`,
        paddingRight: `${blockPadding.paddingHorizontal}px`,
        paddingTop: `${blockPadding.paddingVertical}px`,
        paddingBottom: `${blockPadding.paddingVertical}px`,
        borderRadius: `${scalePreviewValue(item.borderRadius, previewScale)}px`,
        transform,
        writingMode: "horizontal-tb",
        display: "-webkit-box",
        WebkitBoxOrient: "vertical",
        WebkitLineClamp: isHorizontal ? 2 : 6,
        whiteSpace: "normal",
        overflowWrap: "anywhere",
        textAlign: "center",
        flexShrink: 1,
        maxWidth: "100%",
        maxHeight: "100%",
      }}
    >
      {resolveContentItemPreview(item, bar.weatherLocation)}
    </span>
  );
}

function getOverlayBarInsets(bars: OverlayBarPreviewData[]): OverlayBarInsets {
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

function getMediaFrameInsets(bars: OverlayBarPreviewData[]): OverlayBarInsets {
  if (bars.length !== 2) {
    return createEmptyInsets();
  }

  const horizontalBar = bars.find(isHorizontalBar);
  const verticalBar = bars.find((bar) => !isHorizontalBar(bar));

  if (
    !horizontalBar ||
    !verticalBar ||
    Math.abs(horizontalBar.sizePercent - verticalBar.sizePercent) > 0.01
  ) {
    return createEmptyInsets();
  }

  return getOverlayBarInsets(bars);
}

function getMediaFrameStyle(insets: OverlayBarInsets): CSSProperties {
  return {
    top: `${insets.top}%`,
    right: `${insets.right}%`,
    bottom: `${insets.bottom}%`,
    left: `${insets.left}%`,
  };
}

function getOverlayBarStyle(bar: OverlayBarPreviewData, insets: OverlayBarInsets): CSSProperties {
  if (bar.position === "TOP" || bar.position === "BOTTOM") {
    return {
      position: "absolute",
      left: 0,
      width: "100%",
      height: `${bar.sizePercent}%`,
      [bar.position === "TOP" ? "top" : "bottom"]: 0,
    };
  }

  return {
    position: "absolute",
    top: `${insets.top}%`,
    bottom: `${insets.bottom}%`,
    width: `${bar.sizePercent}%`,
    [bar.position === "LEFT" ? "left" : "right"]: 0,
  };
}

function getTvSafeContentStyle(
  position: OverlayBar["position"],
  previewScale: number,
): CSSProperties {
  const safeInset = `${scalePreviewValue(REFERENCE_TV_SAFE_INSET, previewScale)}px`;

  if (position === "TOP") return { paddingTop: safeInset };
  if (position === "BOTTOM") return { paddingBottom: safeInset };

  const lateralSafeInset = `${scalePreviewValue(
    REFERENCE_TV_LATERAL_SAFE_INSET,
    previewScale,
  )}px`;

  return {
    paddingLeft: lateralSafeInset,
    paddingRight: lateralSafeInset,
  };
}

function getTextBlockPadding(
  position: OverlayBar["position"],
  sizePercent: number,
  paddingHorizontal: number,
  paddingVertical: number,
  previewScale: number,
) {
  const isHorizontal = position === "TOP" || position === "BOTTOM";
  const referenceThickness =
    (isHorizontal ? REFERENCE_PLAYER_HEIGHT : REFERENCE_PLAYER_WIDTH) *
    (Math.min(40, Math.max(0, sizePercent)) / 100);
  const maximumCrossAxisPadding = Math.max(
    0,
    (referenceThickness - REFERENCE_TV_SAFE_INSET) * MAX_BLOCK_CROSS_PADDING_SHARE,
  );
  const safeHorizontal = Math.max(0, paddingHorizontal);
  const safeVertical = Math.max(0, paddingVertical);

  return {
    paddingHorizontal: scalePreviewValue(
      isHorizontal ? safeHorizontal : Math.min(safeHorizontal, maximumCrossAxisPadding),
      previewScale,
    ),
    paddingVertical: scalePreviewValue(
      isHorizontal ? Math.min(safeVertical, maximumCrossAxisPadding) : safeVertical,
      previewScale,
    ),
  };
}

function usePreviewScale(ref: React.RefObject<HTMLDivElement | null>) {
  const [previewScale, setPreviewScale] = useState(FALLBACK_PREVIEW_SCALE);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    const updateScale = () => {
      const width = element.getBoundingClientRect().width;
      if (width > 0) {
        setPreviewScale(width / REFERENCE_PLAYER_WIDTH);
      }
    };

    updateScale();

    if (typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(updateScale);
    observer.observe(element);

    return () => observer.disconnect();
  }, [ref]);

  return previewScale;
}

function toFontFamily(family: OverlayBarContentItem["fontFamily"]): CSSProperties["fontFamily"] {
  if (family === "SANS_SERIF") return "Arial, sans-serif";
  if (family === "SANS_SERIF_CONDENSED") return "'Arial Narrow', sans-serif";
  if (family === "SERIF") return "Georgia, serif";
  if (family === "MONOSPACE") return "monospace";
  return "inherit";
}

function resolveContentItemPreview(item: OverlayBarContentItem, weatherLocation?: string | null) {
  if (item.type === "TEXT") return resolvePreviewText(item.text ?? "", weatherLocation);
  if (item.type === "CLOCK") return "09:41";
  if (item.type === "DATE") return "05/08/2026";
  if (item.type === "WEATHER") {
    return `24°C · Ensolarado${weatherLocation ? ` · ${weatherLocation}` : ""} · Dados: Open-Meteo`;
  }
  return "";
}

function toFontWeight(weight: OverlayBarContentItem["fontWeight"]): CSSProperties["fontWeight"] {
  if (weight === "NORMAL") return 400;
  if (weight === "SEMIBOLD") return 600;
  return 700;
}

function toJustifyContent(
  position: OverlayBar["contentPosition"],
): CSSProperties["justifyContent"] {
  if (position === "START") return "flex-start";
  if (position === "END") return "flex-end";
  return "center";
}

function toAlignItems(position: OverlayBar["contentAlignment"]): CSSProperties["alignItems"] {
  if (position === "START") return "flex-start";
  if (position === "END") return "flex-end";
  return "center";
}

function getWidgetPreview(widgetType: OverlayBar["widgetType"], weatherLocation?: string | null) {
  if (widgetType === "CLOCK") return "09:41";
  if (widgetType === "DATE") return "05/08/2026";
  if (widgetType === "WEATHER") {
    return `24°C · Ensolarado${weatherLocation ? ` · ${weatherLocation}` : ""} · Dados: Open-Meteo`;
  }
  return "";
}

function resolvePreviewText(template: string, weatherLocation?: string | null) {
  return template
    .replace(/{{hora}}/g, "09:41")
    .replace(/{{data}}/g, "05/08/2026")
    .replace(/{{dia_semana}}/g, "quarta-feira")
    .replace(/{{temperatura}}/g, "24°C")
    .replace(/{{clima}}/g, "Ensolarado")
    .replace(/{{cidade}}/g, weatherLocation || "sua cidade");
}

function fitToObjectFit(fit: OverlayBar["fit"]): CSSProperties["objectFit"] {
  if (fit === "COVER") return "cover";
  if (fit === "FILL") return "fill";
  return "contain";
}

function getPreviewImageAspectRatio(fit: OverlayBar["fit"]) {
  return fit === "CONTAIN" ? "auto" : "1 / 1";
}

function scalePreviewValue(value: number, previewScale: number) {
  return Math.round(Math.max(0, value * previewScale) * 1000) / 1000;
}

function scaleSignedPreviewValue(value: number, previewScale: number) {
  return Math.round(value * previewScale * 1000) / 1000;
}

function toRgba(hex: string, opacity: number) {
  const normalized = hex.replace("#", "");
  const safeHex = /^[0-9a-fA-F]{6}$/.test(normalized) ? normalized : "000000";
  const red = Number.parseInt(safeHex.slice(0, 2), 16);
  const green = Number.parseInt(safeHex.slice(2, 4), 16);
  const blue = Number.parseInt(safeHex.slice(4, 6), 16);
  const alpha = Math.min(100, Math.max(0, opacity)) / 100;

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function isHorizontalBar(bar: Pick<OverlayBarPreviewData, "position">) {
  return bar.position === "TOP" || bar.position === "BOTTOM";
}

function createEmptyInsets(): OverlayBarInsets {
  return { top: 0, right: 0, bottom: 0, left: 0 };
}
