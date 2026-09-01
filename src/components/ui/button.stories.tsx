import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowRight, Plus, Trash2 } from "lucide-react";
import { fn } from "storybook/test";

import { Button } from "./button";

const meta = {
  title: "Fundamentos/Botão",
  component: Button,
  parameters: {
    docs: {
      description: {
        component:
          "Ação reutilizável da interface. A variante comunica a importância e o risco da operação; o tamanho deve acompanhar a densidade do contexto.",
      },
    },
  },
  args: {
    children: "Continuar",
    onClick: fn(),
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "outline", "secondary", "ghost", "destructive", "link"],
    },
    size: {
      control: "select",
      options: ["default", "xs", "sm", "lg", "icon", "icon-xs", "icon-sm", "icon-lg"],
    },
    asChild: { control: "boolean" },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primário: Story = {};

export const ComÍcone: Story = {
  args: {
    children: (
      <>
        Nova playlist
        <Plus data-icon="inline-end" />
      </>
    ),
  },
};

export const Estados: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-white p-6 shadow-sm">
      <Button>
        Salvar
        <ArrowRight data-icon="inline-end" />
      </Button>
      <Button variant="outline">Cancelar</Button>
      <Button variant="secondary">Ação secundária</Button>
      <Button variant="ghost">Ver detalhes</Button>
      <Button variant="destructive">
        <Trash2 data-icon="inline-start" />
        Excluir
      </Button>
      <Button disabled>Processando...</Button>
    </div>
  ),
};
