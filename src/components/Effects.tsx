"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

// ─── Count-up Hook ────────────────────────────────────────
export function useCountUp(target: number, duration = 2000, decimals = 0) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  useEffect(() => {
    if (!inView) return;
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const current = progress * target;
      
      if (decimals > 0) {
        setVal(parseFloat(current.toFixed(decimals)));
      } else {
        setVal(Math.floor(current));
      }

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setVal(target);
      }
    };
    window.requestAnimationFrame(step);
  }, [inView, target, duration, decimals]);

  return { val, ref };
}

// ─── Mini Chart Line (Card Header) ────────────────────────
export function MiniChart() {
  return (
    <div className="absolute top-0 left-0 w-full h-16 overflow-hidden opacity-50 pointer-events-none">
      <svg width="100%" height="100%" viewBox="0 0 100 40" preserveAspectRatio="none" className="filter drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]">
        <motion.path
          d="M0 35 C 10 32, 20 38, 30 25 C 40 12, 50 18, 60 10 C 70 2, 80 8, 90 5 C 95 3, 100 0, 100 0"
          fill="none"
          stroke="#10b981"
          strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <motion.path
          d="M0 35 C 10 32, 20 38, 30 25 C 40 12, 50 18, 60 10 C 70 2, 80 8, 90 5 C 95 3, 100 0, 100 0 L 100 40 L 0 40 Z"
          fill="url(#miniChartGradient)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.15 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
        />
        <defs>
          <linearGradient id="miniChartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

// ─── Particle Background ───────────────────────────────────
export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: { x: number; y: number; size: number; spX: number; spY: number; opacity: number }[] = [];
    const particleCount = 40;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          spX: (Math.random() - 0.5) * 0.3,
          spY: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.5 + 0.1
        });
      }
    };

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.x += p.spX;
        p.y += p.spY;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 215, 0, ${p.opacity})`;
        ctx.fill();
      });
      requestAnimationFrame(animate);
    };

    window.addEventListener("resize", resize);
    resize();
    createParticles();
    animate();

    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1]"
      style={{ opacity: 0.4 }}
    />
  );
}
