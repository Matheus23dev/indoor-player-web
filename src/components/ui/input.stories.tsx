import type { Meta, StoryObj } from "@storybook/react-vite";
import { Mail, Search } from "lucide-react";

import { Input } from "./input";
import { Label } from "./label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";

const meta = {
  title: "Fundamentos/Campos de formulário",
  component: Input,
  parameters: {
    docs: {
      description: {
        component:
          "Campos padronizados para coleta e filtro de dados. Rótulos visíveis devem indicar claramente o valor esperado.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-md rounded-2xl bg-white p-6 shadow-sm">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Texto: Story = {
  args: {
    placeholder: "Nome da playlist",
  },
};

export const ComÍcone: Story = {
  args: {
    placeholder: "Buscar por nome ou código",
    icon: <Search aria-hidden="true" />,
  },
};

export const Formulário: Story = {
  render: () => (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="storybook-email">E-mail</Label>
        <Input
          id="storybook-email"
          type="email"
          placeholder="usuario@empresa.com.br"
          icon={<Mail aria-hidden="true" />}
        />
        <p className="text-xs text-slate-500">Utilizado para acessar o painel administrativo.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="storybook-role">Perfil</Label>
        <Select defaultValue="operator">
          <SelectTrigger id="storybook-role" className="w-full">
            <SelectValue placeholder="Selecione um perfil" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Administrador</SelectItem>
            <SelectItem value="operator">Operador</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="storybook-disabled">Empresa</Label>
        <Input id="storybook-disabled" value="Empresa demonstração" disabled readOnly />
      </div>
    </div>
  ),
};
