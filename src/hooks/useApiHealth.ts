import { useCallback, useEffect, useState } from "react";
import { API_BASE_URL } from "../lib/environment";

export type ApiHealthStatus = "checking" | "online" | "offline";

export function useApiHealth(intervalMs = 60_000) {
  const [status, setStatus] = useState<ApiHealthStatus>("checking");

  const check = useCallback(async () => {
    if (!navigator.onLine) {
      setStatus("offline");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(5_000),
      });

      setStatus(response.ok ? "online" : "offline");
    } catch {
      setStatus("offline");
    }
  }, []);

  useEffect(() => {
    void check();

    const interval = window.setInterval(() => void check(), intervalMs);
    window.addEventListener("online", check);
    window.addEventListener("offline", check);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("online", check);
      window.removeEventListener("offline", check);
    };
  }, [check, intervalMs]);

  return { status, refresh: check };
}
