import type { Meta, StoryObj } from "@storybook/react-vite";
import { CircleCheck, ListVideo, MonitorSmartphone, Plus, WifiOff } from "lucide-react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { MetricCard, PageContainer, PageHeader, PageToolbar } from "./Page";

const meta = {
  title: "Layout/Estrutura de página",
  component: PageHeader,
  parameters: {
    docs: {
      description: {
        component:
          "Estrutura compartilhada pelas telas autenticadas. Mantém título, contexto, ações, métricas e ferramentas com espaçamento consistente e comportamento responsivo.",
      },
    },
  },
  args: {
    eyebrow: "Operação",
    title: "Dispositivos",
    description: "Acompanhe o status e a programação exibida em cada player.",
    icon: MonitorSmartphone,
  },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Cabeçalho: Story = {
  args: {
    meta: "Atualização automática a cada 30 segundos",
    actions: (
      <Button>
        <Plus data-icon="inline-start" />
        Vincular dispositivo
      </Button>
    ),
  },
};

export const PáginaCompleta: Story = {
  render: () => (
    <PageContainer>
      <PageHeader
        eyebrow="Conteúdo"
        title="Playlists"
        description="Monte sequências de mídia para os players e defina a orientação da tela."
        icon={ListVideo}
        actions={
          <Button>
            <Plus data-icon="inline-start" />
            Nova playlist
          </Button>
        }
      />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Playlists" value={12} icon={ListVideo} description="8 em exibição" />
        <MetricCard
          label="Ativas"
          value={8}
          icon={CircleCheck}
          description="Com agendamento"
          tone="emerald"
        />
        <MetricCard
          label="Sem conteúdo"
          value={2}
          icon={WifiOff}
          description="Precisam de revisão"
          tone="amber"
        />
        <MetricCard
          label="Verticais"
          value={3}
          icon={MonitorSmartphone}
          description="Formato 9:16"
          tone="slate"
        />
      </section>

      <PageToolbar>
        <Input placeholder="Buscar playlist..." className="max-w-md" />
      </PageToolbar>

      <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
        Área reservada para o conteúdo principal da página.
      </section>
    </PageContainer>
  ),
};
