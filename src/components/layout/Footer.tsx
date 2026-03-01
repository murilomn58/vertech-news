import { SITE_CONFIG } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="border-t border-border-dim bg-void/80 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="font-mono text-xs text-text-dim">
          <span className="text-neon-cyan">&gt;</span> {SITE_CONFIG.name} &mdash;{" "}
          {SITE_CONFIG.tagline}
        </div>
        <div className="font-mono text-xs text-text-dim">
          Powered by RSS feeds &bull; Auto-updated daily &bull;{" "}
          {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  );
}
