"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function TrackingScript() {
  const pathname = usePathname();

  // Track page visit on route change
  useEffect(() => {
    if (pathname.startsWith("/admin")) return;

    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "visit", page: pathname }),
    }).catch(() => {});
  }, [pathname]);

  // Track article clicks via event delegation
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement).closest(
        "a[href][target='_blank']"
      );
      if (!anchor) return;

      const url = anchor.getAttribute("href") || "";
      if (!url.startsWith("http")) return;

      const title =
        anchor.querySelector("h3")?.textContent ||
        anchor.querySelector("h2")?.textContent ||
        "";

      const card = anchor.closest("[class*='group']") || anchor;
      const categoryEl = card.querySelector(
        "[class*='uppercase'][class*='tracking-wider']"
      );
      const sourceEl = card.querySelector(
        "[class*='text-text-dim'][class*='uppercase']"
      );

      fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "click",
          articleUrl: url,
          articleTitle: title,
          category:
            categoryEl?.textContent?.toLowerCase().replace(/\s+/g, "-") || "",
          source: sourceEl?.textContent || "",
          page: pathname,
        }),
      }).catch(() => {});
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [pathname]);

  return null;
}
