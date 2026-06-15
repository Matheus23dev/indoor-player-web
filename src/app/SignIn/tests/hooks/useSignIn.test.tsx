// src/app/(auth)/tests/hooks/useSignIn.test.tsx
import { renderHook, act } from "@testing-library/react";
import { useSignIn } from "../../hooks/useSignIn";
import { describe, expect, it, vi } from "vitest";
import { signInRequest } from "../../services/auth.service";
import { Colors } from "../../../../constants";

// Mocks
vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
}));

const loginMock = vi.fn();
const showToastMock = vi.fn();
const notifyErrorMock = vi.fn();
const handleOverlayMock = vi.fn();

vi.mock("../../../../contexts/auth.context", () => ({
  useAuth: () => ({
    login: loginMock,
    isAuthenticated: false,
  }),
}));

vi.mock("../../../../contexts", () => ({
  useApp: () => ({
    showToast: showToastMock,
    notifyError: notifyErrorMock,
    handleOverlay: handleOverlayMock,
  }),
}));

vi.mock("../../services/auth.service", async () => ({
  signInRequest: vi.fn().mockResolvedValue("fake-token"),
}));

describe("useSignIn", () => {
    it("chama e.preventDefault quando evento é passado", async () => {
    const { result } = renderHook(() => useSignIn());

    const preventDefault = vi.fn();
    const fakeEvent = { preventDefault } as unknown as React.FormEvent;

    await act(async () => {
      await result.current.handleSignIn(fakeEvent);
    });

    expect(preventDefault).toHaveBeenCalled();
  });

  it("não chama e.preventDefault se evento não é passado", async () => {
    const { result } = renderHook(() => useSignIn());

    await act(async () => {
      await result.current.handleSignIn(); // sem evento
    });

    // se não quebrou, está OK
    expect(true).toBe(true);
  });

  it("deve iniciar com estado padrão", () => {
    const { result } = renderHook(() => useSignIn());
    expect(result.current.email).toBe("");
    expect(result.current.password).toBe("");
    expect(result.current.loading).toBe(false);
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("deve exibir erro se email estiver vazio", async () => {
    const { result } = renderHook(() => useSignIn());
    await act(() => result.current.handleSignIn());
    expect(showToastMock).toHaveBeenCalledWith("O e-mail é obrigatório", "warn");
  });

  it("deve exibir erro se email for inválido", async () => {
    const { result } = renderHook(() => useSignIn());
    act(() => {
      result.current.setEmail("email-invalido");
      result.current.setPassword("123");
    });
    await act(() => result.current.handleSignIn());
    expect(showToastMock).toHaveBeenCalledWith("Informe um e-mail válido", "warn");
  });

  it("deve exibir erro se senha estiver vazia", async () => {
    const { result } = renderHook(() => useSignIn());
    act(() => {
      result.current.setEmail("teste@email.com");
      result.current.setPassword("");
    });
    await act(() => result.current.handleSignIn());
    expect(showToastMock).toHaveBeenCalledWith("A senha é obrigatória", "warn");
  });
  

  it("deve realizar login com sucesso", async () => {
    const { result } = renderHook(() => useSignIn());
    act(() => {
      result.current.setEmail("teste@email.com");
      result.current.setPassword("123456");
     
    });
    await act(() => result.current.handleSignIn());
    expect(loginMock).toHaveBeenCalledWith("fake-token", expect.any(Function));
  });

 it('mostra erro se login falhar', async () => {
    const { result } = renderHook(() => useSignIn());

    (signInRequest as any).mockRejectedValue(new Error('Login error'));

    const reset = vi.fn();
    result.current.buttonRef.current = { reset } as any;

    act(() => {
      result.current.setEmail('user@email.com');
      result.current.setPassword('wrongpass');
    });

    await act(() => result.current.handleSignIn());

    expect(notifyErrorMock).toHaveBeenCalledWith('Erro ao fazer login. Verifique suas credenciais.');
    expect(reset).toHaveBeenCalled();
  });


it("chama reset com vermelho se email estiver vazio", async () => {
  const { result } = renderHook(() => useSignIn());

  // define spy antes de chamar handleSignIn
  const resetSpy = vi.fn();
  result.current.buttonRef.current = { reset: resetSpy } as any;

  await act(async () => {
    await result.current.handleSignIn({ preventDefault: vi.fn() } as any);
  });

  expect(showToastMock).toHaveBeenCalledWith("O e-mail é obrigatório", "warn");
  expect(resetSpy).toHaveBeenCalledWith(Colors.vermelho);
});

it("chama reset com amarelo se email inválido", async () => {
  const { result } = renderHook(() => useSignIn());

  const resetSpy = vi.fn();
  result.current.buttonRef.current = { reset: resetSpy } as any;

  act(() => result.current.setEmail("email-invalido"));
  act(() => result.current.setPassword("123456"));

  await act(async () => {
    await result.current.handleSignIn({ preventDefault: vi.fn() } as any);
  });

  expect(showToastMock).toHaveBeenCalledWith("Informe um e-mail válido", "warn");
  expect(resetSpy).toHaveBeenCalledWith(Colors.amarelo);
});

it("chama reset com amarelo se senha estiver vazia", async () => {
  const { result } = renderHook(() => useSignIn());

  const resetSpy = vi.fn();
  result.current.buttonRef.current = { reset: resetSpy } as any;

  act(() => result.current.setEmail("teste@teste.com"));
  act(() => result.current.setPassword(""));

  await act(async () => {
    await result.current.handleSignIn({ preventDefault: vi.fn() } as any);
  });

  expect(showToastMock).toHaveBeenCalledWith("A senha é obrigatória", "warn");
  expect(resetSpy).toHaveBeenCalledWith(Colors.amarelo);
});
});
