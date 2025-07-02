import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gray-200",
        className
      )}
      {...props}
    />
  )
}

export function TableSkeleton({ 
  rows = 10, 
  columns = 8 
}: { 
  rows?: number
  columns?: number 
}) {
  return (
    <div className="w-full">
      {/* Header Skeleton */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="flex">
          {Array.from({ length: columns }).map((_, i) => (
            <div key={i} className="flex-1 p-4 min-w-[120px]">
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
      
      {/* Rows Skeleton */}
      <div className="divide-y divide-gray-200">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex animate-fade-in" style={{ animationDelay: `${rowIndex * 50}ms` }}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div key={colIndex} className="flex-1 p-4 min-w-[120px]">
                <Skeleton 
                  className={cn(
                    "h-4",
                    colIndex === 0 ? "w-24" : // SKU column
                    colIndex === 1 ? "w-20" : // Warehouse
                    colIndex === 2 ? "w-32" : // Location
                    colIndex === 3 ? "w-24" : // Pallet ID
                    "w-16" // Number columns
                  )}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="p-6 border border-gray-200 rounded-lg bg-white">
      <div className="space-y-4">
        <Skeleton className="h-6 w-1/3" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    </div>
  )
}

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-16" />
            </div>
            <Skeleton className="h-12 w-12 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  )
}