import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";

import PlaylistCompositionGuide from ".";

describe("PlaylistCompositionGuide", () => {
  afterEach(cleanup);

  it("mostra uma composição ilustrativa sem depender de dados da empresa", () => {
    render(
      <MemoryRouter>
        <PlaylistCompositionGuide />
      </MemoryRouter>,
    );

    expect(screen.getByText("Dados de exemplo")).toBeInTheDocument();
    expect(screen.getByText("Oferta da semana.jpg")).toBeInTheDocument();
    expect(screen.getByText("Vídeo institucional.mp4")).toBeInTheDocument();
    expect(screen.getByText("8 seg")).toBeInTheDocument();
    expect(screen.getByText("Com áudio")).toBeInTheDocument();
  });
});
