export function DetailsCardSkeleton() {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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
    )
  }
  