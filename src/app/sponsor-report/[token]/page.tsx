"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface ReportData {
  sponsorName: string;
  activeFrom: string;
  activeUntil: string;
  totalClicks: number;
  totalImpressions: number;
  ctr: number;
  clicksByDay: Record<string, number>;
}

export default function SponsorReportPage() {
  const params = useParams();
  const token = params.token as string;
  const [data, setData] = useState<ReportData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/sponsor-report/${token}`)
      .then((res) => {
        if (!res.ok) throw new Error("Report not found");
        return res.json();
      })
      .then(setData)
      .catch(() => setError("Report not found or invalid link."))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1120] flex items-center justify-center">
        <p className="font-mono text-sm text-gray-400">Loading report...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#0B1120] flex items-center justify-center">
        <div className="text-center">
          <p className="font-mono text-sm text-red-400 mb-2">{error}</p>
          <p className="font-mono text-xs text-gray-500">
            Please check your report link.
          </p>
        </div>
      </div>
    );
  }

  const sortedDays = Object.entries(data.clicksByDay).sort(
    ([a], [b]) => a.localeCompare(b)
  );

  const maxClicks = Math.max(...Object.values(data.clicksByDay), 1);

  return (
    <div className="min-h-screen bg-[#0B1120] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="font-mono text-[10px] text-[#22D3EE] uppercase tracking-[4px] mb-3">
            Sponsor Campaign Report
          </p>
          <h1 className="font-mono text-2xl font-bold text-white mb-2">
            {data.sponsorName}
          </h1>
          <p className="font-mono text-xs text-gray-500">
            Campaign: {data.activeFrom} to {data.activeUntil}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-[#0F172A] border border-[#334155] rounded-lg p-5 text-center">
            <p className="font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-2">
              Impressions
            </p>
            <p className="font-mono text-2xl font-bold text-white">
              {data.totalImpressions.toLocaleString()}
            </p>
          </div>
          <div className="bg-[#0F172A] border border-[#334155] rounded-lg p-5 text-center">
            <p className="font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-2">
              Clicks
            </p>
            <p className="font-mono text-2xl font-bold text-[#22D3EE]">
              {data.totalClicks.toLocaleString()}
            </p>
          </div>
          <div className="bg-[#0F172A] border border-[#334155] rounded-lg p-5 text-center">
            <p className="font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-2">
              CTR
            </p>
            <p
              className="font-mono text-2xl font-bold"
              style={{
                color: data.ctr > 5 ? "#22c55e" : data.ctr > 2 ? "#f59e0b" : "#94A3B8",
              }}
            >
              {data.ctr}%
            </p>
          </div>
        </div>

        {/* Clicks per Day Chart */}
        {sortedDays.length > 0 && (
          <div className="bg-[#0F172A] border border-[#334155] rounded-lg p-5">
            <p className="font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-4">
              Clicks per Day
            </p>
            <div className="space-y-2">
              {sortedDays.map(([day, count]) => (
                <div key={day} className="flex items-center gap-3">
                  <span className="font-mono text-[10px] text-gray-500 w-20 shrink-0">
                    {day}
                  </span>
                  <div className="flex-1 h-5 bg-[#1E293B] rounded overflow-hidden">
                    <div
                      className="h-full bg-[#22D3EE]/60 rounded transition-all"
                      style={{ width: `${(count / maxClicks) * 100}%` }}
                    />
                  </div>
                  <span className="font-mono text-xs text-[#22D3EE] font-bold w-8 text-right">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-10">
          <p className="font-mono text-[10px] text-gray-600">
            Powered by{" "}
            <span className="text-gray-400">VERTECH NEWS</span>
          </p>
        </div>
      </div>
    </div>
  );
}
