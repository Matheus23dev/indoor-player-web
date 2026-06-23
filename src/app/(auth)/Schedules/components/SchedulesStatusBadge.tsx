type Props = {
  startDate: string;
  endDate: string;
};

export function ScheduleStatusBadge({ startDate, endDate }: Props) {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  let status = "PENDING";
  let classes = "bg-yellow-100 text-yellow-700";

  if (now > end) {
    status = "FINISHED";
    classes = "bg-red-100 text-red-700";
  } else if (now >= start) {
    status = "ACTIVE";
    classes = "bg-green-100 text-green-700";
  }

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${classes}`}>
      {status}
    </span>
  );
}