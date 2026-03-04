"use client";

const CONTACT_EMAIL = "mailto:vertech2026@gmail.com?subject=AI%20Automation%20Inquiry";

export default function ConsultingBanner() {
  function trackClick() {
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "consulting_cta",
        ctaLocation: "banner",
        page: window.location.pathname,
      }),
    }).catch(() => {});
  }

  return (
    <div className="relative overflow-hidden rounded-lg border border-neon-cyan/20 bg-surface/80 backdrop-blur-sm mt-12">
      {/* Gradient accent */}
      <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/5 via-transparent to-neon-purple/5 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/50 to-transparent" />

      <div className="relative px-6 py-8 md:py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <p className="font-mono text-xs text-neon-cyan tracking-widest uppercase mb-2">
            &gt; Vertech Solucoes
          </p>
          <h3 className="font-mono text-lg md:text-xl font-bold tracking-wide mb-2">
            Need AI automation for your business?
          </h3>
          <p className="text-text-secondary text-sm max-w-lg">
            We build custom AI pipelines, chatbots, and automation systems.
            From concept to production — the same tech behind this site.
          </p>
        </div>

        <a
          href={CONTACT_EMAIL}
          onClick={trackClick}
          className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-md font-mono text-sm font-bold
            bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30
            hover:bg-neon-cyan/20 hover:border-neon-cyan/60 hover:shadow-[0_0_20px_rgba(0,240,255,0.2)]
            transition-all duration-300"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
          </svg>
          Contact us via Email
        </a>
      </div>
    </div>
  );
}
