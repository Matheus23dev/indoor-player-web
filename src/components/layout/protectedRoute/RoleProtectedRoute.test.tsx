import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AuthContext, type AuthContextValue } from "../../../contexts/auth-context";
import { RoleProtectedRoute } from "./RoleProtectedRoute";

afterEach(cleanup);

function renderRoute(role: "OWNER" | "ADMIN" | "OPERATOR") {
  const auth: AuthContextValue = {
    isAuthenticated: true,
    token: "token",
    user: {
      id: "user-1",
      name: "UsuÃ¡rio",
      email: "user@example.com",
      role,
    },
    login: vi.fn(),
    logout: vi.fn(),
  };

  render(
    <AuthContext.Provider value={auth}>
      <MemoryRouter initialEntries={["/home/audit-logs"]}>
        <Routes>
          <Route
            path="/home/audit-logs"
            element={
              <RoleProtectedRoute allowedRoles={["OWNER", "ADMIN"]}>
                <p>Auditoria protegida</p>
              </RoleProtectedRoute>
            }
          />
          <Route path="/home/dashboard" element={<p>Dashboard</p>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  );
}

describe("RoleProtectedRoute", () => {
  it("permite o acesso de administradores", () => {
    renderRoute("ADMIN");

    expect(screen.getByText("Auditoria protegida")).toBeInTheDocument();
  });

  it("redireciona operadores para o dashboard", () => {
    renderRoute("OPERATOR");

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.queryByText("Auditoria protegida")).not.toBeInTheDocument();
  });
});
