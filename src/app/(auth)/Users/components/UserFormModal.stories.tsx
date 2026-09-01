import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import UserFormModal from "./UserFormModal";

const currentUser = {
  id: "user-owner",
  name: "Gestor da conta",
  email: "gestor@empresa.com.br",
  role: "OWNER" as const,
  companyId: "company-demo",
};

const meta = {
  title: "Módulos/Usuários/Modal de cadastro",
  component: UserFormModal,
  parameters: {
    docs: {
      description: {
        component:
          "Cadastro e edição de usuários administrativos. Os perfis disponíveis respeitam a hierarquia de permissões de quem realiza a operação.",
      },
    },
  },
  args: {
    open: true,
    saving: false,
    currentUser,
    user: null,
    onClose: fn(),
    onCreate: fn(async () => undefined),
    onUpdate: fn(async () => undefined),
  },
} satisfies Meta<typeof UserFormModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NovoUsuário: Story = {};

export const EditandoOperador: Story = {
  args: {
    user: {
      id: "user-operator",
      name: "Operador da recepção",
      email: "operador@empresa.com.br",
      role: "OPERATOR",
      companyId: "company-demo",
      createdAt: "2026-08-20T12:00:00.000Z",
      updatedAt: "2026-08-24T12:00:00.000Z",
    },
  },
};
