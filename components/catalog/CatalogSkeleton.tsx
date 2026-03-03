export default function CatalogSkeleton() {
  return (
    <div className="w-full">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center mb-6">
        <div className="h-4 w-32 bg-titan-surface animate-pulse rounded"></div>
        <div className="h-10 w-48 bg-titan-surface animate-pulse border border-titan-border"></div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex flex-col border border-titan-border p-4 h-[400px]">
            {/* Image Placeholder */}
            <div className="w-full aspect-[4/5] bg-titan-surface animate-pulse mb-4"></div>
            {/* Category Placeholder */}
            <div className="h-3 w-20 bg-titan-surface animate-pulse mb-2"></div>
            {/* Title Placeholder */}
            <div className="h-6 w-3/4 bg-titan-surface animate-pulse mb-4"></div>
            {/* Price Placeholder */}
            <div className="mt-auto h-6 w-16 bg-titan-surface animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  );
}