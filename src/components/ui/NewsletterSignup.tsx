"use client";

import { useEffect, useState } from "react";

const translations = {
  en: {
    confirmed: "✓ Confirmed",
    subscribed: "You're Subscribed",
    subscribedDesc: "You're all set to receive the Intelligence Brief. Look for weekly summaries of top AI and tech stories in your inbox.",
    noSpam: "No spam. Unsubscribe anytime.",
    briefLabel: "> Intelligence Brief",
    stayAhead: "Stay ahead in AI & Tech",
    stayAheadDesc: "Get the top AI and tech stories delivered weekly. Curated summaries, no spam, unsubscribe anytime.",
    subscribe: "Subscribe",
    subscribing: "Subscribing...",
  },
  pt: {
    confirmed: "✓ Confirmado",
    subscribed: "Você está inscrito",
    subscribedDesc: "Tudo pronto para receber o Intelligence Brief. Procure por resumos semanais das principais histórias de IA e tecnologia na sua caixa de entrada.",
    noSpam: "Sem spam. Desinscrever a qualquer momento.",
    briefLabel: "> Intelligence Brief",
    stayAhead: "Fique à frente em IA & Tech",
    stayAheadDesc: "Receba as principais histórias de IA e tecnologia entregues semanalmente. Resumos curados, sem spam, desinscrever a qualquer momento.",
    subscribe: "Inscrever",
    subscribing: "Inscrevendo...",
  },
};

export default function NewsletterSignup({ compact = false, lang = "en" }: { compact?: boolean; lang?: "en" | "pt" }) {
  const t = translations[lang];
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const subscribed = localStorage.getItem("vertech_subscribed");
      setIsSubscribed(!!subscribed);
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || status === "loading") return;

    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "Subscribed!");
        setEmail("");
        localStorage.setItem("vertech_subscribed", "1");
        setIsSubscribed(true);

        // Track signup
        fetch("/api/analytics/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "newsletter_signup",
            page: window.location.pathname,
          }),
        }).catch(() => {});
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Try again.");
    }
  }

  if (compact) {
    if (isSubscribed) {
      return (
        <span className="font-mono text-xs text-neon-green">✓ Subscribed</span>
      );
    }
    return (
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status !== "idle") setStatus("idle");
          }}
          placeholder="your@email.com"
          required
          className="flex-1 px-3 py-1.5 rounded bg-void border border-border-dim font-mono text-xs text-text-primary
            placeholder:text-text-dim focus:outline-none focus:border-neon-cyan/50 transition-colors"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-3 py-1.5 rounded font-mono text-xs font-bold bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30
            hover:bg-neon-cyan/20 disabled:opacity-50 transition-colors"
        >
          {status === "loading" ? "..." : status === "success" ? "✓" : t.subscribe}
        </button>
      </form>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-lg border border-border-dim bg-surface/60 backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/3 via-transparent to-neon-purple/3 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/30 to-transparent" />

      <div className="relative px-6 py-8 text-center">
        {isSubscribed ? (
          <>
            <p className="font-mono text-[10px] text-neon-green tracking-widest uppercase mb-2">
              {t.confirmed}
            </p>
            <h3 className="font-mono text-lg font-bold tracking-wide mb-2 text-neon-green">
              {t.subscribed}
            </h3>
            <p className="text-text-secondary text-sm mb-6 max-w-md mx-auto">
              {t.subscribedDesc}
            </p>
            <p className="font-mono text-[10px] text-text-dim mt-4">
              {t.noSpam}
            </p>
          </>
        ) : (
          <>
            <p className="font-mono text-[10px] text-neon-cyan tracking-widest uppercase mb-2">
              {t.briefLabel}
            </p>
            <h3 className="font-mono text-lg font-bold tracking-wide mb-2">
              {t.stayAhead}
            </h3>
            <p className="text-text-secondary text-sm mb-6 max-w-md mx-auto">
              {t.stayAheadDesc}
            </p>

            {status === "success" ? (
              <div className="font-mono text-sm text-neon-green">
                &gt; {message}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  placeholder="your@email.com"
                  required
                  className="flex-1 px-4 py-2.5 rounded-md bg-void border border-border-dim font-mono text-sm text-text-primary
                    placeholder:text-text-dim focus:outline-none focus:border-neon-cyan/50 focus:shadow-[0_0_10px_rgba(0,240,255,0.1)]
                    transition-all"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="px-6 py-2.5 rounded-md font-mono text-sm font-bold bg-neon-cyan/10 text-neon-cyan
                    border border-neon-cyan/30 hover:bg-neon-cyan/20 hover:border-neon-cyan/60
                    hover:shadow-[0_0_20px_rgba(0,240,255,0.15)] disabled:opacity-50
                    transition-all duration-300"
                >
                  {status === "loading" ? t.subscribing : t.subscribe}
                </button>
              </form>
            )}

            {status === "error" && (
              <p className="font-mono text-xs text-red-400 mt-2">&gt; {message}</p>
            )}

            <p className="font-mono text-[10px] text-text-dim mt-4">
              {t.noSpam}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
