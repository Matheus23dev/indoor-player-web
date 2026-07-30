export type UserRole =
  | "OWNER"
  | "ADMIN"
  | "OPERATOR";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthenticatedUser {
  id: string;
  name?: string;
  email?: string;
  role: UserRole;
  companyId?: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: Exclude<UserRole, "OWNER">;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  password?: string;
  role?: Exclude<UserRole, "OWNER">;
}

export interface DeleteUserResponse {
  success: boolean;
  message: string;
}
