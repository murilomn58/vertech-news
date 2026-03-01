import { CATEGORIES } from "@/lib/constants";
import { CategorySlug } from "@/lib/types";

export default function CategoryBadge({
  category,
}: {
  category: CategorySlug;
}) {
  const cat = CATEGORIES[category];

  return (
    <span
      className="inline-block px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider rounded border"
      style={{
        color: cat.color,
        borderColor: `${cat.color}66`,
        backgroundColor: `${cat.color}15`,
      }}
    >
      {cat.name}
    </span>
  );
}
