import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { OverlayBar } from "../types";
import { OverlayBarFormModal } from "./OverlayBarFormModal";
import { OverlayBarPreview, OverlayBarsPreview } from "./OverlayBarPreview";

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
  contentAlignment: "END",
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
      paddingHorizontal: 18,
      paddingVertical: 6,
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
    expect(getByTestId("overlay-bars-preview-media")).toHaveStyle({
      top: "0%",
      right: "0%",
      bottom: "0%",
      left: "0%",
    });
    const content = getByTestId("overlay-bar-preview-content");
    expect(content).toHaveStyle({
      height: "100%",
      alignItems: "flex-end",
      paddingLeft: "4px",
      paddingRight: "4px",
      paddingBottom: "5.333px",
    });
    expect(content.style.paddingTop).toBe("");
    expect(getByText("Mensagem")).toHaveStyle({
      fontSize: "10px",
      fontFamily: "monospace",
      fontStyle: "italic",
      paddingLeft: "6px",
      paddingRight: "6px",
      paddingTop: "2px",
      paddingBottom: "2px",
    });
  });

  it("aplica o recuo no topo e rodapé quando a barra é lateral", () => {
    const { getByTestId } = render(<OverlayBarPreview bar={{ ...previewBar, position: "LEFT" }} />);

    const content = getByTestId("overlay-bar-preview-content");
    expect(content).toHaveStyle({
      paddingTop: "4px",
      paddingBottom: "4px",
      paddingLeft: "5.333px",
      paddingRight: "5.333px",
    });
  });

  it("protege a lateral quando o conteudo aponta para a borda externa", () => {
    const { getByTestId } = render(
      <OverlayBarPreview bar={{ ...previewBar, position: "LEFT", contentAlignment: "START" }} />,
    );

    expect(getByTestId("overlay-bar-preview-content")).toHaveStyle({
      paddingLeft: "5.333px",
      paddingRight: "5.333px",
    });
  });

  it("limita padding vertical excessivo e permite mover o bloco para cima", () => {
    const adjustedBar: OverlayBar = {
      ...previewBar,
      contentItems: [
        {
          ...previewBar.contentItems![0],
          paddingVertical: 60,
          offsetY: -30,
        },
      ],
    };
    const { getByText } = render(<OverlayBarPreview bar={adjustedBar} />);

    expect(getByText("Mensagem")).toHaveStyle({
      paddingTop: "2.44px",
      paddingBottom: "2.44px",
      transform: "translate(0px, -10px)",
    });
  });

  it("renderiza várias imagens como conteúdos ajustáveis", () => {
    const image = {
      id: "image-1",
      name: "Logo",
      type: "IMAGE" as const,
      fileUrl: "/files/logo.png",
      createdAt: "2026-08-06T12:00:00.000Z",
      updatedAt: "2026-08-06T12:00:00.000Z",
    };
    const imageContent = {
      ...previewBar.contentItems![0],
      id: "content-image",
      type: "IMAGE" as const,
      mediaId: image.id,
      imageSizePercent: 72,
      fit: "CONTAIN" as const,
      offsetX: 12,
      offsetY: -6,
    };
    const { getAllByTestId } = render(
      <OverlayBarPreview
        bar={{ ...previewBar, contentItems: [imageContent, { ...imageContent, id: "second" }] }}
        images={[image]}
      />,
    );

    expect(getAllByTestId("overlay-bar-preview-content-image")).toHaveLength(2);
    expect(getAllByTestId("overlay-bar-preview-content-image")[0]).toHaveStyle({
      height: "72%",
      objectFit: "contain",
      aspectRatio: "auto",
      transform: "translate(4px, -2px)",
    });
  });

  it("permite ampliar uma imagem lateral acima de cem por cento", () => {
    const image = {
      id: "image-1",
      name: "Logo",
      type: "IMAGE" as const,
      fileUrl: "/files/logo.png",
      createdAt: "2026-08-06T12:00:00.000Z",
      updatedAt: "2026-08-06T12:00:00.000Z",
    };
    const imageContent = {
      ...previewBar.contentItems![0],
      id: "content-image",
      type: "IMAGE" as const,
      mediaId: image.id,
      imageSizePercent: 300,
      fit: "CONTAIN" as const,
    };
    const { getByTestId } = render(
      <OverlayBarPreview
        bar={{
          ...previewBar,
          position: "LEFT",
          contentAlignment: "CENTER",
          contentItems: [imageContent],
        }}
        images={[image]}
      />,
    );

    expect(getByTestId("overlay-bar-preview-content-image")).toHaveStyle({
      width: "calc(300% + 32px)",
      maxWidth: "none",
      maxHeight: "none",
      transform: "translate(8px, 0px)",
    });
    expect(getByTestId("overlay-bar-preview-bar")).toHaveStyle({
      overflow: "visible",
    });
  });

  it("sobrepõe barras diferentes ao vídeo e impede conflito entre elas", () => {
    const topBar = { ...previewBar, position: "TOP" as const, sizePercent: 12 };
    const leftBar = { ...previewBar, position: "LEFT" as const, sizePercent: 20 };
    const { getByTestId, getAllByTestId } = render(<OverlayBarsPreview bars={[topBar, leftBar]} />);

    expect(getByTestId("overlay-bars-preview-media")).toHaveStyle({
      top: "0%",
      left: "0%",
      right: "0%",
      bottom: "0%",
    });
    expect(getAllByTestId("overlay-bar-preview-bar")[1]).toHaveStyle({
      top: "12%",
      bottom: "0%",
      width: "20%",
    });
  });

  it("reserva o centro para duas barras perpendiculares com a mesma espessura", () => {
    const bottomBar = { ...previewBar, position: "BOTTOM" as const, sizePercent: 12 };
    const leftBar = { ...previewBar, position: "LEFT" as const, sizePercent: 12 };
    const { getByTestId } = render(<OverlayBarsPreview bars={[bottomBar, leftBar]} />);

    expect(getByTestId("overlay-bars-preview-media")).toHaveStyle({
      top: "0%",
      left: "12%",
      right: "0%",
      bottom: "12%",
    });
  });

  it("usa a mídia informada dentro da composição das barras", () => {
    const { getByTestId } = render(
      <OverlayBarsPreview
        bars={[]}
        mediaContent={<div data-testid="current-device-media">Mídia atual</div>}
      />,
    );

    expect(getByTestId("overlay-bars-preview-media")).toContainElement(
      getByTestId("current-device-media"),
    );
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

    const contentTourTarget = document.querySelector('[data-help-tour="bar-modal-content"]');
    const previewTourTarget = document.querySelector('[data-help-tour="bar-modal-preview"]');

    expect(contentTourTarget).toHaveTextContent("Adicione os blocos que formarão a barra");
    expect(previewTourTarget).toContainElement(screen.getByTestId("overlay-bars-preview"));
    expect(previewTourTarget).not.toHaveTextContent(
      "Esta barra poderá ser vinculada a várias playlists",
    );
  });

  it("permite alternar a prévia entre horizontal e vertical", () => {
    render(
      <OverlayBarFormModal
        open
        saving={false}
        images={[]}
        onClose={vi.fn()}
        onSave={vi.fn().mockResolvedValue({})}
      />,
    );

    const preview = screen.getByTestId("overlay-bars-preview");

    expect(preview).toHaveAttribute("data-orientation", "LANDSCAPE");
    expect(preview).toHaveStyle({ aspectRatio: "16 / 9" });

    fireEvent.click(screen.getByRole("button", { name: "Visualizar prévia vertical" }));

    expect(preview).toHaveAttribute("data-orientation", "PORTRAIT");
    expect(preview).toHaveStyle({ aspectRatio: "9 / 16" });
    expect(preview).toHaveClass("h-[min(38vh,340px)]", "w-auto", "max-w-full");
  });

  it("aplica o afastamento no topo somente na prévia vertical", () => {
    const image = {
      id: "image-1",
      name: "Logo",
      type: "IMAGE" as const,
      fileUrl: "/files/logo.png",
      createdAt: "2026-08-06T12:00:00.000Z",
      updatedAt: "2026-08-06T12:00:00.000Z",
    };
    const imageContent = {
      ...previewBar.contentItems![0],
      id: "content-image",
      type: "IMAGE" as const,
      mediaId: image.id,
      imageSizePercent: 80,
      fit: "CONTAIN" as const,
      offsetX: 0,
      offsetY: 0,
    };
    const { getByTestId } = render(
      <OverlayBarPreview
        bar={{
          ...previewBar,
          position: "TOP",
          contentAlignment: "CENTER",
          contentItems: [imageContent],
        }}
        images={[image]}
        orientation="PORTRAIT"
      />,
    );

    expect(getByTestId("overlay-bar-preview-content-image")).toHaveStyle({
      transform: "translate(0px, 8px)",
    });
  });
});
