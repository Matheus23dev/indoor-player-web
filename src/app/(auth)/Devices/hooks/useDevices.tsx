import { useCallback, useEffect, useRef, useState } from "react";

import { getApiErrorMessage, getDevices, unlinkDevice } from "../services/devices.services";

import type { Device } from "../types/device";

const REFRESH_INTERVAL_MS = 3_000;

interface LoadDevicesOptions {
  silent?: boolean;
}
interface Feedback {
  type: "success" | "error";

  message: string;
}

export function useDevices() {
  const [devices, setDevices] = useState<Device[]>([]);

  const [loading, setLoading] = useState(true);

  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);

  const mountedRef = useRef(false);

  const hasLoadedRef = useRef(false);

  const requestInProgressRef = useRef(false);

  const loadDevices = useCallback(async (options: LoadDevicesOptions = {}) => {
    if (requestInProgressRef.current) {
      return;
    }

    requestInProgressRef.current = true;

    const initialRequest = !hasLoadedRef.current;

    if (initialRequest) {
      setLoading(true);
    } else if (!options.silent) {
      setRefreshing(true);
    }

    try {
      const data = await getDevices();

      if (!mountedRef.current) {
        return;
      }

      setDevices(Array.isArray(data) ? data : []);

      setError(null);

      setLastUpdatedAt(new Date());

      hasLoadedRef.current = true;
    } catch (requestError) {
      if (!mountedRef.current) {
        return;
      }

      setError(getApiErrorMessage(requestError, "Não foi possível carregar os dispositivos."));
    } finally {
      requestInProgressRef.current = false;

      if (mountedRef.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  async function handleUnlinkDevice(device: Device) {
    try {
      setFeedback(null);

      await unlinkDevice(device.id);

      if (selectedDevice?.id === device.id) {
        setSelectedDevice(null);
      }

      await loadDevices({
        silent: true,
      });

      setFeedback({
        type: "success",

        message: `O dispositivo "${
          device.name?.trim() || device.code
        }" foi desvinculado com sucesso.`,
      });
    } catch (unlinkError) {
      const message = getApiErrorMessage(
        unlinkError,
        "Não foi possível desvincular o dispositivo.",
      );

      setFeedback({
        type: "error",
        message,
      });

      throw unlinkError;
    }
  }
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    void loadDevices();

    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        void loadDevices({
          silent: true,
        });
      }
    }, REFRESH_INTERVAL_MS);

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        void loadDevices({
          silent: true,
        });
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      mountedRef.current = false;

      window.clearInterval(interval);

      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [loadDevices]);

  return {
    devices,
    loading,
    refreshing,
    error,
    lastUpdatedAt,
    loadDevices,
    clearError,
    setFeedback,
    feedback,
    handleUnlinkDevice,
    setSelectedDevice,
    selectedDevice,
  };
}
