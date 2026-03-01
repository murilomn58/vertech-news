"use client";

import { motion } from "framer-motion";
import { CATEGORIES } from "@/lib/constants";
import { NewsArticle } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import CategoryBadge from "./CategoryBadge";
import SourceBadge from "./SourceBadge";

export default function NewsCard({
  article,
  index = 0,
}: {
  article: NewsArticle;
  index?: number;
}) {
  const catColor = CATEGORIES[article.category].color;

  return (
    <motion.a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group block bg-surface border border-border-dim rounded-lg overflow-hidden transition-all duration-300 hover:border-opacity-100"
      style={{
        ["--card-color" as string]: catColor,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = catColor;
        e.currentTarget.style.boxShadow = `0 0 5px ${catColor}, 0 0 20px ${catColor}33`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "";
        e.currentTarget.style.boxShadow = "";
      }}
    >
      {/* Image */}
      <div className="aspect-video relative overflow-hidden bg-surface-light">
        {article.imageUrl ? (
          <img
            src={article.imageUrl}
            alt=""
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${catColor}15, ${catColor}05)`,
            }}
          >
            <span className="font-mono text-4xl" style={{ color: `${catColor}30` }}>
              &gt;_
            </span>
          </div>
        )}
        <div className="absolute top-2 left-2">
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
    </motion.a>
  );
}
