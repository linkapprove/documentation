import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "linkapprove-docs-token";

type ApiTokenContextValue = {
  token: string;
  setToken: (value: string) => void;
  clearToken: () => void;
};

const ApiTokenContext = createContext<ApiTokenContextValue>({
  token: "",
  setToken: () => undefined,
  clearToken: () => undefined,
});

export function ApiTokenProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState("");

  useEffect(() => {
    setTokenState(sessionStorage.getItem(STORAGE_KEY) ?? "");
  }, []);

  const setToken = useCallback((value: string) => {
    setTokenState(value);
    if (value) sessionStorage.setItem(STORAGE_KEY, value);
    else sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  const clearToken = useCallback(() => setToken(""), [setToken]);

  const value = useMemo(
    () => ({ token, setToken, clearToken }),
    [token, setToken, clearToken]
  );

  return (
    <ApiTokenContext.Provider value={value}>
      {children}
    </ApiTokenContext.Provider>
  );
}

export const useApiToken = () => useContext(ApiTokenContext);
