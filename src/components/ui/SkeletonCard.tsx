export default function SkeletonCard() {
  return (
    <div className="bg-surface border border-border-dim rounded-lg overflow-hidden relative">
      {/* Shimmer overlay */}
      <div className="absolute inset-0 z-10 overflow-hidden">
        <div
          className="absolute inset-0 -translate-x-full animate-[shimmer_2s_ease-in-out_infinite]"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(0, 240, 255, 0.04) 50%, transparent 100%)",
          }}
        />
      </div>

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
