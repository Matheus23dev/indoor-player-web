import { render, screen, fireEvent, act } from "@testing-library/react";
import SignInForm from "../../components/SignInForm";
import { describe, expect, it, vi } from "vitest";
import React, { useState } from "react";
import * as useSignInHook from "../../hooks/useSignIn";
const handleSignIn = vi.fn<() => Promise<void>>().mockResolvedValue();
const mockHandleSignIn = vi.fn((e?: React.FormEvent<HTMLFormElement>) => {
  e?.preventDefault();
  return handleSignIn();
});

vi.mock("../../hooks/useSignIn", () => ({
  useSignIn: vi.fn(() => ({
    email: "",
    setEmail: vi.fn(),
    password: "",
    setPassword: vi.fn(),
    loading: false,
    buttonRef: { current: null },
    handleSignIn: mockHandleSignIn,
    isAuthenticated: false,
  })),
}));


describe("SignInForm", () => {
  it("deve renderizar campos de e-mail e senha", () => {
    render(<SignInForm />);
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
  });

  it("deve conter o botão de entrar", () => {
    render(<SignInForm />);
    expect(screen.getByRole("button", { name: /entrar/i })).toBeInTheDocument();
  });

 it("deve permitir digitar e enviar o formulário", async () => {
    const TestWrapper = () => {
      const [email, setEmail] = useState("");
      const [password, setPassword] = useState("");



      vi.spyOn(useSignInHook, "useSignIn").mockReturnValue({
        email,
        setEmail,
        password,
        setPassword,
        loading: false,
        buttonRef: { current: null },
        handleSignIn: mockHandleSignIn,
        isAuthenticated: false,
      });

      return <SignInForm />;
    };

    render(<TestWrapper />);

    const emailInput = screen.getByLabelText(/e-mail/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(/senha/i) as HTMLInputElement;
    const submitButton = screen.getByRole("button", { name: /entrar/i });

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: "novo@email.com" } });
      fireEvent.change(passwordInput, { target: { value: "novasenha" } });
    });

    expect(emailInput.value).toBe("novo@email.com");
    expect(passwordInput.value).toBe("novasenha");

    await act(async () => {
      fireEvent.click(submitButton);
    });
  });

  it("deve exibir 'Entrando...' quando loading for true", async () => {
    const mockHandleSignIn = vi.fn((e) => e.preventDefault());

    vi.spyOn(useSignInHook, "useSignIn").mockReturnValue({
      email: "teste@email.com",
      setEmail: vi.fn(),
      password: "123456",
      setPassword: vi.fn(),
      loading: true,
      buttonRef: { current: null },
      isAuthenticated: false,
      handleSignIn: mockHandleSignIn,
    });

    render(<SignInForm />);

    const button = screen.getByRole("button", { name: /Entrando.../i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Entrando...");
  });

  it("deve exibir 'Entrar' quando loading for false", async () => {
    const mockHandleSignIn = vi.fn((e) => e.preventDefault());

    vi.spyOn(useSignInHook, "useSignIn").mockReturnValue({
      email: "teste@email.com",
      setEmail: vi.fn(),
      password: "123456",
      setPassword: vi.fn(),
      loading: false,
      buttonRef: { current: null },
      handleSignIn: mockHandleSignIn,
      isAuthenticated: false
    });

    render(<SignInForm />);

    const button = screen.getByRole("button", { name: /Entrar/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Entrar");
  });
 
});
