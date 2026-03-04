import { SITE_CONFIG } from "@/lib/constants";
import NewsletterSignup from "@/components/ui/NewsletterSignup";
import Link from "next/link";

const CONTACT_EMAIL = "mailto:vertech2026@gmail.com?subject=AI%20Automation%20Inquiry";

export default function Footer() {
  return (
    <footer className="border-t border-border-dim bg-void/80 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: Site info */}
          <div>
            <div className="font-mono text-sm font-bold mb-3">
              <span className="text-neon-cyan">&gt;</span> {SITE_CONFIG.name}
            </div>
            <p className="text-text-dim text-xs leading-relaxed">
              {SITE_CONFIG.tagline}. Curated AI &amp; tech news from 12+ sources,
              auto-categorized and updated every 6 hours.
            </p>
          </div>

          {/* Column 2: Quick links */}
          <div>
            <h4 className="font-mono text-xs text-text-secondary uppercase tracking-widest mb-3">
              Categories
            </h4>
            <ul className="space-y-1.5">
              {["claude-code", "ai-general", "ai-business", "cybersecurity", "tech-general"].map(
                (slug) => (
                  <li key={slug}>
                    <Link
                      href={`/category/${slug}`}
                      className="font-mono text-xs text-text-dim hover:text-neon-cyan transition-colors"
                    >
                      {slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Column 3: Vertech CTA + Newsletter */}
          <div>
            <h4 className="font-mono text-xs text-text-secondary uppercase tracking-widest mb-3">
              Built by Vertech Solucoes
            </h4>
            <p className="text-text-dim text-xs leading-relaxed mb-3">
              We build AI automation, custom pipelines, and intelligent systems
              for businesses. This site is a demo of what we do.
            </p>
            <a
              href={CONTACT_EMAIL}
              className="inline-flex items-center gap-1.5 font-mono text-xs text-neon-cyan hover:text-neon-cyan/80 transition-colors mb-4"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
              Contact us via Email &rarr;
            </a>
            <div className="mt-4">
              <p className="font-mono text-[10px] text-text-dim uppercase tracking-widest mb-2">Newsletter</p>
              <NewsletterSignup compact />
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border-dim mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="font-mono text-[10px] text-text-dim">
            Powered by RSS feeds &bull; Auto-updated every 6h &bull; {new Date().getFullYear()}
          </div>
          <div className="font-mono text-[10px] text-text-dim">
            <a
              href="https://vertechsolucoes.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neon-cyan transition-colors"
            >
              Vertech Solucoes
            </a>{" "}
            &mdash; AI &amp; Automation Consulting
          </div>
        </div>
      </div>
    </footer>
  );
}
