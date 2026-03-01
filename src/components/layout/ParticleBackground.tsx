"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  hue: number; // color variation
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];

    // Pulse wave state
    let pulseX = 0;
    let pulseY = 0;
    let pulseRadius = 0;
    let pulseActive = false;
    let pulseTimer: ReturnType<typeof setInterval>;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function createParticles() {
      if (!canvas) return;
      const isMobile = window.innerWidth < 768;
      const count = isMobile ? 35 : 90;
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.2 - 0.05,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
        // Mix of cyan (180) and purple (270) hues
        hue: Math.random() > 0.7 ? 270 + Math.random() * 20 : 185 + Math.random() * 15,
      }));
    }

    function triggerPulse() {
      if (!canvas) return;
      pulseX = Math.random() * canvas.width;
      pulseY = Math.random() * canvas.height;
      pulseRadius = 0;
      pulseActive = true;
    }

    function onMouseMove(e: MouseEvent) {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    }

    function draw() {
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mouse = mouseRef.current;
      const MOUSE_RADIUS = 120;
      const MOUSE_FORCE = 2;

      // Draw pulse wave
      if (pulseActive) {
        pulseRadius += 3;
        const alpha = Math.max(0, 0.15 - pulseRadius / 2000);
        if (alpha <= 0) {
          pulseActive = false;
        } else {
          ctx.beginPath();
          ctx.arc(pulseX, pulseY, pulseRadius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            const alpha = (1 - dist / 150) * 0.08;
            // Blend the two particle colors for the connection line
            const avgHue = (particles[i].hue + particles[j].hue) / 2;
            ctx.strokeStyle = `hsla(${avgHue}, 100%, 60%, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 100%, 60%, ${p.opacity})`;
        ctx.fill();

        if (!prefersReducedMotion) {
          // Mouse repulsion
          const mdx = p.x - mouse.x;
          const mdy = p.y - mouse.y;
          const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mDist < MOUSE_RADIUS && mDist > 0) {
            const force = (1 - mDist / MOUSE_RADIUS) * MOUSE_FORCE;
            p.vx += (mdx / mDist) * force * 0.1;
            p.vy += (mdy / mDist) * force * 0.1;
          }

          // Pulse push
          if (pulseActive) {
            const pdx = p.x - pulseX;
            const pdy = p.y - pulseY;
            const pDist = Math.sqrt(pdx * pdx + pdy * pdy);
            if (Math.abs(pDist - pulseRadius) < 30 && pDist > 0) {
              p.vx += (pdx / pDist) * 0.3;
              p.vy += (pdy / pDist) * 0.3;
            }
          }

          // Dampen velocity
          p.vx *= 0.98;
          p.vy *= 0.98;

          // Base drift
          p.vx += (Math.random() - 0.5) * 0.02;
          p.vy -= 0.01;

          p.x += p.vx;
          p.y += p.vy;

          // Wrap around
          if (p.y < -10) p.y = canvas.height + 10;
          if (p.x < -10) p.x = canvas.width + 10;
          if (p.x > canvas.width + 10) p.x = -10;
        }
      }

      animationId = requestAnimationFrame(draw);
    }

    resize();
    createParticles();
    draw();

    // Trigger pulse every 6-10 seconds
    pulseTimer = setInterval(triggerPulse, 6000 + Math.random() * 4000);

    window.addEventListener("resize", () => {
      resize();
      createParticles();
    });
    window.addEventListener("mousemove", onMouseMove);

    return () => {
      cancelAnimationFrame(animationId);
      clearInterval(pulseTimer);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}
