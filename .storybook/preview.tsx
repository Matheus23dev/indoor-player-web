import type { Preview } from "@storybook/react-vite";
import { MemoryRouter } from "react-router-dom";

import "../src/index.css";

const preview: Preview = {
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div className="min-h-screen bg-slate-50 p-4 text-slate-950 sm:p-6">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
  parameters: {
    actions: { disable: true },
    a11y: {
      test: "todo",
    },
    controls: {
      expanded: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      toc: true,
    },
    layout: "fullscreen",
    options: {
      storySort: {
        order: [
          "Introdução",
          "Fundamentos",
          "Layout",
          "Módulos",
          ["Dispositivos", "Mídias", "Playlists", "Agendamentos", "Barras fixas"],
        ],
      },
    },
  },
  tags: ["autodocs"],
};

export default preview;
