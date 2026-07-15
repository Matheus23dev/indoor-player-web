export type UserRole =
  | 'OWNER'
  | 'ADMIN'
  | 'EMPLOYEE';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: Exclude<UserRole, 'OWNER'>;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  password?: string;
  role?: Exclude<UserRole, 'OWNER'>;
}

export interface RemoveUserResponse {
  success: boolean;
  message: string;
}