import { Skeleton } from "@/components/ui/skeleton"

export function TasksPageSkeleton() {
  return (
    <div className="bg-dashboard-background px-4">
      {/* Header Skeleton */}
      <div className="h-header mb-dashboard-gap">
        <div className="h-header">
          <div className="h-breadcrumb flex items-center gap-3 px-3">
            <Skeleton className="h-6 w-6" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="h-title-filter flex items-center justify-between px-3">
            <Skeleton className="h-6 w-48" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-40" />
            </div>
          </div>
        </div>
      </div>

      {/* Controls Skeleton */}
      <div className="mb-dashboard-gap">
        <div className="flex items-center justify-between px-3">
          <div className="flex items-center gap-4">
            <div className="flex gap-1">
              <Skeleton className="h-8 w-12" />
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-20" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-9 w-9" />
          </div>
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="border border-dashboard-border bg-white rounded-dashboard">
        <div className="p-4">
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
