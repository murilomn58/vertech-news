import SkeletonCard from "@/components/ui/SkeletonCard";

export default function HomeLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero skeleton */}
      <div className="w-full aspect-[3/1] rounded-lg bg-surface-light animate-glow-pulse mb-12" />

      {/* Section skeletons */}
      {[0, 1, 2].map((i) => (
        <div key={i} className="mb-12">
          <div className="h-6 w-40 bg-surface-light rounded mb-6 animate-glow-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, j) => (
              <SkeletonCard key={j} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
