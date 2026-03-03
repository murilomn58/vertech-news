import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchAllNews, getArticlesByCategory } from "@/lib/rss";
import { CATEGORIES } from "@/lib/constants";
import { CategorySlug } from "@/lib/types";
import NewsGrid from "@/components/ui/NewsGrid";
import TimestampBadge from "@/components/ui/TimestampBadge";
import ConsultingBanner from "@/components/ui/ConsultingBanner";

export const revalidate = 21600; // 6 hours

export function generateStaticParams() {
  return Object.keys(CATEGORIES).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = CATEGORIES[slug as CategorySlug];
  if (!category) return { title: "Not Found" };

  return {
    title: category.name,
    description: category.description,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = CATEGORIES[slug as CategorySlug];
  if (!category) notFound();

  const articles = await fetchAllNews();
  const categoryArticles = getArticlesByCategory(articles, slug);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Category header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-1.5 h-8 rounded-full"
            style={{ backgroundColor: category.color }}
          />
          <h1 className="font-mono text-2xl font-bold tracking-wide">
            {category.name}
          </h1>
        </div>
        <p className="text-text-secondary text-sm ml-5">
          {category.description}
        </p>
        <p className="text-text-dim font-mono text-xs mt-2 ml-5">
          {categoryArticles.length} articles
        </p>
      </div>

      <NewsGrid articles={categoryArticles} />
      <ConsultingBanner />
      <TimestampBadge />
    </div>
  );
}
