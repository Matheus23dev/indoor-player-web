import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import CreatePlaylistModal from "./CreatePlaylistModal";

const { fire } = vi.hoisted(() => ({
  fire: vi.fn().mockResolvedValue({}),
}));

vi.mock("sweetalert2", () => ({
  default: {
    fire,
  },
}));

describe("CreatePlaylistModal", () => {
  beforeEach(() => {
    fire.mockClear();
  });

  it("envia a orientação vertical ao criar a playlist", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn().mockResolvedValue({});
    const onClose = vi.fn();

    render(<CreatePlaylistModal open saving={false} onClose={onClose} onCreate={onCreate} />);

    await user.type(screen.getByLabelText("Nome da playlist"), "Totem recepção");
    await user.click(screen.getByRole("button", { name: /vertical/i }));
    await user.click(screen.getByRole("button", { name: "Criar playlist" }));

    expect(onCreate).toHaveBeenCalledWith("Totem recepção", "PORTRAIT");
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
