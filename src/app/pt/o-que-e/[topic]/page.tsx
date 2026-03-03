import { Metadata } from "next";
import { notFound } from "next/navigation";
import { SEO_TOPICS } from "@/lib/seo-topics";
import { SITE_CONFIG } from "@/lib/constants";
import { fetchAllNews } from "@/lib/rss";
import NewsletterSignup from "@/components/ui/NewsletterSignup";
import Link from "next/link";

export const revalidate = 86400; // 24 hours

export function generateStaticParams() {
  return SEO_TOPICS.map((topic) => ({ topic: topic.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic: string }>;
}): Promise<Metadata> {
  const { topic: slug } = await params;
  const topic = SEO_TOPICS.find((t) => t.slug === slug);
  if (!topic) return { title: "Não Encontrado" };

  return {
    title: `O que é ${topic.titlePT}? — Guia Completo`,
    description: `Descubra o que é ${topic.titlePT} (${topic.titleEN}), como funciona, principais aplicações e impacto no mercado de tecnologia.`,
    keywords: topic.keywords,
    alternates: {
      canonical: `${SITE_CONFIG.url}/pt/o-que-e/${slug}`,
    },
  };
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic: slug } = await params;
  const topic = SEO_TOPICS.find((t) => t.slug === slug);
  if (!topic) notFound();

  // Find related articles by keyword matching
  let relatedArticles: { id: string; title: string; source: string }[] = [];
  try {
    const articles = await fetchAllNews();
    const keywords = topic.keywords.map((k) => k.toLowerCase());
    relatedArticles = articles
      .filter((a) =>
        keywords.some(
          (kw) =>
            a.title.toLowerCase().includes(kw) ||
            a.description.toLowerCase().includes(kw)
        )
      )
      .slice(0, 5)
      .map((a) => ({ id: a.id, title: a.title, source: a.source }));
  } catch {
    // Articles are optional for SEO pages
  }

  // Related topics (same general area)
  const relatedTopics = SEO_TOPICS.filter(
    (t) =>
      t.slug !== slug &&
      t.keywords.some((kw) =>
        topic.keywords.some(
          (tk) =>
            kw.toLowerCase().includes(tk.toLowerCase()) ||
            tk.toLowerCase().includes(kw.toLowerCase())
        )
      )
  ).slice(0, 6);

  // JSON-LD FAQ schema for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `O que é ${topic.titlePT}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${topic.titlePT} (${topic.titleEN}) é um conceito fundamental na área de tecnologia. Acompanhe as últimas notícias sobre ${topic.titlePT} no Vertech News.`,
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="font-mono text-xs text-text-dim mb-6">
          <Link href="/pt" className="hover:text-neon-cyan transition-colors">
            Início
          </Link>
          <span className="mx-2">/</span>
          <span className="text-text-secondary">O que é {topic.titlePT}?</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <p className="font-mono text-[10px] text-neon-cyan tracking-widest uppercase mb-2">
            &gt; Guia Completo
          </p>
          <h1 className="font-mono text-2xl md:text-3xl font-bold leading-tight mb-4">
            O que é {topic.titlePT}?
          </h1>
          <p className="text-text-secondary leading-relaxed">
            {topic.titlePT} ({topic.titleEN}) é um dos temas mais importantes
            da tecnologia moderna. Aqui você encontra as últimas notícias,
            explicações e recursos sobre {topic.titlePT.toLowerCase()}.
          </p>
        </header>

        {/* Keywords */}
        <div className="flex flex-wrap gap-2 mb-8">
          {topic.keywords.map((kw) => (
            <span
              key={kw}
              className="font-mono text-[10px] px-2.5 py-1 rounded-full border border-border-dim text-text-dim"
            >
              {kw}
            </span>
          ))}
        </div>

        {/* Related news */}
        {relatedArticles.length > 0 && (
          <section className="mb-8 p-6 rounded-lg border border-border-dim bg-surface/60">
            <h2 className="font-mono text-xs text-neon-cyan uppercase tracking-widest mb-4">
              &gt; Últimas notícias sobre {topic.titlePT}
            </h2>
            <div className="space-y-3">
              {relatedArticles.map((article) => (
                <a
                  key={article.id}
                  href={`/pt/article/${article.id}`}
                  className="block group"
                >
                  <span className="font-mono text-[10px] text-text-dim">
                    {article.source}
                  </span>
                  <h3 className="text-sm group-hover:text-neon-cyan transition-colors">
                    {article.title}
                  </h3>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Newsletter */}
        <section className="mb-8">
          <NewsletterSignup />
        </section>

        {/* Related topics */}
        {relatedTopics.length > 0 && (
          <section>
            <h2 className="font-mono text-xs text-text-dim uppercase tracking-widest mb-4">
              &gt; Tópicos Relacionados
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {relatedTopics.map((t) => (
                <Link
                  key={t.slug}
                  href={`/pt/o-que-e/${t.slug}`}
                  className="block p-3 rounded-lg border border-border-dim bg-surface/40 hover:border-neon-cyan/30 transition-colors"
                >
                  <span className="font-mono text-sm hover:text-neon-cyan transition-colors">
                    O que é {t.titlePT}?
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* All topics link */}
        <div className="mt-8 text-center">
          <Link
            href="/pt"
            className="font-mono text-xs text-text-dim hover:text-neon-cyan transition-colors"
          >
            &larr; Voltar para Vertech News
          </Link>
        </div>
      </div>
    </>
  );
}
