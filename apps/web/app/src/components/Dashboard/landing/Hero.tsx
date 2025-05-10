"use client"
import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import Button from '../ui/Button';
import AnimatedText from '../ui/AnimatedText';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const router = useRouter()
  const { data: session } = useSession()
  
  useEffect(() => {
    const heroEl = heroRef.current;
    const imageEl = imageRef.current;
    
    if (!heroEl || !imageEl) return;
    
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    
    tl.fromTo(imageEl, 
      { scale: 1.2, opacity: 0 }, 
      { scale: 1, opacity: 1, duration: 1.5, delay: 0.2 }
    );
    
    gsap.fromTo(
      heroEl.querySelector('.cta-buttons'),
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 1 }
    );
    
    return () => {
      tl.kill();
    };
  }, []);

  function handleRedirect(){
    if (session ){
      router.push("/chat")
    } else {
      // add toast here
      alert("please signin to continue")
    }
  }
  
  return (
    <div ref={heroRef} className="relative min-h-screen pb-[200px] flex items-center justify-center pt-[200px] overflow-hidden">

      <div className="absolute inset-0 flex items-center justify-center opacity-30">
        <div ref={imageRef} className="relative w-full h-full">
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(124,58,237,0.15)_0,_transparent_70%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(45,212,191,0.1)_0,_transparent_50%)]" />
        </div>
      </div>
      
      <div className="container mx-auto max-w-7xl relative z-5 top-0">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">

            <div className="inline-flex items-center space-x-2 bg-purple-500/10 rounded-full px-4 py-2 text-cyan-400 text-sm font-medium backdrop-blur-sm">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-400"></span>
              </span>
              <span>Join the orbit now</span>
            </div>
            
            <div className="space-y-4">
              <AnimatedText 
                element="h1" 
                text="Connect Beyond Boundaries with Orbit" 
                className="text-4xl md:text-6xl font-extrabold text-[#e4e4e4] tracking-tight"
              />
              <AnimatedText 
                element="p" 
                text="The next generation chat platform that brings conversations to life with seamless connectivity and cutting-edge design."
                className="text-xl text-gray-300 max-w-xl"
                delay={0.6}
              />
            </div>
            
            <div onClick={handleRedirect} className="cta-buttons flex flex-wrap gap-4">
              <Button variant="gradient" size="lg" className="text-white shadow-lg shadow-purple-500/20 hover:shadow-cyan-500/40 transition-all duration-300">
                Get Started
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Button>
            </div>
            
            <div className="flex items-center space-x-4 text-gray-300 text-sm">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-gradient-to-br from-purple-500 to-cyan-500" />
                ))}
              </div>
              <div>
                <span className="text-white font-medium">1,000+</span> users already connected
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative rounded-xl overflow-hidden ml-10 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10" />
              <img 
                src="/dottedHands.jpeg" 
                alt="Orbit Chat Interface" 
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute top-6 right-6 w-16 h-16 bg-purple-500/20 rounded-full blur-xl" />
              <div className="absolute bottom-12 left-12 w-20 h-20 bg-cyan-500/20 rounded-full blur-xl" />
            </div>
            
            <div className="absolute -top-8 -right-8 bg-gray-900 rounded-lg p-3 shadow-xl border border-purple-500/30 transform rotate-3 hover:-rotate-1 hover:border-purple-500/50 transition-all duration-300">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-white font-medium">End-to-End Encrypted</span>
              </div>
            </div>
            
            <div className="absolute -bottom-6 left-6 bg-gray-900 rounded-lg p-3 shadow-xl -rotate-3 border border-cyan-500/30 hover:border-cyan-500/50 hover:rotate-1 transform transition-all duration-300">
              <div className="flex items-center space-x-2">
                <span className="text-cyan-400 text-xs font-medium">ONLINE</span>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-white font-medium">256 users</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}