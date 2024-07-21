"use client"

import { useSessionContext } from "./ContextProvider";
import { createSession } from "../lib/auth";
import { useEffect, useState, useRef, useCallback } from "react";
import Spinner from "./Spinner";

const AuthButton = () => {
  const { sessions, setSession, logout, isLoading } = useSessionContext();
  const [buttonState, setButtonState] = useState<'login' | 'logout' | 'loading'>('loading');
  const loginAttemptedRef = useRef(true);

  useEffect(() => {
    console.log("Effect triggered - Sessions changed:", sessions);
    console.log("Effect triggered - isLoading:", isLoading);
    if (isLoading) {
      setButtonState('loading');
    } else {
      setButtonState(Object.keys(sessions).length > 0 ? 'logout' : 'login');
    }
    console.log("Button state set to:", buttonState);
  }, [sessions, isLoading]);

  const handleLogin = async () => {
    console.log("Login button clicked");
    if (buttonState === 'loading') return;

    setButtonState('loading');
    try {
      const { session: newSession, logout: logoutFn } = await createSession();
      if (newSession) {
        console.log("New session created:", newSession);
        setSession(1, newSession, logoutFn);
      }
    } catch (error) {
      console.error("Failed to create session:", error);
      setButtonState('login');
    }
  };

  const handleLogout = useCallback(async () => {
    console.log("Logout button clicked");
    if (buttonState === 'loading') return;

    setButtonState('loading');
    try {
      console.log("Attempting to logout...");
      await logout(1);
      console.log("Logout successful");
    } catch (error) {
      console.error("Logout failed:", error);
      setButtonState('logout');
    } finally {
      loginAttemptedRef.current = false;
    }
  }, [logout, buttonState]);

  const buttonClass = `
    flex items-center justify-center w-32 px-4 py-2 rounded-full text-white font-semibold
    transition-all duration-300 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-accent)]
  `;

  const buttonConfig = {
    login: {
      class: `${buttonClass} bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 active:from-purple-700 active:via-pink-700 active:to-red-700`,
      onClick: handleLogin,
      content: (
        <>
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
          <span>Login</span>
        </>
      )
    },
    logout: {
      class: `${buttonClass} bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 hover:from-red-600 hover:via-orange-600 hover:to-yellow-600 active:from-red-700 active:via-orange-700 active:to-yellow-700`,
      onClick: handleLogout,
      content: (
        <>
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
          </svg>
          <span>Logout</span>
        </>
      )
    },
    loading: {
      class: `${buttonClass} bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 cursor-not-allowed`,
      onClick: () => { console.log("Loading button clicked"); },
      content: <Spinner size="medium" />
    }
  };

  const currentButton = buttonConfig[buttonState];

  console.log("Rendering button with state:", buttonState);

  return (
    <button
      className={currentButton.class}
      onClick={() => {
        console.log("Button clicked, current state:", buttonState);
        currentButton.onClick();
      }}
      disabled={buttonState === 'loading'}
    >
      {currentButton.content}
    </button>
  );
};

export default AuthButton;