import api from '../../../../services/axios';

import type {
  CreateUserPayload,
  RemoveUserResponse,
  UpdateUserPayload,
  User,
} from '../types/users.types';

export async function getUsers(): Promise<User[]> {
  const response =
    await api.get<User[]>(
      '/users',
    );

  return response.data;
}

export async function createUser(
  payload: CreateUserPayload,
): Promise<User> {
  const response =
    await api.post<User>(
      '/users',
      payload,
    );

  return response.data;
}

export async function updateUser(
  id: string,
  payload: UpdateUserPayload,
): Promise<User> {
  const response =
    await api.patch<User>(
      `/users/${id}`,
      payload,
    );

  return response.data;
}

export async function removeUser(
  id: string,
): Promise<RemoveUserResponse> {
  const response =
    await api.delete<RemoveUserResponse>(
      `/users/${id}`,
    );

  return response.data;
}