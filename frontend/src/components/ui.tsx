import { Navigate, Outlet} from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { routes } from "../routes";
import type { ReactNode } from "react";


export function Spinner({ className = "" }: { className?: string }) {
  return (
    <div className={`flex justify-center items-center min-h-[200px] ${className}`}>
      <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
    </div>
  );
}

export function ErrorMessage({
  message,
  className = "",
}: {
  message: string;
  className?: string;
}) {
  return (
    <div
      className={`flex justify-center items-center min-h-[200px] text-[#d32f2f] text-base font-['Inter',sans-serif] ${className}`}
    >
      {message}
    </div>
  );
}

export function ProtectedRoute({ children }: { children?: ReactNode }) {
  const { token, loading } = useAuth();

  if (loading) return <Spinner />;
  if (!token) return <Navigate to={routes.auth.login()} replace />;

  return children ? <>{children}</> : <Outlet />;
}