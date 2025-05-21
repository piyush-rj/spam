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


  const sessionData = useMemo(() => {
    return session.data;
  }, [session]);

  useEffect(() => {
    setSession(sessionData);
  }, [sessionData]);

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
