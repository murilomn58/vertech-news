"use client";

import { motion } from "framer-motion";
import { CATEGORIES } from "@/lib/constants";
import { NewsArticle } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import CategoryBadge from "./CategoryBadge";

export default function HeroSection({ article }: { article: NewsArticle }) {
  const catColor = CATEGORIES[article.category].color;

  return (
    <motion.a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="group relative block w-full aspect-[21/9] md:aspect-[3/1] rounded-lg overflow-hidden border border-border-dim hover:border-neon-cyan/50 transition-all duration-300"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-surface-light">
        {article.imageUrl && (
          <img
            src={article.imageUrl}
            alt=""
            className="w-full h-full object-cover opacity-40 group-hover:opacity-50 transition-opacity duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        )}
      </div>

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${catColor}20, transparent 50%), linear-gradient(to top, rgba(10,10,15,0.95) 0%, rgba(10,10,15,0.4) 50%, rgba(10,10,15,0.2) 100%)`,
        }}
      />

      {/* Neon border accent */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px opacity-50 group-hover:opacity-100 transition-opacity"
        style={{ backgroundColor: catColor }}
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
        <div className="flex items-center gap-3 mb-3">
          <CategoryBadge category={article.category} />
          <span className="font-mono text-[10px] text-text-dim">
            {article.source}
          </span>
        </div>
        <h2 className="font-mono text-lg md:text-2xl font-bold text-text-primary leading-tight group-hover:text-neon-cyan transition-colors line-clamp-2">
          {article.title}
        </h2>
        {article.description && (
          <p className="mt-2 text-sm text-text-secondary line-clamp-2 max-w-2xl">
            {article.description}
          </p>
        )}
        <time className="mt-3 font-mono text-xs text-text-dim">
          {formatDate(article.publishedAt)}
        </time>
      </div>

      {/* Corner accent */}
      <div
        className="absolute top-0 right-0 w-16 h-16 opacity-20"
        style={{
          background: `linear-gradient(225deg, ${catColor}, transparent)`,
        }}
      />
    </motion.a>
  );
}
