import { beforeEach, describe, expect, it, vi } from "vitest";

const { patch } = vi.hoisted(() => ({ patch: vi.fn() }));

vi.mock("../../../../services/axios", () => ({
  default: { patch },
}));

import { updatePlaylistItem } from "./Playlists.services";

describe("updatePlaylistItem", () => {
  beforeEach(() => {
    patch.mockResolvedValue({ data: { id: "item-1", muted: true } });
  });

  it.each([true, false])("envia muted=%s sem alterar o valor", async (muted) => {
    await updatePlaylistItem("item-1", { muted });

    expect(patch).toHaveBeenCalledWith("/playlists/items/item-1", { muted });
  });
});
