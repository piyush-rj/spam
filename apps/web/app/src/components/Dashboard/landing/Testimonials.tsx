"use client"
import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import AnimatedText from '../ui/AnimatedText';

const testimonials = [
  {
    quote: "Orbit has transformed how our remote team collaborates. The interface is intuitive and the features are exactly what we needed.",
    author: "Anjan Suman",
    position: "WEB3 SDE",
    company: "Solana",
  },
  {
    quote: "I've tried dozens of chat apps, but Orbit stands apart with its performance and thoughtful design. It's become essential to our workflow.",
    author: "Rishi Kant",
    position: "FullStack Developer",
    company: "100xDevs",
  },
  {
    quote: "The encryption and privacy features in Orbit give us confidence when discussing sensitive client information. Plus, it's just beautiful to use.",
    author: "Nayan Suman",
    position: "AI Engineer",
    company: "Google",
  },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!cardsRef.current) return;
    
    const cards = cardsRef.current.querySelectorAll('.testimonial-card');
    
    gsap.from(cards, {
      scale: 0.8,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: cardsRef.current,
        start: "top bottom-=100",
      }
    });
    
    return () => {
      gsap.killTweensOf(cards);
    };
  }, []);
  
  return (
    <section ref={sectionRef} className="py-24 bg-black relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,215,0,0.05)_0,_transparent_60%)]" />
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <AnimatedText 
            element="h2" 
            text="What Our Users Are Saying" 
            className="text-3xl md:text-4xl font-bold text-white mb-6"
          />
          <AnimatedText 
            element="p" 
            text="Join thousands of satisfied users who have transformed their communication experience with Orbit."
            className="text-xl text-gray-400"
            delay={0.4}
          />
        </div>
        
        <div ref={cardsRef} className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="testimonial-card bg-gradient-to-br from-black to-gray-900 rounded-xl p-8 border border-yellow-500/10 shadow-lg relative overflow-hidden"
            >
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-yellow-500/5 rounded-full translate-y-1/2 -translate-x-1/2" />
              
              {/* Quote icon */}
              <div className="text-yellow-500/20 mb-4">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              
              <p className="text-gray-300 mb-6 relative z-10">{testimonial.quote}</p>
              
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center mr-4">
                  <span className="text-yellow-500 font-semibold">{testimonial.author[0]}</span>
                </div>
                <div>
                  <h4 className="text-white font-medium">{testimonial.author}</h4>
                  <p className="text-gray-400 text-sm">{testimonial.position}, {testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-1 text-yellow-500">
            <span className="font-medium">4.9</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-gray-400 text-sm">from 500+ reviews</span>
          </div>
        </div>
      </div>
    </section>
  );
}