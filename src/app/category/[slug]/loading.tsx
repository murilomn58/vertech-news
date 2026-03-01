import SkeletonCard from "@/components/ui/SkeletonCard";

export default function CategoryLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="h-8 w-48 bg-surface-light rounded animate-glow-pulse" />
        <div className="h-4 w-64 bg-surface-light rounded mt-2 ml-5 animate-glow-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
