import {
  useEffect,
  useRef,
} from "react";

import {
  ImageOff,
  Play,
  Radio,
  WifiOff,
} from "lucide-react";

import {
  resolveMediaUrl,
} from "../services/devices.services";

import type {
  DevicePreview as DevicePreviewData,
  DeviceStatus,
} from "../types/device";

interface Props {
  preview:
    DevicePreviewData;

  status:
    DeviceStatus;
}

export function DevicePreview({
  preview,
  status,
}: Props) {
  const videoRef =
    useRef<HTMLVideoElement | null>(
      null,
    );

  const media =
    preview.media;

  const mediaUrl =
    media
      ? resolveMediaUrl(
          media.fileUrl,
        )
      : null;

useEffect(() => {
  const videoElement =
    videoRef.current;

  const currentTime =
    preview.playback.currentTime;

  if (
    videoElement === null ||
    currentTime === null
  ) {
    return;
  }

  const applyTime = (
    element: HTMLVideoElement,
  ) => {
    if (
      !Number.isFinite(
        element.duration,
      ) ||
      element.duration <= 0
    ) {
      return;
    }

    element.currentTime =
      Math.min(
        currentTime,
        Math.max(
          0,
          element.duration - 0.15,
        ),
      );
  };

  const handleLoadedMetadata =
    () => {
      applyTime(videoElement);
    };

  if (
    videoElement.readyState >= 1
  ) {
    applyTime(videoElement);
  } else {
    videoElement.addEventListener(
      "loadedmetadata",
      handleLoadedMetadata,
      {
        once: true,
      },
    );
  }

  return () => {
    videoElement.removeEventListener(
      "loadedmetadata",
      handleLoadedMetadata,
    );
  };
}, [
  media?.id,
  preview.playback.currentTime,
]);
  const progress =
    preview.playback.progress ??
    0;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-950">
      <div className="relative aspect-video overflow-hidden bg-black">
        {media &&
        mediaUrl ? (
          media.type ===
          "IMAGE" ? (
            <img
              src={mediaUrl}
              alt={media.name}
              className="h-full w-full object-contain"
            />
          ) : (
            <video
              ref={videoRef}
              src={mediaUrl}
              muted
              autoPlay
              loop
              playsInline
              preload="metadata"
              className="h-full w-full object-contain"
            />
          )
        ) : (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <ImageOff
              size={30}
              className="text-slate-500"
            />

            <p className="mt-3 text-sm font-bold text-slate-300">
              Nenhuma mídia em reprodução
            </p>

            <p className="mt-1 text-xs text-slate-500">
              O conteúdo aparecerá quando o player iniciar uma playlist.
            </p>
          </div>
        )}

        <div className="absolute left-3 top-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-black/65 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white backdrop-blur">
            {status ===
            "ONLINE" ? (
              <>
                <Radio
                  size={13}
                  className="text-emerald-400"
                />

                Ao vivo
              </>
            ) : (
              <>
                <WifiOff
                  size={13}
                  className="text-red-400"
                />

                Offline
              </>
            )}
          </span>
        </div>

        {media?.type ===
          "VIDEO" && (
          <div className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/65 text-white backdrop-blur">
            <Play size={14} />
          </div>
        )}

        {status ===
          "OFFLINE" && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/55 backdrop-blur-[1px]">
            <div className="rounded-xl border border-white/10 bg-black/55 px-4 py-2 text-sm font-bold text-white">
              Player sem comunicação
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3 border-t border-white/10 bg-slate-900 px-4 py-3">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-white">
              {media?.name ??
                "Aguardando conteúdo"}
            </p>

            <p className="mt-1 truncate text-xs text-slate-400">
              {preview.playlist
                ?.name ??
                "Sem playlist ativa"}
            </p>
          </div>

          {preview.schedule && (
            <span className="shrink-0 rounded-lg bg-white/5 px-2 py-1 text-[10px] font-bold text-slate-300">
              {
                preview.schedule
                  .startTime
              }
              {" – "}
              {
                preview.schedule
                  .endTime
              }
            </span>
          )}
        </div>

        {preview.playback
          .duration !== null && (
          <div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-blue-500 transition-[width] duration-500"
                style={{
                  width: `${Math.min(
                    100,
                    Math.max(
                      0,
                      progress,
                    ),
                  )}%`,
                }}
              />
            </div>

            <div className="mt-1.5 flex justify-between text-[10px] font-medium text-slate-500">
              <span>
                {formatSeconds(
                  preview.playback
                    .currentTime,
                )}
              </span>

              <span>
                {formatSeconds(
                  preview.playback
                    .duration,
                )}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function formatSeconds(
  value:
    number | null,
) {
  if (
    value === null ||
    !Number.isFinite(
      value,
    )
  ) {
    return "00:00";
  }

  const seconds =
    Math.max(
      0,
      Math.floor(
        value,
      ),
    );

  const minutes =
    Math.floor(
      seconds / 60,
    );

  const remaining =
    seconds % 60;

  return `${String(
    minutes,
  ).padStart(
    2,
    "0",
  )}:${String(
    remaining,
  ).padStart(
    2,
    "0",
  )}`;
}