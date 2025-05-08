"use client"
import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particlesArray: Particle[] = [];
    const particleCount = Math.min(100, Math.floor(canvas.width * canvas.height / 20000));
    
    for (let i = 0; i < particleCount; i++) {
      const size = Math.random() * 2 + 0.5;
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const directionX = Math.random() * 0.5 - 0.25;
      const directionY = Math.random() * 0.5 - 0.25;
      const color = Math.random() > 0.5 ? '#FFD700' : '#FFA500';
      
      particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update(canvas);
        particlesArray[i].draw(ctx);
      }
      
      connect(particlesArray, canvas, ctx);
    };
    
    animate();
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full bg-black opacity-60" />;
}

class Particle {
  x: number;
  y: number;
  directionX: number;
  directionY: number;
  size: number;
  color: string;
  
  constructor(x: number, y: number, directionX: number, directionY: number, size: number, color: string) {
    this.x = x;
    this.y = y;
    this.directionX = directionX;
    this.directionY = directionY;
    this.size = size;
    this.color = color;
  }
  
  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
  
  update(canvas: HTMLCanvasElement) {
    // Bounce off edges
    if (this.x > canvas.width || this.x < 0) {
      this.directionX = -this.directionX;
    }
    if (this.y > canvas.height || this.y < 0) {
      this.directionY = -this.directionY;
    }
    
    // Update position
    this.x += this.directionX;
    this.y += this.directionY;
  }
}

function connect(particles: Particle[], canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  const maxDistance = canvas.width * 0.08;
  
  for (let a = 0; a < particles.length; a++) {
    for (let b = a; b < particles.length; b++) {
      const dx = particles[a].x - particles[b].x;
      const dy = particles[a].y - particles[b].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < maxDistance) {
        const opacity = 1 - (distance / maxDistance);
        ctx.strokeStyle = `rgba(255, 215, 0, ${opacity * 0.5})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[a].x, particles[a].y);
        ctx.lineTo(particles[b].x, particles[b].y);
        ctx.stroke();
      }
    }
  }
}
