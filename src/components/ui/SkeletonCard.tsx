export default function SkeletonCard() {
  return (
    <div className="bg-surface border border-border-dim rounded-lg overflow-hidden animate-glow-pulse">
      <div className="aspect-video bg-surface-light" />
      <div className="p-4 space-y-3">
        <div className="h-2 w-16 bg-surface-light rounded" />
        <div className="h-4 w-full bg-surface-light rounded" />
        <div className="h-4 w-3/4 bg-surface-light rounded" />
        <div className="h-3 w-full bg-surface-light rounded" />
        <div className="h-2 w-20 bg-surface-light rounded" />
      </div>
    </div>
  );
}
