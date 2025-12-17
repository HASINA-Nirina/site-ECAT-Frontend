// 🔄 Skeleton Loaders pour chargement progressif
export function SkeletonBar() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-32 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="animate-pulse space-y-3 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
      <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
    </div>
  );
}

export function SkeletonGrid({ cols = 4 }: { cols?: number }) {
  return (
    <div className={`grid grid-cols-${cols} gap-4 animate-pulse`}>
      {[...Array(cols)].map((_, i) => (
        <div key={i} className="h-48 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
      ))}
    </div>
  );
}
