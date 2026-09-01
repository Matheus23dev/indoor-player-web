import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { sampleDevice } from "@/stories/fixtures";

import { DeviceCard } from "./DeviceCard";

const meta = {
  title: "Módulos/Dispositivos/Cartão do player",
  component: DeviceCard,
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-xl">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Visão operacional de um player. Reúne prévia, identificação, última comunicação e ações permitidas para o perfil atual.",
      },
    },
  },
  args: {
    device: sampleDevice,
    onLogs: fn(),
    onUnlink: fn(async () => undefined),
  },
} satisfies Meta<typeof DeviceCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const VinculadoEOnline: Story = {};

export const Offline: Story = {
  args: {
    device: {
      ...sampleDevice,
      status: "OFFLINE",
      lastHeartbeat: "2026-08-24T09:00:00.000Z",
    },
  },
};

export const NãoVinculado: Story = {
  args: {
    device: {
      ...sampleDevice,
      name: null,
      isLinked: false,
      status: "OFFLINE",
      companyId: null,
      lastHeartbeat: null,
    },
    onLogs: undefined,
  },
};
