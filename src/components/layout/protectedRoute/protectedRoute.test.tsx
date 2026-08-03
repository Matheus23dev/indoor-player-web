import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { AuthContext, type AuthContextValue } from "../../../contexts/auth-context";
import { ProtectedRoute } from ".";

function renderRoute(isAuthenticated: boolean) {
  const context: AuthContextValue = {
    isAuthenticated,
    user: null,
    token: isAuthenticated ? "token" : null,
    login: vi.fn(),
    logout: vi.fn(),
  };

  render(
    <AuthContext.Provider value={context}>
      <MemoryRouter initialEntries={["/private"]}>
        <Routes>
          <Route path="/" element={<p>Tela de login</p>} />
          <Route
            path="/private"
            element={
              <ProtectedRoute>
                <p>Área privada</p>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  );
}

describe("ProtectedRoute", () => {
  it("redireciona visitantes para o login", () => {
    renderRoute(false);
    expect(screen.getByText("Tela de login")).toBeInTheDocument();
  });

  it("renderiza o conteúdo para usuários autenticados", () => {
    renderRoute(true);
    expect(screen.getByText("Área privada")).toBeInTheDocument();
  });
});
