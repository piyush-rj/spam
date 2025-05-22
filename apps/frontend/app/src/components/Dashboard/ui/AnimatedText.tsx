"use client"
import React, { FC, useRef, useEffect, createElement } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

interface AnimatedTextProps {
  text: string;
  className?: string;
  element?: keyof React.JSX.IntrinsicElements; // Fixed JSX namespace
  delay?: number;
}

const AnimatedText: FC<AnimatedTextProps> = ({
  text,
  className = '',
  element = 'h2',
  delay = 0.1,
}) => {
  const textRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!textRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const animation = gsap.fromTo(
      textRef.current,
      { autoAlpha: 0, y: 20 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 1,
        delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: textRef.current,
          start: 'top bottom-=100px',
          once: true,
        },
      }
    );

    return () => {
      animation.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [delay, text]);

  return createElement(
    element,
    { ref: textRef, className },
    text
  );
};

export default AnimatedText;