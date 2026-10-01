import { describe, expect, it } from "vitest";

import { getPlaylistUsageStatus } from "../utils/playlistUsageStatus";

describe("getPlaylistUsageStatus", () => {
  it("prioriza o alerta vermelho quando a playlist não possui mídias", () => {
    expect(getPlaylistUsageStatus(0, 2)).toEqual({
      label: "Playlist sem mídias",
      stripeClassName: "bg-red-500",
    });
  });

  it("usa cinza quando possui mídias, mas não possui agendamento", () => {
    expect(getPlaylistUsageStatus(3, 0)).toEqual({
      label: "Playlist sem agendamento",
      stripeClassName: "bg-slate-400",
    });
  });

  it("usa verde quando possui mídias e agendamento", () => {
    expect(getPlaylistUsageStatus(3, 1)).toEqual({
      label: "Playlist com mídias e agendamento",
      stripeClassName: "bg-emerald-500",
    });
  });
});
