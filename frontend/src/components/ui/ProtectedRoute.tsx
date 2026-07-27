import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { routes } from "../../routes";
import type { ReactNode } from "react";
import { Spinner } from "./Spinner";

export function ProtectedRoute({ children }: { children?: ReactNode }) {
  const { token, loading } = useAuth();

  if (loading) return <Spinner />;
  if (!token) return <Navigate to={routes.auth.login()} replace />;

  return children ? <>{children}</> : <Outlet />;
}
