import axios from "axios";

import instance from "../../../../services/axios";

import type {
  Device,
  DeviceLog,
  PairDevicePayload,
} from "../types/device";

interface ApiErrorResponse {
  message?:
    string | string[];
}

export async function getDevices():
  Promise<Device[]> {
  const response =
    await instance.get<Device[]>(
      "/devices",
    );

  return response.data;
}

export async function getDevicePreview(
  deviceId: string,
): Promise<Device> {
  const response =
    await instance.get<Device>(
      `/devices/${deviceId}/preview`,
    );

  return response.data;
}

export async function pairDevice(
  code: string,
  name: string,
): Promise<Device> {
  const payload:
    PairDevicePayload = {
    code:
      code
        .trim()
        .toUpperCase(),

    name:
      name.trim(),
  };

  const response =
    await instance.post<Device>(
      "/devices/pair",
      payload,
    );

  return response.data;
}

export async function getDeviceLogs(
  deviceId: string,
): Promise<DeviceLog[]> {
  const response =
    await instance.get<
      DeviceLog[]
    >(
      `/devices/${deviceId}/logs`,
    );

  return response.data;
}

export async function unlinkDevice(
  deviceId: string,
) {
  const response =
    await instance.post(
      `/devices/${deviceId}/unlink`,
    );

  return response.data;
}

export function resolveMediaUrl(
  fileUrl: string,
) {
  if (
    /^https?:\/\//i.test(
      fileUrl,
    )
  ) {
    return fileUrl;
  }

  const baseUrl =
  
    import.meta.env.VITE_BASE_URL_API_FILES;

  try {
    return new URL(
      fileUrl,
      baseUrl,
    ).toString();
  } catch {
    return fileUrl;
  }
}

export function getApiErrorMessage(
  error: unknown,
  fallback =
    "Não foi possível concluir a operação.",
) {
  if (
    axios.isAxiosError<ApiErrorResponse>(
      error,
    )
  ) {
    const responseMessage =
      error.response?.data
        ?.message;

    if (
      Array.isArray(
        responseMessage,
      )
    ) {
      return responseMessage.join(
        " ",
      );
    }

    if (
      typeof responseMessage ===
      "string"
    ) {
      return responseMessage;
    }

    if (!error.response) {
      return "Não foi possível conectar ao servidor.";
    }

    if (
      error.response.status ===
      401
    ) {
      return "Sua sessão expirou. Entre novamente.";
    }

    if (
      error.response.status ===
      404
    ) {
      return "O dispositivo não foi encontrado.";
    }

    if (
      error.response.status ===
      409
    ) {
      return "Este dispositivo já está vinculado.";
    }

    if (
      error.response.status >=
      500
    ) {
      return "O servidor apresentou um erro. Tente novamente em instantes.";
    }

    return (
      error.message ||
      fallback
    );
  }

  if (
    error instanceof Error
  ) {
    return error.message;
  }

  return fallback;
}