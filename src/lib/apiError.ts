import axios from "axios";

interface ApiErrorBody {
  message?: string | string[];
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    const message = error.response?.data?.message;

    if (Array.isArray(message)) {
      return message.filter(Boolean).join(" ") || fallback;
    }

    if (typeof message === "string" && message.trim()) {
      return message;
    }

    if (!error.response) {
      return "Não foi possível conectar ao servidor. Verifique a rede e tente novamente.";
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallback;
}
