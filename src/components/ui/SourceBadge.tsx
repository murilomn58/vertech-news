export default function SourceBadge({ source }: { source: string }) {
  return (
    <span className="inline-block text-[10px] font-mono text-text-dim uppercase tracking-wider">
      {source}
    </span>
  );
}
