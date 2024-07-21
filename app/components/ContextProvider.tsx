"use client"

import { Session } from "@chromia/ft4";
import { ReactNode, createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { createSession } from "../lib/auth";

type SessionsType = { [blockchainIid: number]: Session | undefined };
type LogoutFunction = (() => void) | (() => Promise<void>);

const ChromiaContext = createContext<{
  sessions: SessionsType;
  setSession: (blockchainIid: number, session: Session | undefined, logoutFn?: LogoutFunction) => void;
  logout: (blockchainIid: number) => Promise<void>;
  isLoading: boolean;
}>({
  sessions: {},
  setSession: () => {},
  logout: async () => {},
  isLoading: true,
});

export function useSessionContext() {
  return useContext(ChromiaContext);
}

export function ContextProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<SessionsType>({});
  const [isLoading, setIsLoading] = useState(true);
  const logoutFunctionsRef = useRef<{ [blockchainIid: number]: LogoutFunction }>({});

  const handleSetSession = useCallback((blockchainIid: number, newSession: Session | undefined, logoutFn?: LogoutFunction) => {
    console.log(`Setting session for blockchainIid: ${blockchainIid}`, newSession);
    setSessions(prev => {
      if (newSession === undefined) {
        const { [blockchainIid]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [blockchainIid]: newSession };
    });

    if (newSession && logoutFn) {
      logoutFunctionsRef.current[blockchainIid] = logoutFn;
      localStorage.setItem(`session_${blockchainIid}`, "true");
    } else {
      delete logoutFunctionsRef.current[blockchainIid];
      localStorage.removeItem(`session_${blockchainIid}`);
    }
  }, []);

  const handleLogout = useCallback(async (blockchainIid: number) => {
    console.log(`Handle logout for blockchainIid: ${blockchainIid}`);
    try {
      const logoutFn = logoutFunctionsRef.current[blockchainIid];
      if (logoutFn) {
        const result = logoutFn();
        if (result instanceof Promise) {
          await result;
        }
        console.log("Logout function executed successfully");
      } else {
        console.warn(`No logout function found for blockchainIid: ${blockchainIid}`);
      }
      
      setSessions(prev => {
        const { [blockchainIid]: _, ...rest } = prev;
        return rest;
      });
      
      delete logoutFunctionsRef.current[blockchainIid];
      localStorage.removeItem(`session_${blockchainIid}`);
      
      console.log("Session and logout function removed");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  }, []);

  useEffect(() => {
    const attemptAutoLogin = async () => {
      setIsLoading(true);
      try {
        console.log("Attempting auto-login...");
        const persistedSessionData = localStorage.getItem('session_1');
        if (persistedSessionData) {
          console.log("Found persisted session data, recreating session");
          const { session, logout } = await createSession(true);
          if (session) {
            console.log("Session recreated successfully");
            setSessions({ 1: session });
            logoutFunctionsRef.current[1] = logout;
          } else {
            console.log("Failed to recreate session, removing persisted data");
            localStorage.removeItem('session_1');
          }
        } else {
          console.log("No persisted session found, creating new session");
          const { session, logout } = await createSession(true);
          if (session) {
            console.log("New session created successfully");
            setSessions({ 1: session });
            logoutFunctionsRef.current[1] = logout;
            localStorage.setItem('session_1', "true");
          } else {
            console.log("Failed to create new session");
          }
        }
      } catch (error) {
        console.error("Failed to auto-login:", error);
      } finally {
        setIsLoading(false);
      }
    };

    attemptAutoLogin();
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
      isLoading 
    }}>
      {children}
    </ChromiaContext.Provider>
  );
}