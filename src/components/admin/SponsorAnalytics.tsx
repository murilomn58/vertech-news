"use client";

import { useEffect, useState } from "react";

interface SponsorStat {
  name: string;
  totalClicks: number;
  newsletterImpressions: number;
  ctr: number;
  clicksByDay: Record<string, number>;
}

export default function SponsorAnalytics() {
  const [stats, setStats] = useState<SponsorStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/sponsors/analytics")
      .then((res) => res.json())
      .then((data) => setStats(data.sponsors || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-surface border border-border-dim rounded-lg p-4">
        <p className="font-mono text-xs text-text-dim text-center py-8">
          Loading analytics...
        </p>
      </div>
    );
  }

  if (stats.length === 0) {
    return (
      <div className="bg-surface border border-border-dim rounded-lg p-4">
        <p className="font-mono text-[10px] uppercase tracking-widest text-text-dim mb-4">
          Sponsor Analytics
        </p>
        <p className="font-mono text-xs text-text-dim text-center py-8">
          No sponsor analytics data yet
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border-dim rounded-lg p-4 overflow-x-auto">
      <p className="font-mono text-[10px] uppercase tracking-widest text-text-dim mb-4">
        Sponsor Analytics
      </p>
      <table className="w-full">
        <thead>
          <tr className="border-b border-border-dim">
            <th className="text-left font-mono text-[10px] uppercase text-text-dim pb-2 pr-4">
              Sponsor
            </th>
            <th className="text-right font-mono text-[10px] uppercase text-text-dim pb-2 pr-4">
              Clicks
            </th>
            <th className="text-right font-mono text-[10px] uppercase text-text-dim pb-2 pr-4">
              Impressions
            </th>
            <th className="text-right font-mono text-[10px] uppercase text-text-dim pb-2">
              CTR %
            </th>
          </tr>
        </thead>
        <tbody>
          {stats.map((s) => (
            <tr
              key={s.name}
              className="border-b border-border-dim/30 hover:bg-surface-light/50 transition-colors"
            >
              <td className="py-2 pr-4">
                <span className="font-mono text-xs text-text-secondary">
                  {s.name}
                </span>
              </td>
              <td className="py-2 pr-4 text-right">
                <span className="font-mono text-sm font-bold text-neon-cyan">
                  {s.totalClicks}
                </span>
              </td>
              <td className="py-2 pr-4 text-right">
                <span className="font-mono text-sm text-text-secondary">
                  {s.newsletterImpressions}
                </span>
              </td>
              <td className="py-2 text-right">
                <span
                  className="font-mono text-sm font-bold"
                  style={{
                    color: s.ctr > 5 ? "#22c55e" : s.ctr > 2 ? "#f59e0b" : "#94A3B8",
                  }}
                >
                  {s.ctr}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
