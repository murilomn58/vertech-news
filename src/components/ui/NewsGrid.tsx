import { NewsArticle } from "@/lib/types";
import NewsCard from "./NewsCard";

export default function NewsGrid({ articles }: { articles: NewsArticle[] }) {
  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="font-mono text-text-dim text-sm">
          <span className="text-neon-cyan">&gt;</span> No articles found_
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {articles.map((article, i) => (
        <NewsCard key={article.id} article={article} index={i} />
      ))}
    </div>
  );
}
