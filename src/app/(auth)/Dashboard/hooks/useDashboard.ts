import { useCallback, useEffect, useRef, useState } from "react";

import type { Device } from "../../Devices/types/device";
import { getDevices } from "../../Devices/services/devices.services";
import type { Media } from "../../Medias/types";
import { getMedias } from "../../Medias/services/medias.services";
import type { Playlist } from "../../Playlists/types";
import { getPlaylists } from "../../Playlists/services/Playlists.services";
import type { Schedule } from "../../Schedules/types";
import { getSchedules } from "../../Schedules/services/schedules.service";

export interface DashboardData {
  devices: Device[];
  medias: Media[];
  playlists: Playlist[];
  schedules: Schedule[];
}

const emptyData: DashboardData = {
  devices: [],
  medias: [],
  playlists: [],
  schedules: [],
};

export function useDashboard() {
  const [data, setData] = useState<DashboardData>(emptyData);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);
  const mountedRef = useRef(false);
  const hasLoadedRef = useRef(false);

  const loadDashboard = useCallback(async () => {
    if (hasLoadedRef.current) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    const results = await Promise.allSettled([
      getDevices(),
      getMedias(),
      getPlaylists(),
      getSchedules(),
    ]);

    if (!mountedRef.current) {
      return;
    }

    const [devicesResult, mediasResult, playlistsResult, schedulesResult] = results;
    const failedRequests = results.filter((result) => result.status === "rejected").length;

    setData((current) => ({
      devices: devicesResult.status === "fulfilled" ? devicesResult.value : current.devices,
      medias: mediasResult.status === "fulfilled" ? mediasResult.value : current.medias,
      playlists: playlistsResult.status === "fulfilled" ? playlistsResult.value : current.playlists,
      schedules: schedulesResult.status === "fulfilled" ? schedulesResult.value : current.schedules,
    }));

    setError(
      failedRequests > 0
        ? failedRequests === results.length
          ? "Não foi possível carregar os dados do dashboard."
          : "Alguns indicadores não puderam ser atualizados. Os demais dados continuam disponíveis."
        : null,
    );
    setLastUpdatedAt(new Date());
    hasLoadedRef.current = true;
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    void loadDashboard();

    return () => {
      mountedRef.current = false;
    };
  }, [loadDashboard]);

  return {
    ...data,
    loading,
    refreshing,
    error,
    lastUpdatedAt,
    loadDashboard,
  };
}
