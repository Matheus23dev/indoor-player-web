import { ImageIcon } from "lucide-react";

import { resolveMediaUrl } from "../../../../lib/mediaUrl";
import type { OverlayBar, OverlayBarContentItem } from "../types";

const PREVIEW_SCALE = 1 / 3;

interface OverlayBarPreviewProps {
  bar: Pick<
    OverlayBar,
    | "position"
    | "sizePercent"
    | "backgroundColor"
    | "opacity"
    | "fit"
    | "media"
    | "contentPosition"
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
  className?: string;
  showEmptyState?: boolean;
}

export function OverlayBarPreview({
  bar,
  className = "",
  showEmptyState = false,
}: OverlayBarPreviewProps) {
  const isHorizontal = bar.position === "TOP" || bar.position === "BOTTOM";
  const imageUrl = bar.media?.fileUrl ? resolveMediaUrl(bar.media.fileUrl) : "";
  const dynamicText = resolvePreviewText(bar.textContent ?? "", bar.weatherLocation);
  const widgetText = getWidgetPreview(bar.widgetType, bar.weatherLocation);
  const contentItems = bar.contentItems ?? [];

  const barStyle: React.CSSProperties = {
    position: "absolute",
    boxSizing: "border-box",
    overflow: "hidden",
    backgroundColor: toRgba(bar.backgroundColor, bar.opacity),
    ...(isHorizontal
      ? {
          left: 0,
          width: "100%",
          height: `${bar.sizePercent}%`,
          [bar.position === "TOP" ? "top" : "bottom"]: 0,
        }
      : {
          top: 0,
          height: "100%",
          width: `${bar.sizePercent}%`,
          [bar.position === "LEFT" ? "left" : "right"]: 0,
        }),
  };
  const contentStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: isHorizontal ? "row" : "column",
    alignItems: "center",
    justifyContent: toJustifyContent(bar.contentPosition),
    gap: `${scalePreviewValue(bar.contentGap)}px`,
    ...(isHorizontal
      ? {
          paddingLeft: `${scalePreviewValue(bar.contentPadding)}px`,
          paddingRight: `${scalePreviewValue(bar.contentPadding)}px`,
        }
      : {
          paddingTop: `${scalePreviewValue(bar.contentPadding)}px`,
          paddingBottom: `${scalePreviewValue(bar.contentPadding)}px`,
        }),
  };

  return (
    <div
      className={`relative aspect-video overflow-hidden rounded-xl bg-slate-950 ${className}`}
      aria-label="Prévia da barra no player"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#334155_0,_#0f172a_66%)]" />
      <div className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        Conteúdo da playlist
      </div>

      <div data-testid="overlay-bar-preview-bar" style={barStyle} className="z-10">
        <div data-testid="overlay-bar-preview-content" style={contentStyle}>
          {imageUrl && (
            <img
              src={imageUrl}
              alt={bar.media?.name ?? "Imagem da barra"}
              style={{
                objectFit: fitToObjectFit(bar.fit),
                flex: "0 0 auto",
                ...(isHorizontal
                  ? {
                      height: `${bar.imageSizePercent}%`,
                      aspectRatio: "1 / 1",
                      maxWidth: "100%",
                    }
                  : {
                      width: `${bar.imageSizePercent}%`,
                      aspectRatio: "1 / 1",
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

          {contentItems.map((item) =>
            item.type === "SPACER" ? (
              <span
                key={item.id}
                aria-hidden="true"
                style={
                  isHorizontal
                    ? { flex: `0 0 ${Math.max(0, item.spacerSize / 3)}px`, height: 1 }
                    : { flex: `0 0 ${Math.max(0, item.spacerSize / 3)}px`, width: 1 }
                }
              />
            ) : (
              <span
                key={item.id}
                className="min-w-0 overflow-hidden leading-tight"
                style={{
                  color: item.textColor,
                  fontSize: `${scalePreviewValue(item.fontSize)}px`,
                  lineHeight: 1.2,
                  fontWeight: toFontWeight(item.fontWeight),
                  fontFamily: toFontFamily(item.fontFamily),
                  fontStyle: item.italic ? "italic" : "normal",
                  backgroundColor: item.backgroundColor,
                  padding: `${scalePreviewValue(item.padding)}px`,
                  borderRadius: `${scalePreviewValue(item.borderRadius)}px`,
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
            ),
          )}

          {contentItems.length === 0 && (dynamicText || widgetText) && (
            <span
              className="min-w-0 overflow-hidden font-bold leading-tight"
              style={{
                color: bar.textColor,
                fontSize: `${scalePreviewValue(bar.fontSize)}px`,
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
    </div>
  );
}

function toFontFamily(
  family: OverlayBarContentItem["fontFamily"],
): React.CSSProperties["fontFamily"] {
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

function toFontWeight(
  weight: OverlayBarContentItem["fontWeight"],
): React.CSSProperties["fontWeight"] {
  if (weight === "NORMAL") return 400;
  if (weight === "SEMIBOLD") return 600;
  return 700;
}

function toJustifyContent(position: OverlayBar["contentPosition"]) {
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

function fitToObjectFit(fit: OverlayBar["fit"]): React.CSSProperties["objectFit"] {
  if (fit === "COVER") return "cover";
  if (fit === "FILL") return "fill";
  return "contain";
}

function scalePreviewValue(value: number) {
  return Math.max(0, value * PREVIEW_SCALE);
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
