import { Skeleton } from "@/components/ui/skeleton"

export function TaskExecutionPageSkeleton() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 px-4">
        <div className="max-w-dashboard mx-auto w-full">
          <div className="bg-dashboard-background">
            {/* Header Skeleton */}
            <div className="h-header mb-dashboard-gap">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-6 w-6" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-8 w-64" />
              </div>
              <Skeleton className="h-8 w-48 mt-4" />
            </div>

            {/* Tabs Skeleton */}
            <div className="mb-4">
              <div className="flex gap-2">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>

            {/* Content Skeleton */}
            <div className="border border-dashboard-border bg-white rounded-dashboard p-6">
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
