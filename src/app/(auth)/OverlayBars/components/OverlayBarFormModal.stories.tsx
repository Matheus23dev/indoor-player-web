import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { sampleBottomBar, sampleImage } from "@/stories/fixtures";

import { OverlayBarFormModal } from "./OverlayBarFormModal";

const meta = {
  title: "Módulos/Barras fixas/Editor completo",
  component: OverlayBarFormModal,
  parameters: {
    docs: {
      description: {
        component:
          "Editor reutilizável de barras. Controla posição, espessura, alinhamento, espaçamentos, cor, opacidade e uma composição independente de textos, imagens, relógio, data, clima e espaçadores.",
      },
    },
  },
  args: {
    open: true,
    saving: false,
    images: [sampleImage],
    initialBar: null,
    onClose: fn(),
    onSave: fn(async () => undefined),
  },
} satisfies Meta<typeof OverlayBarFormModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NovaBarra: Story = {};

export const EditandoBarra: Story = {
  args: { initialBar: sampleBottomBar },
};
