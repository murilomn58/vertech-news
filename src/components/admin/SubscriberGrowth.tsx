"use client";

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

interface SubscriberGrowthProps {
  subscribersPerDay: Record<string, number>;
}

export default function SubscriberGrowth({
  subscribersPerDay,
}: SubscriberGrowthProps) {
  // Build cumulative growth data from all-time subscriber data
  const sortedDays = Object.keys(subscribersPerDay).sort();

  if (sortedDays.length === 0) {
    return (
      <div className="bg-surface border border-border-dim rounded-lg p-4">
        <p className="font-mono text-[10px] uppercase tracking-widest text-text-dim mb-4">
          Subscriber Growth
        </p>
        <p className="font-mono text-xs text-text-dim text-center py-8">
          No subscriber data yet
        </p>
      </div>
    );
  }

  const labels: string[] = [];
  const cumulative: number[] = [];
  const daily: number[] = [];
  let total = 0;

  for (const day of sortedDays) {
    const count = subscribersPerDay[day];
    total += count;
    const d = new Date(day + "T00:00:00");
    labels.push(
      d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    );
    cumulative.push(total);
    daily.push(count);
  }

  return (
    <div className="bg-surface border border-border-dim rounded-lg p-4">
      <p className="font-mono text-[10px] uppercase tracking-widest text-text-dim mb-4">
        Subscriber Growth
      </p>
      <div className="h-64">
        <Line
          data={{
            labels,
            datasets: [
              {
                label: "Total Subscribers",
                data: cumulative,
                borderColor: "#f472b6",
                backgroundColor: "rgba(244, 114, 182, 0.08)",
                fill: true,
                tension: 0.3,
                pointRadius: cumulative.length > 30 ? 0 : 3,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "#f472b6",
                pointHoverBorderColor: "#f472b6",
                borderWidth: 2,
                yAxisID: "y",
              },
              {
                label: "New / Day",
                data: daily,
                borderColor: "#818cf8",
                backgroundColor: "rgba(129, 140, 248, 0.06)",
                fill: true,
                tension: 0.3,
                pointRadius: 0,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "#818cf8",
                pointHoverBorderColor: "#818cf8",
                borderWidth: 1.5,
                yAxisID: "y1",
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
                  maxTicksLimit: 10,
                },
                grid: { color: "rgba(42, 42, 58, 0.3)" },
              },
              y: {
                type: "linear",
                position: "left",
                beginAtZero: true,
                ticks: {
                  color: "#f472b6",
                  font: { family: "monospace", size: 9 },
                  stepSize: 1,
                },
                grid: { color: "rgba(42, 42, 58, 0.3)" },
                title: {
                  display: true,
                  text: "Total",
                  color: "#555570",
                  font: { family: "monospace", size: 9 },
                },
              },
              y1: {
                type: "linear",
                position: "right",
                beginAtZero: true,
                ticks: {
                  color: "#818cf8",
                  font: { family: "monospace", size: 9 },
                  stepSize: 1,
                },
                grid: { drawOnChartArea: false },
                title: {
                  display: true,
                  text: "New/Day",
                  color: "#555570",
                  font: { family: "monospace", size: 9 },
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
}
