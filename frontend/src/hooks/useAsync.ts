import { useEffect, useState } from "react";

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string;
}

export function useAsync<T>(fn: () => Promise<T>): AsyncState<T> & { reload: () => void } {
  const [reloadKey, setReloadKey] = useState(0);
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: true,
    error: "",
  });

  useEffect(() => {
    let cancelled = false;

    fn()
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: "" });
      })
      .catch((err) => {
        if (!cancelled)
          setState({
            data: null,
            loading: false,
            error: err instanceof Error ? err.message : String(err),
          });
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadKey]);

  return {
    ...state,
    reload: () => {
      setState((prev) => ({ ...prev, loading: true, error: "" }));
      setReloadKey((k) => k + 1);
    },
  };
}
