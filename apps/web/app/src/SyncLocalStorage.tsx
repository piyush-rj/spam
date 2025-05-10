"use client";

import { JSX } from "react"

import { useEffect } from "react";
import { useSession } from "next-auth/react";

const SyncTokenToLocalStorage = (): JSX.Element | null => {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.token) {
      localStorage.setItem("token", session.user.token);
    }
  }, [session]);

  return null;
};

export default SyncTokenToLocalStorage;
