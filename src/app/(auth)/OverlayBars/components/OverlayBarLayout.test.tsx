import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { OverlayBar } from "../types";
import { OverlayBarFormModal } from "./OverlayBarFormModal";
import { OverlayBarPreview } from "./OverlayBarPreview";

const previewBar: OverlayBar = {
  id: "bar-1",
  name: "Rodapé",
  position: "BOTTOM",
  sizePercent: 12,
  backgroundColor: "#000000",
  opacity: 100,
  fit: "CONTAIN",
  contentPosition: "CENTER",
  imageSizePercent: 80,
  contentPadding: 12,
  contentGap: 9,
  contentItems: [
    {
      id: "message",
      type: "TEXT",
      text: "Mensagem",
      textColor: "#FFFFFF",
      fontSize: 30,
      fontWeight: "BOLD",
      fontFamily: "MONOSPACE",
      italic: true,
      padding: 0,
      borderRadius: 0,
      spacerSize: 0,
    },
  ],
  textContent: null,
  textColor: "#FFFFFF",
  fontSize: 28,
  widgetType: "NONE",
  weatherLocation: null,
  companyId: "company-1",
  mediaId: null,
  media: null,
  createdAt: "2026-08-05T12:00:00.000Z",
  updatedAt: "2026-08-05T12:00:00.000Z",
};

describe("layout das barras", () => {
  it("mantém a espessura externa e aplica o padding somente no conteúdo", () => {
    render(<OverlayBarPreview bar={previewBar} />);

    expect(screen.getByTestId("overlay-bar-preview-bar")).toHaveStyle({
      height: "12%",
      boxSizing: "border-box",
    });
    expect(screen.getByTestId("overlay-bar-preview-content")).toHaveStyle({
      height: "100%",
      padding: "4px",
    });
    expect(screen.getByText("Mensagem")).toHaveStyle({
      fontFamily: "monospace",
      fontStyle: "italic",
    });
  });

  it("mantém a prévia fixa e o scroll apenas no editor esquerdo", () => {
    render(
      <OverlayBarFormModal
        open
        saving={false}
        images={[]}
        onClose={vi.fn()}
        onSave={vi.fn().mockResolvedValue({})}
      />,
    );

    expect(screen.getByTestId("overlay-bar-modal-body")).toHaveClass("overflow-hidden");
    expect(screen.getByTestId("overlay-bar-editor-scroll")).toHaveClass("overflow-y-auto");
    expect(screen.getByTestId("overlay-bar-preview-panel")).toHaveClass("overflow-hidden");
  });
});
