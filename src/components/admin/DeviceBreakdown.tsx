"use client";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS: Record<string, string> = {
  desktop: "#00f0ff",
  mobile: "#a855f7",
  tablet: "#f59e0b",
};

export default function DeviceBreakdown({
  visitsByDevice,
}: {
  visitsByDevice: Record<string, number>;
}) {
  const entries = Object.entries(visitsByDevice).sort((a, b) => b[1] - a[1]);
  const total = entries.reduce((sum, [, v]) => sum + v, 0);

  return (
    <div className="bg-surface border border-border-dim rounded-lg p-4">
      <p className="font-mono text-[10px] uppercase tracking-widest text-text-dim mb-4">
        Device Breakdown
      </p>
      {total === 0 ? (
        <p className="font-mono text-xs text-text-dim text-center py-8">
          No data yet
        </p>
      ) : (
        <div className="flex items-center gap-6">
          <div className="w-32 h-32 flex-shrink-0">
            <Doughnut
              data={{
                labels: entries.map(([k]) => k),
                datasets: [
                  {
                    data: entries.map(([, v]) => v),
                    backgroundColor: entries.map(
                      ([k]) => COLORS[k] || "#555570"
                    ),
                    borderColor: "#111118",
                    borderWidth: 2,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    backgroundColor: "#111118",
                    borderColor: "#2a2a3a",
                    borderWidth: 1,
                    bodyFont: { family: "monospace", size: 11 },
                    bodyColor: "#e4e4ef",
                  },
                },
                cutout: "60%",
              }}
            />
          </div>
          <div className="space-y-2">
            {entries.map(([key, val]) => (
              <div key={key} className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: COLORS[key] || "#555570" }}
                />
                <span className="font-mono text-xs text-text-secondary capitalize">
                  {key}
                </span>
                <span className="font-mono text-xs text-text-dim">
                  {val} ({Math.round((val / total) * 100)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
