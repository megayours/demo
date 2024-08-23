"use client"

import { useSessionContext } from "./ContextProvider";
import { createSession } from "../lib/auth";
import { useEffect, useState, useRef, useCallback } from "react";
import Spinner from "./Spinner";
import getMegaYoursChromiaClient from "../lib/megaYoursChromiaClient";
import getFishingGameChromiaClient from "../lib/fishingGameChromiaClient";

const AuthButton = () => {
  const { sessions, setSession, logout } = useSessionContext();
  const [buttonState, setButtonState] = useState<'login' | 'logout' | 'loading' | 'no-wallet'>('loading');
  const loginAttemptedRef = useRef(true);

  useEffect(() => {
    console.log("Effect triggered - Sessions changed:", sessions);
    setButtonState(Object.keys(sessions).length > 1 ? 'logout' : 'login');
  }, [sessions]);

  const handleLogin = async () => {
    console.log("Login button clicked");
    if (buttonState === 'loading') return;

    setButtonState('loading');
    try {
      const { session: megaSession, logout: megaLogoutFn } = await createSession(await getMegaYoursChromiaClient());
      if (megaSession) {
        console.log("New Mega Session created:", megaSession);
        setSession(megaSession.blockchainRid.toString("hex").toUpperCase(), megaSession, megaLogoutFn);
      } else {
        setButtonState('no-wallet');
      }

      const { session: fishingSession, logout: fishingLogoutFn } = await createSession(await getFishingGameChromiaClient());
      if (fishingSession) {
        console.log("New Fishing Session created:", fishingSession);
        setSession(fishingSession.blockchainRid.toString("hex").toUpperCase(), fishingSession, fishingLogoutFn);
      } else {
        setButtonState('no-wallet');
      }
    } catch (error) {
      console.error("Failed to create session:", error);
      setButtonState('login');
    }
  };

  const handleLogout = useCallback(async () => {
    console.log("Logout button clicked");
    if (buttonState === 'loading') return;

    try {
      setButtonState('loading');
      for (const session of Object.values(sessions)) {
        if (!session) continue;
        await logout(session.blockchainRid.toString("hex").toUpperCase());
      }
      console.log("Logout successful");
    } catch (error) {
      console.error("Logout failed:", error);
      setButtonState('logout');
    } finally {
      loginAttemptedRef.current = false;
    }
  }, [logout, buttonState]);

  const buttonClass = `
    flex items-center justify-center w-50 px-4 py-2 rounded-full text-white font-semibold
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
          <span>Connect Wallet</span>
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
          <span>Disconnect Wallet</span>
        </>
      )
    },
    loading: {
      class: `${buttonClass} bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 cursor-not-allowed`,
      onClick: () => { console.log("Loading button clicked"); },
      content: <Spinner size="medium" />
    },
    'no-wallet': {
      class: `${buttonClass} bg-gray-500 cursor-not-allowed`,
      onClick: () => { console.log("No wallet button clicked"); },
      content: <span>MetaMask Missing</span>
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