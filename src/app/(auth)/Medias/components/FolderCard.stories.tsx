import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { sampleFolder } from "@/stories/fixtures";

import FolderCard from "./FolderCard";

const meta = {
  title: "Módulos/Mídias/Pasta",
  component: FolderCard,
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
          "Agrupa mídias da biblioteca. O cartão inteiro abre a pasta, enquanto editar e excluir são ações independentes.",
      },
    },
  },
  args: {
    folder: sampleFolder,
    onOpen: fn(),
    onEdit: fn(),
    onDelete: fn(),
  },
} satisfies Meta<typeof FolderCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ComMídias: Story = {};

export const Vazia: Story = {
  args: {
    folder: {
      ...sampleFolder,
      id: "folder-empty",
      name: "Materiais futuros",
      _count: { medias: 0 },
    },
  },
};

export const NomeLongo: Story = {
  args: {
    folder: {
      ...sampleFolder,
      id: "folder-long",
      name: "Campanhas promocionais nacionais aprovadas para o segundo semestre",
    },
  },
};
