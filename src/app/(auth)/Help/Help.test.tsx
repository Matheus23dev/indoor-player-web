import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";

import { AuthContext, type AuthContextValue } from "../../../contexts/auth-context";
import { HelpTourContext } from "./help-tour-context";
import Help from ".";

afterEach(cleanup);

function renderHelp(startTour = vi.fn()) {
  const auth: AuthContextValue = {
    isAuthenticated: true,
    token: "token",
    user: {
      id: "operator-1",
      name: "Operador",
      email: "operator@example.com",
      role: "OPERATOR",
    },
    login: vi.fn(),
    logout: vi.fn(),
  };

  render(
    <AuthContext.Provider value={auth}>
      <HelpTourContext.Provider value={{ startTour, isTourActive: false, activeStepId: null }}>
        <MemoryRouter>
          <Help />
        </MemoryRouter>
      </HelpTourContext.Provider>
    </AuthContext.Provider>,
  );

  return { startTour };
}

describe("Help", () => {
  it("apresenta o fluxo e somente os módulos permitidos ao operador", () => {
    renderHelp();

    expect(screen.getByRole("heading", { name: "Como usar o Indoor Player" })).toBeInTheDocument();
    expect(screen.getByText("Do arquivo até a tela em seis etapas")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Playlists" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Usuários" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Auditoria" })).not.toBeInTheDocument();
  });

  it("pesquisa o manual e permite reiniciar a apresentação", async () => {
    const user = userEvent.setup();
    const { startTour } = renderHelp();

    await user.type(screen.getByRole("searchbox"), "áudio");

    expect(screen.getByRole("heading", { name: "Playlists" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Dispositivos" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Refazer apresentação" }));
    expect(startTour).toHaveBeenCalledOnce();
  });
});
