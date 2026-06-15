import { describe, it, expect } from "vitest";
import MockAdapter from "axios-mock-adapter";
import instance from "../../../../services/axios";
import { signInRequest } from "../../services/auth.service";

describe("signInRequest", () => {
  const mock = new MockAdapter(instance);

  it("deve retornar o token quando login for bem-sucedido", async () => {
    const mockToken = "fake_token";

    mock.onPost("/auth/login").reply(200, { access_token: mockToken });

    const result = await signInRequest("email@teste.com", "123456");

    expect(result).toBe(mockToken);
  });

  it("deve lançar erro se o token não for retornado", async () => {
    mock.onPost("/auth/login").reply(200, {}); // Sem token

    await expect(signInRequest("email@teste.com", "123456")).rejects.toThrow(
      "Token de acesso não recebido."
    );
  });

  it("deve lançar erro se a requisição falhar", async () => {
    mock.onPost("/auth/login").reply(500); // Erro do servidor

    await expect(signInRequest("email@teste.com", "123456")).rejects.toThrow();
  });
});
