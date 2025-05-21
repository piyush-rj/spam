import { Suspense } from 'react';
import Footer from '@/app/src/components/Dashboard/landing/Footer';
import Hero from '@/app/src/components/Dashboard/landing/Hero';
import Features from '@/app/src/components/Dashboard/landing/Features';


export default function Home() {
  return (
    <div className="relative overflow-hidden bg-[#fff] min-h-screen">
      <div className="relative z-10">
        <Hero />
        <Features />
        <Footer />
      </div>
    </div>
  );
}