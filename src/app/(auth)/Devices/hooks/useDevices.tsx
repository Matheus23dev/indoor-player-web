import { useEffect, useState } from "react";

import { getDevices } from "../services/devices.services";

import type { Device } from "../types/device";

export function useDevices() {
  const [devices, setDevices] =
    useState<Device[]>([]);

  const [loading, setLoading] =
    useState(true);

  async function loadDevices() {
    try {
      const data =
        await getDevices();

      setDevices(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDevices();

    const interval =
      setInterval(
        loadDevices,
        10000,
      );

    return () =>
      clearInterval(interval);
  }, []);

  return {
    devices,
    loading,
    loadDevices,
  };
}