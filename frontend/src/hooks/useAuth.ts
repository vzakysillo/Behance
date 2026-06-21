import { useContext } from "react";
import { AuthContext } from "../context/authContextDefinition";
import type { AuthContextValue } from "../context/authContextDefinition";

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
