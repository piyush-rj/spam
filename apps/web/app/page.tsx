"use client";

import { useEffect, useMemo } from 'react';
import Hero from './src/components/Dashboard/landing/Hero';
import Features from './src/components/Dashboard/landing/Features';
import Footer from './src/components/Dashboard/landing/Footer';
import { useSession } from 'next-auth/react';
import { useSessionStore, useSocketStore } from './zustand/atoms/zustand';

export default function Home() {
  const { setSession } = useSessionStore();
  const session = useSession();

  const { setSocket, closeSocket } = useSocketStore();

  const sessionData = useMemo(() => {
    return session.data;
  }, [session]);

  useEffect(() => {
    setSession(sessionData);
  }, [sessionData]);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");

    socket.onopen = () => {
      console.log("WebSocket connected from Home");
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected from Home");
    };

    socket.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    setSocket(socket);

    return () => {
      socket.close();
      closeSocket();
    };
  }, []);

  return (
    <main className="relative overflow-hidden bg-[#141414] min-h-screen">
      <div className="relative z-10">
        <Hero />
        <Features />
        <Footer />
      </div>
    </main>
  );
}
