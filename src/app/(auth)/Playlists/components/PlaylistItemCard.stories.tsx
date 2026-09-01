import { DndContext } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import {
  sampleImage,
  samplePlaylistItem,
  sampleSilentVideo,
  sampleVideoPlaylistItem,
} from "@/stories/fixtures";

import PlaylistItemCard from "./PlaylistItemCard";

const sortableIds = ["playlist-item-image", "playlist-item-video", "playlist-item-silent"];

const meta = {
  title: "Módulos/Playlists/Item da composição",
  component: PlaylistItemCard,
  decorators: [
    (Story) => (
      <DndContext>
        <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
          <div className="mx-auto w-full max-w-4xl">
            <Story />
          </div>
        </SortableContext>
      </DndContext>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Item ordenável e duplicável da composição. Imagens permitem definir o tempo de exibição; vídeos usam a duração do arquivo e permitem controlar o áudio quando existe uma faixa sonora.",
      },
    },
  },
  args: {
    item: samplePlaylistItem,
    index: 0,
    saving: false,
    selected: false,
    dirty: false,
    onSelectedChange: fn(),
    onChange: fn(),
    onDuplicate: fn(async () => undefined),
  },
} satisfies Meta<typeof PlaylistItemCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Imagem: Story = {};

export const VídeoComÁudio: Story = {
  args: {
    item: sampleVideoPlaylistItem,
    index: 1,
  },
};

export const VídeoSemFaixaDeÁudio: Story = {
  args: {
    item: {
      ...sampleVideoPlaylistItem,
      id: "playlist-item-silent",
      mediaId: sampleSilentVideo.id,
      media: sampleSilentVideo,
      muted: true,
    },
    index: 2,
  },
};

export const Salvando: Story = {
  args: {
    item: {
      ...samplePlaylistItem,
      media: { ...sampleImage, name: "Campanha em processamento.png" },
    },
    saving: true,
  },
};
