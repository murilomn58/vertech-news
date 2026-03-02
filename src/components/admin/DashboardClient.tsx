"use client";

import { useEffect, useState, useCallback } from "react";
import StatsCard from "./StatsCard";
import VisitsChart from "./VisitsChart";
import DeviceBreakdown from "./DeviceBreakdown";
import TopArticles from "./TopArticles";
import PageBreakdown from "./PageBreakdown";
import GeoBreakdown from "./GeoBreakdown";

interface AnalyticsData {
  totalVisits: number;
  uniqueVisitors: number;
  todayVisits: number;
  totalClicks: number;
  visitsByPage: Record<string, number>;
  visitsByDevice: Record<string, number>;
  visitsByCountry: Record<string, number>;
  visitsByCity: Record<string, number>;
  visitsByBrowser: Record<string, number>;
  visitsPerDay: Record<string, number>;
  uniqueVisitorsPerDay: Record<string, number>;
  visitsPerSixHours: Record<string, number>;
  uniqueVisitorsPerSixHours: Record<string, number>;
  topArticles: Array<{
    title: string;
    url: string;
    source: string;
    category: string;
    count: number;
  }>;
}

export default function DashboardClient() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchData = useCallback(() => {
    fetch("/api/analytics/stats")
      .then(async (r) => {
        if (!r.ok) {
          const body = await r.json().catch(() => ({}));
          throw new Error(body.error || `HTTP ${r.status}`);
        }
        return r.json();
      })
      .then((d) => {
        setData(d);
        setError(null);
        setLastRefresh(new Date());
      })
      .catch((e) => setError(e.message || "Failed to load analytics data"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh every 5 minutes (matches server cache TTL)
  useEffect(() => {
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <span className="font-mono text-xs text-neon-green">&gt;</span>
          <span className="font-mono text-sm text-text-secondary">
            SYSTEM ANALYTICS
          </span>
          <span className="font-mono text-[10px] text-text-dim animate-pulse">
            Loading...
          </span>
        </div>
        {/* Skeleton cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-surface border border-border-dim rounded-lg p-4 h-24 animate-pulse"
            >
              <div className="h-2 w-16 bg-surface-light rounded mb-3" />
              <div className="h-6 w-20 bg-surface-light rounded" />
            </div>
          ))}
        </div>
        <div className="bg-surface border border-border-dim rounded-lg h-72 animate-pulse" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="font-mono text-sm text-red-400 mb-4">
          &gt; ERROR: {error || "No data available"}
        </p>
        <button
          onClick={fetchData}
          className="font-mono text-xs text-neon-cyan border border-neon-cyan/30 px-4 py-2 rounded hover:bg-neon-cyan/10 transition-colors"
        >
          [Retry]
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-neon-green">&gt;</span>
          <span className="font-mono text-sm text-text-secondary">
            SYSTEM ANALYTICS
          </span>
          <span className="font-mono text-[10px] text-text-dim">
            [Last 30 days]
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] text-text-dim">
            Updated:{" "}
            {lastRefresh.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          <button
            onClick={fetchData}
            className="font-mono text-[10px] text-neon-cyan hover:text-neon-cyan/80 transition-colors"
          >
            [Refresh]
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard
          label="Total Views"
          value={data.totalVisits}
          accent="#00f0ff"
          sub="last 30 days"
        />
        <StatsCard
          label="Unique Visitors"
          value={data.uniqueVisitors}
          accent="#a855f7"
          sub="by IP"
        />
        <StatsCard
          label="Today"
          value={data.todayVisits}
          accent="#39ff14"
          sub="visits today"
        />
        <StatsCard
          label="Article Clicks"
          value={data.totalClicks}
          accent="#f59e0b"
          sub="total clicks"
        />
      </div>

      {/* Chart */}
      <VisitsChart
        visitsPerDay={data.visitsPerDay}
        uniqueVisitorsPerDay={data.uniqueVisitorsPerDay}
        visitsPerSixHours={data.visitsPerSixHours}
        uniqueVisitorsPerSixHours={data.uniqueVisitorsPerSixHours}
      />

      {/* 2-column: Device + Pages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DeviceBreakdown visitsByDevice={data.visitsByDevice} />
        <PageBreakdown visitsByPage={data.visitsByPage} />
      </div>

      {/* Geo */}
      <GeoBreakdown
        visitsByCountry={data.visitsByCountry}
        visitsByCity={data.visitsByCity}
      />

      {/* Top articles */}
      <TopArticles articles={data.topArticles} />
    </div>
  );
}
