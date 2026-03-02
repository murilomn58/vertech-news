export default function StatsCard({
  label,
  value,
  accent,
  sub,
}: {
  label: string;
  value: string | number;
  accent: string;
  sub?: string;
}) {
  return (
    <div
      className="bg-surface border border-border-dim rounded-lg p-4 flex gap-3 relative overflow-hidden"
      style={{ boxShadow: `0 0 20px ${accent}10` }}
    >
      {/* Left accent bar */}
      <div
        className="w-1 rounded-full flex-shrink-0"
        style={{ background: `linear-gradient(to bottom, ${accent}, transparent)` }}
      />
      <div className="min-w-0">
        <p className="font-mono text-[10px] uppercase tracking-widest text-text-dim">
          {label}
        </p>
        <p
          className="font-mono text-2xl font-bold mt-1"
          style={{ color: accent }}
        >
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>
        {sub && (
          <p className="font-mono text-[10px] text-text-dim mt-1">{sub}</p>
        )}
      </div>
    </div>
  );
}
