import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { Role } from "../types";
import { roleHome } from "./roleHome";

export default function RoleRoute({ allowedRoles }: { allowedRoles: Role[] }) {
  const { user } = useAuth();

  if (!user) return <Navigate replace to="/login" />;
  if (!allowedRoles.includes(user.role)) {
    return <Navigate replace to={roleHome[user.role]} />;
  }

  return <Outlet />;
}
