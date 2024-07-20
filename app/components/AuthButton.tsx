"use client"

import { useSessionContext } from "./ContextProvider";
import { createSession } from "../lib/auth";

const AuthButton = () => {
  const { session, setSession, logout, isLoading } = useSessionContext();

  const handleLogin = async () => {
    try {
      const { session, logout } = await createSession();
      if (session) {
        setSession(session);
      }
    } catch (error) {
      console.error("Failed to create session:", error);
    }
  };

  if (isLoading) {
    return <button className="md:flex gap-x-6 text-white" disabled>Loading...</button>;
  }

  if (session) {
    return <button className="md:flex gap-x-6 text-white" onClick={logout}>Logout</button>;
  }

  return <button className="md:flex gap-x-6 text-white" onClick={handleLogin}>Login</button>;
};

export default AuthButton;