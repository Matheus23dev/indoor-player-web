import type { Meta, StoryObj } from "@storybook/react-vite";

import { DeviceStatusBadge } from "./DeviceStatusBadge";

const meta = {
  title: "Módulos/Dispositivos/Status",
  component: DeviceStatusBadge,
  parameters: {
    docs: {
      description: {
        component:
          "Indica se o player mantém comunicação recente com a API. Online possui sinal animado; offline usa contraste vermelho sem animação.",
      },
    },
  },
  argTypes: {
    status: { control: "inline-radio", options: ["ONLINE", "OFFLINE"] },
  },
  args: { status: "ONLINE" },
} satisfies Meta<typeof DeviceStatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Online: Story = {};

export const Offline: Story = {
  args: { status: "OFFLINE" },
};
