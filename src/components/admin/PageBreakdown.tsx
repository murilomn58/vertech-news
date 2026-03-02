const PAGE_LABELS: Record<string, string> = {
  "/": "Homepage",
  "/category/claude-code": "Claude Code",
  "/category/ai-general": "AI General",
  "/category/ai-business": "AI Business",
};

export default function PageBreakdown({
  visitsByPage,
}: {
  visitsByPage: Record<string, number>;
}) {
  const entries = Object.entries(visitsByPage).sort((a, b) => b[1] - a[1]);
  const max = entries.length > 0 ? entries[0][1] : 1;

  return (
    <div className="bg-surface border border-border-dim rounded-lg p-4">
      <p className="font-mono text-[10px] uppercase tracking-widest text-text-dim mb-4">
        Top Pages
      </p>
      {entries.length === 0 ? (
        <p className="font-mono text-xs text-text-dim text-center py-8">
          No data yet
        </p>
      ) : (
        <div className="space-y-3">
          {entries.slice(0, 8).map(([page, count]) => (
            <div key={page}>
              <div className="flex justify-between mb-1">
                <span className="font-mono text-xs text-text-secondary truncate mr-2">
                  {PAGE_LABELS[page] || page}
                </span>
                <span className="font-mono text-xs text-neon-cyan flex-shrink-0">
                  {count}
                </span>
              </div>
              <div className="h-1.5 bg-surface-light rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(count / max) * 100}%`,
                    background:
                      "linear-gradient(to right, #00f0ff, rgba(0,240,255,0.4))",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
