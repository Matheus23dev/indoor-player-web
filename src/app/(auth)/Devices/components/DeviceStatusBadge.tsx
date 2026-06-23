type Props = {
  status: "ONLINE" | "OFFLINE";
};

export function DeviceStatusBadge({
  status,
}: Props) {
  const isOnline =
    status === "ONLINE";

  return (
    <span
      className={`
        inline-flex
        items-center
        gap-2
        px-3
        py-1
        rounded-full
        text-xs
        font-semibold
        ${
          isOnline
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }
      `}
    >
      <span
        className={`
          w-2
          h-2
          rounded-full
          ${
            isOnline
              ? "bg-green-500"
              : "bg-red-500"
          }
        `}
      />

      {isOnline
        ? "Online"
        : "Offline"}
    </span>
  );
}