export function InventoryPageSkeleton() {
  return (
    <div className="h-screen flex flex-col bg-dashboard-background">
      {/* Page Header Skeleton */}
      <div className="flex-shrink-0 px-4 py-4">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center space-x-2 mb-4">
          <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-1 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Title and Search Bar */}
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-64 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Filters Section Skeleton */}
      <div className="flex-shrink-0 px-4 mb-4">
        <div className="flex items-center space-x-4">
          {/* Customer Dropdown Skeleton */}
          <div className="h-10 w-64 bg-gray-200 rounded animate-pulse"></div>

          {/* Action Buttons Skeleton */}
          <div className="h-9 w-9 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-9 w-9 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Table Container Skeleton */}
      <div className="flex-1 px-4 pb-4 min-h-0">
        <div className="h-full bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          {/* Table Header Skeleton */}
          <div className="grid grid-cols-9 gap-4 pb-4 border-b border-gray-200">
            <div className="h-4 w-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-14 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-18 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-14 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-8 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* Table Rows Skeleton */}
          <div className="space-y-4 pt-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="grid grid-cols-9 gap-4 py-2">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-6 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>

          {/* Table Footer Skeleton */}
          <div className="grid grid-cols-9 gap-4 pt-4 mt-4 border-t border-gray-200">
            <div className="h-4 w-16 bg-gray-300 rounded animate-pulse"></div>
            <div className="h-4 w-0 bg-transparent"></div>
            <div className="h-4 w-0 bg-transparent"></div>
            <div className="h-4 w-0 bg-transparent"></div>
            <div className="h-4 w-8 bg-gray-300 rounded animate-pulse"></div>
            <div className="h-4 w-8 bg-gray-300 rounded animate-pulse"></div>
            <div className="h-4 w-6 bg-gray-300 rounded animate-pulse"></div>
            <div className="h-4 w-8 bg-gray-300 rounded animate-pulse"></div>
            <div className="h-4 w-0 bg-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
