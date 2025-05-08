import { Suspense } from 'react';
import Hero from "./src/components/Dashboard/landing/Hero";
import Features from './src/components/Dashboard/landing/Features';
import Footer from './src/components/Dashboard/landing/Footer';
import ParticleBackground from './src/components/Dashboard/ui/ParticleBackground';

export default function Home() {
  return (
    <main className="relative overflow-hidden bg-black min-h-screen">
      <ParticleBackground />
      <div className="relative z-10">
        <Hero />
        <Features />
        <Footer />
      </div>
    </main>
  );
}