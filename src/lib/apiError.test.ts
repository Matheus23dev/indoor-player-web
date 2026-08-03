import { describe, expect, it } from "vitest";
import { getApiErrorMessage } from "./apiError";

function axiosError(message?: string | string[]) {
  return {
    isAxiosError: true,
    response: { data: { message } },
  };
}

describe("getApiErrorMessage", () => {
  it("retorna a mensagem da API", () => {
    expect(getApiErrorMessage(axiosError("Dados inválidos"), "Falha")).toBe("Dados inválidos");
  });

  it("combina mensagens de validação", () => {
    expect(getApiErrorMessage(axiosError(["Nome obrigatório", "E-mail inválido"]), "Falha")).toBe(
      "Nome obrigatório E-mail inválido",
    );
  });

  it("explica falhas de rede", () => {
    expect(getApiErrorMessage({ isAxiosError: true }, "Falha")).toBe(
      "Não foi possível conectar ao servidor. Verifique a rede e tente novamente.",
    );
  });

  it("usa a mensagem de Error e depois o fallback", () => {
    expect(getApiErrorMessage(new Error("Tempo esgotado"), "Falha")).toBe("Tempo esgotado");
    expect(getApiErrorMessage(null, "Falha")).toBe("Falha");
  });
});
