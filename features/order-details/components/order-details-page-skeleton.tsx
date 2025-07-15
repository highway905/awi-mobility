import { Skeleton } from "@/components/ui/skeleton"

export function OrderDetailsPageSkeleton() {
  return (
    <div className="bg-dashboard-background min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col">
        <div className="px-4">
          <div className="max-w-dashboard mx-auto w-full">
            {/* Header Skeleton */}
            <div className="h-header mb-dashboard-gap">
              <div className="h-breadcrumb flex items-center gap-3 px-3">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="h-title-filter flex items-center justify-between px-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-6 w-24" />
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-8" />
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div className="px-4 border-b border-dashboard-border bg-white">
          <div className="max-w-[928px] mx-auto">
            <div className="h-8 flex gap-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-20" />
              ))}
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="flex-1 bg-white p-6">
          <div className="space-y-6">
            <div className="border rounded-dashboard p-6">
              <div className="flex justify-between items-center mb-4">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-8 w-12" />
              </div>
              <div className="grid grid-cols-3 gap-6">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </div>
            </div>
            <div className="border rounded-dashboard p-6">
              <div className="flex justify-between items-center mb-4">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-8 w-12" />
              </div>
              <div className="grid grid-cols-2 gap-8">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-3 w-12" />
                    {Array.from({ length: 7 }).map((_, j) => (
                      <Skeleton key={j} className="h-4 w-full" />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
