import { Skeleton } from "@/components/ui/skeleton"

export function OrdersPageSkeleton() {
  return (
    <div className="bg-dashboard-background min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col p-4">
        <div className="max-w-dashboard mx-auto w-full flex flex-col h-full space-y-dashboard-gap">
          {/* Header Skeleton - 72px */}
          <div className="h-header">
            <div className="h-breadcrumb flex items-center gap-3 px-3">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="h-title-filter flex items-center justify-between px-3">
              <Skeleton className="h-6 w-16" />
            </div>
          </div>

          {/* Filter Skeleton - 36px */}
          <div className="h-9 flex items-center justify-between gap-4">
            <div className="flex gap-2">
              <Skeleton className="h-9 w-12" />
              <Skeleton className="h-9 w-16" />
              <Skeleton className="h-9 w-20" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-[250px]" />
              <Skeleton className="h-9 w-[250px]" />
              <Skeleton className="h-9 w-9" />
              <Skeleton className="h-9 w-9" />
            </div>
          </div>

          {/* Table Skeleton */}
          <div className="flex-1 min-h-0 rounded-dashboard border border-dashboard-border bg-white p-4">
            <div className="space-y-3">
              {/* Table Header */}
              <div className="flex gap-4">
                {Array.from({ length: 7 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 flex-1" />
                ))}
              </div>
              {/* Table Rows */}
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex gap-4">
                  {Array.from({ length: 7 }).map((_, j) => (
                    <Skeleton key={j} className="h-4 flex-1" />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
