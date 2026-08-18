import { cleanup, render, screen } from "@testing-library/react";
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
        onUpdateDuration={vi.fn()}
        onUpdateMuted={vi.fn()}
        onDelete={vi.fn()}
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
  });
});
