import {
  useCallback,
  useEffect,
  useState,
} from "react";

import Swal from "sweetalert2";

import {
  createSchedule,
  deleteSchedule,
  getSchedules,
  updateSchedule,
} from "../services/schedules.service";

import {
  getDevices,
} from "../services/devices.service";

import {
  getPlaylists,
} from "../services/playlists.service";

import type {
  CreateSchedulePayload,
  Schedule,
  ScheduleDevice,
  SchedulePlaylist,
  UpdateSchedulePayload,
} from "../types";

export function useSchedules() {
  const [
    schedules,
    setSchedules,
  ] = useState<Schedule[]>([]);

  const [
    devices,
    setDevices,
  ] = useState<ScheduleDevice[]>([]);

  const [
    playlists,
    setPlaylists,
  ] = useState<SchedulePlaylist[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    deletingScheduleId,
    setDeletingScheduleId,
  ] = useState<string | null>(null);

  const [
    togglingScheduleId,
    setTogglingScheduleId,
  ] = useState<string | null>(null);

  const loadSchedules =
    useCallback(async () => {
      const data =
        await getSchedules();

      setSchedules(data);

      return data;
    }, []);

  const loadDevices =
    useCallback(async () => {
      const data =
        await getDevices();

      setDevices(data);

      return data;
    }, []);

  const loadPlaylists =
    useCallback(async () => {
      const data =
        await getPlaylists();

      setPlaylists(data);

      return data;
    }, []);

  const loadData =
    useCallback(async () => {
      try {
        setLoading(true);

        const [
          schedulesData,
          devicesData,
          playlistsData,
        ] = await Promise.all([
          getSchedules(),
          getDevices(),
          getPlaylists(),
        ]);

        setSchedules(
          schedulesData,
        );

        setDevices(
          devicesData,
        );

        setPlaylists(
          playlistsData,
        );

        return {
          schedules:
            schedulesData,

          devices:
            devicesData,

          playlists:
            playlistsData,
        };
      } catch (error: any) {
        const message =
          getErrorMessage(
            error,
            "Não foi possível carregar os agendamentos.",
          );

        await Swal.fire({
          icon: "error",
          title:
            "Erro ao carregar",
          text: message,
        });

        return null;
      } finally {
        setLoading(false);
      }
    }, []);

  const addSchedule =
    useCallback(
      async (
        data: CreateSchedulePayload,
      ) => {
        try {
          setSaving(true);

          const schedule =
            await createSchedule(
              data,
            );

          setSchedules(
            (currentSchedules) => [
              schedule,
              ...currentSchedules,
            ],
          );

          return schedule;
        } finally {
          setSaving(false);
        }
      },
      [],
    );

  const editSchedule =
    useCallback(
      async (
        id: string,
        data: UpdateSchedulePayload,
      ) => {
        try {
          setSaving(true);

          const schedule =
            await updateSchedule(
              id,
              data,
            );

          setSchedules(
            (currentSchedules) =>
              currentSchedules.map(
                (
                  currentSchedule,
                ) =>
                  currentSchedule.id ===
                  id
                    ? schedule
                    : currentSchedule,
              ),
          );

          return schedule;
        } finally {
          setSaving(false);
        }
      },
      [],
    );

  const toggleScheduleActive =
    useCallback(
      async (
        schedule: Schedule,
      ) => {
        try {
          setTogglingScheduleId(
            schedule.id,
          );

          const updatedSchedule =
            await updateSchedule(
              schedule.id,
              {
                active:
                  !schedule.active,
              },
            );

          setSchedules(
            (currentSchedules) =>
              currentSchedules.map(
                (
                  currentSchedule,
                ) =>
                  currentSchedule.id ===
                  schedule.id
                    ? updatedSchedule
                    : currentSchedule,
              ),
          );

          return updatedSchedule;
        } catch (error: any) {
          const message =
            getErrorMessage(
              error,
              "Não foi possível alterar o status do agendamento.",
            );

          await Swal.fire({
            icon: "error",
            title:
              "Erro ao alterar status",
            text: message,
          });

          return null;
        } finally {
          setTogglingScheduleId(
            null,
          );
        }
      },
      [],
    );

  const removeSchedule =
    useCallback(
      async (
        schedule: Schedule,
      ) => {
        const result =
          await Swal.fire({
            icon: "warning",
            title:
              "Excluir agendamento?",

            html: `
              <p>
                O agendamento
                <strong>${escapeHtml(
                  schedule.name,
                )}</strong>
                será excluído.
              </p>
            `,

            showCancelButton:
              true,

            confirmButtonText:
              "Sim, excluir",

            cancelButtonText:
              "Cancelar",

            confirmButtonColor:
              "#dc2626",
          });

        if (
          !result.isConfirmed
        ) {
          return;
        }

        try {
          setDeletingScheduleId(
            schedule.id,
          );

          const response =
            await deleteSchedule(
              schedule.id,
            );

          setSchedules(
            (currentSchedules) =>
              currentSchedules.filter(
                (
                  currentSchedule,
                ) =>
                  currentSchedule.id !==
                  schedule.id,
              ),
          );

          await Swal.fire({
            icon: "success",
            title:
              "Agendamento excluído",
            text:
              response.message,
          });
        } catch (error: any) {
          const message =
            getErrorMessage(
              error,
              "Não foi possível excluir o agendamento.",
            );

          await Swal.fire({
            icon: "error",
            title:
              "Erro ao excluir",
            text: message,
          });
        } finally {
          setDeletingScheduleId(
            null,
          );
        }
      },
      [],
    );

  useEffect(() => {
    void loadData();
  }, [loadData]);

  return {
    schedules,
    setSchedules,

    devices,
    setDevices,

    playlists,
    setPlaylists,

    loading,
    saving,

    deletingScheduleId,
    togglingScheduleId,

    loadData,
    loadSchedules,
    loadDevices,
    loadPlaylists,

    addSchedule,
    editSchedule,
    toggleScheduleActive,
    removeSchedule,
  };
}

function getErrorMessage(
  error: any,
  fallback: string,
) {
  const message =
    error?.response?.data
      ?.message ??
    fallback;

  if (
    Array.isArray(message)
  ) {
    return (
      message[0] ??
      fallback
    );
  }

  return String(message);
}

function escapeHtml(
  value: string,
) {
  return value
    .split("&").join("&amp;")
    .split("<").join("&lt;")
    .split(">").join("&gt;")
    .split('"').join("&quot;")
    .split("'").join("&#039;");
}