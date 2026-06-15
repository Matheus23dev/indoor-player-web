import { describe, it, vi, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SignIn from "../index";
import * as signInHook from "../hooks/useSignIn";
import { MemoryRouter } from "react-router-dom";

describe("SignIn redirecionamento", () => {
  it("redireciona para '/' quando está autenticado", () => {
    vi.spyOn(signInHook, "useSignIn").mockReturnValue({
        isAuthenticated: true,
        email: "",
        setEmail: function (): void {},
        password: "",
        setPassword: function(): void {},
        loading: false,
        buttonRef: undefined,
        handleSignIn: undefined
    });

    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );

    expect(screen.queryByRole("form")).not.toBeInTheDocument();
  });

  it("exibe o formulário quando não está autenticado", () => {
    vi.spyOn(signInHook, "useSignIn").mockReturnValue({
        isAuthenticated: false,
        email: "",
        password: "",
        loading: false,
        buttonRef: undefined,
        handleSignIn: undefined,
        setEmail: function (): void {},
        setPassword: function (): void {
    }});

    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );

    expect(screen.getByText("Entrar")).toBeInTheDocument();
    expect(screen.getByText("Tijuca Track")).toBeInTheDocument();
  });
});
