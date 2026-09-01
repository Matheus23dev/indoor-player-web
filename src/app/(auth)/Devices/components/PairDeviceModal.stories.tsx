import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { PairDeviceModal } from "./PairDeviceModal";

const meta = {
  title: "Módulos/Dispositivos/Modal de vínculo",
  component: PairDeviceModal,
  parameters: {
    docs: {
      description: {
        component:
          "Fluxo usado para vincular à empresa o código exibido no aplicativo da TV e atribuir um nome operacional ao player.",
      },
    },
  },
  args: {
    open: true,
    loading: false,
    onClose: fn(),
    onConfirm: fn(async () => undefined),
  },
} satisfies Meta<typeof PairDeviceModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrão: Story = {};

export const Vinculando: Story = {
  args: { loading: true },
};
