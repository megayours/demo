"use client"

import { Session } from "@chromia/ft4";
import { ReactNode, createContext, useContext, useState, useCallback, useEffect } from "react";
import { createSession } from "../lib/auth";

const ChromiaContext = createContext<{
  session: Session | undefined;
  setSession: (session: Session | undefined) => void;
  logout: () => void;
  isLoading: boolean;
}>({
  session: undefined,
  setSession: () => {},
  logout: () => {},
  isLoading: true,
});

export function useSessionContext() {
  return useContext(ChromiaContext);
}

export function ContextProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | undefined>(undefined);
  const [logoutFunction, setLogoutFunction] = useState<() => void>(() => {});
  const [isLoading, setIsLoading] = useState(true);

  const handleSetSession = useCallback((newSession: Session | undefined) => {
    setSession(newSession);
  }, []);

  const handleLogout = useCallback(() => {
    logoutFunction();
    setSession(undefined);
  }, [logoutFunction]);

  useEffect(() => {
    const attemptAutoLogin = async () => {
      try {
        const { session, logout } = await createSession(true);
        if (session) {
          setSession(session);
          setLogoutFunction(() => logout);
        }
      } catch (error) {
        console.error("Failed to auto-login:", error);
      } finally {
        setIsLoading(false);
      }
    };

    attemptAutoLogin();
  }, []);

  return (
    <ChromiaContext.Provider value={{ session, setSession: handleSetSession, logout: handleLogout, isLoading }}>
      {children}
    </ChromiaContext.Provider>
  );
}