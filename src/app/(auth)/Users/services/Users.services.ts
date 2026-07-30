import api from "../../../../services/axios";

import type {
  CreateUserPayload,
  DeleteUserResponse,
  UpdateUserPayload,
  User,
} from "../types/index";

export async function getUsers(): Promise<User[]> {
  const response =
    await api.get<User[]>(
      "/users",
    );

  return response.data;
}

export async function createUser(
  data: CreateUserPayload,
): Promise<User> {
  const response =
    await api.post<User>(
      "/users",
      data,
    );

  return response.data;
}

export async function updateUser(
  userId: string,
  data: UpdateUserPayload,
): Promise<User> {
  const response =
    await api.patch<User>(
      `/users/${userId}`,
      data,
    );

  return response.data;
}

export async function deleteUser(
  userId: string,
): Promise<DeleteUserResponse> {
  const response =
    await api.delete<DeleteUserResponse>(
      `/users/${userId}`,
    );

  return response.data;
}
