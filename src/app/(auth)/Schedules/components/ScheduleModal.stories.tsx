import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { sampleSchedule } from "@/stories/fixtures";

import ScheduleModal from "./ScheduleModal";

const meta = {
  title: "Módulos/Agendamentos/Modal de configuração",
  component: ScheduleModal,
  parameters: {
    docs: {
      description: {
        component:
          "Define player, playlist, período, faixa de horário, dias recorrentes, prioridade e estado do agendamento.",
      },
    },
  },
  args: {
    open: true,
    saving: false,
    schedule: null,
    devices: [sampleSchedule.device!],
    playlists: [sampleSchedule.playlist!],
    onClose: fn(),
    onSubmit: fn(async () => undefined),
  },
} satisfies Meta<typeof ScheduleModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Novo: Story = {};

export const Editando: Story = {
  args: { schedule: sampleSchedule },
};
