import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { routes } from "../routes";

export function useAuthRedirect() {
  const { user, token, loading } = useAuth();

  if (!loading && token && user) {
    return <Navigate to={user.skills?.length ? routes.home() : routes.auth.interests()} replace />;
  }

  return null;
}
