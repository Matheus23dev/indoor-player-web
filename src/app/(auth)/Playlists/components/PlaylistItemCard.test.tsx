import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { PlaylistItem } from "../types";
import PlaylistItemCard from "./PlaylistItemCard";

vi.mock("@dnd-kit/sortable", () => ({
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
    transition: undefined,
    isDragging: false,
  }),
}));

afterEach(cleanup);

describe("PlaylistItemCard", () => {
  it("mantém bloqueado em sem áudio quando o vídeo não possui faixa de áudio", () => {
    const item: PlaylistItem = {
      id: "item-1",
      playlistId: "playlist-1",
      mediaId: "media-1",
      order: 1,
      duration: 20,
      muted: false,
      createdAt: "2026-08-18T10:00:00.000Z",
      media: {
        id: "media-1",
        name: "Vídeo silencioso.mp4",
        type: "VIDEO",
        fileUrl: "/files/video-silencioso.mp4",
        duration: 20,
        hasAudio: false,
        createdAt: "2026-08-18T10:00:00.000Z",
        updatedAt: "2026-08-18T10:00:00.000Z",
      },
    };

    const { container } = render(
      <PlaylistItemCard
        item={item}
        index={0}
        saving={false}
        selected={false}
        dirty={false}
        onSelectedChange={vi.fn()}
        onChange={vi.fn()}
        onDuplicate={vi.fn()}
      />,
    );

    const audioButton = screen.getByRole("button", {
      name: "Sem áudio: o vídeo não possui faixa de áudio",
    });
    const video = container.querySelector("video");

    expect(audioButton).toBeDisabled();
    expect(audioButton).toHaveAttribute("aria-pressed", "true");
    expect(audioButton).toHaveTextContent("Sem áudio");
    expect(video).toHaveProperty("muted", true);
    expect(screen.queryByLabelText("Duração em segundos")).not.toBeInTheDocument();
    expect(screen.getByText("Duração do vídeo")).toBeInTheDocument();
    expect(screen.getByText("00:20")).toBeInTheDocument();
  });

  it("mantém a edição da imagem como alteração pendente", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const item: PlaylistItem = {
      id: "item-2",
      playlistId: "playlist-1",
      mediaId: "media-2",
      order: 2,
      duration: 8,
      createdAt: "2026-08-18T10:00:00.000Z",
      media: {
        id: "media-2",
        name: "Campanha.png",
        type: "IMAGE",
        fileUrl: "/files/campanha.png",
        duration: null,
        createdAt: "2026-08-18T10:00:00.000Z",
        updatedAt: "2026-08-18T10:00:00.000Z",
      },
    };

    render(
      <PlaylistItemCard
        item={item}
        index={1}
        saving={false}
        selected={false}
        dirty
        onSelectedChange={vi.fn()}
        onChange={onChange}
        onDuplicate={vi.fn()}
      />,
    );

    expect(screen.getByLabelText("Duração em segundos")).toBeEnabled();
    expect(screen.getByRole("button", { name: "Diminuir um segundo" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Aumentar um segundo" })).toBeEnabled();
    expect(screen.getByTestId("playlist-item-drag-rail")).toContainElement(
      screen.getByRole("button", { name: "Arrastar Campanha.png para alterar a posição" }),
    );
    expect(screen.getByText("Alteração pendente")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Aumentar um segundo" }));

    expect(onChange).toHaveBeenCalledWith(item.id, { duration: 9 });
  });

  it("solicita a duplicação da mídia selecionada", async () => {
    const user = userEvent.setup();
    const onDuplicate = vi.fn().mockResolvedValue(undefined);
    const item: PlaylistItem = {
      id: "item-3",
      playlistId: "playlist-1",
      mediaId: "media-3",
      order: 3,
      duration: 5,
      createdAt: "2026-08-18T10:00:00.000Z",
      media: {
        id: "media-3",
        name: "Oferta.png",
        type: "IMAGE",
        fileUrl: "/files/oferta.png",
        duration: null,
        createdAt: "2026-08-18T10:00:00.000Z",
        updatedAt: "2026-08-18T10:00:00.000Z",
      },
    };

    render(
      <PlaylistItemCard
        item={item}
        index={2}
        saving={false}
        selected={false}
        dirty={false}
        onSelectedChange={vi.fn()}
        onChange={vi.fn()}
        onDuplicate={onDuplicate}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Duplicar Oferta.png" }));

    expect(onDuplicate).toHaveBeenCalledWith(item);
  });

  it("permite selecionar a mídia sem excluí-la imediatamente", async () => {
    const user = userEvent.setup();
    const onSelectedChange = vi.fn();
    const item: PlaylistItem = {
      id: "item-4",
      playlistId: "playlist-1",
      mediaId: "media-4",
      order: 4,
      duration: 5,
      createdAt: "2026-08-18T10:00:00.000Z",
      media: {
        id: "media-4",
        name: "Institucional.png",
        type: "IMAGE",
        fileUrl: "/files/institucional.png",
        duration: null,
        createdAt: "2026-08-18T10:00:00.000Z",
        updatedAt: "2026-08-18T10:00:00.000Z",
      },
    };

    render(
      <PlaylistItemCard
        item={item}
        index={3}
        saving={false}
        selected={false}
        dirty={false}
        onSelectedChange={onSelectedChange}
        onChange={vi.fn()}
        onDuplicate={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("checkbox", { name: "Selecionar Institucional.png" }));

    expect(onSelectedChange).toHaveBeenCalledWith(item.id, true);
    expect(screen.queryByRole("button", { name: "Remover mídia" })).not.toBeInTheDocument();
  });
});
