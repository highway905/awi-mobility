"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Task } from "../../types"

interface PickingTaskContentProps {
  activeTab: string
  task: Task
}

export function PickingTaskContent({ activeTab, task }: PickingTaskContentProps) {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Picking Task - {activeTab}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Picking task content for {task.transactionId} - {activeTab} tab
          </p>
          <p className="text-sm text-gray-500 mt-2">This content will be implemented based on picking requirements.</p>
        </CardContent>
      </Card>
    </div>
  )
}
