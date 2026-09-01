import axios from "axios";
import { describe, expect, it } from "vitest";

import { getApiErrorMessage } from "./apiError";

describe("getApiErrorMessage", () => {
  const fallback = "Não foi possível concluir a operação.";

  it("preserva mensagens funcionais retornadas pela API", () => {
    const error = new axios.AxiosError("Request failed", "ERR_BAD_REQUEST", undefined, undefined, {
      data: { message: "A playlist não foi encontrada." },
      status: 404,
      statusText: "Not Found",
      headers: {},
      config: { headers: new axios.AxiosHeaders() },
    });

    expect(getApiErrorMessage(error, fallback)).toBe("A playlist não foi encontrada.");
  });

  it("não expõe rota e método HTTP em mensagens técnicas", () => {
    const error = new axios.AxiosError("Request failed", "ERR_BAD_REQUEST", undefined, undefined, {
      data: { message: "Cannot POST /playlists/items/item-1/duplicate" },
      status: 404,
      statusText: "Not Found",
      headers: {},
      config: { headers: new axios.AxiosHeaders() },
    });

    expect(getApiErrorMessage(error, fallback)).toBe(fallback);
  });

  it("informa indisponibilidade quando não existe resposta do servidor", () => {
    const error = new axios.AxiosError("Network Error", "ERR_NETWORK");

    expect(getApiErrorMessage(error, fallback)).toBe(
      "Não foi possível conectar ao servidor. Verifique a rede e tente novamente.",
    );
  });
});
