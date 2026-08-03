import { describe, expect, it } from "vitest";
import { MEDIA_BASE_URL } from "./environment";
import { resolveMediaUrl } from "./mediaUrl";

describe("resolveMediaUrl", () => {
  it("preserva URLs HTTP completas", () => {
    expect(resolveMediaUrl("https://cdn.example.com/video demo.mp4")).toBe(
      "https://cdn.example.com/video%20demo.mp4",
    );
  });

  it.each([
    "video.mp4",
    "/video.mp4",
    "files/indoor-player-api/video.mp4",
    "/files/indoor-player-api/video.mp4",
  ])("normaliza o caminho de mídia %s", (path) => {
    expect(resolveMediaUrl(path)).toBe(`${MEDIA_BASE_URL}/video.mp4`);
  });

  it("codifica espaços e caracteres especiais seguros", () => {
    expect(resolveMediaUrl("pasta/meu vídeo.mp4")).toBe(
      encodeURI(`${MEDIA_BASE_URL}/pasta/meu vídeo.mp4`),
    );
  });

  it("retorna vazio quando não há arquivo", () => {
    expect(resolveMediaUrl("  ")).toBe("");
  });
});
