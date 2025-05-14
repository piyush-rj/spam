"use client"
import { useEffect } from 'react';
import Hero from './src/components/Dashboard/landing/Hero';
import Features from './src/components/Dashboard/landing/Features';
import Footer from './src/components/Dashboard/landing/Footer';
import { useSetRecoilState } from 'recoil';
import { useSession } from 'next-auth/react';
import { CustomSession } from './api/auth/[...nextauth]/options';
import { useSessionStore } from './recoil/atoms/atom';


export default function Home() {

  const { setSession } = useSessionStore();
    const session  = useSession();
    
    useEffect(() => {
      setSession(session.data)
    }, [session])


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