"use client"

import { Session } from "@chromia/ft4";
import { ReactNode, createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { createSession } from "../lib/auth";
import getMegaYoursChromiaClient from "../lib/megaYoursChromiaClient";

type SessionsType = { [blockchainRid: string]: Session | undefined };
type LogoutFunction = (() => void) | (() => Promise<void>);

const ChromiaContext = createContext<{
  sessions: SessionsType;
  setSession: (blockchainRid: string, session: Session | undefined, logoutFn?: LogoutFunction) => void;
  logout: (blockchainRid: string) => Promise<void>;
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
    const attemptAutoLogin = async () => {
      setIsLoading(true);
      try {
        console.log("Attempting auto-login...");
        const client = await getMegaYoursChromiaClient();
        const persistedSessionData = localStorage.getItem(`session_${client.config.blockchainRid.toUpperCase()}`);
        if (persistedSessionData) {
          console.log("Found persisted session data, recreating session");
          const { session, logout } = await createSession(true);
          if (session) {
            console.log("Session recreated successfully");
            setSessions({ [client.config.blockchainRid.toUpperCase()]: session });
            logoutFunctionsRef.current[client.config.blockchainRid.toUpperCase()] = logout;
          } else {
            console.log("Failed to recreate session, removing persisted data");
            localStorage.removeItem(`session_${client.config.blockchainRid.toUpperCase()}`);
          }
        } else {
          console.log("No persisted session found, creating new session");
          const { session, logout } = await createSession(true);
          if (session) {
            console.log("New session created successfully");
            setSessions({ [client.config.blockchainRid.toUpperCase()]: session });
            logoutFunctionsRef.current[client.config.blockchainRid.toUpperCase()] = logout;
            localStorage.setItem(`session_${client.config.blockchainRid.toUpperCase()}`, "true");
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