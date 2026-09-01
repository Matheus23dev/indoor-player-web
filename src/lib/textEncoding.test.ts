import { describe, expect, it } from "vitest";

import { normalizeDisplayText, normalizeNamedRecord } from "./textEncoding";

describe("normalizeDisplayText", () => {
  it.each([
    ["ÃMEGA 3 - 1920 x 1080 3.mp4", "ÔMEGA 3 - 1920 x 1080 3.mp4"],
    ["VÃ­deo institucional.mp4", "Vídeo institucional.mp4"],
    ["ApresentaÃƒÂ§Ã£o.jpg", "Apresentação.jpg"],
    ["campanha-2026.mp4", "campanha-2026.mp4"],
    ["Ângela.jpg", "Ângela.jpg"],
  ])("normalizes %s", (input, expected) => {
    expect(normalizeDisplayText(input)).toBe(expected);
  });

  it("keeps the remaining record fields", () => {
    expect(normalizeNamedRecord({ id: "1", name: "VÃ­deo.mp4" })).toEqual({
      id: "1",
      name: "Vídeo.mp4",
    });
  });
});
