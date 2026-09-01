import type { Meta, StoryObj } from "@storybook/react-vite";

import { sampleBottomBar, sampleImage, sampleLeftBar } from "@/stories/fixtures";

import { OverlayBarPreview, OverlayBarsPreview } from "./OverlayBarPreview";

const meta = {
  title: "Módulos/Barras fixas/Prévia",
  component: OverlayBarPreview,
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-3xl">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Simula a composição exibida pelo player com proporção de TV. Conteúdos mantêm orientação legível em barras horizontais e laterais.",
      },
    },
  },
  args: {
    bar: sampleBottomBar,
    images: [sampleImage],
    orientation: "LANDSCAPE",
    showEmptyState: true,
  },
  argTypes: {
    orientation: { control: "inline-radio", options: ["LANDSCAPE", "PORTRAIT"] },
  },
} satisfies Meta<typeof OverlayBarPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const RodapéHorizontal: Story = {};

export const LateralHorizontal: Story = {
  args: { bar: sampleLeftBar },
};

export const DuasBarrasProporcionais: Story = {
  render: () => (
    <OverlayBarsPreview
      bars={[sampleBottomBar, sampleLeftBar]}
      images={[sampleImage]}
      orientation="LANDSCAPE"
      showEmptyState
    />
  ),
};

export const PlaylistVertical: Story = {
  args: {
    bar: sampleBottomBar,
    orientation: "PORTRAIT",
  },
  decorators: [
    (Story) => (
      <div className="mx-auto h-[640px] max-h-[75vh] w-auto">
        <Story />
      </div>
    ),
  ],
};
