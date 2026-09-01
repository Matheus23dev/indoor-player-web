import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { samplePlaylist } from "@/stories/fixtures";

import PlaylistCard from "./PlaylistCard";

const meta = {
  title: "Módulos/Playlists/Cartão",
  component: PlaylistCard,
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-sm">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Resume orientação, quantidade de mídias, duração e agendamentos. A ação principal abre a composição da playlist.",
      },
    },
  },
  args: {
    playlist: samplePlaylist,
    onDelete: fn(),
  },
} satisfies Meta<typeof PlaylistCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {};

export const Vertical: Story = {
  args: {
    playlist: {
      ...samplePlaylist,
      id: "playlist-portrait",
      name: "Totem vertical da entrada",
      orientation: "PORTRAIT",
      _count: { items: 6, overlayBars: 1, schedules: 1 },
    },
  },
};

export const Vazia: Story = {
  args: {
    playlist: {
      ...samplePlaylist,
      id: "playlist-empty",
      name: "Nova campanha",
      items: [],
      _count: { items: 0, overlayBars: 0, schedules: 0 },
    },
  },
};
