"use client"
import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import AnimatedText from '../ui/AnimatedText';

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Instant Messaging',
    description: 'Send and receive messages instantly with zero latency across all your devices.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: 'End-to-End Encryption',
    description: 'Your conversations stay private with military-grade encryption protocols.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: 'Group Channels',
    description: 'Create dedicated spaces for teams, projects, or communities with rich collaboration tools.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Media Sharing',
    description: 'Seamlessly share photos, videos, documents and more with automatic organization.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
      </svg>
    ),
    title: 'Smart Replies',
    description: 'AI-powered contextual suggestions help you respond quickly and effectively.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
    ),
    title: 'Voice Messages',
    description: 'Record and send voice notes with high-quality audio compression technology.',
  },
];

export default function Features() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  useEffect(() => {
    if (!featuresRef.current) return;
    
    const featureItems = featuresRef.current.querySelectorAll('.feature-item');
    
    gsap.from(featureItems, {
      y: 60,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out",
      scrollTrigger: {
        trigger: featuresRef.current,
        start: "top bottom-=100",
      }
    });
    
    return () => {
      gsap.killTweensOf(featureItems);
    };
  }, []);
  
  return (
    <section 
      ref={sectionRef} 
      className="pt-24 pb-16 bg-black relative overflow-hidden"
      style={{
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23333' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
      }}
    >

      <div className="hidden md:block absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="hidden md:block absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent">
        <div className="absolute left-1/4 top-1/2 w-2 h-2 bg-cyan-500 rounded-full -translate-y-1/2" />
        <div className="absolute left-2/4 top-1/2 w-2 h-2 bg-purple-500 rounded-full -translate-y-1/2" />
        <div className="absolute left-3/4 top-1/2 w-2 h-2 bg-cyan-500 rounded-full -translate-y-1/2" />
      </div>
      
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <div className="inline-block mb-6">
            <div className="py-1 px-3 border border-white/10 rounded-full text-xs uppercase tracking-widest text-white/70 backdrop-blur-sm bg-black/30">
              Communication Reimagined
            </div>
          </div>
          
          <AnimatedText 
            element="h2" 
            text="Powerful Features for Modern Communication" 
            className="text-3xl md:text-5xl font-bold text-white mb-8 tracking-tight"
          />
        </div>
        
        <div 
          ref={featuresRef} 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="feature-item group relative"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* animated border */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 animate-gradient-x"></div>
                <div className="absolute inset-[1px] rounded-2xl bg-black"></div>
              </div>
              
              <div className="relative z-10 p-8 rounded-2xl bg-black/40 backdrop-blur-sm border border-white/5 h-full flex flex-col">
                {/* icons */}
                <div className="relative mb-6 w-14 h-14 overflow-hidden rounded-xl">
                  <div className={`absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 animate-gradient-x transition-opacity duration-300 ${hoveredIndex === index ? 'opacity-100' : 'opacity-30'}`}></div>
                  <div className="absolute inset-0 flex items-center justify-center text-white">
                    {feature.icon}
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-white/70 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Bottom decorative element */}
        <div className="mt-2 relative flex justify-center">
          <div className="relative flex flex-col items-center">
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-black animate-bounce transition-all transform duration-300 backdrop-blur-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e4e4e4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-orbit-icon lucide-orbit"><path d="M20.341 6.484A10 10 0 0 1 10.266 21.85"/><path d="M3.659 17.516A10 10 0 0 1 13.74 2.152"/><circle cx="12" cy="12" r="3"/><circle cx="19" cy="5" r="2"/><circle cx="5" cy="19" r="2"/></svg>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        @keyframes gradient-x {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 4s ease infinite;
        }
      `}</style>
    </section>
  );
}