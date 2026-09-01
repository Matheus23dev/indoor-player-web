import type { Meta, StoryObj } from "@storybook/react-vite";
import { MoreHorizontal } from "lucide-react";

import { Button } from "./button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";

const meta = {
  title: "Fundamentos/Cartão",
  component: Card,
  parameters: {
    docs: {
      description: {
        component:
          "Superfície base para agrupar informações relacionadas. Cabeçalho, conteúdo, ação e rodapé podem ser combinados conforme a necessidade.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Completo: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Programação da recepção</CardTitle>
        <CardDescription>Conteúdo exibido em dias úteis, das 08:00 às 18:00.</CardDescription>
        <CardAction>
          <Button variant="ghost" size="icon" aria-label="Mais opções">
            <MoreHorizontal />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-6 text-slate-600">
          A programação está vinculada à TV da recepção e utiliza a playlist institucional.
        </p>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="outline">Editar</Button>
        <Button>Visualizar</Button>
      </CardFooter>
    </Card>
  ),
};

export const Compacto: Story = {
  render: () => (
    <Card size="sm">
      <CardHeader>
        <CardTitle>Player online</CardTitle>
        <CardDescription>Última comunicação há poucos segundos.</CardDescription>
      </CardHeader>
    </Card>
  ),
};
