import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { getMe } from "../api/user.api";
import { AuthContext } from "./authContextDefinition";
import type { AuthState } from "./authContextDefinition";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem("token"),
    loading: true,
  });

  const refreshUser = useCallback(async () => {
    try {
      const user = await getMe();
      setState((prev) => ({ ...prev, user, loading: false }));
    } catch {
      localStorage.removeItem("token");
      setState({ user: null, token: null, loading: false });
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    let cancelled = false;

    if (!token) {
      Promise.resolve().then(() => {
        if (!cancelled) setState((prev) => ({ ...prev, loading: false }));
      });
      return () => {
        cancelled = true;
      };
    }

    getMe()
      .then((user) => {
        if (!cancelled) setState({ user, token, loading: false });
      })
      .catch(() => {
        if (!cancelled) {
          localStorage.removeItem("token");
          setState({ user: null, token: null, loading: false });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (token: string) => {
    localStorage.setItem("token", token);
    const user = await getMe();
    setState({ user, token, loading: false });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setState({ user: null, token: null, loading: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}
