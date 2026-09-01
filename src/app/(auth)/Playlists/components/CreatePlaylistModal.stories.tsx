import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import CreatePlaylistModal from "./CreatePlaylistModal";

const meta = {
  title: "Módulos/Playlists/Modal de criação",
  component: CreatePlaylistModal,
  parameters: {
    docs: {
      description: {
        component:
          "Inicia uma playlist com nome e orientação. Horizontal usa proporção 16:9; vertical usa 9:16 e orienta o aplicativo da TV durante a reprodução.",
      },
    },
  },
  args: {
    open: true,
    saving: false,
    onClose: fn(),
    onCreate: fn(async () => undefined),
  },
} satisfies Meta<typeof CreatePlaylistModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrão: Story = {};

export const Salvando: Story = {
  args: { saving: true },
};
