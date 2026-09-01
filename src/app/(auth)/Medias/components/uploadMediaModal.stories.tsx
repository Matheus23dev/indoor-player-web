import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { sampleFolder } from "@/stories/fixtures";

import UploadMediaModal from "./uploadMediaModal";

const meta = {
  title: "Módulos/Mídias/Modal de envio",
  component: UploadMediaModal,
  parameters: {
    docs: {
      description: {
        component:
          "Seleciona e envia imagens ou vídeos para a biblioteca. Permite escolher a pasta de destino e valida formato, tamanho, duplicidade e limite do lote.",
      },
    },
  },
  args: {
    open: true,
    folders: [sampleFolder],
    selectedFolderId: sampleFolder.id,
    onClose: fn(),
    onUploaded: fn(async () => undefined),
  },
} satisfies Meta<typeof UploadMediaModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrão: Story = {};
