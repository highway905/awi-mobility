import { Suspense } from "react"
import { TasksPageContent } from "@/features/tasks/components/tasks-page-content"
import { TasksPageSkeleton } from "@/features/tasks/components/tasks-page-skeleton"

export default function TasksPage() {
  return (
    <Suspense fallback={<></>}>
      <TasksPageContent />
    </Suspense>
  )
}
