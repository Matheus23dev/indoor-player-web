import type {
  DeviceStatus,
} from "../types/device";

interface Props {
  status:
    DeviceStatus;
}

export function DeviceStatusBadge({
  status,
}: Props) {
  const isOnline =
    status === "ONLINE";

  return (
    <span
      className={
        isOnline
          ? "inline-flex shrink-0 items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700"
          : "inline-flex shrink-0 items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700"
      }
    >
      <span className="relative flex h-2.5 w-2.5">
        {isOnline && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
        )}

        <span
          className={
            isOnline
              ? "relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"
              : "relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500"
          }
        />
      </span>

      {isOnline
        ? "Online"
        : "Offline"}
    </span>
  );
}