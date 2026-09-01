import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { sampleBottomBar, sampleImage, sampleLeftBar } from "@/stories/fixtures";

import { OverlayBarCard } from "./OverlayBarCard";

const meta = {
  title: "Módulos/Barras fixas/Cartão reutilizável",
  component: OverlayBarCard,
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-md">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Representa uma barra reutilizável e informa posição, espessura, cor, quantidade de imagens e playlists vinculadas.",
      },
    },
  },
  args: {
    bar: sampleBottomBar,
    images: [sampleImage],
    disabled: false,
    onEdit: fn(),
    onDelete: fn(),
  },
} satisfies Meta<typeof OverlayBarCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Rodapé: Story = {};

export const LateralComImagem: Story = {
  args: { bar: sampleLeftBar },
};

export const Desabilitado: Story = {
  args: { disabled: true },
};
