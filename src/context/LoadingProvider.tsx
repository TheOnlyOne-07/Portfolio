import React, { createContext, useContext, useState } from "react";
import Loading from "../components/Loading";

interface LoadingContextValue {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  setLoading: (percent: number) => void;
}

const LoadingContext = createContext<LoadingContextValue | null>(null);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(
    () => window.innerWidth > 768
  );
  const [loading, setLoading] = useState<number>(0);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading, setLoading }}>
      {isLoading && <Loading percent={loading} />}
      <main className="main-body">{children}</main>
    </LoadingContext.Provider>
  );
};

export function useLoading(): LoadingContextValue {
  const ctx = useContext(LoadingContext);
  if (!ctx) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return ctx;
}
