import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { sampleImage, sampleSilentVideo, sampleVideo } from "@/stories/fixtures";
import { normalizeNamedRecord } from "@/lib/textEncoding";

import MediaCard from "./mediaCard";

const meta = {
  title: "Módulos/Mídias/Arquivo",
  component: MediaCard,
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-sm">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Apresenta a mídia, seus metadados, pasta e quantidade de playlists que a utilizam. Vídeos informam duração e disponibilidade de áudio.",
      },
    },
  },
  args: {
    media: sampleImage,
    onDelete: fn(),
  },
} satisfies Meta<typeof MediaCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Imagem: Story = {};

export const VídeoComÁudio: Story = {
  args: { media: sampleVideo },
};

export const VídeoSemÁudio: Story = {
  args: { media: sampleSilentVideo },
};

export const SemMetadados: Story = {
  args: {
    media: {
      ...sampleImage,
      id: "media-no-metadata",
      name: "Imagem recém-importada.jpg",
      fileSize: null,
      folderId: null,
      folder: null,
      _count: { playlistItems: 0 },
    },
  },
};

export const NomeLegadoCorrigido: Story = {
  args: {
    media: normalizeNamedRecord({
      ...sampleVideo,
      id: "media-legacy-name",
      name: "ÃMEGA 3 - 1920 x 1080 3.mp4",
    }),
  },
};
