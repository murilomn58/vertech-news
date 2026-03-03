"use client";

import { useEffect, useRef } from "react";

interface AdSlotProps {
  /** Ad slot identifier for targeting */
  slot: string;
  /** Layout format */
  format?: "horizontal" | "rectangle" | "vertical";
  /** Additional CSS class */
  className?: string;
}

/**
 * Universal ad slot wrapper. Supports:
 * - Google AdSense (set NEXT_PUBLIC_ADSENSE_CLIENT)
 * - Carbon Ads (set NEXT_PUBLIC_CARBON_SERVE)
 * - Placeholder for development
 */
export default function AdSlot({ slot, format = "horizontal", className = "" }: AdSlotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const adLoaded = useRef(false);

  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const carbonServe = process.env.NEXT_PUBLIC_CARBON_SERVE;

  useEffect(() => {
    if (adLoaded.current || !containerRef.current) return;
    adLoaded.current = true;

    // Carbon Ads
    if (carbonServe) {
      const script = document.createElement("script");
      script.src = `//cdn.carbonads.com/carbon.js?serve=${carbonServe}&placement=vertechnewscom`;
      script.id = `_carbonads_js_${slot}`;
      script.async = true;
      containerRef.current.appendChild(script);
      return;
    }

    // AdSense
    if (adsenseClient && typeof window !== "undefined") {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch {
        // AdSense not loaded
      }
    }
  }, [slot, adsenseClient, carbonServe]);

  const heightClass =
    format === "horizontal"
      ? "min-h-[90px]"
      : format === "rectangle"
        ? "min-h-[250px]"
        : "min-h-[600px]";

  // Don't render anything if no ad provider is configured
  if (!adsenseClient && !carbonServe) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full flex items-center justify-center ${heightClass} ${className}`}
      data-ad-slot={slot}
    >
      {/* AdSense ad unit */}
      {adsenseClient && !carbonServe && (
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={adsenseClient}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      )}
    </div>
  );
}
