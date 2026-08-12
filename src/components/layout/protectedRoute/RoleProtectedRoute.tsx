import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import type { UserRole } from "../../../contexts/auth-context";
import { useAuth } from "../../../contexts/useAuth";

interface RoleProtectedRouteProps {
  allowedRoles: UserRole[];
  children: ReactNode;
}

export function RoleProtectedRoute({ allowedRoles, children }: RoleProtectedRouteProps) {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/home/dashboard" replace />;
  }

  return <>{children}</>;
}
