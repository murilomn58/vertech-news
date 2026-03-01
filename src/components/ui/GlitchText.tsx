"use client";

import { useEffect, useState } from "react";

export default function GlitchText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    // Glitch on mount
    setGlitching(true);
    const timeout = setTimeout(() => setGlitching(false), 500);

    // Then glitch every 5 seconds
    const interval = setInterval(() => {
      setGlitching(true);
      setTimeout(() => setGlitching(false), 300);
    }, 5000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative z-10">{text}</span>
      {glitching && (
        <>
          <span
            className="absolute inset-0 text-neon-cyan animate-glitch"
            style={{ clipPath: "inset(20% 0 40% 0)" }}
            aria-hidden="true"
          >
            {text}
          </span>
          <span
            className="absolute inset-0 text-neon-pink animate-glitch"
            style={{
              clipPath: "inset(60% 0 10% 0)",
              animationDelay: "0.1s",
            }}
            aria-hidden="true"
          >
            {text}
          </span>
        </>
      )}
    </span>
  );
}
