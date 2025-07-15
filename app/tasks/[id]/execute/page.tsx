import { Suspense } from "react"
import { TaskExecutionPageContent } from "@/features/tasks/components/task-execution-page-content"
import { TaskExecutionPageSkeleton } from "@/features/tasks/components/task-execution-page-skeleton"

interface TaskExecutionPageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ type?: string }>
}

export default async function TaskExecutionPage({ params, searchParams }: TaskExecutionPageProps) {
  const { id } = await params
  const { type } = await searchParams
  return (
    <Suspense fallback={<></>}>
      <TaskExecutionPageContent taskId={id} taskType={type} />
    </Suspense>
  )
}
