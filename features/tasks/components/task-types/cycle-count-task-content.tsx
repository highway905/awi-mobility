"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Task } from "../../types"

interface CycleCountTaskContentProps {
  activeTab: string
  task: Task
}

export function CycleCountTaskContent({ activeTab, task }: CycleCountTaskContentProps) {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Cycle Count - {activeTab}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Cycle count task content for {task.transactionId} - {activeTab} tab
          </p>
          <p className="text-sm text-gray-500 mt-2">
            This content will be implemented based on cycle count requirements.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
