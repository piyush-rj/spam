import { Suspense } from 'react';
import Hero from "./src/components/Dashboard/landing/Hero";
import Features from './src/components/Dashboard/landing/Features';
import Testimonials from './src/components/Dashboard/landing/Testimonials';
import Footer from './src/components/Dashboard/landing/Footer';
import ParticleBackground from './src/components/Dashboard/ui/ParticleBackground';

export default function Home() {
  return (
    <main className="relative overflow-hidden bg-black min-h-screen">
      <ParticleBackground />
      <div className="relative z-10">
        <Hero />
        <Features />
        <Testimonials />
        <Footer />
      </div>
    </main>
  );
}