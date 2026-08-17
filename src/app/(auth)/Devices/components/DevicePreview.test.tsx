import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import type { OverlayBar } from "../../OverlayBars/types";
import type { DevicePreview as DevicePreviewData } from "../types/device";
import { DevicePreview } from "./DevicePreview";

afterEach(cleanup);

const timestamp = "2026-08-06T12:00:00.000Z";
const contentImage = {
  id: "image-1",
  name: "Logo da barra",
  type: "IMAGE" as const,
  fileUrl: "/files/logo.png",
  createdAt: timestamp,
  updatedAt: timestamp,
};
const bar: OverlayBar = {
  id: "bar-1",
  name: "Barra lateral",
  position: "LEFT",
  sizePercent: 14,
  backgroundColor: "#000000",
  opacity: 100,
  fit: "CONTAIN",
  contentPosition: "CENTER",
  contentAlignment: "CENTER",
  imageSizePercent: 80,
  contentPadding: 8,
  contentGap: 8,
  contentItems: [
    {
      id: "content-image",
      type: "IMAGE",
      textColor: "#FFFFFF",
      fontSize: 28,
      fontWeight: "BOLD",
      padding: 0,
      borderRadius: 0,
      spacerSize: 0,
      mediaId: contentImage.id,
      media: contentImage,
      imageSizePercent: 70,
      fit: "CONTAIN",
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
  createdAt: timestamp,
  updatedAt: timestamp,
};
const preview: DevicePreviewData = {
  schedule: null,
  playlist: {
    id: "playlist-1",
    name: "Institucional",
    orientation: "LANDSCAPE",
    bars: [bar],
  },
  item: null,
  media: {
    id: "media-1",
    name: "Campanha",
    type: "IMAGE",
    fileUrl: "/files/campanha.png",
    duration: 10,
  },
  playback: {
    currentTime: 2,
    duration: 10,
    progress: 20,
    muted: null,
    startedAt: timestamp,
    updatedAt: timestamp,
  },
};

describe("DevicePreview", () => {
  it("mostra a mídia atual junto com as barras da playlist", () => {
    const { getByAltText, getAllByTestId, getByTestId } = render(
      <DevicePreview preview={preview} status="ONLINE" />,
    );

    expect(getByAltText("Campanha")).toBeInTheDocument();
    expect(getAllByTestId("overlay-bar-preview-bar")).toHaveLength(1);
    expect(getByAltText("Logo da barra")).toBeInTheDocument();
    expect(getByTestId("device-preview-live-status")).toHaveStyle({
      left: "calc(14% + 10px)",
      top: "calc(0% + 10px)",
    });
    expect(getByTestId("device-preview-live-status")).toHaveClass("z-20");
  });
});
