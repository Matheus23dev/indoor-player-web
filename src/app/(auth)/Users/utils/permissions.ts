import type {
  AuthenticatedUser,
  User,
  UserRole,
} from "../types";

export function canAccessUsersModule(
  role?: UserRole | null,
) {
  return (
    role === "OWNER" ||
    role === "ADMIN"
  );
}

export function canCreateUser(
  role?: UserRole | null,
) {
  return canAccessUsersModule(role);
}

export function canEditUser(
  currentUser: AuthenticatedUser,
  targetUser: User,
) {
  if (targetUser.role === "OWNER") {
    return false;
  }

  if (currentUser.role === "OWNER") {
    return true;
  }

  if (currentUser.role === "ADMIN") {
    return (
      targetUser.role === "OPERATOR" ||
      targetUser.id === currentUser.id
    );
  }

  return false;
}

export function canDeleteUser(
  currentUser: AuthenticatedUser,
  targetUser: User,
) {
  if (
    targetUser.role === "OWNER" ||
    targetUser.id === currentUser.id
  ) {
    return false;
  }

  if (currentUser.role === "OWNER") {
    return true;
  }

  return (
    currentUser.role === "ADMIN" &&
    targetUser.role === "OPERATOR"
  );
}

export function getAssignableRoles(
  requesterRole: UserRole,
): Array<{
  value: Exclude<UserRole, "OWNER">;
  label: string;
}> {
  if (requesterRole === "OWNER") {
    return [
      {
        value: "ADMIN",
        label: "Administrador",
      },
      {
        value: "OPERATOR",
        label: "Operador",
      },
    ];
  }

  if (requesterRole === "ADMIN") {
    return [
      {
        value: "OPERATOR",
        label: "Operador",
      },
    ];
  }

  return [];
}

export function getRoleLabel(
  role: UserRole,
) {
  switch (role) {
    case "OWNER":
      return "Proprietário";

    case "ADMIN":
      return "Administrador";

    case "OPERATOR":
      return "Operador";

    default:
      return role;
  }
}
