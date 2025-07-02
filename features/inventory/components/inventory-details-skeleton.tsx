export function InventoryDetailsSkeleton() {
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Page Header Skeleton */}
      <div className="flex-shrink-0 px-4 py-4">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center space-x-2 mb-4">
          <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-1 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-3 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-1 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-1 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Title Skeleton */}
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pb-4 min-h-0">
        {/* Details Card Skeleton */}
        <div className="mb-4 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-4 gap-6">
            {/* Customer */}
            <div className="space-y-2">
              <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
            </div>

            {/* Warehouse */}
            <div className="space-y-2">
              <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
            </div>

            {/* SKU */}
            <div className="space-y-2">
              <div className="h-3 w-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-8 bg-gray-200 rounded animate-pulse"></div>
            </div>

            {/* Lot# */}
            <div className="space-y-2">
              <div className="h-3 w-10 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mt-4">
            {/* Expiration Date */}
            <div className="space-y-2">
              <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
            </div>

            {/* Pallet ID */}
            <div className="space-y-2">
              <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Transaction History Table Skeleton */}
        <div className="flex-1 min-h-0 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          {/* Table Header Skeleton */}
          <div className="grid grid-cols-8 gap-4 pb-4 border-b border-gray-200">
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-14 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-18 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* Table Rows Skeleton */}
          <div className="space-y-4 pt-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="grid grid-cols-8 gap-4 py-2">
                <div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-6 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
