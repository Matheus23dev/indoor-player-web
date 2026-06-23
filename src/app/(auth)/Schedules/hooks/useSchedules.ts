import { useEffect, useState, useCallback } from "react";
import { getSchedules } from "../services/schedules.services";
import type { Schedule } from "../types/schedules";

export function useSchedules() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSchedules = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getSchedules();
      setSchedules(data);
    } catch {
      setError("Erro ao carregar agendamentos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSchedules();
  }, [loadSchedules]);

  return {
    schedules,
    loading,
    error,
    loadSchedules,
  };
}