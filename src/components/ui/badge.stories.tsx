import type { Meta, StoryObj } from "@storybook/react-vite";
import { CheckCircle2, Clock3, TriangleAlert } from "lucide-react";

import { Badge } from "./badge";

const meta = {
  title: "Fundamentos/Indicador",
  component: Badge,
  parameters: {
    docs: {
      description: {
        component:
          "Indicador compacto para status, categorias e informações curtas. Não deve ser usado como botão quando não houver uma ação associada.",
      },
    },
  },
  args: {
    children: "Ativo",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "destructive", "outline", "ghost", "link"],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrão: Story = {};

export const ConjuntoDeEstados: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3 rounded-2xl bg-white p-6 shadow-sm">
      <Badge>
        <CheckCircle2 data-icon="inline-start" />
        Ativo
      </Badge>
      <Badge variant="secondary">
        <Clock3 data-icon="inline-start" />
        Agendado
      </Badge>
      <Badge variant="destructive">
        <TriangleAlert data-icon="inline-start" />
        Falha
      </Badge>
      <Badge variant="outline">Rascunho</Badge>
    </div>
  ),
};
