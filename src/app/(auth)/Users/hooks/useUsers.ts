import {
    useCallback,
    useEffect,
    useState,
  } from 'react';
  
  import {
    createUser,
    getUsers,
    removeUser,
    updateUser,
  } from '../services/users.services';
  
  import type {
    CreateUserPayload,
    UpdateUserPayload,
    User,
  } from '../types/users.types';
  
  export function useUsers() {
    const [users, setUsers] =
      useState<User[]>([]);
  
    const [loading, setLoading] =
      useState(false);
  
    const [saving, setSaving] =
      useState(false);
  
    const loadUsers =
      useCallback(
        async () => {
          try {
            setLoading(true);
  
            const data =
              await getUsers();
  
            setUsers(data);
          } finally {
            setLoading(false);
          }
        },
        [],
      );
  
    const handleCreateUser =
      useCallback(
        async (
          payload: CreateUserPayload,
        ) => {
          try {
            setSaving(true);
  
            const user =
              await createUser(payload);
  
            setUsers(
              currentUsers => [
                user,
                ...currentUsers,
              ],
            );
  
            return user;
          } finally {
            setSaving(false);
          }
        },
        [],
      );
  
    const handleUpdateUser =
      useCallback(
        async (
          id: string,
          payload: UpdateUserPayload,
        ) => {
          try {
            setSaving(true);
  
            const updatedUser =
              await updateUser(
                id,
                payload,
              );
  
            setUsers(
              currentUsers =>
                currentUsers.map(user =>
                  user.id === id
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
  
    const handleRemoveUser =
      useCallback(
        async (
          id: string,
        ) => {
          await removeUser(id);
  
          setUsers(
            currentUsers =>
              currentUsers.filter(
                user => user.id !== id,
              ),
          );
        },
        [],
      );
  
    useEffect(
      () => {
        void loadUsers();
      },
      [
        loadUsers,
      ],
    );
  
    return {
      users,
      loading,
      saving,
      loadUsers,
      createUser: handleCreateUser,
      updateUser: handleUpdateUser,
      removeUser: handleRemoveUser,
    };
  }