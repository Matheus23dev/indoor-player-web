import axios from "axios";

interface ApiErrorBody {
  message?: string | string[];
}

const TECHNICAL_MESSAGE_PATTERNS = [
  /^cannot\s+(?:get|post|put|patch|delete)\s+\//i,
  /^request failed with status code\s+\d+$/i,
  /^(?:network error|failed to fetch)$/i,
  /^timeout of \d+ms exceeded$/i,
];

function isTechnicalMessage(message: string) {
  return TECHNICAL_MESSAGE_PATTERNS.some((pattern) => pattern.test(message.trim()));
}

function toUserMessage(message: string | undefined, fallback: string) {
  const normalizedMessage = message?.trim();

  if (!normalizedMessage || isTechnicalMessage(normalizedMessage)) {
    return fallback;
  }

  return normalizedMessage;
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    const message = error.response?.data?.message;

    if (Array.isArray(message)) {
      const userMessages = message
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter((item) => item && !isTechnicalMessage(item));

      return userMessages.join(" ") || fallback;
    }

    if (typeof message === "string") {
      return toUserMessage(message, fallback);
    }

    if (!error.response) {
      return "Não foi possível conectar ao servidor. Verifique a rede e tente novamente.";
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return toUserMessage(error.message, fallback);
  }

  return fallback;
}
