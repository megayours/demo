"use client"

import { Session } from "@chromia/ft4";
import { ReactNode, createContext, useContext, useState, useCallback, useEffect, useRef } from "react";

type SessionsType = { [blockchainRid: string]: Session | undefined };
type LogoutFunction = (() => void) | (() => Promise<void>);

const ChromiaContext = createContext<{
  sessions: SessionsType;
  setSession: (blockchainRid: string, session: Session | undefined, logoutFn?: LogoutFunction) => void;
  logout: (blockchainRid: string) => Promise<void>;
}>({
  sessions: {},
  setSession: () => { },
  logout: async () => { },
});

export function useSessionContext() {
  return useContext(ChromiaContext);
}

export function ContextProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<SessionsType>({});
  const logoutFunctionsRef = useRef<{ [blockchainRid: string]: LogoutFunction }>({});

  const handleSetSession = useCallback((blockchainRid: string, newSession: Session | undefined, logoutFn?: LogoutFunction) => {
    console.log(`Setting session for blockchainRid: ${blockchainRid}`, newSession);
    setSessions(prev => {
      if (newSession === undefined) {
        const { [blockchainRid]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [blockchainRid]: newSession };
    });

    if (newSession && logoutFn) {
      logoutFunctionsRef.current[blockchainRid.toUpperCase()] = logoutFn;
      localStorage.setItem(`session_${blockchainRid.toUpperCase()}`, "true");
    } else {
      delete logoutFunctionsRef.current[blockchainRid.toUpperCase()];
      localStorage.removeItem(`session_${blockchainRid.toUpperCase()}`);
    }
  }, []);

  const handleLogout = useCallback(async (blockchainRid: string) => {
    console.log(`Handle logout for blockchainRid: ${blockchainRid}`);
    try {
      const logoutFn = logoutFunctionsRef.current[blockchainRid.toUpperCase()];
      if (logoutFn) {
        const result = logoutFn();
        if (result instanceof Promise) {
          await result;
        }
        console.log("Logout function executed successfully");
      } else {
        console.warn(`No logout function found for blockchainRid: ${blockchainRid}`);
      }

      setSessions(prev => {
        const { [blockchainRid]: _, ...rest } = prev;
        return rest;
      });

      delete logoutFunctionsRef.current[blockchainRid.toUpperCase()];
      localStorage.removeItem(`session_${blockchainRid.toUpperCase()}`);

      console.log("Session and logout function removed");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  }, []);

  useEffect(() => {
    console.log("Current sessions:", sessions);
    console.log("Logout functions available:", Object.keys(logoutFunctionsRef.current));
  }, [sessions]);

  return (
    <ChromiaContext.Provider value={{
      sessions,
      setSession: handleSetSession,
      logout: handleLogout,
    }}>
      {children}
    </ChromiaContext.Provider>
  );
}