import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { roleHome } from "../routes/roleHome";

export default function AuthLayout() {
  const { user } = useAuth();
  if (user) return <Navigate replace to={roleHome[user.role]} />;
  return <Outlet />;
}
