"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Task } from "../../types"

interface ReviewOverageTaskContentProps {
  activeTab: string
  task: Task
}

export function ReviewOverageTaskContent({ activeTab, task }: ReviewOverageTaskContentProps) {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Review Overage/Underage - {activeTab}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Review overage/underage task content for {task.transactionId} - {activeTab} tab
          </p>
          <p className="text-sm text-gray-500 mt-2">This content will be implemented based on review requirements.</p>
        </CardContent>
      </Card>
    </div>
  )
}
