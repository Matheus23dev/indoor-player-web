import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";

import ErrorPage from ".";

describe("ErrorPage", () => {
  afterEach(cleanup);

  it("exibe a identidade da aplicação e caminhos seguros de navegação", () => {
    render(
      <MemoryRouter>
        <ErrorPage />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", {
        name: "Parece que esta tela saiu da programação.",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Indoor Player")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ir para o painel" })).toHaveAttribute(
      "href",
      "/home/dashboard",
    );
    expect(screen.getByRole("button", { name: "Voltar à página anterior" })).toBeInTheDocument();
  });
});
