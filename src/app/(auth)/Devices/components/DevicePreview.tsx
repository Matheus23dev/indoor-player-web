import { useEffect, useMemo, useRef, useState } from "react";

import { ImageOff, Play, Radio, Volume2, VolumeX, WifiOff } from "lucide-react";

import { OverlayBarsPreview } from "../../OverlayBars/components/OverlayBarPreview";
import { resolveMediaUrl } from "../services/devices.services";

import type { DevicePreview as DevicePreviewData, DeviceStatus } from "../types/device";

interface Props {
  preview: DevicePreviewData;

  status: DeviceStatus;
}

export function DevicePreview({ preview, status }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const media = preview.media;

  const mediaUrl = media ? resolveMediaUrl(media.fileUrl) : null;

  const bars = useMemo(() => preview.playlist?.bars ?? [], [preview.playlist?.bars]);

  const contentImages = useMemo(
    () =>
      Array.from(
        new Map(
          bars.flatMap((bar) =>
            (bar.contentItems ?? []).flatMap((item) =>
              item.media ? [[item.media.id, item.media] as const] : [],
            ),
          ),
        ).values(),
      ),
    [bars],
  );

  const [liveCurrentTime, setLiveCurrentTime] = useState(preview.playback.currentTime);

  const hasLiveCurrentTime = liveCurrentTime !== null;

  useEffect(() => {
    setLiveCurrentTime(preview.playback.currentTime);
  }, [media?.id, preview.playback.currentTime]);

  useEffect(() => {
    if (status !== "ONLINE" || !hasLiveCurrentTime || preview.playback.duration === null) {
      return;
    }

    const interval = window.setInterval(() => {
      setLiveCurrentTime((currentTime) => {
        if (currentTime === null || preview.playback.duration === null) {
          return currentTime;
        }

        return Math.min(currentTime + 1, preview.playback.duration);
      });
    }, 1_000);

    return () => {
      window.clearInterval(interval);
    };
  }, [hasLiveCurrentTime, preview.playback.duration, status]);

  useEffect(() => {
    const videoElement = videoRef.current;

    const currentTime = preview.playback.currentTime;

    if (videoElement === null || currentTime === null) {
      return;
    }

    const applyTime = (element: HTMLVideoElement) => {
      if (!Number.isFinite(element.duration) || element.duration <= 0) {
        return;
      }

      element.currentTime = Math.min(currentTime, Math.max(0, element.duration - 0.15));
    };

    const handleLoadedMetadata = () => {
      applyTime(videoElement);
    };

    if (videoElement.readyState >= 1) {
      applyTime(videoElement);
    } else {
      videoElement.addEventListener("loadedmetadata", handleLoadedMetadata, {
        once: true,
      });
    }

    return () => {
      videoElement.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [media?.id, preview.playback.currentTime]);
  const progress =
    liveCurrentTime !== null && preview.playback.duration !== null && preview.playback.duration > 0
      ? (liveCurrentTime / preview.playback.duration) * 100
      : (preview.playback.progress ?? 0);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-950">
      <div className="relative overflow-hidden bg-black">
        <OverlayBarsPreview
          bars={bars}
          images={contentImages}
          className="rounded-none"
          mediaContent={
            media && mediaUrl ? (
              media.type === "IMAGE" ? (
                <img src={mediaUrl} alt={media.name} className="h-full w-full object-contain" />
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
                <ImageOff size={30} className="text-slate-500" />

                <p className="mt-3 text-sm font-bold text-slate-300">Nenhuma mídia em reprodução</p>

                <p className="mt-1 text-xs text-slate-500">
                  O conteúdo aparecerá quando o player iniciar uma playlist.
                </p>
              </div>
            )
          }
        />

        <div className="absolute left-2.5 top-2.5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-black/65 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur">
            {status === "ONLINE" ? (
              <>
                <Radio size={13} className="text-emerald-400" />
                Ao vivo
              </>
            ) : (
              <>
                <WifiOff size={13} className="text-red-400" />
                Offline
              </>
            )}
          </span>
        </div>

        {media?.type === "VIDEO" && preview.playback.muted !== null && (
          <span
            className={`absolute right-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-full bg-black/65 px-2.5 py-1 text-[10px] font-bold backdrop-blur ${
              preview.playback.muted ? "text-red-300" : "text-emerald-300"
            }`}
          >
            {preview.playback.muted ? <VolumeX size={12} /> : <Volume2 size={12} />}
            {preview.playback.muted ? "Sem áudio" : "Com áudio"}
          </span>
        )}

        {media?.type === "VIDEO" && (
          <div className="absolute bottom-2.5 right-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/65 text-white backdrop-blur">
            <Play size={14} />
          </div>
        )}

        {status === "OFFLINE" && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/55 backdrop-blur-[1px]">
            <div className="rounded-xl border border-white/10 bg-black/55 px-4 py-2 text-sm font-bold text-white">
              Player sem comunicação
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2 border-t border-white/10 bg-slate-900 px-3 py-2.5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-white">
              {media?.name ?? "Aguardando conteúdo"}
            </p>

            <p className="mt-0.5 truncate text-[11px] text-slate-400">
              {preview.playlist?.name ?? "Sem playlist ativa"}
            </p>
          </div>

          {preview.schedule && (
            <span className="shrink-0 rounded-lg bg-white/5 px-2 py-1 text-[10px] font-bold text-slate-300">
              {preview.schedule.startTime}
              {" – "}
              {preview.schedule.endTime}
            </span>
          )}
        </div>

        {preview.playback.duration !== null && (
          <div className="flex items-center gap-2 text-[10px] font-medium text-slate-500">
            <span className="w-8 shrink-0">{formatSeconds(liveCurrentTime)}</span>

            <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-blue-500 transition-[width] duration-500"
                style={{
                  width: `${Math.min(100, Math.max(0, progress))}%`,
                }}
              />
            </div>

            <span className="w-8 shrink-0 text-right">
              {formatSeconds(preview.playback.duration)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function formatSeconds(value: number | null) {
  if (value === null || !Number.isFinite(value)) {
    return "00:00";
  }

  const seconds = Math.max(0, Math.floor(value));

  const minutes = Math.floor(seconds / 60);

  const remaining = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`;
}
