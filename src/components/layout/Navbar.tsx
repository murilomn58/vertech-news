"use client";

import Link from "next/link";
import { useState } from "react";
import GlitchText from "@/components/ui/GlitchText";
import { CATEGORIES } from "@/lib/constants";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const categories = Object.values(CATEGORIES);

  return (
    <nav className="relative z-20 border-b border-border-dim bg-void/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-neon-cyan glow-cyan" />
          <GlitchText
            text="VERTECH NEWS"
            className="font-mono font-bold text-lg tracking-wider text-neon-cyan text-glow-cyan"
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="font-mono text-xs uppercase tracking-widest text-text-secondary hover:text-text-primary transition-colors duration-200"
              style={{
                ["--hover-color" as string]: cat.color,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = cat.color)
              }
              onMouseLeave={(e) => (e.currentTarget.style.color = "")}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Mobile burger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Toggle menu"
        >
          <span
            className={`block w-5 h-0.5 bg-neon-cyan transition-transform duration-200 ${
              menuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-neon-cyan transition-opacity duration-200 ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-neon-cyan transition-transform duration-200 ${
              menuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border-dim bg-void/95 backdrop-blur-md">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-3 font-mono text-sm uppercase tracking-widest text-text-secondary hover:text-text-primary border-b border-border-dim/50 transition-colors"
            >
              <span
                className="inline-block w-2 h-2 rounded-full mr-3"
                style={{ backgroundColor: cat.color }}
              />
              {cat.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
