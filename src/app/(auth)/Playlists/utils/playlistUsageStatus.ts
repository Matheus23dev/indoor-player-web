export function getPlaylistUsageStatus(itemsCount: number, schedulesCount: number) {
  if (itemsCount === 0) {
    return {
      label: "Playlist sem mídias",
      stripeClassName: "bg-red-500",
    };
  }

  if (schedulesCount === 0) {
    return {
      label: "Playlist sem agendamento",
      stripeClassName: "bg-slate-400",
    };
  }

  return {
    label: "Playlist com mídias e agendamento",
    stripeClassName: "bg-emerald-500",
  };
}
