export default function TimestampBadge() {
  const now = new Date().toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });

  return (
    <div className="text-center py-8">
      <span className="font-mono text-xs text-text-dim">
        <span className="text-neon-green mr-1">&#9679;</span>
        Last updated: {now}
      </span>
    </div>
  );
}
