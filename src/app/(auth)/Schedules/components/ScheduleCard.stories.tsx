import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { sampleSchedule } from "@/stories/fixtures";

import ScheduleCard from "./ScheduleCard";

const meta = {
  title: "Módulos/Agendamentos/Cartão",
  component: ScheduleCard,
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
          "Resume período, horário, recorrência, prioridade, dispositivo e playlist. O estado ativo determina se o agendamento participa da programação do player.",
      },
    },
  },
  args: {
    schedule: sampleSchedule,
    deleting: false,
    toggling: false,
    onEdit: fn(),
    onDelete: fn(),
    onToggleActive: fn(),
  },
} satisfies Meta<typeof ScheduleCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ativo: Story = {};

export const Inativo: Story = {
  args: {
    schedule: { ...sampleSchedule, id: "schedule-inactive", active: false },
  },
};

export const AlterandoStatus: Story = {
  args: { toggling: true },
};

export const ConteúdoLongo: Story = {
  args: {
    schedule: {
      ...sampleSchedule,
      id: "schedule-long",
      name: "Programação institucional especial de inauguração da unidade",
      device: {
        ...sampleSchedule.device!,
        name: "Televisor principal do auditório e recepção administrativa",
      },
      playlist: {
        ...sampleSchedule.playlist!,
        name: "Conteúdos institucionais aprovados para visitantes e colaboradores",
      },
    },
  },
};
