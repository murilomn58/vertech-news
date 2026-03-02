"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip
);

export default function VisitsChart({
  visitsPerDay,
}: {
  visitsPerDay: Record<string, number>;
}) {
  // Fill last 30 days including zeros
  const labels: string[] = [];
  const values: number[] = [];
  const now = new Date();

  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().split("T")[0];
    labels.push(
      d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    );
    values.push(visitsPerDay[key] || 0);
  }

  return (
    <div className="bg-surface border border-border-dim rounded-lg p-4">
      <p className="font-mono text-[10px] uppercase tracking-widest text-text-dim mb-4">
        Visits Over Time
      </p>
      <div className="h-64">
        <Line
          data={{
            labels,
            datasets: [
              {
                data: values,
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
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              tooltip: {
                backgroundColor: "#111118",
                borderColor: "#2a2a3a",
                borderWidth: 1,
                titleFont: { family: "monospace", size: 10 },
                bodyFont: { family: "monospace", size: 12 },
                titleColor: "#555570",
                bodyColor: "#00f0ff",
              },
            },
            scales: {
              x: {
                ticks: {
                  color: "#555570",
                  font: { family: "monospace", size: 9 },
                  maxTicksLimit: 8,
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
