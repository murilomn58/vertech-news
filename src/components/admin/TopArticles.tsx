import { CATEGORIES } from "@/lib/constants";
import { CategorySlug } from "@/lib/types";

interface Article {
  title: string;
  url: string;
  source: string;
  category: string;
  count: number;
}

export default function TopArticles({ articles }: { articles: Article[] }) {
  if (articles.length === 0) {
    return (
      <div className="bg-surface border border-border-dim rounded-lg p-4">
        <p className="font-mono text-[10px] uppercase tracking-widest text-text-dim mb-4">
          Top Clicked Articles
        </p>
        <p className="font-mono text-xs text-text-dim text-center py-8">
          No clicks tracked yet
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border-dim rounded-lg p-4 overflow-x-auto">
      <p className="font-mono text-[10px] uppercase tracking-widest text-text-dim mb-4">
        Top Clicked Articles
      </p>
      <table className="w-full">
        <thead>
          <tr className="border-b border-border-dim">
            <th className="text-left font-mono text-[10px] uppercase text-text-dim pb-2 pr-4">
              Article
            </th>
            <th className="text-left font-mono text-[10px] uppercase text-text-dim pb-2 pr-4">
              Source
            </th>
            <th className="text-left font-mono text-[10px] uppercase text-text-dim pb-2 pr-4">
              Category
            </th>
            <th className="text-right font-mono text-[10px] uppercase text-text-dim pb-2">
              Clicks
            </th>
          </tr>
        </thead>
        <tbody>
          {articles.map((a, i) => {
            const cat = CATEGORIES[a.category as CategorySlug];
            return (
              <tr
                key={i}
                className="border-b border-border-dim/30 hover:bg-surface-light/50 transition-colors"
              >
                <td className="py-2 pr-4 max-w-xs">
                  <a
                    href={a.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs text-text-secondary hover:text-neon-cyan transition-colors line-clamp-1"
                  >
                    {a.title || a.url}
                  </a>
                </td>
                <td className="py-2 pr-4">
                  <span className="font-mono text-[10px] text-text-dim">
                    {a.source}
                  </span>
                </td>
                <td className="py-2 pr-4">
                  {cat && (
                    <span
                      className="font-mono text-[10px] px-1.5 py-0.5 rounded"
                      style={{
                        color: cat.color,
                        backgroundColor: `${cat.color}15`,
                        border: `1px solid ${cat.color}30`,
                      }}
                    >
                      {cat.name}
                    </span>
                  )}
                </td>
                <td className="py-2 text-right">
                  <span className="font-mono text-sm font-bold text-neon-cyan">
                    {a.count}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
