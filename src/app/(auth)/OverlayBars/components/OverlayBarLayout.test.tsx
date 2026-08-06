import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { OverlayBar } from "../types";
import { OverlayBarFormModal } from "./OverlayBarFormModal";
import { OverlayBarPreview } from "./OverlayBarPreview";

afterEach(cleanup);

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
  it("mantém a espessura e aplica o recuo somente nas extremidades horizontais", () => {
    const { getByTestId, getByText } = render(<OverlayBarPreview bar={previewBar} />);

    expect(getByTestId("overlay-bar-preview-bar")).toHaveStyle({
      height: "12%",
      boxSizing: "border-box",
    });
    const content = getByTestId("overlay-bar-preview-content");
    expect(content).toHaveStyle({
      height: "100%",
      paddingLeft: "4px",
      paddingRight: "4px",
    });
    expect(content.style.paddingTop).toBe("");
    expect(content.style.paddingBottom).toBe("");
    expect(getByText("Mensagem")).toHaveStyle({
      fontSize: "10px",
      fontFamily: "monospace",
      fontStyle: "italic",
    });
  });

  it("aplica o recuo no topo e rodapé quando a barra é lateral", () => {
    const { getByTestId } = render(<OverlayBarPreview bar={{ ...previewBar, position: "LEFT" }} />);

    const content = getByTestId("overlay-bar-preview-content");
    expect(content).toHaveStyle({
      paddingTop: "4px",
      paddingBottom: "4px",
    });
    expect(content.style.paddingLeft).toBe("");
    expect(content.style.paddingRight).toBe("");
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
