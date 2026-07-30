import {
  useCallback,
  useEffect,
  useState,
} from "react";

import Swal from "sweetalert2";

import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
} from "../services/Users.services";

import type {
  CreateUserPayload,
  UpdateUserPayload,
  User,
} from "../types/index";

interface UseUsersOptions {
  enabled?: boolean;
}

export function useUsers({
  enabled = true,
}: UseUsersOptions = {}) {
  const [users, setUsers] =
    useState<User[]>([]);

  const [loading, setLoading] =
    useState(enabled);

  const [saving, setSaving] =
    useState(false);

  const loadUsers =
    useCallback(async () => {
      if (!enabled) {
        setUsers([]);
        setLoading(false);
        return [];
      }

      try {
        setLoading(true);

        const data =
          await getUsers();

        setUsers(data);

        return data;
      } catch (error: any) {
        const message =
          getApiMessage(
            error,
            "Não foi possível carregar os usuários.",
          );

        await Swal.fire({
          icon: "error",
          title:
            "Erro ao carregar usuários",
          text: message,
        });

        return [];
      } finally {
        setLoading(false);
      }
    }, [enabled]);

  const addUser =
    useCallback(
      async (
        data: CreateUserPayload,
      ) => {
        try {
          setSaving(true);

          const createdUser =
            await createUser(data);

          setUsers(
            (current) => [
              createdUser,
              ...current,
            ],
          );

          return createdUser;
        } finally {
          setSaving(false);
        }
      },
      [],
    );

  const editUser =
    useCallback(
      async (
        userId: string,
        data: UpdateUserPayload,
      ) => {
        try {
          setSaving(true);

          const updatedUser =
            await updateUser(
              userId,
              data,
            );

          setUsers(
            (current) =>
              current.map(
                (user) =>
                  user.id === userId
                    ? updatedUser
                    : user,
              ),
          );

          return updatedUser;
        } finally {
          setSaving(false);
        }
      },
      [],
    );

  const removeUser =
    useCallback(
      async (user: User) => {
        const result =
          await Swal.fire({
            icon: "warning",
            title:
              "Excluir usuário?",
            text:
              `O usuário “${user.name}” perderá o acesso ao sistema.`,
            showCancelButton:
              true,
            confirmButtonText:
              "Sim, excluir",
            cancelButtonText:
              "Cancelar",
            confirmButtonColor:
              "#dc2626",
          });

        if (!result.isConfirmed) {
          return false;
        }

        try {
          setSaving(true);

          const response =
            await deleteUser(
              user.id,
            );

          setUsers(
            (current) =>
              current.filter(
                (currentUser) =>
                  currentUser.id !==
                  user.id,
              ),
          );

          await Swal.fire({
            icon: "success",
            title:
              "Usuário excluído",
            text: response.message,
            timer: 1400,
            showConfirmButton:
              false,
          });

          return true;
        } catch (error: any) {
          await Swal.fire({
            icon: "error",
            title:
              "Erro ao excluir",
            text: getApiMessage(
              error,
              "Não foi possível excluir o usuário.",
            ),
          });

          return false;
        } finally {
          setSaving(false);
        }
      },
      [],
    );

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  return {
    users,
    loading,
    saving,

    loadUsers,
    addUser,
    editUser,
    removeUser,
  };
}

export function getApiMessage(
  error: any,
  fallback: string,
) {
  const message =
    error?.response?.data?.message;

  if (Array.isArray(message)) {
    return message[0] ?? fallback;
  }

  return message ?? fallback;
}
