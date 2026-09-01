import type { Meta, StoryObj } from "@storybook/react-vite";

import { sampleBottomBar, sampleDevicePreview, sampleLeftBar } from "@/stories/fixtures";

import { DevicePreview } from "./DevicePreview";

const meta = {
  title: "Módulos/Dispositivos/Prévia ao vivo",
  component: DevicePreview,
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-2xl">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Representa o conteúdo informado pelo player, incluindo playlist, progresso, áudio, conexão e barras fixas. A prévia é informativa e não substitui a validação na TV.",
      },
    },
  },
  args: {
    preview: sampleDevicePreview,
    status: "ONLINE",
  },
} satisfies Meta<typeof DevicePreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ImagemAoVivo: Story = {};

export const ComDuasBarras: Story = {
  args: {
    preview: {
      ...sampleDevicePreview,
      playlist: {
        ...sampleDevicePreview.playlist!,
        bars: [sampleBottomBar, sampleLeftBar],
      },
    },
  },
};

export const Offline: Story = {
  args: { status: "OFFLINE" },
};

export const AguardandoConteúdo: Story = {
  args: {
    preview: {
      schedule: null,
      playlist: null,
      item: null,
      media: null,
      playback: {
        currentTime: null,
        duration: null,
        progress: null,
        muted: null,
        startedAt: null,
        updatedAt: null,
      },
    },
  },
};
