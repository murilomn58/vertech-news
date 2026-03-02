"use client";

import { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

type ViewMode = "daily" | "6hours";

interface VisitsChartProps {
  visitsPerDay: Record<string, number>;
  uniqueVisitorsPerDay: Record<string, number>;
  visitsPerSixHours: Record<string, number>;
  uniqueVisitorsPerSixHours: Record<string, number>;
}

function buildDailyData(
  visitsPerDay: Record<string, number>,
  uniqueVisitorsPerDay: Record<string, number>
) {
  const labels: string[] = [];
  const visits: number[] = [];
  const unique: number[] = [];
  const now = new Date();

  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().split("T")[0];
    labels.push(
      d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    );
    visits.push(visitsPerDay[key] || 0);
    unique.push(uniqueVisitorsPerDay[key] || 0);
  }

  return { labels, visits, unique };
}

function buildSixHourData(
  visitsPerSixHours: Record<string, number>,
  uniqueVisitorsPerSixHours: Record<string, number>
) {
  const labels: string[] = [];
  const visits: number[] = [];
  const unique: number[] = [];
  const now = new Date();

  // Last 7 days × 4 slots = 28 data points
  for (let i = 27; i >= 0; i--) {
    const slotTime = new Date(now.getTime() - i * 6 * 60 * 60 * 1000);
    const day = slotTime.toISOString().split("T")[0];
    const hour = Math.floor(slotTime.getUTCHours() / 6) * 6;
    const key = `${day}T${String(hour).padStart(2, "0")}`;

    const d = new Date(slotTime);
    const dayLabel = d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    labels.push(`${dayLabel} ${String(hour).padStart(2, "0")}h`);
    visits.push(visitsPerSixHours[key] || 0);
    unique.push(uniqueVisitorsPerSixHours[key] || 0);
  }

  return { labels, visits, unique };
}

export default function VisitsChart({
  visitsPerDay,
  uniqueVisitorsPerDay,
  visitsPerSixHours,
  uniqueVisitorsPerSixHours,
}: VisitsChartProps) {
  const [mode, setMode] = useState<ViewMode>("daily");

  const { labels, visits, unique } =
    mode === "daily"
      ? buildDailyData(visitsPerDay, uniqueVisitorsPerDay)
      : buildSixHourData(visitsPerSixHours, uniqueVisitorsPerSixHours);

  return (
    <div className="bg-surface border border-border-dim rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <p className="font-mono text-[10px] uppercase tracking-widest text-text-dim">
          Visits Over Time
        </p>
        <div className="flex gap-1">
          <button
            onClick={() => setMode("daily")}
            className={`font-mono text-[10px] px-3 py-1 rounded border transition-colors ${
              mode === "daily"
                ? "border-neon-cyan text-neon-cyan bg-neon-cyan/10"
                : "border-border-dim text-text-dim hover:text-text-secondary"
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setMode("6hours")}
            className={`font-mono text-[10px] px-3 py-1 rounded border transition-colors ${
              mode === "6hours"
                ? "border-neon-cyan text-neon-cyan bg-neon-cyan/10"
                : "border-border-dim text-text-dim hover:text-text-secondary"
            }`}
          >
            6 Hours
          </button>
        </div>
      </div>
      <div className="h-64">
        <Line
          data={{
            labels,
            datasets: [
              {
                label: "Total Visits",
                data: visits,
                borderColor: "#00f0ff",
                backgroundColor: "rgba(0, 240, 255, 0.08)",
                fill: true,
                tension: 0.3,
                pointRadius: 0,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "#00f0ff",
                pointHoverBorderColor: "#00f0ff",
                borderWidth: 2,
              },
              {
                label: "Unique Visitors",
                data: unique,
                borderColor: "#a855f7",
                backgroundColor: "rgba(168, 85, 247, 0.06)",
                fill: true,
                tension: 0.3,
                pointRadius: 0,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "#a855f7",
                pointHoverBorderColor: "#a855f7",
                borderWidth: 2,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
              mode: "index",
              intersect: false,
            },
            plugins: {
              legend: {
                display: true,
                position: "top",
                align: "center",
                labels: {
                  color: "#8888a0",
                  font: { family: "monospace", size: 10 },
                  boxWidth: 20,
                  boxHeight: 2,
                  padding: 16,
                },
              },
              tooltip: {
                backgroundColor: "#111118",
                borderColor: "#2a2a3a",
                borderWidth: 1,
                titleFont: { family: "monospace", size: 10 },
                bodyFont: { family: "monospace", size: 12 },
                titleColor: "#555570",
                bodyColor: "#e4e4ef",
                callbacks: {
                  labelColor(ctx) {
                    return {
                      borderColor: ctx.dataset.borderColor as string,
                      backgroundColor: ctx.dataset.borderColor as string,
                    };
                  },
                },
              },
            },
            scales: {
              x: {
                ticks: {
                  color: "#555570",
                  font: { family: "monospace", size: 9 },
                  maxTicksLimit: mode === "daily" ? 8 : 10,
                  maxRotation: mode === "6hours" ? 45 : 0,
                },
                grid: { color: "rgba(42, 42, 58, 0.3)" },
              },
              y: {
                beginAtZero: true,
                ticks: {
                  color: "#555570",
                  font: { family: "monospace", size: 9 },
                  stepSize: 1,
                },
                grid: { color: "rgba(42, 42, 58, 0.3)" },
              },
            },
          }}
        />
      </div>
    </div>
  );
}
