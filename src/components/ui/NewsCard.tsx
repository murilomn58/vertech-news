"use client";

import { useRef } from "react";
import { CATEGORIES } from "@/lib/constants";
import { NewsArticle } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import CategoryBadge from "./CategoryBadge";
import SourceBadge from "./SourceBadge";

export default function NewsCard({ article }: { article: NewsArticle }) {
  const catColor = CATEGORIES[article.category].color;
  const cardRef = useRef<HTMLAnchorElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent) {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card || !glow) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // 3D tilt (max 4 degrees)
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;

    // Light reflection that follows cursor
    glow.style.opacity = "1";
    glow.style.background = `radial-gradient(300px circle at ${x}px ${y}px, ${catColor}20, transparent 60%)`;
  }

  function handleMouseLeave() {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (card) {
      card.style.transform = "perspective(800px) rotateX(0) rotateY(0) scale(1)";
      card.style.borderColor = "";
      card.style.boxShadow = "";
    }
    if (glow) {
      glow.style.opacity = "0";
    }
  }

  function handleMouseEnter() {
    const card = cardRef.current;
    if (card) {
      card.style.borderColor = catColor;
      card.style.boxShadow = `0 0 5px ${catColor}, 0 0 20px ${catColor}33`;
    }
  }

  return (
    <a
      ref={cardRef}
      href={`/article/${article.id}`}
      className="group relative block bg-surface border border-border-dim rounded-lg overflow-hidden transition-[border-color,box-shadow] duration-300"
      style={{ transformStyle: "preserve-3d", transition: "transform 0.15s ease, border-color 0.3s, box-shadow 0.3s" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Light reflection overlay */}
      <div
        ref={glowRef}
        className="absolute inset-0 z-10 pointer-events-none rounded-lg opacity-0 transition-opacity duration-300"
      />

      {/* Image */}
      <div className="aspect-video relative overflow-hidden bg-surface-light">
        {article.imageUrl ? (
          <img
            src={article.imageUrl}
            alt=""
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.style.display = "none";
              // Show the fallback sibling
              const fallback = img.parentElement?.querySelector("[data-fallback]") as HTMLElement;
              if (fallback) fallback.style.display = "flex";
            }}
          />
        ) : null}
        <div
          data-fallback
          className="w-full h-full absolute inset-0 flex flex-col items-center justify-center"
          style={{
            display: article.imageUrl ? "none" : "flex",
            background: `linear-gradient(135deg, ${catColor}12 0%, transparent 50%, ${catColor}08 100%)`,
            backgroundSize: "100% 100%",
          }}
        >
          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `linear-gradient(${catColor} 1px, transparent 1px), linear-gradient(90deg, ${catColor} 1px, transparent 1px)`,
              backgroundSize: "24px 24px",
            }}
          />
          <span
            className="font-mono text-3xl font-bold tracking-wider relative"
            style={{ color: `${catColor}40` }}
          >
            &gt;_
          </span>
          <span
            className="font-mono text-[10px] tracking-widest mt-2 uppercase relative"
            style={{ color: `${catColor}30` }}
          >
            {article.source}
          </span>
        </div>
        <div className="absolute top-2 left-2 z-20">
          <CategoryBadge category={article.category} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <SourceBadge source={article.source} />
        <h3 className="mt-1 font-mono text-sm font-bold text-text-primary leading-tight group-hover:text-neon-cyan transition-colors line-clamp-2">
          {article.title}
        </h3>
        {article.description && (
          <p className="mt-2 text-xs text-text-secondary leading-relaxed line-clamp-3">
            {article.description}
          </p>
        )}
        <time className="mt-3 block font-mono text-[10px] text-text-dim">
          {formatDate(article.publishedAt)}
        </time>
      </div>
    </a>
  );
}
