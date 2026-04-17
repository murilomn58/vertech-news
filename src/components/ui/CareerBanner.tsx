"use client";

const REF_URL = "https://jobs.aiarchitech.com/join?ref=KJWCR7RP";

const COPY = {
  en: {
    kicker: "Vertech Referral",
    title: "Work on AI inside real companies.",
    body: "AI Architechs places vetted AI engineers inside companies that already have traction. Remote-friendly, USD pay.",
    cta: "Join talent pool →",
    disclosure: "Partner referral.",
  },
  pt: {
    kicker: "Indicação Vertech",
    title: "Trabalhe com IA em empresas de verdade.",
    body: "A AI Architechs coloca engenheiros de IA dentro de empresas com tração. Remoto, pagamento em USD.",
    cta: "Entrar no talent pool →",
    disclosure: "Indicação de parceria.",
  },
} as const;

type Locale = keyof typeof COPY;

export default function CareerBanner({ locale = "en" }: { locale?: Locale }) {
  const t = COPY[locale];

  function trackClick() {
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "affiliate_click",
        affiliateName: "AI Architechs",
        category: "career",
        page: typeof window !== "undefined" ? window.location.pathname : "",
      }),
    }).catch(() => {});
  }

  return (
    <a
      href={REF_URL}
      target="_blank"
      rel="noopener noreferrer sponsored"
      onClick={trackClick}
      className="group/career block relative overflow-hidden rounded-lg border border-neon-purple/25
        bg-surface/70 backdrop-blur-sm hover:border-neon-purple/50 hover:bg-surface/90
        transition-all duration-300"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-purple/50 to-transparent" />

      <div className="relative px-4 py-3 flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-mono text-[9px] text-neon-purple/70 uppercase tracking-widest">
              {t.kicker}
            </span>
            <span className="font-mono text-[9px] text-text-dim/60">·</span>
            <span className="font-mono text-[9px] text-text-dim/60 uppercase tracking-widest">
              {t.disclosure}
            </span>
          </div>
          <p className="font-mono text-xs sm:text-sm font-bold leading-snug text-text-primary group-hover/career:text-neon-purple transition-colors">
            {t.title}
          </p>
          <p className="text-text-secondary text-xs leading-snug mt-0.5 line-clamp-2 sm:line-clamp-1">
            {t.body}
          </p>
        </div>

        <span className="shrink-0 font-mono text-[11px] sm:text-xs font-bold px-3 py-1.5 rounded-md
          bg-neon-purple/10 text-neon-purple border border-neon-purple/30
          group-hover/career:bg-neon-purple/20 group-hover/career:border-neon-purple/60
          transition-all duration-300 whitespace-nowrap">
          {t.cta}
        </span>
      </div>
    </a>
  );
}
