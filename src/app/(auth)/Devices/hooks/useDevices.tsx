import { useEffect, useState } from "react";

import {
  getDevices,
} from "../services/devices.services";

export function useDevices() {
  const [devices, setDevices] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  async function loadDevices() {
    try {
      const data =
        await getDevices();

      setDevices(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDevices();

    const interval =
      setInterval(loadDevices, 30000);

    return () =>
      clearInterval(interval);
  }, []);

  return {
    devices,
    loading,
    loadDevices,
  };
}